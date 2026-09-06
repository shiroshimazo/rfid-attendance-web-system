import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"

// Run the real public-schema migrations. Only Supabase-owned Auth objects are
// stubbed; lifecycle triggers, constraints, and RLS execute in PostgreSQL.
const db = new PGlite()
const adminId = "10000000-0000-0000-0000-000000000001"
const userId = "20000000-0000-0000-0000-000000000001"

before(async () => {
  await db.exec(`
    create role authenticated;
    create schema auth;
    create table auth.users (
      id uuid primary key,
      email text,
      raw_app_meta_data jsonb default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;
  `)

  const directory = new URL("../supabase/migrations/", import.meta.url)
  for (const file of (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
})

after(async () => db.close())

beforeEach(async () => {
  await db.exec(`
    begin;
    insert into auth.users (id, email, raw_app_meta_data)
    values ('${adminId}', 'admin@example.test', '{"role":"admin"}');
    select set_config('request.jwt.claim.sub', '${adminId}', false);
  `)
})

afterEach(async () => db.exec("rollback; reset role;"))

async function createProfile(kind, status = "active") {
  await db.query(
    "insert into auth.users (id, email, raw_app_meta_data) values ($1, $2, $3)",
    [userId, `${kind}@example.test`, JSON.stringify({ role: kind })]
  )
  await db.exec("set local role authenticated")
  const { rows } = kind === "student"
    ? await db.query(`
        insert into public.students
          (user_id, student_id, full_name, email, parent_name,
           parent_contact_number, program_id, year_level, section, campus, status)
        select $1, 'S-1', 'Student Example', 'student@example.test', 'Guardian',
          '+639171234567', id, '2nd Year', '21001', 'Main Campus', $2
        from public.programs where program_code = 'BSIT'
        returning id
      `, [userId, status])
    : await db.query(`
        insert into public.teachers
          (user_id, teacher_id, full_name, email, department, status)
        values ($1, 'T-1', 'Teacher Example', 'teacher@example.test', 'IT', $2)
        returning id
      `, [userId, status])
  return rows[0].id
}

async function accountStatus() {
  return (await db.query("select status from public.users where id = $1", [userId])).rows[0].status
}

async function addAssignment(teacherId) {
  await db.query(`
    insert into public.teacher_assignments
      (teacher_id, program_id, course_id, year_level, section, campus)
    select $1, program_id, id, '2nd Year', '21001', 'Main Campus'
    from public.courses where course_code = 'CCS2207'
  `, [teacherId])
}

async function assignmentStatuses() {
  return (await db.query("select status from public.teacher_assignments order by id")).rows.map((row) => row.status)
}

async function addCards(studentId) {
  for (const [index, status] of ["Active", "Lost", "Inactive", "Deactivated"].entries()) {
    await db.query(
      "insert into public.rfid_cards (student_id, rfid_number, card_status) values ($1, $2, $3)",
      [studentId, `0000000${index}`, status]
    )
  }
}

async function cardStatuses() {
  return (await db.query("select card_status from public.rfid_cards order by rfid_number")).rows.map((row) => row.card_status)
}

for (const kind of ["student", "teacher"]) {
  for (const status of ["active", "inactive", "archived"]) {
    test(`creating a ${status} ${kind} synchronizes the account and new assignments`, async () => {
      const id = await createProfile(kind, status)
      assert.equal(await accountStatus(), status)
      if (kind === "teacher") {
        await addAssignment(id)
        assert.deepEqual(await assignmentStatuses(), [status])
      }
    })
  }
}

for (const editProfile of [false, true]) {
  test(`${editProfile ? "edit dialog" : "status action"} archives and restores students without reviving cards`, async () => {
    const id = await createProfile("student")
    await addCards(id)
    const extra = editProfile ? ", full_name = 'Edited Student'" : ""
    await db.query(`update public.students set status = 'archived'${extra} where id = $1`, [id])
    assert.equal(await accountStatus(), "archived")
    assert.deepEqual(await cardStatuses(), ["Deactivated", "Lost", "Inactive", "Deactivated"])
    await db.query("update public.students set status = 'active' where id = $1", [id])
    assert.equal(await accountStatus(), "active")
    assert.deepEqual(await cardStatuses(), ["Deactivated", "Lost", "Inactive", "Deactivated"])
  })

  test(`${editProfile ? "edit dialog" : "status action"} keeps teacher assignments synchronized through every status`, async () => {
    const id = await createProfile("teacher")
    await addAssignment(id)
    for (const status of ["inactive", "archived", "active"]) {
      const extra = editProfile ? ", full_name = 'Edited Teacher'" : ""
      await db.query(`update public.teachers set status = $1${extra} where id = $2`, [status, id])
      assert.equal(await accountStatus(), status)
      assert.deepEqual(await assignmentStatuses(), [status])
      // Teacher edits replace assignments after the profile write.
      if (editProfile) {
        await db.query("delete from public.teacher_assignments where teacher_id = $1", [id])
        await addAssignment(id)
        assert.deepEqual(await assignmentStatuses(), [status])
      }
    }
  })
}

test("temporarily inactivating a student preserves the existing card policy", async () => {
  const id = await createProfile("student")
  await addCards(id)
  await db.query("update public.students set status = 'inactive' where id = $1", [id])
  assert.equal(await accountStatus(), "inactive")
  assert.deepEqual(await cardStatuses(), ["Active", "Lost", "Inactive", "Deactivated"])
})

for (const kind of ["student", "teacher"]) {
  test(`a dependent-write failure rolls back the entire ${kind} status change`, async () => {
    const id = await createProfile(kind)
    if (kind === "student") await addCards(id)
    else await addAssignment(id)

    await db.exec(`
      reset role;
      create function public.reject_lifecycle_test_write() returns trigger
      language plpgsql as $$ begin raise exception 'injected lifecycle failure'; end $$;
      create trigger reject_lifecycle_test_write before update on public.${kind === "student" ? "rfid_cards" : "teacher_assignments"}
      for each row execute function public.reject_lifecycle_test_write();
      set local role authenticated;
      savepoint before_failure;
    `)
    await assert.rejects(
      db.query(`update public.${kind}s set status = 'archived' where id = $1`, [id]),
      /injected lifecycle failure/
    )
    await db.exec("rollback to savepoint before_failure")
    assert.equal(await accountStatus(), "active")
    assert.equal((await db.query(`select status from public.${kind}s where id = $1`, [id])).rows[0].status, "active")
    if (kind === "student") assert.deepEqual(await cardStatuses(), ["Active", "Lost", "Inactive", "Deactivated"])
    else assert.deepEqual(await assignmentStatuses(), ["active"])
  })
}

test("a student session cannot change its lifecycle through the profile", async () => {
  const id = await createProfile("student")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [userId])
  const result = await db.query("update public.students set status = 'archived' where id = $1 returning id", [id])
  assert.equal(result.rows.length, 0)
  assert.equal(await accountStatus(), "active")
})
