import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { before, beforeEach, afterEach, after, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"

const db = new PGlite()
const ids = Object.fromEntries(["admin", "teacher", "otherTeacher", "student", "otherStudent"].map((role, i) => [role, `10000000-0000-4000-8000-00000000000${i + 1}`]))
let program, courseA, courseB, teacher, otherTeacher, student, otherStudent, assignmentA, assignmentB, day, date, migration, legacy
const rows = async (sql, args = []) => (await db.query(sql, args)).rows
async function identity(name) {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [ids[name] ?? name])
  await db.exec("set local role authenticated")
}
async function rejected(fn, pattern = /permission|assigned|active|outside|Choose|Refresh|changed|Confirm|duplicate/i) {
  await db.exec("savepoint rejection")
  try { await assert.rejects(fn, pattern) }
  finally { await db.exec("rollback to savepoint rejection; release savepoint rejection") }
}
async function schedule(assignment = assignmentA, start = "08:00", end = "09:00") {
  await identity("admin")
  return (await rows("select public.create_subject_schedule($1,$2,$3::time,$4::time) as id", [assignment, day, start, end]))[0].id
}
async function confirm(sch, status = "Present", who = student, expected = null, when = date) {
  return rows("select public.confirm_subject_attendance($1,$2::date,$3,$4,$5::timestamptz) as id", [sch, when, who, status, expected])
}
async function dailyEvidence() {
  await db.exec("reset role")
  const result = {}
  for (const name of ["attendance_records", "rfid_cards", "sms_notifications"]) result[name] = await rows(`select * from public.${name} order by id`)
  return result
}
before(async () => {
  await db.exec(`create role authenticated; create role anon; create schema auth;
    create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;`)
  const directory = new URL("../supabase/migrations/", import.meta.url)
  const name = "202609120001_subject_attendance.sql"
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql") && file < name).sort()) await db.exec(await readFile(new URL(file, directory), "utf8"))
  migration = await readFile(new URL(name, directory), "utf8")
  for (const [role, id] of Object.entries(ids)) await db.query("insert into auth.users(id,email,raw_app_meta_data) values($1,$2,$3)", [id, `${role}@example.test`, JSON.stringify({ role: role.includes("Teacher") ? "teacher" : role.includes("Student") ? "student" : role })])
  program = (await rows("select id from public.programs where program_code='BSIT'"))[0].id
  ;[courseA, courseB] = (await rows("select id from public.courses where program_id=$1 order by id limit 2", [program])).map(row => row.id)
  for (const name of ["teacher", "otherTeacher"]) {
    const id = (await rows("insert into public.teachers(user_id,teacher_id,full_name,email,department) values($1,$2,$2,$3,'IT') returning id", [ids[name], name, `${name}@example.test`]))[0].id
    if (name === "teacher") teacher = id; else otherTeacher = id
  }
  for (const name of ["student", "otherStudent"]) {
    const id = (await rows(`insert into public.students(user_id,student_id,full_name,email,parent_name,parent_contact_number,program_id,year_level,section,campus)
      values($1,$2,$2,$3,'Guardian','09123456789',$4,'2nd Year','21001',$5) returning id`, [ids[name], name, `${name}@example.test`, program, name === "student" ? "Main Campus" : "MV Campus"]))[0].id
    if (name === "student") student = id; else otherStudent = id
  }
  assignmentA = (await rows("insert into public.teacher_assignments(teacher_id,program_id,course_id,year_level,section,campus) values($1,$2,$3,'2nd Year','21001','Main Campus') returning id", [teacher, program, courseA]))[0].id
  assignmentB = (await rows("insert into public.teacher_assignments(teacher_id,program_id,course_id,year_level,section,campus) values($1,$2,$3,'2nd Year','21001','Main Campus') returning id", [otherTeacher, program, courseB]))[0].id
  const now = (await rows("select (now() at time zone 'Asia/Manila')::date::text as date, extract(dow from now() at time zone 'Asia/Manila')::integer as day"))[0]
  date = now.date; day = now.day
  // Only the other student has a card. The subject student is genuinely cardless.
  const card = (await rows("insert into public.rfid_cards(student_id,rfid_number) values($1,'00000011') returning id", [otherStudent]))[0].id
  const record = (await rows("insert into public.attendance_records(student_id,rfid_card_id,attendance_date,time_in,time_out,attendance_status,campus) values($1,$2,$3,'08:00','12:00','Present','MV Campus') returning id", [otherStudent, card, date]))[0].id
  await rows("insert into public.sms_notifications(attendance_id,student_id,parent_contact_number,message) values($1,$2,'09123456789','Existing message')", [record, otherStudent])
  legacy = await dailyEvidence()
  await db.exec(migration)
})
beforeEach(async () => { await db.exec("begin") })
afterEach(async () => { await db.exec("rollback; reset role") })
after(async () => db.close())

