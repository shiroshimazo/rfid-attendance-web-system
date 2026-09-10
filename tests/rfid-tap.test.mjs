import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"
import { before, beforeEach, afterEach, after, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist"

const db = new PGlite({ extensions: { btree_gist } })
const rows = async (sql, args = []) => (await db.query(sql, args)).rows
const account = "10000000-0000-4000-8000-000000000001"
let student, card, program, migration
const tap = async (time = "2026-09-08T06:15:00+08:00", uid = "00:00:00:11", requestId = randomUUID()) =>
  (await rows("select public.record_rfid_tap($1,$2,$3) as result", [requestId, uid, time]))[0].result
async function rejected(fn) {
  await db.exec("savepoint rejection")
  try { await assert.rejects(fn, /permission denied/) }
  finally { await db.exec("rollback to savepoint rejection; release savepoint rejection") }
}
before(async () => {
  await db.exec(`create role authenticated; create role anon; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;`)
  const directory = new URL("../supabase/migrations/", import.meta.url)
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql")).sort()) {
    const sql = await readFile(new URL(file, directory), "utf8")
    await db.exec(sql)
    if (file === "202609140001_rfid_tap_processing.sql") migration = sql
  }
  await rows("insert into auth.users(id,email,raw_app_meta_data) values($1,'tap@example.test','{\"role\":\"student\"}')", [account])
  program = (await rows("select id from public.programs where program_code='BSIT'"))[0].id
  student = (await rows(`insert into public.students(user_id,student_id,full_name,email,parent_name,parent_contact_number,program_id,year_level,section,campus)
    values($1,'TAP-STUDENT','Tap Student','tap@example.test','Guardian','09123456789',$2,'2nd Year','21001','Main Campus') returning id`, [account, program]))[0].id
  card = (await rows("insert into public.rfid_cards(student_id,rfid_number) values($1,'00000011') returning id", [student]))[0].id
})
beforeEach(() => db.exec("begin"))
afterEach(() => db.exec("rollback; reset role"))
after(() => db.close())

test("first tap and retry record one arrival; second distinct tap fills departure only", async () => {
  const request = randomUUID()
  const first = await tap(undefined, undefined, request)
  assert.equal(first.ok, true); assert.equal(first.action, "time_in")
  assert.equal(first.attendanceStatus, "Present")
  assert.deepEqual(first.student, { name: "Tap Student", yearLevel: "2nd Year" })
  assert.deepEqual(first.feedback, { led: "green", buzzer: "success" })
  assert.equal((await rows("select time_out from public.attendance_records"))[0].time_out, null)
  const replay = await tap("2026-09-08T08:00:00+08:00", "00-00-00-11", request)
  assert.deepEqual(replay, { ...first, replayed: true })
  assert.equal((await rows("select time_out from public.attendance_records"))[0].time_out, null)
  const second = await tap("2026-09-08T12:30:00+08:00")
  assert.equal(second.action, "time_out"); assert.equal(second.attendanceStatus, "Present")
  const saved = (await rows("select * from public.attendance_records"))[0]
  assert.equal(saved.time_in, "06:15:00"); assert.equal(saved.time_out, "12:30:00")
  assert.equal(saved.rfid_card_id, card)
  assert.equal((await rows("select * from public.rfid_tap_requests")).length, 2)
  assert.equal((await rows("select * from public.subject_attendance")).length, 0)
  const notifications = await rows("select * from public.sms_notifications")
  assert.equal(notifications.length, 1)
  assert.equal(notifications[0].sms_status, "Pending")
  assert.equal(notifications[0].sent_at, null)
  assert.match(notifications[0].message, /Tap Student has arrived at Main Campus/)
})

for (const [section, time, expected] of [
  ["21001", "06:15:00", "Present"], ["21001", "06:15:01", "Late"],
  ["21006", "13:15:00", "Present"], ["21006", "13:15:01", "Late"],
]) test(`${section} at ${time} stores ${expected} in Manila time`, async () => {
  await rows("update public.students set section=$1 where id=$2", [section, student])
  const result = await tap(`2026-09-08T${time}+08:00`)
  assert.equal(result.attendanceStatus, expected)
  assert.equal(result.date, "2026-09-08")
  assert.equal(result.time, time)
  assert.equal((await rows("select attendance_status from public.attendance_records"))[0].attendance_status, expected)
})

test("unscheduled weekdays and out-of-pilot placement stay Present", async () => {
  assert.equal((await tap("2026-09-06T15:00:00+08:00")).attendanceStatus, "Present")
  await rows("update public.students set year_level='1st Year' where id=$1", [student])
  assert.equal((await tap("2026-09-08T15:00:00+08:00")).attendanceStatus, "Present")
})

