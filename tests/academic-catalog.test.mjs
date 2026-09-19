import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist"

// Real migrations and RLS in PGlite. Only Supabase-owned Auth objects are stubbed.
const db = new PGlite({ extensions: { btree_gist } })
const directory = new URL("../supabase/migrations/", import.meta.url)
const migrationName = "202609220001_academic_catalog.sql"
const ids = {
  admin: "10000000-0000-4000-8000-000000000001",
  teacher: "20000000-0000-4000-8000-000000000001",
  student: "30000000-0000-4000-8000-000000000001",
}
const sessions = {
  admin: "40000000-0000-4000-8000-000000000001",
  teacher: "40000000-0000-4000-8000-000000000002",
  student: "40000000-0000-4000-8000-000000000003",
}
let migration, rollback, bsitId, legacyId

/** The scripts carry their own transaction; each test runs inside one it rolls back. */
const unwrapped = (sql) => sql.replace(/^begin;$/m, "").replace(/^commit;$/m, "")

async function as(role) {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [ids[role]])
  await db.query("select set_config('request.jwt.claims', $1, false)", [
    JSON.stringify({ session_id: sessions[role], role: "authenticated" }),
  ])
  await db.exec("set local role authenticated")
}

async function rejects(action, pattern) {
  await db.exec("savepoint expected_failure")
  try { await assert.rejects(action, pattern) }
  finally { await db.exec("rollback to savepoint expected_failure; release savepoint expected_failure") }
}

async function catalog() {
  await db.exec("reset role")
  return {
    sections: (await db.query("select * from public.academic_sections order by id")).rows,
    courses: (await db.query("select * from public.courses order by id")).rows,
    policies: (await db.query(
      "select policyname from pg_policies where tablename = 'academic_sections' order by policyname"
    )).rows.map((row) => row.policyname),
  }
}

const insertSection = (programId, yearLevel, sectionCode, campus) => db.query(
  "insert into public.academic_sections(program_id, year_level, section_code, campus) values ($1, $2, $3, $4) returning *",
  [programId, yearLevel, sectionCode, campus]
)

before(async () => {
  await db.exec(`
    create role authenticated;
    create role anon;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key, email text, encrypted_password text,
      raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}');
    create table auth.sessions(id uuid primary key, user_id uuid);
    create table auth.audit_log_entries(id uuid, payload jsonb);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;
  `)
  const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort()
  for (const file of files.filter((file) => file < migrationName)) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }

  for (const [role, id] of Object.entries(ids)) {
    await db.query("insert into auth.users(id, email, raw_app_meta_data) values ($1, $2, $3)",
      [id, `${role}@example.test`, JSON.stringify({ role })])
    await db.query("insert into public.email_verified_sessions(session_id, user_id) values ($1, $2)",
      [sessions[role], id])
  }

  // A placement that exists before the catalog does, outside the pilot scope.
  bsitId = (await db.query("select id from public.programs where program_code = 'BSIT'")).rows[0].id
  legacyId = (await db.query(
    "insert into public.programs(program_code, program_name) values ('BSHM', 'BS Hospitality Management') returning id"
  )).rows[0].id
  await db.query(`insert into public.students(user_id, student_id, full_name, email, parent_name,
      parent_contact_number, program_id, year_level, section, campus)
    values ($1, 'S-1', 'Student Example', 'student@example.test', 'Guardian', '+639171234567', $2,
      '1st Year', 'HM-1', 'Main Campus')`, [ids.student, legacyId])

  migration = await readFile(new URL(migrationName, directory), "utf8")
  rollback = await readFile(new URL("../supabase/rollback_academic_setup.sql", import.meta.url), "utf8")
  for (const file of files.filter((file) => file >= migrationName)) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
})

beforeEach(async () => db.exec("begin"))
afterEach(async () => db.exec("rollback; reset role"))
after(async () => db.close())

