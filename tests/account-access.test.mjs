import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"

const db = new PGlite()
const migrationName = "202609090001_enforce_active_account_access.sql"
const directory = new URL("../supabase/migrations/", import.meta.url)
const ids = Object.fromEntries(["admin", "teacher", "student", "otherTeacher", "otherStudent", "archivedStudent"]
  .map((name, index) => [name, `00000000-0000-4000-8000-00000000000${index + 1}`]))
const tables = ["users", "students", "teachers", "programs", "courses", "teacher_assignments",
  "rfid_cards", "attendance_records", "sms_notifications", "class_schedules"]
const businessTables = tables.filter(table => table !== "users")
let migration
let baseline
let originalData

async function asUser(name) {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [ids[name] ?? name])
  await db.exec("set local role authenticated")
}

async function count(table) {
  return Number((await db.query(`select count(*) as n from public.${table}`)).rows[0].n)
}

async function snapshot() {
  await db.exec("reset role")
  return Object.fromEntries(await Promise.all(tables.map(async table => [table,
    (await db.query(`select * from public.${table} order by id`)).rows])))
}

async function setStatus(name, status, profile = false) {
  await db.exec("reset role")
  const table = profile ? (name === "teacher" ? "teachers" : "students") : "users"
  await db.query(`update public.${table} set status = $1 where ${profile ? "user_id" : "id"} = $2`, [status, ids[name]])
}

async function expectRejected(sql, params = []) {
  await db.exec("savepoint rejected_write")
  try {
    await assert.rejects(db.query(sql, params), error => error.code === "42501")
  } finally {
    await db.exec("rollback to savepoint rejected_write; release savepoint rejected_write")
  }
}

before(async () => {
  await db.exec(`
    create role authenticated;
    create role anon;
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;
  `)
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql") && file < migrationName).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
  for (const [name, id] of Object.entries(ids)) {
    const role = name === "admin" ? "admin" : name.toLowerCase().includes("teacher") ? "teacher" : "student"
    await db.query("insert into auth.users (id, email, raw_app_meta_data) values ($1, $2, $3)",
      [id, `${name}@example.test`, JSON.stringify({ role })])
  }
  for (const [index, name] of ["teacher", "otherTeacher"].entries()) {
    await db.query(`insert into public.teachers (id, user_id, teacher_id, full_name, email, department)
      values ($1, $2, $3, $3, $4, 'IT')`, [index + 1, ids[name], `T${index}`, `${name}@example.test`])
    await db.query(`insert into public.teacher_assignments
      (id, teacher_id, program_id, course_id, year_level, section, campus)
      select $1, $1, program_id, id, '2nd Year', $2, 'Main Campus'
      from public.courses where course_code = 'CCS2207'`, [index + 1, index === 0 ? "21001" : "21002"])
  }
  for (const [index, name] of ["student", "otherStudent", "archivedStudent"].entries()) {
    await db.query(`insert into public.students
      (id, user_id, student_id, full_name, email, parent_name, parent_contact_number,
       program_id, year_level, section, campus, status)
      select $1, $2, $3, $3, $4, 'Guardian', '+639171234567', id, '2nd Year', $5, 'Main Campus', $6
      from public.programs where program_code = 'BSIT'`,
    [index + 1, ids[name], `S${index}`, `${name}@example.test`, index === 1 ? "21002" : "21001", index === 2 ? "archived" : "active"])
    await db.query(`insert into public.rfid_cards (id, student_id, rfid_number) values ($1, $1, $2)`, [index + 1, `CARD${index}`])
    await db.query(`insert into public.attendance_records
      (id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
      values ($1, $1, $1, '2026-09-04', '06:00', 'Present', 'Main Campus')`, [index + 1])
    await db.query(`insert into public.sms_notifications
      (id, attendance_id, student_id, parent_contact_number, message)
      values ($1, $1, $1, '+639171234567', 'Arrival')`, [index + 1])
  }

  // Reproduce retained-session leaks against the actual pre-P01 policies.
  await db.exec("begin")
  baseline = {}
  for (const name of ["admin", "teacher", "student"]) {
    await setStatus(name, "inactive")
    await asUser(name)
    baseline[name] = { students: await count("students"), courses: await count("courses") }
  }
  await db.exec("rollback; reset role")
  originalData = await snapshot()
  migration = await readFile(new URL(migrationName, directory), "utf8")
  await db.exec(migration)
  // Later migrations must follow the legacy fixture/baseline setup, preserving
  // this suite's explicit proof of access to pre-existing historical records.
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql") && file > migrationName).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
})

