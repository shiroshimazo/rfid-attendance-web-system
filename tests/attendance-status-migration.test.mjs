import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"

const db = new PGlite()
const adminId = "10000000-0000-0000-0000-000000000001"
const migrationName = "202609080001_restrict_attendance_status.sql"
let migration
let originalRows
let originalSms

before(async () => {
  await db.exec(`
    create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;
  `)
  const directory = new URL("../supabase/migrations/", import.meta.url)
  for (const name of (await readdir(directory)).filter(name => name.endsWith(".sql") && name < migrationName).sort()) {
    await db.exec(await readFile(new URL(name, directory), "utf8"))
  }
  await db.exec(`
    insert into auth.users (id, email, raw_app_meta_data) values
      ('${adminId}', 'admin@example.test', '{"role":"admin"}'),
      ('20000000-0000-0000-0000-000000000001', 'student@example.test', '{"role":"student"}');
    insert into public.students
      (id, user_id, student_id, full_name, email, parent_name, parent_contact_number, program_id, year_level, section, campus)
    select 1, '20000000-0000-0000-0000-000000000001', 'S1', 'Student', 'student@example.test',
      'Guardian', '+639171234567', id, '2nd Year', '21001', 'Main Campus'
    from public.programs where program_code = 'BSIT';
    insert into public.rfid_cards (id, student_id, rfid_number) values (1, 1, '04AABBCC');
    insert into public.attendance_records
      (id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
    values (1, 1, 1, '2026-09-01', '06:00', 'Excused', 'Main Campus'),
      (2, 1, 1, '2026-09-02', '06:00', 'Present', 'Main Campus');
    insert into public.sms_notifications (attendance_id, student_id, parent_contact_number, message)
    values (1, 1, '+639171234567', 'Retained historical message');
  `)
  originalRows = (await db.query("select * from public.attendance_records order by id")).rows
  originalSms = (await db.query("select * from public.sms_notifications order by id")).rows
  migration = await readFile(new URL(migrationName, directory), "utf8")
  await db.exec(migration)
  await db.exec(migration) // Re-running the additive guard is safe.
})

after(async () => db.close())
beforeEach(async () => db.exec(`begin; select set_config('request.jwt.claim.sub', '${adminId}', true); set local role authenticated;`))
afterEach(async () => db.exec("rollback; reset role;"))

test("migration and reapplication preserve every existing attendance/SMS field", async () => {
  assert.deepEqual((await db.query("select * from public.attendance_records order by id")).rows, originalRows)
  assert.deepEqual((await db.query("select * from public.sms_notifications order by id")).rows, originalSms)
})

for (const status of ["Present", "Late", "Absent"]) {
  test(`new ${status} rows remain writable under the existing admin RLS`, async () => {
    const result = await db.query(`
      insert into public.attendance_records
        (id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
      values (10, 1, 1, '2026-09-03', '06:16', $1, 'Main Campus') returning attendance_status
    `, [status])
    assert.equal(result.rows[0].attendance_status, status)
  })
}

test("retired status cannot be inserted by a current or older client", async () => {
  await assert.rejects(db.exec(`
    insert into public.attendance_records
      (id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
    values (10, 1, 1, '2026-09-03', '06:16', 'Excused', 'Main Campus')
  `), { code: "23514" })
})

test("an existing current record cannot change to the retired status", async () => {
  await assert.rejects(db.exec("update public.attendance_records set attendance_status = 'Excused' where id = 2"), { code: "23514" })
})

test("a historical row may keep its original status when time-out is updated", async () => {
  await db.exec("update public.attendance_records set time_out = '12:30' where id = 1")
  const { rows } = await db.query("select attendance_status, time_in, time_out from public.attendance_records where id = 1")
  assert.deepEqual(rows[0], { attendance_status: "Excused", time_in: "06:00:00", time_out: "12:30:00" })
})

test("historical status cannot be reassigned to a different attendance day", async () => {
  await assert.rejects(db.exec("update public.attendance_records set attendance_date = '2026-09-04' where id = 1"), { code: "23514" })
})

test("documented rollback removes only the guard and preserves historical records", async () => {
  await db.exec(`reset role;
    drop trigger attendance_enforce_current_status on public.attendance_records;
    drop function public.enforce_current_attendance_status();
  `)
  assert.deepEqual((await db.query("select * from public.attendance_records order by id")).rows, originalRows)
  assert.deepEqual((await db.query("select * from public.sms_notifications order by id")).rows, originalSms)
  await db.exec("update public.attendance_records set attendance_status = 'Excused' where id = 2")
})