test("seeds the pilot scope and every placement already in use", async () => {
  const { sections, courses, policies } = await catalog()
  const pilot = sections.filter((row) => row.program_id === bsitId && row.year_level === "2nd Year")

  assert.equal(pilot.length, 30)
  assert.equal(new Set(pilot.map((row) => row.section_code)).size, 10)
  assert.equal(new Set(pilot.map((row) => row.campus)).size, 3)
  assert(sections.some((row) => row.program_id === legacyId && row.year_level === "1st Year"
    && row.section_code === "HM-1" && row.campus === "Main Campus"))
  assert(sections.every((row) => row.status === "active"))
  assert(courses.length > 0 && courses.every((row) => row.status === "active"))
  assert.deepEqual(policies, [
    "academic_sections_admin_write",
    "academic_sections_authenticated_read",
    "active_account_required",
    "email_verification_required",
  ])

  const triggers = (await db.query(
    "select tgname from pg_trigger where tgrelid = 'public.academic_sections'::regclass and not tgisinternal order by tgname"
  )).rows.map((row) => row.tgname)
  assert.deepEqual(triggers, ["academic_sections_set_updated_at", "audit_record_change"])
  assert.equal((await db.query(
    "select count(*)::int as n from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'academic_sections'"
  )).rows[0].n, 1)
})

test("reapplying the migration twice leaves the catalog unchanged", async () => {
  const original = await catalog()
  await db.exec(unwrapped(migration))
  await db.exec(unwrapped(migration))
  assert.deepEqual(await catalog(), original)
})

test("rejects duplicate groupings in any section letter case, blank values, and unknown programs", async () => {
  await insertSection(legacyId, "1st Year", "hm-2", "Main Campus")
  await rejects(() => insertSection(legacyId, "1st Year", "HM-2", "Main Campus"), /duplicate key/)
  for (const blank of [["  ", "HM-3", "Main Campus"], ["1st Year", " ", "Main Campus"], ["1st Year", "HM-3", ""]]) {
    await rejects(() => insertSection(legacyId, ...blank), /check constraint/)
  }
  await rejects(() => insertSection(999999, "1st Year", "HM-4", "Main Campus"), /foreign key/)
})

test("administrators write the catalog while teachers and students only read it", async () => {
  for (const role of ["teacher", "student"]) {
    await as(role)
    assert((await db.query("select count(*)::int as n from public.academic_sections")).rows[0].n >= 31)
    await rejects(() => insertSection(bsitId, "2nd Year", "21011", "Main Campus"), /row-level security/)
    assert.equal((await db.query("update public.academic_sections set status = 'archived' returning id")).rows.length, 0)
    assert.equal((await db.query("update public.courses set status = 'archived' returning id")).rows.length, 0)
  }

  await as("admin")
  const created = (await insertSection(bsitId, "2nd Year", "21011", "Main Campus")).rows[0]
  assert.equal(created.status, "active")
  assert.equal((await db.query(
    "update public.academic_sections set status = 'archived' where id = $1 returning status", [created.id]
  )).rows[0].status, "archived")
  assert.equal((await db.query(
    "update public.courses set status = 'archived' where course_code = 'CCS2207' returning status"
  )).rows[0].status, "archived")
})

test("the rollback script reverses the migration and reapplying rebuilds the catalog", async () => {
  await db.exec("reset role")
  await db.exec(unwrapped(rollback))
  assert.equal((await db.query("select to_regclass('public.academic_sections') as name")).rows[0].name, null)
  assert.equal((await db.query(`select count(*)::int as n from information_schema.columns
    where table_schema = 'public' and table_name = 'courses' and column_name = 'status'`)).rows[0].n, 0)
  assert.equal((await db.query("select section from public.students")).rows[0].section, "HM-1")

  await db.exec(unwrapped(migration))
  const { sections } = await catalog()
  assert.equal(sections.filter((row) => row.program_id === bsitId).length, 30)
  assert(sections.some((row) => row.section_code === "HM-1"))
})