test("unknown, inactive cards and disabled student accounts create no attendance", async () => {
  assert.equal((await tap(undefined, "00000022")).code, "INVALID_CARD")
  await rows("update public.rfid_cards set card_status='Lost' where id=$1", [card])
  assert.equal((await tap()).code, "INVALID_CARD")
  await rows("update public.rfid_cards set card_status='Active' where id=$1", [card])
  await rows("update public.users set status='inactive' where id=$1", [account])
  assert.equal((await tap()).code, "INVALID_CARD")
  assert.equal((await rows("select * from public.attendance_records")).length, 0)
  assert.equal((await rows("select * from public.rfid_tap_requests")).length, 0)
})

test("request IDs cannot be reused for another UID", async () => {
  const request = randomUUID()
  await tap(undefined, undefined, request)
  assert.equal((await tap(undefined, "00000022", request)).code, "REQUEST_ID_CONFLICT")
  assert.equal((await rows("select time_out from public.attendance_records"))[0].time_out, null)
})

test("third tap is rejected while completed requests remain safely replayable", async () => {
  await tap()
  const exitRequest = randomUUID()
  const exit = await tap("2026-09-08T12:00:00+08:00", undefined, exitRequest)
  const before = await rows("select * from public.attendance_records")
  assert.equal((await tap("2026-09-08T13:00:00+08:00")).code, "DAY_COMPLETE")
  assert.deepEqual(await tap("2026-09-08T14:00:00+08:00", undefined, exitRequest), { ...exit, replayed: true })
  assert.deepEqual(await rows("select * from public.attendance_records"), before)
  assert.equal((await rows("select * from public.sms_notifications")).length, 1)
})

test("Manila midnight starts a new day without filling yesterday's missing departure", async () => {
  const request = randomUUID()
  const first = await tap("2026-09-08T15:59:59Z", undefined, request)
  assert.equal(first.date, "2026-09-08")
  assert.equal(first.time, "23:59:59")
  assert.deepEqual(await tap("2026-09-08T16:00:00Z", undefined, request), { ...first, replayed: true })
  const next = await tap("2026-09-08T16:00:01Z")
  assert.equal(next.action, "time_in"); assert.equal(next.date, "2026-09-09")
  const records = await rows("select * from public.attendance_records order by attendance_date")
  assert.equal(records.length, 2)
  assert(records.every(row => row.time_out === null))
  assert.equal((await rows("select * from public.sms_notifications")).length, 2)
})

test("active all-campus schedule wins, with campus-specific fallback only when absent", async () => {
  await rows(`insert into public.class_schedules(program_id,year_level,section,campus,day_of_week,time_start,grace_minutes)
    values($1,'2nd Year','21001','Main Campus',2,'09:00',15)`, [program])
  assert.equal((await tap("2026-09-08T07:00:00+08:00")).attendanceStatus, "Late")
  await rows("update public.class_schedules set status='inactive' where campus is null and section='21001'")
  await rows("update public.class_schedules set day_of_week=3 where campus='Main Campus' and section='21001'")
  assert.equal((await tap("2026-09-09T07:00:00+08:00")).attendanceStatus, "Present")
})

test("Late is retained at departure and changed schedules do not reclassify it", async () => {
  assert.equal((await tap("2026-09-08T08:00:00+08:00")).attendanceStatus, "Late")
  await rows("update public.class_schedules set time_start='10:00'")
  assert.equal((await tap("2026-09-08T12:00:00+08:00")).attendanceStatus, "Late")
})

test("rejected invalid UID and archived student leave no new record or notification", async () => {
  assert.equal((await tap(undefined, "garbage")).code, "INVALID_REQUEST")
  await rows("update public.students set status='archived' where id=$1", [student])
  assert.equal((await tap()).code, "INVALID_CARD")
  assert.equal((await rows("select * from public.attendance_records")).length, 0)
  assert.equal((await rows("select * from public.sms_notifications")).length, 0)
})

test("failure saving the request receipt rolls back arrival and Pending notification together", async () => {
  await db.exec(`create function public.fail_tap_receipt() returns trigger language plpgsql as $$
    begin raise exception 'Injected receipt failure'; end $$;
    create trigger fail_receipt before insert on public.rfid_tap_requests for each row execute function public.fail_tap_receipt();`)
  await db.exec("savepoint failed_tap")
  await assert.rejects(() => tap(), /Injected receipt failure/)
  await db.exec("rollback to savepoint failed_tap")
  assert.equal((await rows("select * from public.attendance_records")).length, 0)
  assert.equal((await rows("select * from public.sms_notifications")).length, 0)
  assert.equal((await rows("select * from public.rfid_tap_requests")).length, 0)
})

test("only service role can execute ingestion; portal and anonymous callers cannot read receipts", async () => {
  for (const role of ["authenticated", "anon"]) {
    await db.exec(`set local role ${role}`)
    await rejected(() => tap())
    await rejected(() => rows("select * from public.rfid_tap_requests"))
    await db.exec("reset role")
  }
  await db.exec("set local role service_role")
  assert.equal((await tap()).ok, true)
})

