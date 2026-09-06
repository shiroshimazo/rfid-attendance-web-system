import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"

const db = new PGlite()
const directory = new URL("../supabase/migrations/", import.meta.url)
const migrationName = "202609100001_atomic_management_saves.sql"
const ids = { admin: "10000000-0000-4000-8000-000000000001",
  teacher: "20000000-0000-4000-8000-000000000001", student: "30000000-0000-4000-8000-000000000001" }
let programId, courseId, teacherId, studentId, migration, original
let teacher, student, assignment

async function identity(role) {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [ids[role]])
  await db.exec("set local role authenticated")
}
async function snapshot() {
  await db.exec("reset role")
  const result = {}
  for (const table of ["auth.users", "public.users", "public.students", "public.teachers",
    "public.teacher_assignments", "public.rfid_cards", "public.programs", "public.courses", "public.class_schedules"]) {
    result[table] = (await db.query(`select * from ${table} order by id`)).rows
  }
  return result
}
async function rejects(action, pattern = /pilot|BSIT|section|weekday|Monday|campus|subject|assignment/i) {
  await db.exec("savepoint failed_save")
  try { await assert.rejects(action, pattern) }
  finally { await db.exec("rollback to savepoint failed_save; release savepoint failed_save") }
}
const saveTeacher = (profile = teacher, assignments = [assignment], id = teacherId, userId = null) =>
  db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, $3::uuid, $4::bigint)",
    [JSON.stringify(profile), JSON.stringify(assignments), userId, id])
const saveStudent = (profile = student, id = studentId, userId = null) =>
  db.query("select public.save_student_profile($1::jsonb, $2::uuid, $3::bigint)", [JSON.stringify(profile), userId, id])
const saveWeek = (days = [1, 3, 5], options = {}) => db.query(
  "select public.save_schedule_week($1, $2, $3, $4, $5::integer[], $6::time, $7, $8::public.account_status)",
  [options.program ?? programId, options.year ?? "2nd Year", options.section ?? "21001",
    options.campus ?? null, days, options.time ?? "07:00", options.grace ?? 20, options.status ?? "active"])

before(async () => {
  await db.exec(`create role authenticated; create role anon; create schema auth;
    create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;`)
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql") && file < migrationName).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
  for (const [role, id] of Object.entries(ids)) await db.query(
    "insert into auth.users(id, email, raw_app_meta_data) values ($1, $2, $3)",
    [id, `${role}@example.test`, JSON.stringify({ role })])
  programId = (await db.query("select id from public.programs where program_code = 'BSIT'")).rows[0].id
  courseId = (await db.query("select id from public.courses where course_code = 'CCS2207'")).rows[0].id
  teacherId = (await db.query(`insert into public.teachers(user_id, teacher_id, full_name, email, department)
    values ($1, 'T01', 'Teacher Original', 'teacher@example.test', 'IT') returning id`, [ids.teacher])).rows[0].id
  studentId = (await db.query(`insert into public.students(user_id, student_id, full_name, email, parent_name,
    parent_contact_number, program_id, year_level, section, campus)
    values ($1, 'S01', 'Student Original', 'student@example.test', 'Guardian', '+639171234567', $2,
    '2nd Year', '21001', 'Main Campus') returning id`, [ids.student, programId])).rows[0].id
  await db.query(`insert into public.teacher_assignments(teacher_id, program_id, course_id, year_level, section, campus)
    values ($1, $2, $3, '2nd Year', '21001', 'Main Campus')`, [teacherId, programId, courseId])
  await db.query("insert into public.rfid_cards(student_id, rfid_number) values ($1, 'P02CARD')", [studentId])
  teacher = (await db.query("select * from public.teachers where id = $1", [teacherId])).rows[0]
  student = (await db.query("select * from public.students where id = $1", [studentId])).rows[0]
  assignment = { program_id: programId, course_id: courseId, year_level: "2nd Year", section: "21001", campus: "Main Campus" }
  original = await snapshot()
  migration = await readFile(new URL(migrationName, directory), "utf8")
  await db.exec(migration)
})
beforeEach(async () => { await db.exec("begin"); await identity("admin") })
afterEach(async () => db.exec("rollback; reset role"))
after(async () => db.close())