test("new programs save student and teacher placements and retain assignment identity", async () => {
  await as("admin")
  const programId = (await db.query("insert into public.programs(program_code, program_name) values ('NEW', 'New Program') returning id")).rows[0].id
  await insertSection(programId, "3rd Year", "NEW-3", "New Campus")
  const courseId = (await db.query("insert into public.courses(program_id, course_code, course_name) values ($1, 'NEW101', 'New Subject') returning id", [programId])).rows[0].id
  const student = (await db.query("select * from public.students limit 1")).rows[0]
  const placement = { program_id: programId, year_level: "3rd Year", section: "NEW-3", campus: "New Campus" }
  await db.query("select public.save_student_profile($1::jsonb, null, $2)", [JSON.stringify({ ...student, ...placement }), student.id])
  assert.equal((await db.query("select program_id from public.students where id = $1", [student.id])).rows[0].program_id, programId)
  const teacher = { teacher_id: "T-NEW", full_name: "New Teacher", email: "teacher@example.test", department: "New", status: "active" }
  const assignments = [{ ...placement, course_id: courseId }]
  const teacherId = (await db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, $3::uuid, null) as id", [JSON.stringify(teacher), JSON.stringify(assignments), ids.teacher])).rows[0].id
  const assignment = (await db.query("select * from public.teacher_assignments where teacher_id = $1", [teacherId])).rows[0]
  const scheduleId = (await db.query("select public.create_subject_schedule($1, 1, '09:00'::time, '10:00'::time) as id", [assignment.id])).rows[0].id
  await db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, null, $3)", [JSON.stringify({ ...teacher, full_name: "Updated Teacher" }), JSON.stringify([{ ...assignments[0], id: assignment.id }]), teacherId])
  assert.equal((await db.query("select id from public.teacher_assignments where teacher_id = $1 and status = 'active'", [teacherId])).rows[0].id, assignment.id)
  assert.equal((await db.query("select status from public.subject_schedules where id = $1", [scheduleId])).rows[0].status, "active")
  const otherCourseId = (await db.query("select id from public.courses where program_id = $1 limit 1", [bsitId])).rows[0].id
  await rejects(() => db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, null, $3)", [JSON.stringify(teacher), JSON.stringify([{ ...assignments[0], course_id: otherCourseId }]), teacherId]), /subject/)
  for (const table of ["courses", "academic_sections", "programs"]) {
    await db.exec("savepoint inactive_catalog")
    await db.query(`update public.${table} set status = 'inactive' where ${table === "programs" ? "id" : "program_id"} = $1`, [programId])
    await rejects(() => db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, null, $3)", [JSON.stringify(teacher), JSON.stringify([{ ...assignments[0], id: assignment.id }]), teacherId]), /active/)
    if (table !== "courses") await rejects(() => db.query("select public.save_student_profile($1::jsonb, null, $2)", [JSON.stringify({ ...student, ...placement }), student.id]), /active/)
    await db.exec("rollback to savepoint inactive_catalog; release savepoint inactive_catalog")
  }
  await rejects(() => db.query("select public.assert_pilot_placement($1, '3rd Year', 'NEW-3', 'Wrong Campus')", [programId]), /grouping/)
  await as("teacher")
  await rejects(() => db.query("select public.assert_pilot_placement($1, '3rd Year', 'NEW-3', 'New Campus')", [programId]), /administrator/)
})


