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

const accessUsers = {
  student: userId,
  mv: "30000000-0000-4000-8000-000000000002",
  admin: "10000000-0000-4000-8000-000000000001",
  teacher: "20000000-0000-4000-8000-000000000001",
  both: "20000000-0000-4000-8000-000000000002",
  unassigned: "20000000-0000-4000-8000-000000000003",
}
const accessSession = (name) => accessUsers[name].replace("-0000-", "-9999-")

async function asCalendarUser(name, verified = true) {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, true)", [accessUsers[name] ?? ""])
  await db.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({
    role: "authenticated", session_id: verified && accessUsers[name] ? accessSession(name) : "unknown",
  })])
  await db.exec("set local role authenticated")
}

async function accessFixture() {
  const sql = (await readFile(new URL("202610250002_school_calendar_access.sql", directory), "utf8"))
    .replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(sql)
  await db.exec(sql)
  for (const [name, id] of Object.entries(accessUsers)) {
    const role = ["student", "mv"].includes(name) ? "student" : name === "admin" ? "admin" : "teacher"
    if (name !== "student") {
      await db.query("insert into auth.users(id,email,raw_app_meta_data) values ($1,$2,$3)", [id, `${name}@example.test`, JSON.stringify({ role })])
    }
    await db.query("insert into public.email_verified_sessions(session_id,user_id) values ($1,$2)", [accessSession(name), id])
    if (role === "teacher") {
      await db.query("insert into public.teachers(user_id,teacher_id,full_name,email,department) values ($1,$2,$2,$3,'BSIT')", [id, name, `${name}@example.test`])
    }
  }
  await db.query(`insert into public.students(id,user_id,student_id,full_name,email,parent_name,
    parent_contact_number,program_id,year_level,section,campus)
    select 2,$1,'CAL-2','MV Student','mv@example.test','Guardian','+639171234568',id,'2nd Year','21001','MV Campus'
    from public.programs where program_code='BSIT'`, [accessUsers.mv])
  for (const [name, campuses] of [["teacher", ["Main Campus"]], ["both", ["Main Campus", "MV Campus"]]]) {
    for (const campus of campuses) {
      await db.query(`insert into public.teacher_assignments(teacher_id,program_id,course_id,year_level,section,campus)
        select t.id,c.program_id,c.id,'2nd Year','21001',$2 from public.teachers t
        cross join public.courses c where t.user_id=$1 order by c.id limit 1`, [accessUsers[name], campus])
    }
  }
  const entries = {}
  for (const [title, overrides] of Object.entries({
    draft: { status: "draft", published_at: null },
    all: {},
    main: { tags: ["no_classes"], attendance_impact: "no_classes", campuses: ["Main Campus"], ends_on: "2026-10-26", reason: "Storm" },
    mv: { tags: ["online_class"], attendance_impact: "online_manual", campuses: ["MV Campus"], reason: "Storm" },
    teachers: { audience: "teachers", campuses: ["Main Campus"] },
    students: { audience: "students", campuses: ["Main Campus"] },
    cancelled: { status: "cancelled", cancelled_at: "2026-10-25T02:00:00Z", campuses: ["Main Campus"] },
    other: { campuses: ["Bulacan Campus"] },
    caseMismatch: { campuses: ["main campus"] },
    allImpact: { tags: ["online_class"], attendance_impact: "online_manual", starts_on: "2026-10-28", ends_on: "2026-10-29", reason: "Storm" },
  })) entries[title] = await entry({ title, status: "published", published_at: "2026-10-25T00:00:00Z", ...overrides })
  await db.query(`insert into public.attendance_day_marks(student_id,attendance_date,status,calendar_entry_id,campus)
    values (1,'2026-10-25','NoClasses',$1,'Main Campus'),(2,'2026-10-25','OnlineManual',$2,'MV Campus')`, [entries.main.id, entries.mv.id])
  await db.query(`insert into public.calendar_email_deliveries(calendar_entry_id,batch_id,notification_type,
    recipient_user_id,recipient_email,recipient_role,subject,html_body,text_body)
    values ($1,'40000000-0000-4000-8000-000000000001','published',$2,'student@example.test','student','Subject','Body','Body')`, [entries.main.id, userId])
  return entries
}

const visibleTitles = async () => (await db.query("select title from public.calendar_entries order by title")).rows.map((row) => row.title)
const recipients = async (id) => (await db.query("select * from public.calendar_entry_recipients($1)", [id])).rows.map((row) => row.user_id).sort()

test("calendar RLS isolates drafts, audiences, exact campuses, and cancelled entries", async () => {
  await accessFixture()
  await asCalendarUser("admin")
  assert.equal((await visibleTitles()).length, 10)
  await asCalendarUser("student")
  assert.deepEqual(await visibleTitles(), ["all", "allImpact", "cancelled", "main", "students"])
  await asCalendarUser("mv")
  assert.deepEqual(await visibleTitles(), ["all", "allImpact", "mv"])
  await asCalendarUser("teacher")
  assert.deepEqual(await visibleTitles(), ["all", "allImpact", "cancelled", "main", "teachers"])
  await asCalendarUser("unassigned")
  assert.deepEqual(await visibleTitles(), ["all", "allImpact"])
})