test("migration and reapplication preserve all existing data", async () => {
  assert.deepEqual(await snapshot(), original)
  await db.exec(migration.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  assert.deepEqual(await snapshot(), original)
})

test("documented rollback and forward reapplication preserve records and restore RPCs", async () => {
  await db.exec("reset role")
  const docs = await readFile(new URL("../supabase/migrations/README.md", import.meta.url), "utf8")
  const rollback = docs.match(/<!-- p02-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec(rollback.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  assert.deepEqual(await snapshot(), original)
  assert.equal((await db.query("select to_regprocedure('public.save_student_profile(jsonb,uuid,bigint)') as f")).rows[0].f, null)
  await db.exec(migration.replace(/^begin;$/m, "").replace(/^commit;$/m, ""))
  await identity("admin")
  await saveStudent()
  await saveTeacher()
  await saveWeek()
})

for (const role of ["teacher", "student"]) test(`${role} creation stores the Auth email and requested profile status`, async () => {
  await db.exec("reset role")
  const userId = "40000000-0000-4000-8000-000000000001"
  await db.query("insert into auth.users(id, email, raw_app_meta_data) values ($1, 'new@example.test', $2)",
    [userId, JSON.stringify({ role })])
  await identity("admin")
  const profile = { ...(role === "teacher" ? teacher : student), [`${role}_id`]: "NEW02", email: "unaccepted@example.test", status: "inactive" }
  if (role === "teacher") await saveTeacher(profile, [assignment], null, userId)
  else await saveStudent(profile, null, userId)
  const saved = (await db.query(`select * from public.${role}s where user_id = $1`, [userId])).rows[0]
  assert.equal(saved.email, "new@example.test")
  assert.equal(saved.status, "inactive")
  assert.equal((await db.query("select status from public.users where id = $1", [userId])).rows[0].status, "inactive")
  if (role === "teacher") assert.equal((await db.query("select status from public.teacher_assignments where teacher_id = $1", [saved.id])).rows[0].status, "inactive")
})

test("teacher profile, assignments and lifecycle commit together and deduplicate", async () => {
  await saveTeacher({ ...teacher, full_name: "Changed teacher", status: "inactive" }, [assignment, assignment])
  const result = await snapshot()
  assert.equal(result["public.teachers"][0].full_name, "Changed teacher")
  assert.equal(result["public.users"].find(row => row.id === ids.teacher).status, "inactive")
  assert.equal(result["public.teacher_assignments"].length, 1)
  assert.equal(result["public.teacher_assignments"][0].status, "inactive")
})

test("assignment insert failure rolls back profile, account status and previous assignments", async () => {
  await db.exec(`reset role;
    create function public.reject_p02_assignment() returns trigger language plpgsql as $$
    begin raise exception 'injected assignment failure'; end; $$;
    create trigger reject_p02_assignment before insert on public.teacher_assignments
    for each row execute function public.reject_p02_assignment();`)
  await identity("admin")
  await rejects(() => saveTeacher({ ...teacher, full_name: "Must not persist", status: "archived" }), /injected assignment/)
  assert.deepEqual(await snapshot(), original)
})

test("teacher create failure leaves no partial profile or assignments", async () => {
  await db.exec("reset role")
  const newId = "20000000-0000-4000-8000-000000000002"
  await db.query("insert into auth.users(id, email, raw_app_meta_data) values ($1, 'new@example.test', '{\"role\":\"teacher\"}')", [newId])
  await db.exec(`create function public.reject_p02_assignment() returns trigger language plpgsql as $$
    begin raise exception 'injected assignment failure'; end; $$;
    create trigger reject_p02_assignment before insert on public.teacher_assignments
    for each row execute function public.reject_p02_assignment();`)
  await identity("admin")
  await rejects(() => saveTeacher({ ...teacher, teacher_id: "T02", email: "new@example.test" }, [assignment], null, newId), /injected assignment/)
  assert.equal((await db.query("select * from public.teachers where user_id = $1", [newId])).rows.length, 0)
  assert.equal((await db.query("select count(*)::int as n from public.teacher_assignments")).rows[0].n, 1)
})

for (const [field, badValues] of Object.entries({ year_level: ["", null, "1st Year"], section: ["", null, "21011"], campus: ["", null, "Other Campus"] })) {
  for (const bad of badValues) test(`teacher rejects ${field}=${bad} without clearing assignments`, async () => {
    await rejects(() => saveTeacher(teacher, [{ ...assignment, [field]: bad }]))
    assert.deepEqual(await snapshot(), original)
  })
}

test("teacher rejects missing or wrong-program subjects and empty assignments", async () => {
  await rejects(() => saveTeacher(teacher, []))
  await rejects(() => saveTeacher(teacher, [{ ...assignment, course_id: 999999 }]))
  const other = (await db.query("insert into public.programs(program_code, program_name) values ('BSHM', 'Hospitality') returning id")).rows[0].id
  await rejects(() => saveTeacher(teacher, [{ ...assignment, program_id: other }]))
})

test("student rejects a real non-BSIT program ID before any profile or card changes", async () => {
  const other = (await db.query("insert into public.programs(program_code, program_name) values ('BSHM', 'Hospitality') returning id")).rows[0].id
  await rejects(() => saveStudent({ ...student, program_id: other, status: "archived" }))
  assert.equal((await db.query("select card_status from public.rfid_cards")).rows[0].card_status, "Active")
  assert.equal((await db.query("select status from public.students")).rows[0].status, "active")
})

test("student archive saves preserve the existing card lifecycle", async () => {
  await saveStudent({ ...student, full_name: "Changed Student", status: "archived" })
  assert.equal((await db.query("select card_status from public.rfid_cards")).rows[0].card_status, "Deactivated")
  await saveStudent(student)
  assert.equal((await db.query("select card_status from public.rfid_cards")).rows[0].card_status, "Deactivated")
})

test("failed student profile write preserves status and card", async () => {
  await rejects(() => saveStudent({ ...student, full_name: "", status: "archived" }), /check constraint/)
  assert.deepEqual(await snapshot(), original)
})

test("schedule save updates selected days and archives omitted days without deleting history", async () => {
  await saveWeek()
  const rows = (await db.query("select * from public.class_schedules where section = '21001' order by day_of_week")).rows
  assert.equal(rows.length, 5)
  for (const row of rows) {
    assert.equal(row.status, [1, 3, 5].includes(row.day_of_week) ? "active" : "archived")
    if (row.status === "active") assert.equal(row.time_start, "07:00:00")
  }
  await db.query("select public.set_schedule_week_status($1, '2nd Year', '21001', null, 'inactive')", [programId])
  assert.equal((await db.query("select count(*)::int as n from public.class_schedules where section = '21001' and status = 'archived'")).rows[0].n, 2)
})

test("schedule failure during retirement rolls back all earlier day updates", async () => {
  await db.exec(`reset role; create function public.reject_p02_schedule() returns trigger language plpgsql as $$
    begin if new.status = 'archived' then raise exception 'injected schedule failure'; end if; return new; end; $$;
    create trigger reject_p02_schedule before update on public.class_schedules
    for each row execute function public.reject_p02_schedule();`)
  await identity("admin")
  await rejects(() => saveWeek(), /injected schedule/)
  assert.deepEqual(await snapshot(), original)
})

test("schedule insert failure preserves the prior week", async () => {
  await db.query("delete from public.class_schedules where section = '21001' and day_of_week = 5")
  const before = await snapshot()
  await db.exec(`create function public.reject_p02_schedule() returns trigger language plpgsql as $$
    begin if new.day_of_week = 5 then raise exception 'injected insert failure'; end if; return new; end; $$;
    create trigger reject_p02_schedule before insert on public.class_schedules
    for each row execute function public.reject_p02_schedule();`)
  await identity("admin")
  await rejects(() => saveWeek(), /injected insert/)
  assert.deepEqual(await snapshot(), before)
})

for (const days of [[0], [6], [1, 1], [], null, [null]]) test(`schedule rejects invalid days ${JSON.stringify(days)}`, async () => {
  await rejects(() => saveWeek(days))
  assert.deepEqual(await snapshot(), original)
})

test("schedule rejects non-pilot placement and invalid grace/status", async () => {
  for (const options of [{ year: "1st Year" }, { campus: "Other" }, { section: "21011" }, { program: 999999 }, { grace: -1 }, { status: "archived" }]) {
    await rejects(() => saveWeek([1], options))
  }
  assert.deepEqual(await snapshot(), original)
})

for (const role of ["teacher", "student"]) {
  test(`${role} cannot call management RPCs`, async () => {
    await identity(role)
    for (const action of [() => saveTeacher(), () => saveStudent(), () => saveWeek()]) await rejects(action, /active administrator/)
    assert.deepEqual(await snapshot(), original)
  })
}
test("disabled admin cannot call management RPCs", async () => {
  await db.exec("reset role")
  await db.query("update public.users set status = 'inactive' where id = $1", [ids.admin])
  await identity("admin")
  for (const action of [() => saveTeacher(), () => saveStudent(), () => saveWeek()]) await rejects(action, /active administrator/)
})

for (const role of ["teacher", "student"]) {
  test(`${role} Auth email change synchronizes login/account/profile in one transaction`, async () => {
    await db.exec("reset role")
    await db.query("update auth.users set email = $1 where id = $2", [`changed-${role}@example.test`, ids[role]])
    for (const table of ["auth.users", "public.users"]) assert.equal((await db.query(`select email from ${table} where id = $1`, [ids[role]])).rows[0].email, `changed-${role}@example.test`)
    assert.equal((await db.query(`select email from public.${role}s where user_id = $1`, [ids[role]])).rows[0].email, `changed-${role}@example.test`)
  })

  test(`${role} email synchronization failure rolls back the Auth email too`, async () => {
    await db.exec(`reset role;
      create function public.reject_p02_email() returns trigger language plpgsql as $$
      begin raise exception 'injected email failure'; end; $$;
      create trigger reject_p02_email before update of email on public.${role}s
      for each row execute function public.reject_p02_email();`)
    await rejects(() => db.query("update auth.users set email = 'rejected@example.test' where id = $1", [ids[role]]), /injected email/)
    assert.deepEqual(await snapshot(), original)
  })

  test(`${role} older-client email writes retain the actual Auth email until accepted`, async () => {
    await db.query(`update public.${role}s set email = 'unaccepted@example.test' where user_id = $1`, [ids[role]])
    await db.query("update public.users set email = 'unaccepted@example.test' where id = $1", [ids[role]])
    assert.equal((await db.query(`select email from public.${role}s where user_id = $1`, [ids[role]])).rows[0].email, `${role}@example.test`)
    assert.equal((await db.query("select email from public.users where id = $1", [ids[role]])).rows[0].email, `${role}@example.test`)
  })
}