beforeEach(async () => db.exec("begin"))
afterEach(async () => db.exec("rollback; reset role"))
after(async () => db.close())

test("pre-P01 policies reproduce disabled admin, teacher, and student access", () => {
  assert.equal(baseline.admin.students, 3)
  assert.equal(baseline.teacher.students, 1)
  assert.equal(baseline.student.students, 1)
  for (const value of Object.values(baseline)) assert(value.courses > 0)
})

test("migration preserves every row, account status, and linked historical record", async () => {
  assert.deepEqual(await snapshot(), originalData)
})

test("active admin retains reads and writes, including archived student history", async () => {
  await asUser("admin")
  for (const table of tables) assert((await count(table)) > 0, table)
  assert.equal(await count("students"), 3)
  assert.equal(await count("attendance_records"), 3)
  for (const table of tables) {
    assert((await db.query(`update public.${table} set id = id returning id`)).rows.length > 0, table)
  }
  const created = await db.query(`insert into public.programs (program_code, program_name)
    values ('P01-TEST', 'Test only') returning id`)
  assert.equal((await db.query("delete from public.programs where id = $1 returning id", [created.rows[0].id])).rows.length, 1)
})

test("active teacher keeps only assigned active students, cards, attendance, and schedules", async () => {
  await asUser("teacher")
  for (const table of ["users", "teachers", "teacher_assignments", "students", "rfid_cards", "attendance_records"]) {
    assert.equal(await count(table), 1, table)
  }
  assert.equal(await count("sms_notifications"), 0)
  const schedules = (await db.query("select distinct section from public.class_schedules")).rows
  assert.deepEqual(schedules, [{ section: "21001" }])
  assert((await count("courses")) > 0)
  assert((await count("programs")) > 0)
  assert.equal((await db.query("select public.teacher_can_access_student(2) as allowed")).rows[0].allowed, false)
  assert.equal((await db.query("select public.teacher_can_access_student(3) as allowed")).rows[0].allowed, false)
})

test("active student keeps personal profile, card, attendance and SMS only", async () => {
  await asUser("student")
  for (const table of ["users", "students", "rfid_cards", "attendance_records", "sms_notifications"]) {
    assert.equal(await count(table), 1, table)
  }
  for (const table of ["teachers", "teacher_assignments", "class_schedules"]) assert.equal(await count(table), 0, table)
  assert((await count("programs")) > 0)
  assert((await count("courses")) > 0)
})

for (const role of ["admin", "teacher", "student"]) {
  for (const status of ["inactive", "archived"]) {
    test(`${status} ${role}: retained identity loses business reads, writes, and helper access`, async () => {
      await asUser(role)
      assert((await count("students")) > 0)
      await setStatus(role, status)
      await asUser(role)
      for (const table of businessTables) assert.equal(await count(table), 0, table)
      assert.deepEqual((await db.query("select id, status from public.users")).rows, [{ id: ids[role], status }])
      assert.deepEqual((await db.query(`select public.current_user_role() as role,
        public.current_student_id() as student, public.teacher_can_access_student(1) as assigned`)).rows,
      [{ role: null, student: null, assigned: false }])
      for (const table of tables) {
        assert.equal((await db.query(`update public.${table} set id = id returning id`)).rows.length, 0, `update ${table}`)
        assert.equal((await db.query(`delete from public.${table} returning id`)).rows.length, 0, `delete ${table}`)
      }
      await expectRejected(`insert into public.programs (program_code, program_name) values ('DENIED', 'Denied')`)
      assert.equal((await db.query(`update public.users set status = 'active', role = 'admin' where id = $1 returning id`, [ids[role]])).rows.length, 0)
      await expectRejected(`insert into public.users (id, email, role, status) values ($1, $2, 'admin', 'active')
        on conflict (id) do update set role = 'admin', status = 'active'`, [ids[role], `${role}@example.test`])
    })
  }
}