test("campus helper resolves active assignments and recipient resolver deduplicates teachers", async () => {
  const entries = await accessFixture()
  await asCalendarUser("both")
  assert.deepEqual((await db.query("select public.current_user_campuses() as campuses")).rows[0].campuses, ["MV Campus", "Main Campus"])
  await asCalendarUser("student")
  assert.deepEqual((await db.query("select public.current_user_campuses() as campuses")).rows[0].campuses, ["Main Campus"])
  await asCalendarUser("admin")
  assert.deepEqual(await recipients(entries.all.id), ["student", "mv", "teacher", "both", "unassigned"].map((name) => accessUsers[name]).sort())
  assert.deepEqual(await recipients(entries.main.id), ["student", "teacher", "both"].map((name) => accessUsers[name]).sort())
  assert.deepEqual(await recipients(entries.teachers.id), [accessUsers.teacher, accessUsers.both].sort())
  assert.deepEqual(await recipients(entries.students.id), [userId])
  assert.deepEqual(await recipients(entries.caseMismatch.id), [])
  assert.deepEqual(await recipients(999999), [])
  await db.exec("reset role")
  await db.query("update public.teacher_assignments set status='inactive' where teacher_id=(select id from public.teachers where user_id=$1) and campus='Main Campus'", [accessUsers.both])
  await db.exec("update public.students set status='inactive' where id=1")
  await asCalendarUser("admin")
  assert.deepEqual(await recipients(entries.main.id), [accessUsers.teacher])
  await asCalendarUser("both")
  assert.deepEqual((await db.query("select public.current_user_campuses() as campuses")).rows[0].campuses, ["MV Campus"])
  await db.exec("reset role")
  await db.query("update public.teachers set status='archived' where user_id=$1", [accessUsers.unassigned])
  await asCalendarUser("admin")
  assert.deepEqual(await recipients(entries.all.id), ["mv", "teacher", "both"].map((name) => accessUsers[name]).sort())
  await asCalendarUser("student")
  assert.deepEqual(await visibleTitles(), [])
  assert.deepEqual((await db.query("select public.current_user_campuses() as campuses")).rows[0].campuses, [])
  await asCalendarUser("unassigned")
  assert.deepEqual(await visibleTitles(), [])
})

test("security-invoker view expands inclusive dates using only caller-visible students", async () => {
  const entries = await accessFixture()
  for (const [name, campuses] of [["student", ["Main Campus"]], ["teacher", ["Main Campus"]], ["mv", ["MV Campus"]], ["admin", ["MV Campus", "Main Campus"]]]) {
    await asCalendarUser(name)
    const { rows } = await db.query("select campus,attendance_date::text from public.calendar_attendance_days where entry_id=$1 order by campus,attendance_date", [entries.allImpact.id])
    assert.deepEqual(rows, campuses.flatMap((campus) => ["2026-10-28", "2026-10-29"].map((attendance_date) => ({ campus, attendance_date }))))
    assert.equal((await db.query("select count(*)::int as count from public.calendar_attendance_days where entry_id in ($1,$2,$3)", [entries.draft.id, entries.cancelled.id, entries.all.id])).rows[0].count, 0)
  }
  await asCalendarUser("student")
  assert.equal((await db.query("select count(*)::int as count from public.calendar_attendance_days where entry_id=$1", [entries.main.id])).rows[0].count, 2)
  assert.equal((await db.query("select count(*)::int as count from public.calendar_attendance_days where entry_id=$1", [entries.mv.id])).rows[0].count, 0)
})

test("receipts upsert safely with server timestamps and immutable identity", async () => {
  const entries = await accessFixture()
  await asCalendarUser("student")
  const upsert = () => db.query(`insert into public.calendar_entry_reads(entry_id,user_id,read_at)
    values ($1,$2,'2999-01-01') on conflict(entry_id,user_id) do update
    set entry_id=excluded.entry_id,user_id=excluded.user_id,read_at=excluded.read_at
    returning read_at < '2999-01-01'::timestamptz as server_time`, [entries.main.id, userId])
  assert.equal((await upsert()).rows[0].server_time, true)
  await db.exec("reset role")
  await db.query("update public.calendar_entries set title='Edited main' where id=$1", [entries.main.id])
  await asCalendarUser("student")
  assert.equal((await upsert()).rows[0].server_time, true)
  assert.equal((await db.query("select r.read_at >= e.updated_at as read from public.calendar_entry_reads r join public.calendar_entries e on e.id=r.entry_id")).rows[0].read, true)
  await rejects(() => db.query("update public.calendar_entry_reads set entry_id=$1", [entries.all.id]))
  for (const [id, recipient] of [[entries.mv.id, userId], [entries.draft.id, userId], [entries.cancelled.id, userId], [entries.main.id, accessUsers.mv]]) {
    await rejects(() => db.query("insert into public.calendar_entry_reads(entry_id,user_id) values ($1,$2)", [id, recipient]), "42501")
  }
  await rejects(() => db.exec("delete from public.calendar_entry_reads"), "42501")
  await asCalendarUser("mv")
  assert.deepEqual((await db.query("select * from public.calendar_entry_reads")).rows, [])
  assert.equal((await db.query("update public.calendar_entry_reads set read_at=now() returning *")).rows.length, 0)
  await asCalendarUser("admin")
  await rejects(() => db.query("insert into public.calendar_entry_reads(entry_id,user_id) values ($1,$2)", [entries.all.id, accessUsers.admin]), "42501")
})