test("grouping edits cascade current placements, preserve history, and reject unsafe changes atomically", async () => {
  await as("admin")
  const group = (await db.query("select * from public.academic_sections where program_id=$1 and section_code='21002' and campus='Main Campus'", [bsitId])).rows[0]
  const student = (await db.query("select * from public.students limit 1")).rows[0]
  await db.query("select public.save_student_profile($1::jsonb, null, $2)", [JSON.stringify({ ...student, program_id: bsitId, year_level: group.year_level, section: group.section_code, campus: group.campus }), student.id])
  const course = (await db.query("select * from public.courses where program_id=$1 limit 1", [bsitId])).rows[0]
  const teacher = { teacher_id: "T-EDIT", full_name: "Grouping Teacher", email: "teacher@example.test", department: "IT", status: "active" }
  const assignment = { program_id: bsitId, course_id: course.id, year_level: group.year_level, section: group.section_code, campus: group.campus }
  const teacherId = (await db.query("select public.save_teacher_profile($1::jsonb, $2::jsonb, $3::uuid, null) as id", [JSON.stringify(teacher), JSON.stringify([assignment]), ids.teacher])).rows[0].id
  const assignmentId = (await db.query("select id from public.teacher_assignments where teacher_id=$1", [teacherId])).rows[0].id
  const scheduleId = (await db.query("select public.create_subject_schedule($1, 1, '09:00'::time, '10:00'::time) as id", [assignmentId])).rows[0].id
  await db.query("select public.save_subject_enrollment($1, $2::bigint[], 1)", [scheduleId, [student.id]])
  await as("teacher")
  await db.query("select public.confirm_subject_attendance($1, '2026-09-14'::date, $2, 'Present')", [scheduleId, student.id])
  const history = (await db.query("select * from public.subject_attendance")).rows
  await as("admin")
  const specific = (await db.query("insert into public.class_schedules(program_id, year_level, section, campus, day_of_week, time_start) values ($1, '2nd Year', '21002', 'Main Campus', 1, '08:00') returning id", [bsitId])).rows[0].id
  const edit = (program = bsitId, year = "3rd Year", section = "NEW-3", campus = "New Campus", status = "active") =>
    db.query("select public.update_academic_section($1,$2,$3,$4,$5,$6)", [group.id, program, year, section, campus, status])
  await rejects(() => edit(bsitId, "2nd Year", "21003", "Main Campus"), /unique|duplicate/)
  await rejects(() => edit(legacyId), /matching active subject/)
  assert.equal((await db.query("select section from public.students where id=$1", [student.id])).rows[0].section, "21002")
  assert.equal((await db.query("select section_code from public.academic_sections where id=$1", [group.id])).rows[0].section_code, "21002")

  await db.exec("savepoint timetable_collision")
  await db.query("insert into public.class_schedules(program_id, year_level, section, campus, day_of_week, time_start) values ($1, '3rd Year', 'NEW-3', 'New Campus', 1, '08:30')", [bsitId])
  await rejects(() => edit(), /unique|duplicate/)
  assert.equal((await db.query("select section from public.students where id=$1", [student.id])).rows[0].section, "21002")
  assert.equal((await db.query("select section from public.subject_schedules where id=$1", [scheduleId])).rows[0].section, "21002")
  await db.exec("rollback to savepoint timetable_collision; release savepoint timetable_collision")

  await edit()
  for (const table of ["students", "teacher_assignments", "subject_schedules"]) {
    const rows = (await db.query(`select program_id, year_level, section, campus from public.${table}`)).rows
    assert(rows.some(row => row.program_id === bsitId && row.year_level === "3rd Year" && row.section === "NEW-3" && row.campus === "New Campus"))
  }
  assert.equal((await db.query("select section from public.class_schedules where id=$1", [specific])).rows[0].section, "NEW-3")
  const defaults = (await db.query("select day_of_week, time_start from public.class_schedules where program_id=$1 and section='NEW-3' order by day_of_week", [bsitId])).rows
  assert.equal(defaults.length, 5)
  assert.equal(defaults[0].time_start, "08:00:00")
  assert.equal((await db.query("select count(*)::int as n from public.class_schedules where program_id=$1 and section='21002' and campus is null", [bsitId])).rows[0].n, 5)
  assert.equal((await db.query("select active from public.subject_enrollments where schedule_id=$1 and student_id=$2", [scheduleId, student.id])).rows[0].active, true)
  assert.deepEqual((await db.query("select * from public.subject_attendance")).rows, history)

  const destinationCourse = (await db.query("insert into public.courses(program_id, course_code, course_name) values ($1,$2,$3) returning id", [legacyId, course.course_code, course.course_name])).rows[0].id
  await edit(legacyId)
  assert.equal((await db.query("select course_id from public.teacher_assignments where id=$1", [assignmentId])).rows[0].course_id, destinationCourse)
  assert.equal((await db.query("select course_id from public.subject_schedules where id=$1", [scheduleId])).rows[0].course_id, destinationCourse)
  assert.equal((await db.query("select program_id from public.students where id=$1", [student.id])).rows[0].program_id, legacyId)
  assert.deepEqual((await db.query("select * from public.subject_attendance")).rows, history)
  await edit(legacyId, "3rd Year", "NEW-3", "New Campus", "inactive")
  assert.equal((await db.query("select status from public.academic_sections where id=$1", [group.id])).rows[0].status, "inactive")
  await rejects(() => edit(legacyId, "3rd Year", "NEW-3", "New Campus", "archived"), /status/)
  await db.query("update public.academic_sections set status='archived' where id=$1", [group.id])
  await rejects(() => edit(legacyId), /Restore/)
  await as("teacher")
  await rejects(() => edit(), /administrator/)
})


test("unverified administrators cannot edit class groupings", async () => {
  await as("admin")
  await db.query("select set_config('request.jwt.claims', '{}', false)")
  await rejects(() => db.query("select public.update_academic_section(1, $1, '2nd Year', '21002', 'Main Campus', 'active')", [bsitId]), /verified administrator/)
})