test("migration preserves existing daily RFID/SMS data and creates no inferred subject results", async () => {
  assert.deepEqual(await dailyEvidence(), legacy)
  assert.equal((await rows("select count(*)::integer as n from public.subject_attendance"))[0].n, 0)
})
test("read-only installation probe returns six PASS rows without changing data", async () => {
  const sql = await readFile(new URL("../supabase/verify_subject_attendance.sql", import.meta.url), "utf8")
  const checks = await rows(sql)
  assert.equal(checks.length, 6)
  assert(checks.every(row => row.result === "PASS"), JSON.stringify(checks))
  assert.deepEqual(await dailyEvidence(), legacy)
})
test("cardless student can be Present in A and teacher-confirmed Absent in B without any tap", async () => {
  const a = await schedule()
  const b = await schedule(assignmentB, "09:00", "10:00")
  await identity("teacher"); await confirm(a)
  await identity("otherTeacher"); await confirm(b, "Absent")
  await identity("admin")
  const results = await rows("select * from public.subject_attendance order by id")
  assert.deepEqual(results.map(row => row.attendance_status), ["Present", "Absent"])
  assert.deepEqual(results.map(row => row.teacher_id), [teacher, otherTeacher])
  assert(results.every(row => !Object.hasOwn(row, "time_in") && !Object.hasOwn(row, "rfid_card_id")))
  assert.deepEqual(await dailyEvidence(), legacy)
})
test("an unconfirmed subject never becomes Absent when another subject is confirmed", async () => {
  const a = await schedule(); await schedule(assignmentB, "09:00", "10:00")
  await identity("teacher"); await confirm(a)
  assert.equal((await rows("select count(*)::integer as n from public.subject_attendance"))[0].n, 1)
})
test("teachers cannot confirm or read another teacher's subject despite sharing the same roster", async () => {
  const a = await schedule(); const b = await schedule(assignmentB, "09:00", "10:00")
  await identity("otherTeacher"); await confirm(b, "Absent")
  await identity("teacher"); await rejected(() => confirm(b))
  assert.equal((await rows("select * from public.subject_attendance")).length, 0)
  await confirm(a)
  assert.equal((await rows("select * from public.subject_attendance")).length, 1)
})
test("wrong campus, future dates, wrong weekdays, retired values and invalid confirmations are rejected", async () => {
  const a = await schedule(); await identity("teacher")
  await rejected(() => confirm(a, "Present", otherStudent))
  const future = (await rows("select ((now() at time zone 'Asia/Manila')::date + 7)::text as date"))[0].date
  const otherDay = (await rows("select ((now() at time zone 'Asia/Manila')::date - 1)::text as date"))[0].date
  await rejected(() => confirm(a, "Present", student, null, future))
  await rejected(() => confirm(a, "Present", student, null, otherDay))
  for (const status of ["Excused", "Late", "NoRecord", null]) await rejected(() => confirm(a, status))
})
test("same-result retries are idempotent and stale corrections cannot overwrite a saved decision", async () => {
  const a = await schedule(); await identity("teacher")
  const first = await confirm(a); assert.deepEqual(await confirm(a), first)
  await rejected(() => confirm(a, "Absent"))
  const original = (await rows("select * from public.subject_attendance"))[0]
  await confirm(a, "Absent", student, original.confirmed_at.toISOString())
  await rejected(() => confirm(a, "Present", student, original.confirmed_at.toISOString()))
  assert.equal((await rows("select attendance_status from public.subject_attendance"))[0].attendance_status, "Absent")
})
test("student sees both own subject results but cannot confirm attendance or read others", async () => {
  const a = await schedule(); await identity("teacher"); await confirm(a)
  await identity("student")
  assert.equal((await rows("select * from public.subject_attendance")).length, 1)
  await rejected(() => confirm(a, "Absent"))
  await identity("otherStudent")
  assert.equal((await rows("select * from public.subject_attendance")).length, 0)
})
for (const role of ["admin", "teacher", "student"]) test(`${role} cannot bypass RPC checks with direct table writes`, async () => {
  await identity(role)
  await rejected(() => rows("delete from public.subject_attendance"))
  await rejected(() => rows("update public.subject_schedules set time_start='00:00'"))
})
test("disabled accounts and retired assignments lose confirmation access", async () => {
  const a = await schedule(); await identity("teacher"); await confirm(a)
  await db.exec("reset role"); await rows("update public.users set status='inactive' where id=$1", [ids.teacher])
  await identity("teacher"); await rejected(() => confirm(a, "Absent"))
  assert.equal((await rows("select * from public.subject_attendance")).length, 0)
  await db.exec("reset role"); await rows("update public.users set status='active' where id=$1", [ids.teacher]); await rows("update public.teacher_assignments set status='archived' where id=$1", [assignmentA])
  await identity("teacher"); await rejected(() => confirm(a, "Absent"))
})
test("retiring a schedule or archiving a student preserves history for the admin and prevents new confirmations", async () => {
  const a = await schedule(); await identity("teacher"); await confirm(a)
  await identity("admin"); await rows("select public.retire_subject_schedule($1)", [a])
  await rows("update public.students set status='archived' where id=$1", [student])
  assert.equal((await rows("select * from public.subject_attendance")).length, 1)
  await identity("teacher"); await rejected(() => confirm(a, "Absent"))
  assert.deepEqual(await dailyEvidence(), legacy)
})
test("schedule replacement cannot duplicate an already-confirmed subject slot", async () => {
  const a = await schedule(); await identity("teacher"); await confirm(a)
  await identity("admin"); await rows("select public.retire_subject_schedule($1)", [a])
  const replacement = await schedule()
  await identity("teacher"); await rejected(() => confirm(replacement))
})
test("schedule RPC requires admin and validates weekday/time and pilot assignment", async () => {
  await identity("teacher"); await rejected(() => rows("select public.create_subject_schedule($1,$2,'08:00','09:00')", [assignmentA, day]))
  await identity("admin"); await rejected(() => rows("select public.create_subject_schedule($1,8,'08:00','09:00')", [assignmentA]))
  await rejected(() => rows("select public.create_subject_schedule($1,1,'09:00','08:00')", [assignmentA]))
})
test("migration reapplication and write-disable rollback retain confirmations and legacy evidence", async () => {
  const a = await schedule(); await identity("teacher"); await confirm(a)
  await db.exec("reset role")
  const original = await rows("select * from public.subject_attendance")
  const withinTransaction = sql => sql.replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(withinTransaction(migration))
  assert.deepEqual(await rows("select * from public.subject_attendance"), original)
  await db.exec(withinTransaction(await readFile(new URL("../supabase/rollback_subject_attendance.sql", import.meta.url), "utf8")))
  await identity("teacher"); await rejected(() => confirm(a, "Absent"))
  await db.exec("reset role"); await db.exec(withinTransaction(migration))
  assert.deepEqual(await rows("select * from public.subject_attendance"), original)
  assert.deepEqual(await dailyEvidence(), legacy)
})