test("marks use student scope independently of source visibility; deliveries are admin-only", async () => {
  const entries = await accessFixture()
  await db.query("update public.calendar_entries set status='cancelled',cancelled_at=now(),campuses=array['Bulacan Campus'] where id=$1", [entries.main.id])
  for (const [name, ids] of [["student", [1]], ["mv", [2]], ["teacher", [1]], ["both", [1, 2]], ["admin", [1, 2]], ["unassigned", []]]) {
    await asCalendarUser(name)
    assert.deepEqual((await db.query("select student_id::int from public.attendance_day_marks order by student_id")).rows.map((row) => row.student_id), ids)
    assert.equal((await db.query("select * from public.calendar_email_deliveries")).rows.length, name === "admin" ? 1 : 0)
    for (const table of ["calendar_entries", "attendance_day_marks", "calendar_email_deliveries"]) {
      for (const privilege of ["INSERT", "UPDATE", "DELETE"]) {
        assert.equal((await db.query("select has_table_privilege('authenticated',$1,$2) as allowed", [`public.${table}`, privilege])).rows[0].allowed, false)
      }
    }
  }
})

test("unverified, inactive, unknown, and anonymous callers cannot bypass calendar access", async () => {
  const entries = await accessFixture()
  for (const [name, verified] of [["admin", false], ["student", false], ["teacher", false], ["missing", true]]) {
    await asCalendarUser(name, verified)
    assert.deepEqual(await visibleTitles(), [])
    for (const table of ["calendar_entry_reads", "attendance_day_marks", "calendar_email_deliveries", "calendar_attendance_days"]) {
      assert.deepEqual((await db.query(`select * from public.${table}`)).rows, [])
    }
    assert.deepEqual((await db.query("select public.current_user_campuses() as campuses")).rows[0].campuses, [])
    await rejects(() => recipients(entries.main.id), "42501")
    await rejects(() => db.query("insert into public.calendar_entry_reads(entry_id,user_id) values ($1,$2)", [entries.all.id, userId]), "42501")
  }
  for (const name of ["teacher", "student"]) {
    await asCalendarUser(name)
    await rejects(() => recipients(entries.main.id), "42501")
  }
  await db.exec("reset role")
  await db.query("update public.users set status='inactive' where id=$1", [accessUsers.admin])
  await asCalendarUser("admin")
  assert.deepEqual(await visibleTitles(), [])
  await rejects(() => recipients(entries.main.id), "42501")
  assert.deepEqual((await db.query("select * from public.calendar_email_deliveries")).rows, [])
  await db.exec("reset role; set local role anon")
  await rejects(() => visibleTitles(), "42501")
  await rejects(() => db.query("select public.current_user_campuses()"), "42501")
  await rejects(() => recipients(entries.main.id), "42501")
})

async function marksFixture() {
  await accessFixture()
  await db.exec("delete from public.attendance_day_marks; delete from public.calendar_entries")
  const dates = (await db.query(`select
    ((now() at time zone 'Asia/Manila')::date - 1)::text as yesterday,
    (now() at time zone 'Asia/Manila')::date::text as today,
    ((now() at time zone 'Asia/Manila')::date + 1)::text as tomorrow,
    ((now() at time zone 'Asia/Manila')::date + 2)::text as last`)).rows[0]
  const main = await entry({ title: "Break", tags: ["no_classes"], attendance_impact: "no_classes",
    reason: "Storm", campuses: ["Main Campus"], starts_on: dates.yesterday, ends_on: dates.last,
    status: "published", published_at: `${dates.yesterday}T00:00:00Z` })
  const mv = await entry({ title: "Online", tags: ["online_class"], attendance_impact: "online_manual",
    reason: "Storm", campuses: ["MV Campus"], starts_on: dates.yesterday, ends_on: dates.last,
    status: "published", published_at: `${dates.yesterday}T00:00:00Z` })
  await entry({ title: "Draft break", tags: ["no_classes"], attendance_impact: "no_classes", reason: "Draft",
    starts_on: dates.today, ends_on: dates.last })
  await entry({ title: "Normal", starts_on: dates.today, ends_on: dates.last,
    status: "published", published_at: `${dates.today}T00:00:00Z` })
  await db.query(`insert into public.attendance_day_marks(student_id,attendance_date,status,calendar_entry_id,campus)
    values (1,$1,'NoClasses',$2,'Main Campus'),(2,$1,'OnlineManual',$3,'MV Campus')`, [dates.yesterday, main.id, mv.id])
  const history = (await db.query("select * from public.attendance_day_marks order by student_id")).rows
  const sql = (await readFile(new URL("202610250003_calendar_attendance_marks.sql", directory), "utf8"))
    .replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(sql)
  await db.exec(sql)
  return { ...dates, main, mv, history }
}

const syncMarks = async (from, to) => (await db.query("select public.sync_attendance_day_marks($1,$2) as result", [from, to])).rows[0].result
const currentMarks = async (today) => (await db.query("select student_id::int,attendance_date::text,status,campus,calendar_entry_id from public.attendance_day_marks where attendance_date >= $1 order by student_id,attendance_date", [today])).rows