for (const role of ["teacher", "student"]) {
  test(`active ${role} cannot elevate privileges or write business records`, async () => {
    await asUser(role)
    for (const table of tables) assert.equal((await db.query(`update public.${table} set id = id returning id`)).rows.length, 0, table)
    await expectRejected(`insert into public.programs (program_code, program_name) values ('DENIED', 'Denied')`)
    assert.equal((await db.query("update public.users set role = 'admin' returning id")).rows.length, 0)
  })

  test(`${role} profile archive/restore revokes/restores access using the same identity`, async () => {
    await asUser("admin")
    await db.query(`update public.${role}s set status = 'archived' where user_id = $1`, [ids[role]])
    await asUser(role)
    for (const table of businessTables) assert.equal(await count(table), 0, table)
    await asUser("admin")
    await db.query(`update public.${role}s set status = 'active' where user_id = $1`, [ids[role]])
    await asUser(role)
    assert.equal(await count("students"), 1)
    if (role === "student") assert.equal((await db.query("select card_status from public.rfid_cards")).rows[0].card_status, "Deactivated")
  })
}

test("missing account and missing identity cannot access business data", async () => {
  for (const identity of ["", "99999999-0000-4000-8000-000000000001"]) {
    await asUser(identity)
    for (const table of tables) assert.equal(await count(table), 0, table)
  }
})

test("anonymous role cannot invoke authorization helpers", async () => {
  await db.exec("set local role anon")
  for (const call of ["current_user_role()", "current_student_id()", "teacher_can_access_student(1)"]) {
    await expectRejected(`select public.${call}`)
  }
})

test("reapplication is idempotent and preserves rows", async () => {
  await db.exec(migration.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  assert.deepEqual(await snapshot(), originalData)
  const policies = await db.query("select count(*)::int as n from pg_policies where policyname = 'active_account_required' and permissive = 'RESTRICTIVE'")
  assert.equal(policies.rows[0].n, 9)
})

test("rollback restores prior authorization definitions without modifying data", async () => {
  const readme = await readFile(new URL("README.md", directory), "utf8")
  const rollback = readme.match(/<!-- p01-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec(rollback.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  assert.deepEqual(await snapshot(), originalData)
  for (const role of ["admin", "teacher", "student"]) {
    await setStatus(role, "inactive")
    await asUser(role)
    assert.equal(await count("students"), baseline[role].students)
    assert.equal(await count("courses"), baseline[role].courses)
  }
})

test("hosted verification script reports nine passes and rolls back every persistent change", async () => {
  const script = await readFile(new URL("../verify_active_account_access.sql", directory), "utf8")
  // The suite already owns a transaction; execute the same script body inside it.
  const results = await db.exec(script.replace(/^begin;$/m, "").replace(/^rollback;$/m, ""))
  const report = results.find(result => result.rows?.length === 9)
  assert(report, "Expected all three roles and all three statuses")
  assert(report.rows.every(row => row.result === "PASS"))
  assert.deepEqual(await snapshot(), originalData)
})

test("hosted verification script detects old policies and rolls back failed probes", async () => {
  const readme = await readFile(new URL("README.md", directory), "utf8")
  const rollback = readme.match(/<!-- p01-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec(rollback.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  const script = await readFile(new URL("../verify_active_account_access.sql", directory), "utf8")
  await db.exec("savepoint verification_failure")
  await assert.rejects(db.exec(script.replace(/^begin;$/m, "").replace(/^rollback;$/m, "")), /Disabled .* authorization helper/)
  await db.exec("rollback to savepoint verification_failure")
  assert.deepEqual(await snapshot(), originalData)
})