test("migration reapplication and rollback preserve attendance and retry receipts", async () => {
  await tap()
  const records = await rows("select * from public.attendance_records")
  const receipts = await rows("select * from public.rfid_tap_requests")
  const inner = sql => sql.replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(inner(migration))
  await db.exec(await readFile(new URL("../supabase/rollback_rfid_tap.sql", import.meta.url), "utf8"))
  await db.exec("set local role service_role")
  await rejected(() => tap())
  await db.exec("reset role")
  await db.exec(inner(migration))
  assert.deepEqual(await rows("select * from public.attendance_records"), records)
  assert.deepEqual(await rows("select * from public.rfid_tap_requests"), receipts)
})

test("read-only rollout probe returns seven PASS checks", async () => {
  const realtimeSql = await readFile(new URL('../supabase/migrations/202609160001_complete_realtime_publication.sql', import.meta.url),'utf8')
  await db.exec(realtimeSql.replace(/^begin;$/m,'').replace(/^commit;$/m,''))
  const realtimeChecks = await rows(await readFile(new URL('../supabase/verify_realtime.sql', import.meta.url),'utf8'))
  assert.equal(realtimeChecks.length,11)
  assert(realtimeChecks.every(row=>row.result==='PASS'),JSON.stringify(realtimeChecks))
  const checks = await rows(await readFile(new URL("../supabase/verify_rfid_tap.sql", import.meta.url), "utf8"))
  assert.equal(checks.length, 7)
  assert(checks.every(row => row.result === "PASS"), JSON.stringify(checks))
  assert.equal((await rows("select * from public.attendance_records")).length, 0)
  const smsChecks = await rows(await readFile(new URL("../supabase/verify_philsms_delivery.sql", import.meta.url), "utf8"))
  assert.equal(smsChecks.length, 5)
  assert(smsChecks.every(row => row.result === "PASS"), JSON.stringify(smsChecks))
})

test("SMS claim is one attempt per new arrival and completion cannot be overwritten", async () => {
  const result = await tap()
  const attempt = randomUUID()
  const claim = async token => (await rows('select public.claim_arrival_sms($1,$2) as result',[result.attendanceId,token]))[0].result
  await db.exec('set local role service_role')
  const sms = await claim(attempt)
  assert(sms.id)
  assert.equal(await claim(randomUUID()),null)
  await rows("select public.finish_arrival_sms($1,$2,'accepted','provider-id')",[sms.id,attempt])
  await rows("select public.finish_arrival_sms($1,$2,'rejected',null)",[sms.id,attempt])
  await db.exec('reset role')
  const saved=(await rows('select * from public.sms_notifications'))[0]
  assert.equal(saved.sms_status,'Sent'); assert(saved.sent_at); assert.equal(saved.provider_message_id,'provider-id')
  assert.equal((await rows('select * from public.attendance_records')).length,1)
})

test("SMS skips historical, expired and duplicate notifications; portal roles cannot dispatch", async () => {
  const result=await tap()
  const claim=async()=> (await rows('select public.claim_arrival_sms($1,$2) as result',[result.attendanceId,randomUUID()]))[0].result
  await rows('update public.sms_notifications set delivery_enabled=false')
  assert.equal(await claim(),null)
  await rows("update public.sms_notifications set delivery_enabled=true,created_at=now()-interval '11 minutes'")
  assert.equal(await claim(),null)
  await rows('update public.sms_notifications set created_at=now()')
  await rows('insert into public.sms_notifications(attendance_id,student_id,parent_contact_number,message) select attendance_id,student_id,parent_contact_number,message from public.sms_notifications')
  assert.equal(await claim(),null)
  for(const role of ['authenticated','anon']) {
    await db.exec(`set local role ${role}`); await rejected(claim)
    await rejected(()=>rows("select public.finish_arrival_sms(1,$1,'accepted',null)",[randomUUID()]))
    await db.exec('reset role')
  }
})

test("unknown SMS outcomes stay Pending and cannot be claimed again; rollback preserves evidence", async () => {
  const result=await tap(); const attempt=randomUUID()
  const sms=(await rows('select public.claim_arrival_sms($1,$2) as result',[result.attendanceId,attempt]))[0].result
  await rows("select public.finish_arrival_sms($1,$2,'unknown',null)",[sms.id,attempt])
  assert.equal((await rows('select sms_status from public.sms_notifications'))[0].sms_status,'Pending')
  assert.equal((await rows('select public.claim_arrival_sms($1,$2) as result',[result.attendanceId,randomUUID()]))[0].result,null)
  const before=await rows('select * from public.sms_notifications')
  const sql=await readFile(new URL('../supabase/migrations/202609150001_philsms_arrival_delivery.sql',import.meta.url),'utf8')
  await db.exec(sql.replace(/^begin;$/m,'').replace(/^commit;$/m,''))
  await db.exec(await readFile(new URL('../supabase/rollback_philsms_delivery.sql',import.meta.url),'utf8'))
  await db.exec('set local role service_role')
  await rejected(()=>rows('select public.claim_arrival_sms($1,$2)',[result.attendanceId,randomUUID()]))
  await db.exec('reset role')
  assert.deepEqual(await rows('select * from public.sms_notifications'),before)
})
