import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const db = new PGlite({ extensions: { btree_gist } })
const directory = new URL("../supabase/migrations/", import.meta.url)
const migrationName = "202610250001_school_calendar.sql"
const userId = "30000000-0000-4000-8000-000000000001"
let original, migration

async function existingData() {
  return {
    attendance: (await db.query("select * from public.attendance_records order by id")).rows,
    sms: (await db.query("select * from public.sms_notifications order by id")).rows,
    subject: (await db.query("select * from public.subject_attendance order by id")).rows,
    statuses: (await db.query("select enum_range(null::public.attendance_status)::text as statuses")).rows,
    tap: (await db.query("select pg_get_functiondef('public.record_rfid_tap(uuid,text,timestamptz)'::regprocedure) as definition")).rows,
  }
}

before(async () => {
  await db.exec(`
    create role authenticated; create role anon; create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key, email text, encrypted_password text,
      raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}');
    create table auth.sessions(id uuid primary key, user_id uuid);
    create table auth.audit_log_entries(id uuid, payload jsonb);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;
  `)
  for (const file of (await readdir(directory)).filter((file) => file.endsWith(".sql") && file < migrationName).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
  await db.exec(`
    insert into auth.users(id, email, raw_app_meta_data)
      values ('${userId}', 'calendar-student@example.test', '{"role":"student"}');
    insert into public.students(id, user_id, student_id, full_name, email, parent_name,
      parent_contact_number, program_id, year_level, section, campus)
      select 1, '${userId}', 'CAL-1', 'Calendar Student', 'calendar-student@example.test',
        'Guardian', '+639171234567', id, '2nd Year', '21001', 'Main Campus'
      from public.programs where program_code = 'BSIT';
    insert into public.rfid_cards(id, student_id, rfid_number) values (1, 1, '04AABBCC');
    insert into public.attendance_records(id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
      values (1, 1, 1, '2026-09-01', '06:00', 'Present', 'Main Campus');
    insert into public.sms_notifications(attendance_id, student_id, parent_contact_number, message)
      values (1, 1, '+639171234567', 'Retained message');
  `)
  original = await existingData()
  migration = await readFile(new URL(migrationName, directory), "utf8")
  await db.exec(migration)
  await db.exec(migration)
})
after(async () => db.close())
beforeEach(async () => db.exec("begin"))
afterEach(async () => db.exec("rollback; reset role"))

async function rejects(action, code = "23514") {
  await db.exec("savepoint expected_failure")
  try { await assert.rejects(action, { code }) }
  finally { await db.exec("rollback to savepoint expected_failure; release savepoint expected_failure") }
}

async function entry(overrides = {}) {
  const values = { title: "School event", tags: ["event"], starts_on: "2026-10-25", ends_on: "2026-10-25", ...overrides }
  const fields = Object.keys(values)
  const { rows } = await db.query(
    `insert into public.calendar_entries(${fields.join(",")}) values (${fields.map((field, i) => `$${i + 1}${field === "tags" ? "::text[]::public.calendar_tag[]" : ""}`).join(",")}) returning *`,
    Object.values(values)
  )
  return rows[0]
}

test("foundation and reapplication preserve RFID, SMS, subject data, status enum, and tap function", async () => {
  assert.deepEqual(await existingData(), original)
  const { rows } = await db.query("select enum_range(null::public.attendance_day_status)::text as statuses")
  assert.equal(rows[0].statuses, "{NoClasses,OnlineManual}")
})

test("SQL enums match validation enums and all planned query indexes exist", async () => {
  const schema = createSourceLoader()("src/features/calendar/schema.ts")
  for (const [name, values] of Object.entries({
    calendar_tag: schema.calendarTags,
    calendar_attendance_impact: schema.calendarAttendanceImpacts,
    calendar_status: schema.calendarStatuses,
    calendar_audience: schema.calendarAudiences,
    attendance_day_status: schema.attendanceDayStatuses,
    calendar_email_type: schema.calendarEmailTypes,
    calendar_email_status: schema.calendarEmailStatuses,
  })) {
    const { rows } = await db.query("select enumlabel from pg_enum where enumtypid=$1::regtype order by enumsortorder", [`public.${name}`])
    assert.deepEqual(rows.map((row) => row.enumlabel), values)
  }
  const indexes = new Set((await db.query("select indexname from pg_indexes where schemaname='public'")).rows.map((row) => row.indexname))
  for (const name of [
    "calendar_entries_status_dates_idx", "calendar_entries_published_at_idx",
    "calendar_entries_tags_idx", "calendar_entries_campuses_idx", "calendar_entry_reads_user_idx",
    "attendance_day_marks_date_idx", "attendance_day_marks_entry_idx", "attendance_day_marks_campus_date_idx",
    "calendar_email_deliveries_entry_idx", "calendar_email_deliveries_status_idx", "calendar_email_deliveries_batch_idx",
  ]) assert(indexes.has(name), name)
})

test("entries default to draft/all campuses and reuse the updated_at trigger", async () => {
  const row = await entry()
  assert.equal(row.status, "draft")
  assert.equal(row.attendance_impact, "normal")
  assert.equal(row.audience, "everyone")
  assert.deepEqual(row.campuses, [])
  const { rows } = await db.query("update public.calendar_entries set title = 'Changed', updated_at = '2000-01-01' where id = $1 returning updated_at > '2000-01-01'::timestamptz as refreshed", [row.id])
  assert.equal(rows[0].refreshed, true)
})

test("database rejects blank/oversized text, empty/null tags, and blank/null campuses", async () => {
  for (const values of [
    { title: " \t\n" }, { title: "x".repeat(161) }, { description: "x".repeat(5001) },
    { reason: "x".repeat(501) }, { location: "x".repeat(201) },
    { tags: [] }, { tags: [null] }, { tags: ["event", null] },
    { campuses: [""] }, { campuses: ["\t\n"] }, { campuses: [null] },
  ]) await rejects(() => entry(values))
  await entry({ title: "x", campuses: ["Main Campus", "MV Campus"] })
  await entry({ title: "x".repeat(160), description: "x".repeat(5000), reason: "x".repeat(500), location: "x".repeat(200) })
})

test("database validates real dates and inclusive 366-day ranges", async () => {
  await entry({ starts_on: "2024-01-01", ends_on: "2024-12-31" })
  await entry({ starts_on: "2024-02-29", ends_on: "2024-02-29" })
  for (const values of [
    { starts_on: "2024-01-01", ends_on: "2025-01-01" },
    { starts_on: "2026-10-26" }, { ends_on: "infinity" },
  ]) await rejects(() => entry(values))
  await rejects(() => entry({ starts_on: "2026-02-29" }), "22008")
})

test("time pairs require a single date and later end time", async () => {
  await entry({ start_time: "00:00", end_time: "23:59" })
  for (const values of [
    { start_time: "08:00" }, { end_time: "09:00" },
    { start_time: "08:00", end_time: "08:00" }, { start_time: "23:00", end_time: "01:00" },
    { start_time: "08:00", end_time: "24:00" },
    { start_time: "08:00", end_time: "09:00", ends_on: "2026-10-26" },
  ]) await rejects(() => entry(values))
})

test("tag/impact rules, everyone audience, all-day scope, and required reason hold in SQL", async () => {
  for (const [tags, expected] of [
    [["event"], "normal"], [["no_classes"], "no_classes"],
    [["online_class"], "online_manual"], [["no_classes", "online_class"], "online_manual"],
  ]) {
    for (const impact of ["normal", "no_classes", "online_manual"]) {
      const values = { tags, attendance_impact: impact, reason: "Storm" }
      if (impact === expected) await entry(values)
      else await rejects(() => entry(values))
    }
  }
  for (const impact of ["no_classes", "online_manual"]) {
    const values = { tags: [impact === "no_classes" ? "no_classes" : "online_class"], attendance_impact: impact, reason: "Storm" }
    for (const invalid of [
      { reason: null }, { reason: " \t" }, { audience: "teachers" }, { audience: "students" },
      { start_time: "08:00", end_time: "09:00" },
    ]) await rejects(() => entry({ ...values, ...invalid }))
  }
})

test("lifecycle timestamp combinations are constrained", async () => {
  for (const values of [
    { status: "published" }, { status: "cancelled" }, { published_at: "2026-10-25T00:00:00Z" },
    { cancelled_at: "2026-10-25T00:00:00Z" },
    { status: "published", published_at: "2026-10-25T00:00:00Z", cancelled_at: "2026-10-25T01:00:00Z" },
    { status: "cancelled", published_at: "2026-10-25T00:00:00Z" },
  ]) await rejects(() => entry(values))
  await entry({ status: "published", published_at: "2026-10-25T00:00:00Z" })
  await entry({ status: "cancelled", published_at: "2026-10-25T00:00:00Z", cancelled_at: "2026-10-25T01:00:00Z" })
})

test("snapshot uniqueness and foreign keys preserve both exception statuses separately from RFID", async () => {
  const row = await entry()
  for (const [date, status] of [["2026-10-25", "NoClasses"], ["2026-10-26", "OnlineManual"]]) {
    await db.query("insert into public.attendance_day_marks(student_id, attendance_date, status, calendar_entry_id, campus) values (1, $1, $2, $3, 'Main Campus')", [date, status, row.id])
  }
  await rejects(() => db.query("insert into public.attendance_day_marks(student_id, attendance_date, calendar_entry_id, campus) values (1, '2026-10-25', $1, 'MV Campus')", [row.id]), "23505")
  await rejects(() => db.query("delete from public.calendar_entries where id = $1", [row.id]), "23503")
  await rejects(() => db.query("insert into public.attendance_day_marks(student_id, attendance_date, calendar_entry_id, campus) values (999, '2026-10-25', $1, 'Main Campus')", [row.id]), "23503")
  assert.deepEqual(await existingData(), original)
})

test("receipts enforce entry/user identity; delivery payloads and unique batch recipients persist", async () => {
  const row = await entry()
  await db.query("insert into public.calendar_entry_reads(entry_id,user_id) values ($1,$2)", [row.id, userId])
  await rejects(() => db.query("insert into public.calendar_entry_reads(entry_id,user_id) values ($1,$2)", [row.id, userId]), "23505")
  const delivery = (role = "student", attempts = 0) => db.query(`
    insert into public.calendar_email_deliveries(calendar_entry_id,batch_id,notification_type,
      recipient_user_id,recipient_email,recipient_role,subject,html_body,text_body,attempt_count)
    values ($1,'40000000-0000-4000-8000-000000000001','published',$2,'student@example.test',$3,
      'Saved subject','<p>Saved body</p>','Saved body',$4) returning *`, [row.id, userId, role, attempts])
  await rejects(() => delivery("admin"))
  await rejects(() => delivery("student", -1))
  const { rows } = await delivery()
  assert.equal(rows[0].status, "Pending")
  assert.equal(rows[0].attempt_count, 0)
  await rejects(() => delivery(), "23505")
  await db.query("update public.calendar_entries set title='Edited' where id=$1", [row.id])
  assert.equal((await db.query("select html_body from public.calendar_email_deliveries")).rows[0].html_body, "<p>Saved body</p>")
})

test("foundation denies client access until role policies are installed", async () => {
  for (const role of ["anon", "authenticated"]) {
    for (const table of ["calendar_entries", "calendar_entry_reads", "attendance_day_marks", "calendar_email_deliveries"]) {
      const { rows } = await db.query("select relrowsecurity from pg_class where oid=$1::regclass", [`public.${table}`])
      assert.equal(rows[0].relrowsecurity, true)
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
        assert.equal((await db.query("select has_table_privilege($1,$2,$3) as allowed", [role, `public.${table}`, privilege])).rows[0].allowed, false)
      }
    }
    await db.exec(`set local role ${role}`)
    await rejects(() => db.query("select * from public.calendar_entries"), "42501")
    await db.exec("reset role")
  }
})
