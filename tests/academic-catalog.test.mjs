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