async function assertHistory(fixture) {
  assert.deepEqual((await db.query("select * from public.attendance_day_marks where attendance_date < $1 order by student_id", [fixture.today])).rows, fixture.history)
  assert.deepEqual(await existingData(), original)
}

test("mark sync creates both exception statuses, clamps past dates, and is idempotent", async () => {
  const fixture = await marksFixture()
  await db.exec("set local time zone 'Pacific/Honolulu'")
  await asCalendarUser("admin")
  assert.deepEqual(await syncMarks(fixture.yesterday, fixture.last), { inserted: 6, deleted: 0 })
  const marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 6)
  assert(marks.filter((row) => row.student_id === 1).every((row) => row.status === "NoClasses"))
  assert(marks.filter((row) => row.student_id === 2).every((row) => row.status === "OnlineManual"))
  assert.deepEqual(await syncMarks(fixture.today, fixture.last), { inserted: 0, deleted: 0 })
  assert.deepEqual(await syncMarks(fixture.yesterday, fixture.yesterday), { inserted: 0, deleted: 0 })
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("sync removes cancelled and shortened exceptions, including today, without changing history", async () => {
  const fixture = await marksFixture()
  await asCalendarUser("admin")
  await syncMarks(fixture.today, fixture.last)
  await db.exec("reset role")
  await db.query("update public.calendar_entries set status='cancelled',cancelled_at=now() where id=$1", [fixture.main.id])
  await db.query("update public.calendar_entries set ends_on=$1 where id=$2", [fixture.today, fixture.mv.id])
  await asCalendarUser("admin")
  assert.deepEqual(await syncMarks(fixture.yesterday, fixture.last), { inserted: 0, deleted: 5 })
  assert.equal((await currentMarks(fixture.today)).length, 1)
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("online precedence replaces no-class snapshots and falls back when online is cancelled", async () => {
  const fixture = await marksFixture()
  await asCalendarUser("admin")
  await syncMarks(fixture.today, fixture.last)
  await db.exec("reset role")
  await db.query("update public.calendar_entries set campuses='{}' where id=$1", [fixture.mv.id])
  await asCalendarUser("admin")
  assert.deepEqual(await syncMarks(fixture.today, fixture.last), { inserted: 3, deleted: 3 })
  assert((await currentMarks(fixture.today)).every((row) => row.status === "OnlineManual"))
  await db.exec("reset role")
  await db.query("update public.calendar_entries set status='cancelled',cancelled_at=now() where id=$1", [fixture.mv.id])
  await asCalendarUser("admin")
  assert.deepEqual(await syncMarks(fixture.today, fixture.last), { inserted: 3, deleted: 6 })
  assert((await currentMarks(fixture.today)).every((row) => row.status === "NoClasses" && row.student_id === 1))
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("student transfers and lifecycle changes reconcile immediately without report reads", async () => {
  const fixture = await marksFixture()
  await asCalendarUser("admin")
  await db.exec("update public.students set campus='MV Campus' where id=1")
  let marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 3)
  assert(marks.every((row) => row.student_id === 1 && row.status === "OnlineManual" && row.campus === "MV Campus"))
  await db.exec("update public.students set status='inactive' where id=1")
  assert.deepEqual(await currentMarks(fixture.today), [])
  await db.exec("update public.students set status='active' where id=1")
  assert.equal((await currentMarks(fixture.today)).length, 3)
  await db.exec("update public.students set status='archived' where id=1")
  assert.deepEqual(await currentMarks(fixture.today), [])
  await db.exec("update public.students set status='active',campus='Main Campus' where id=1")
  marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 3)
  assert(marks.every((row) => row.status === "NoClasses" && row.campus === "Main Campus"))
  await db.exec("update public.students set campus='Bulacan Campus' where id=1")
  assert.deepEqual(await currentMarks(fixture.today), [])
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("new students receive today/future snapshots but no historical backfill", async () => {
  const fixture = await marksFixture()
  const newUser = "30000000-0000-4000-8000-000000000003"
  await db.query("insert into auth.users(id,email,raw_app_meta_data) values ($1,'new@example.test',$2)", [newUser, JSON.stringify({ role: "student" })])
  await db.query(`insert into public.students(id,user_id,student_id,full_name,email,parent_name,
    parent_contact_number,program_id,year_level,section,campus)
    select 3,$1,'CAL-3','New Student','new@example.test','Guardian','+639171234569',id,'2nd Year','21001','Main Campus'
    from public.programs where program_code='BSIT'`, [newUser])
  const marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 3)
  assert(marks.every((row) => row.student_id === 3 && row.status === "NoClasses"))
  await assertHistory(fixture)
})

test("roster changes and automatic snapshots roll back together", async () => {
  const fixture = await marksFixture()
  await asCalendarUser("admin")
  await db.exec("savepoint roster_change")
  await db.exec("update public.students set campus='MV Campus' where id=1")
  assert.equal((await currentMarks(fixture.today)).length, 3)
  await db.exec("rollback to savepoint roster_change; release savepoint roster_change")
  assert.deepEqual(await currentMarks(fixture.today), [])
  assert.equal((await db.query("select campus from public.students where id=1")).rows[0].campus, "Main Campus")
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("historical snapshots reject inserts, updates, deletion, and cascade deletion", async () => {
  const fixture = await marksFixture()
  await rejects(() => db.exec("update public.attendance_day_marks set campus='MV Campus' where student_id=1"))
  await rejects(() => db.exec("delete from public.attendance_day_marks where student_id=2"))
  await rejects(() => db.query("insert into public.attendance_day_marks(student_id,attendance_date,status,calendar_entry_id,campus) values (1,$1::date-1,'NoClasses',$2,'Main Campus')", [fixture.yesterday, fixture.main.id]))
  await rejects(() => db.exec("delete from public.students where id=2"))
  await asCalendarUser("admin")
  await syncMarks(fixture.today, fixture.last)
  await db.exec("reset role")
  await rejects(() => db.query("update public.attendance_day_marks set attendance_date=$1::date-1 where student_id=1 and attendance_date=$2", [fixture.yesterday, fixture.today]))
  await assertHistory(fixture)
})

test("sync rejects invalid ranges and unauthorized callers; internal helpers stay private", async () => {
  const fixture = await marksFixture()
  await asCalendarUser("admin")
  for (const [from, to] of [[null, fixture.last], [fixture.today, null], [fixture.last, fixture.today], ["-infinity", fixture.last], [fixture.today, "infinity"]]) {
    await rejects(() => syncMarks(from, to), "22023")
  }
  await rejects(() => db.query("select public.reconcile_calendar_marks($1,$2)", [fixture.today, fixture.last]), "42501")
  for (const [name, verified] of [["student", true], ["teacher", true], ["admin", false], ["missing", true]]) {
    await asCalendarUser(name, verified)
    await rejects(() => syncMarks(fixture.today, fixture.last), "42501")
  }
  await db.exec("reset role")
  await db.query("update public.users set status='inactive' where id=$1", [accessUsers.admin])
  await asCalendarUser("admin")
  await rejects(() => syncMarks(fixture.today, fixture.last), "42501")
  await db.exec("reset role; set local role anon")
  await rejects(() => syncMarks(fixture.today, fixture.last), "42501")
})

async function saveFixture() {
  const fixture = await marksFixture()
  const sql = (await readFile(new URL("202610250004_save_calendar_entry.sql", directory), "utf8"))
    .replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(sql)
  await db.exec(sql)
  return fixture
}
const saveEntry = async (payload) => (await db.query("select public.save_calendar_entry($1::jsonb) as result", [JSON.stringify(payload)])).rows[0].result
const entryPayload = (fixture, overrides = {}) => ({
  title: "School event", tags: ["event"], attendanceImpact: "normal", audience: "everyone",
  campuses: [], startsOn: fixture.today, endsOn: fixture.today, ...overrides,
})
const mainPayload = (fixture, overrides = {}) => entryPayload(fixture, {
  id: fixture.main.id, title: "Break", tags: ["no_classes"], attendanceImpact: "no_classes",
  reason: "Storm", campuses: ["Main Campus"], startsOn: fixture.yesterday, endsOn: fixture.last, ...overrides,
})

test("save RPC normalizes drafts, assigns actors, and never publishes or creates marks", async () => {
  const fixture = await saveFixture()
  await asCalendarUser("admin")
  const result = await saveEntry(entryPayload(fixture, {
    title: "  Meeting  ", campuses: [" MV Campus ", "Main Campus", "MV Campus"],
    tags: ["meeting", "meeting"], reason: " ", location: " Room 1 ", startTime: "", endTime: null,
  }))
  assert.equal(result.ok, true)
  let row = (await db.query("select * from public.calendar_entries where id=$1", [result.id])).rows[0]
  assert.equal(row.title, "Meeting")
  assert.deepEqual(row.campuses, ["MV Campus", "Main Campus"])
  assert.equal(row.reason, null)
  assert.equal(row.location, "Room 1")
  assert.equal(row.start_time, null)
  assert.equal(row.status, "draft")
  assert.equal(row.created_by, accessUsers.admin)
  assert.equal(row.updated_by, accessUsers.admin)
  assert.equal(row.published_at, null)
  assert.equal(row.cancelled_at, null)
  assert.equal((await saveEntry(entryPayload(fixture, { id: result.id, title: "Edited", isPinned: true }))).ok, true)
  row = (await db.query("select * from public.calendar_entries where id=$1", [result.id])).rows[0]
  assert.equal(row.title, "Edited")
  assert.equal(row.is_pinned, true)
  assert.equal(row.status, "draft")
  assert.deepEqual(await currentMarks(fixture.today), [])
  assert.equal((await saveEntry(entryPayload(fixture, { id: 999999 }))).code, "NOT_FOUND")
})

test("save RPC rejects malformed, forged, and constraint-breaking input atomically", async () => {
  const fixture = await saveFixture()
  await asCalendarUser("admin")
  const count = (await db.query("select count(*) as count from public.calendar_entries")).rows
  for (const payload of [null, [], "entry", {}, ...[
    { status: "published" }, { publishedAt: "2026-10-25" }, { created_by: accessUsers.student },
    { id: "1" }, { id: -1 }, { id: 1.2 }, { title: 7 }, { description: {} }, { reason: false },
    { isPinned: "true" }, { isPinned: null }, { tags: null }, { tags: [null] },
    { campuses: "Main Campus" }, { campuses: [1] }, { startsOn: "10/25/2026" },
    { startTime: "08:00:00", endTime: "09:00" },
  ].map((invalid) => entryPayload(fixture, invalid))]) {
    await rejects(() => saveEntry(payload), "22023")
  }
  for (const invalid of [
    { title: " " }, { title: "x".repeat(161) }, { campuses: [" "] }, { tags: [] },
    { startsOn: fixture.last, endsOn: fixture.today },
    { tags: ["no_classes"], attendanceImpact: "normal" },
    { tags: ["no_classes"], attendanceImpact: "no_classes", reason: null },
    { tags: ["online_class"], attendanceImpact: "online_manual", reason: "Storm", audience: "students" },
    { startTime: "08:00", endTime: null },
  ]) await rejects(() => saveEntry(entryPayload(fixture, invalid)))
  assert.deepEqual((await db.query("select count(*) as count from public.calendar_entries")).rows, count)
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("published save rejects overlap while drafts and normal events may overlap", async () => {
  const fixture = await saveFixture()
  await db.query("update public.calendar_entries set starts_on=$1 where id=$2", [fixture.today, fixture.main.id])
  await asCalendarUser("admin")
  const valid = mainPayload(fixture, { startsOn: fixture.today })
  assert.equal((await saveEntry(valid)).ok, true)
  const before = (await db.query("select * from public.calendar_entries where id=$1", [fixture.main.id])).rows
  const marks = await currentMarks(fixture.today)
  for (const campuses of [["MV Campus"], [], ["Main Campus", "MV Campus"]]) {
    const result = await saveEntry({ ...valid, campuses })
    assert.equal(result.code, "CALENDAR_CONFLICT")
    assert.match(result.message, /Online/)
  }
  assert.deepEqual((await db.query("select * from public.calendar_entries where id=$1", [fixture.main.id])).rows, before)
  assert.deepEqual(await currentMarks(fixture.today), marks)
  assert.equal((await saveEntry({ ...valid, id: null, campuses: [] })).ok, true)
  assert.equal((await saveEntry(entryPayload(fixture, { id: fixture.main.id, endsOn: fixture.last }))).ok, true)
  assert.equal((await currentMarks(fixture.today)).filter((row) => row.student_id === 1).length, 0)
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("published edits reconcile old/new ranges, campus scope, and exception status", async () => {
  const fixture = await saveFixture()
  await db.query("update public.calendar_entries set starts_on=$1 where id=$2", [fixture.today, fixture.main.id])
  await asCalendarUser("admin")
  const valid = mainPayload(fixture, { startsOn: fixture.today })
  await saveEntry(valid)
  assert.equal((await currentMarks(fixture.today)).filter((row) => row.student_id === 1).length, 3)
  assert.equal((await saveEntry({ ...valid, startsOn: fixture.tomorrow })).ok, true)
  assert.equal((await currentMarks(fixture.today)).filter((row) => row.student_id === 1).length, 2)
  assert.equal((await saveEntry({ ...valid, campuses: ["Bulacan Campus"] })).ok, true)
  assert.equal((await currentMarks(fixture.today)).filter((row) => row.student_id === 1).length, 0)
  assert.equal((await saveEntry({ ...valid, tags: ["online_class"], attendanceImpact: "online_manual" })).ok, true)
  const marks = (await currentMarks(fixture.today)).filter((row) => row.student_id === 1)
  assert.equal(marks.length, 3)
  assert(marks.every((row) => row.status === "OnlineManual"))
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("overlap checks include shared endpoints and existing all-campus entries", async () => {
  const fixture = await saveFixture()
  await db.query("update public.calendar_entries set starts_on=$1 where id=$2", [fixture.today, fixture.main.id])
  const dates = (await db.query("select ($1::date+1)::text as next, ($1::date+2)::text as later", [fixture.last])).rows[0]
  await entry({ title: "All-campus break", tags: ["no_classes"], attendance_impact: "no_classes", reason: "Break",
    starts_on: dates.next, ends_on: dates.next, status: "published", published_at: `${fixture.today}T00:00:00Z` })
  await asCalendarUser("admin")
  const valid = mainPayload(fixture, { startsOn: fixture.today })
  assert.equal((await saveEntry({ ...valid, startsOn: fixture.last, campuses: ["MV Campus"] })).code, "CALENDAR_CONFLICT")
  const conflict = await saveEntry({ ...valid, startsOn: dates.next, endsOn: dates.next })
  assert.equal(conflict.code, "CALENDAR_CONFLICT")
  assert.match(conflict.message, /All-campus break/)
  assert.equal((await saveEntry({ ...valid, startsOn: dates.later, endsOn: dates.later })).ok, true)
})

test("historical attendance scope stays locked while descriptive edits preserve lifecycle", async () => {
  const fixture = await saveFixture()
  await asCalendarUser("admin")
  const before = (await db.query("select published_at,cancelled_at,status,created_by from public.calendar_entries where id=$1", [fixture.main.id])).rows
  assert.equal((await saveEntry(mainPayload(fixture, { title: "Updated reason", description: "Details", reason: "New explanation" }))).ok, true)
  assert.deepEqual((await db.query("select published_at,cancelled_at,status,created_by from public.calendar_entries where id=$1", [fixture.main.id])).rows, before)
  for (const changes of [
    { startsOn: fixture.today }, { endsOn: fixture.today }, { campuses: [] },
    { tags: ["no_classes", "holiday"] }, { audience: "students" },
    { tags: ["event"], attendanceImpact: "normal" },
  ]) assert.equal((await saveEntry(mainPayload(fixture, changes))).code, "HISTORICAL_SCOPE")
  await db.exec("reset role")
  await db.query("update public.calendar_entries set status='cancelled',cancelled_at=now() where id=$1", [fixture.main.id])
  await asCalendarUser("admin")
  assert.equal((await saveEntry(mainPayload(fixture, { title: "Cancelled details" }))).ok, true)
  assert.equal((await db.query("select status from public.calendar_entries where id=$1", [fixture.main.id])).rows[0].status, "cancelled")
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("normal entries cannot become backdated exceptions; drafts retain dates for later publication validation", async () => {
  const fixture = await saveFixture()
  const normal = await entry({ starts_on: fixture.yesterday, ends_on: fixture.today,
    status: "published", published_at: `${fixture.yesterday}T00:00:00Z` })
  await asCalendarUser("admin")
  const payload = mainPayload(fixture, { id: normal.id })
  assert.equal((await saveEntry(payload)).code, "PAST_ATTENDANCE_DATE")
  assert.equal((await saveEntry({ ...payload, id: null })).ok, true)
  assert.equal((await saveEntry(entryPayload(fixture, { id: normal.id, startsOn: fixture.yesterday }))).ok, true)
})

test("save requires an active verified admin and keeps overlap helper private", async () => {
  const fixture = await saveFixture()
  for (const [name, verified] of [["student", true], ["teacher", true], ["admin", false], ["missing", true]]) {
    await asCalendarUser(name, verified)
    await rejects(() => saveEntry(entryPayload(fixture)), "42501")
  }
  await asCalendarUser("admin")
  await rejects(() => db.query("select * from public.calendar_entry_conflict(null,$1,$2,'{}')", [fixture.today, fixture.last]), "42501")
  await db.exec("reset role")
  await db.query("update public.users set status='inactive' where id=$1", [accessUsers.admin])
  await asCalendarUser("admin")
  await rejects(() => saveEntry(entryPayload(fixture)), "42501")
  await db.exec("reset role; set local role anon")
  await rejects(() => saveEntry(entryPayload(fixture)), "42501")
})

async function publishFixture() {
  const fixture = await saveFixture()
  await db.exec("update public.calendar_entries set status='cancelled',cancelled_at=now() where status='published'")
  const sql = (await readFile(new URL("202610250005_publish_calendar_entry.sql", directory), "utf8"))
    .replace(/^begin;$/m, "").replace(/^commit;$/m, "")
  await db.exec(sql)
  await db.exec(sql)
  return fixture
}
const publishEntry = async (id) => (await db.query("select public.publish_calendar_entry($1) as result", [id])).rows[0].result

async function draftException(fixture, overrides = {}) {
  return entry({ title: "Publish break", tags: ["no_classes"], attendance_impact: "no_classes",
    reason: "Storm", campuses: ["Main Campus"], starts_on: fixture.today, ends_on: fixture.last, ...overrides })
}

test("publishing no-class entries creates scoped marks atomically and exposes the announcement", async () => {
  const fixture = await publishFixture()
  const draft = await draftException(fixture)
  await asCalendarUser("admin")
  assert.deepEqual(await publishEntry(draft.id), { ok: true, id: draft.id })
  const row = (await db.query("select * from public.calendar_entries where id=$1", [draft.id])).rows[0]
  assert.equal(row.status, "published")
  assert(row.published_at)
  assert.equal(row.cancelled_at, null)
  assert.equal(row.updated_by, accessUsers.admin)
  const marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 3)
  assert(marks.every((mark) => mark.student_id === 1 && mark.status === "NoClasses" && mark.calendar_entry_id === draft.id))
  assert.equal((await db.query("select count(*)::int as count from public.calendar_email_deliveries")).rows[0].count, 0)
  await asCalendarUser("student")
  assert((await visibleTitles()).includes("Publish break"))
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("normal publication creates no marks; all-campus online publication creates only OnlineManual", async () => {
  const fixture = await publishFixture()
  const normal = await entry({ starts_on: fixture.today, ends_on: fixture.last })
  const online = await draftException(fixture, { tags: ["no_classes", "online_class"], attendance_impact: "online_manual", campuses: [] })
  await asCalendarUser("admin")
  assert.equal((await publishEntry(normal.id)).ok, true)
  assert.deepEqual(await currentMarks(fixture.today), [])
  assert.equal((await publishEntry(online.id)).ok, true)
  const marks = await currentMarks(fixture.today)
  assert.equal(marks.length, 6)
  assert(marks.every((mark) => mark.status === "OnlineManual"))
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("publication allows different campuses and rejects same-campus and all-campus overlap", async () => {
  const fixture = await publishFixture()
  const main = await draftException(fixture)
  const mv = await draftException(fixture, { campuses: ["MV Campus"], tags: ["online_class"], attendance_impact: "online_manual" })
  const conflicts = [await draftException(fixture), await draftException(fixture, { campuses: [] })]
  await asCalendarUser("admin")
  assert.equal((await publishEntry(main.id)).ok, true)
  assert.equal((await publishEntry(mv.id)).ok, true)
  const marks = await currentMarks(fixture.today)
  for (const draft of conflicts) {
    const result = await publishEntry(draft.id)
    assert.equal(result.code, "CALENDAR_CONFLICT")
    assert.match(result.message, /Publish break/)
    assert.equal((await db.query("select status from public.calendar_entries where id=$1", [draft.id])).rows[0].status, "draft")
  }
  assert.deepEqual(await currentMarks(fixture.today), marks)
})

test("republishing resets the publish window and rejects repeated publication", async () => {
  const fixture = await publishFixture()
  const cancelled = await draftException(fixture, { status: "cancelled",
    published_at: "2020-01-01T00:00:00Z", cancelled_at: "2020-01-02T00:00:00Z" })
  await asCalendarUser("admin")
  assert.equal((await publishEntry(cancelled.id)).ok, true)
  const published = (await db.query("select * from public.calendar_entries where id=$1", [cancelled.id])).rows
  assert.equal(published[0].cancelled_at, null)
  assert(new Date(published[0].published_at) > new Date(cancelled.published_at))
  assert.equal((await currentMarks(fixture.today)).length, 3)
  assert.equal((await publishEntry(cancelled.id)).code, "INVALID_TRANSITION")
  assert.deepEqual((await db.query("select * from public.calendar_entries where id=$1", [cancelled.id])).rows, published)
})

test("publish and republish reject past attendance dates but allow past normal events", async () => {
  const fixture = await publishFixture()
  const draft = await draftException(fixture, { starts_on: fixture.yesterday })
  const normal = await entry({ starts_on: fixture.yesterday, ends_on: fixture.yesterday })
  await asCalendarUser("admin")
  await db.exec("set local time zone 'Pacific/Honolulu'")
  assert.equal((await publishEntry(draft.id)).code, "PAST_ATTENDANCE_DATE")
  assert.equal((await publishEntry(fixture.mv.id)).code, "PAST_ATTENDANCE_DATE")
  assert.equal((await publishEntry(normal.id)).ok, true)
  assert.deepEqual(await currentMarks(fixture.today), [])
  await db.exec("reset role")
  await assertHistory(fixture)
})

test("a mark insertion failure rolls back publication and all generated snapshots", async () => {
  const fixture = await publishFixture()
  const draft = await draftException(fixture, { campuses: [] })
  await db.exec(`create function public.test_reject_calendar_mark() returns trigger language plpgsql as $$
    begin if new.student_id = 2 then raise exception 'Test snapshot failure' using errcode='23514'; end if; return new; end $$;
    create trigger test_reject_calendar_mark before insert on public.attendance_day_marks
    for each row execute function public.test_reject_calendar_mark();`)
  await asCalendarUser("admin")
  await rejects(() => publishEntry(draft.id))
  assert.deepEqual((await db.query("select * from public.calendar_entries where id=$1", [draft.id])).rows, [draft])
  assert.deepEqual(await currentMarks(fixture.today), [])
  await db.exec("reset role; drop trigger test_reject_calendar_mark on public.attendance_day_marks; drop function public.test_reject_calendar_mark()")
  await asCalendarUser("admin")
  assert.equal((await publishEntry(draft.id)).ok, true)
  assert.equal((await currentMarks(fixture.today)).length, 6)
})

test("queued competing publications choose one winner and retain the shared transaction lock", async () => {
  const fixture = await publishFixture()
  const first = await draftException(fixture)
  const second = await draftException(fixture)
  await asCalendarUser("admin")
  // PGlite serializes requests; this checks competing outcomes, not multi-session scheduling.
  const results = await Promise.all([publishEntry(first.id), publishEntry(second.id)])
  assert.equal(results.filter((result) => result.ok).length, 1)
  assert.equal(results.filter((result) => result.code === "CALENDAR_CONFLICT").length, 1)
  const { rows } = await db.query(`select count(*)::int as locks from pg_locks
    where locktype='advisory' and granted and pid=pg_backend_pid()
      and classid::bigint = ((hashtextextended('calendar-entry-save',0) >> 32) & 4294967295)
      and objid::bigint = (hashtextextended('calendar-entry-save',0) & 4294967295)`)
  assert.equal(rows[0].locks, 1)
  assert.equal((await currentMarks(fixture.today)).length, 3)
})

test("publish validates ids and requires an active verified admin", async () => {
  const fixture = await publishFixture()
  const draft = await draftException(fixture)
  await asCalendarUser("admin")
  for (const id of [null, 0, -1]) await rejects(() => publishEntry(id), "22023")
  assert.equal((await publishEntry(999999)).code, "NOT_FOUND")
  for (const [name, verified] of [["student", true], ["teacher", true], ["admin", false], ["missing", true]]) {
    await asCalendarUser(name, verified)
    await rejects(() => publishEntry(draft.id), "42501")
  }
  await db.exec("reset role")
  await db.query("update public.users set status='inactive' where id=$1", [accessUsers.admin])
  await asCalendarUser("admin")
  await rejects(() => publishEntry(draft.id), "42501")
  await db.exec("reset role; set local role anon")
  await rejects(() => publishEntry(draft.id), "42501")
})
