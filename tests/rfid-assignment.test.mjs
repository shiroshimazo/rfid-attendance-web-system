import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const db = new PGlite()
const directory = new URL("../supabase/migrations/", import.meta.url)
const name = "202609110001_atomic_rfid_assignment.sql"
const load = createSourceLoader()
const { normalizeRfidUid } = load("src/lib/rfid-uid.ts")
const uids = ["00:00:00:11", "00:00:00:22", "00:00:00:33", "00:00:00:44", "00:00:00:55"]
const ids = { admin: "10000000-0000-4000-8000-000000000001", teacher: "20000000-0000-4000-8000-000000000001",
  student: "30000000-0000-4000-8000-000000000001", other: "30000000-0000-4000-8000-000000000002" }
let migration, original
const body = sql => sql.replace(/^begin;$/m, "").replace(/^commit;$/m, "")
async function identity(role = "admin") {
  await db.exec("reset role")
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [ids[role]])
  await db.exec("set local role authenticated")
}
async function snapshot() {
  const rows = {}
  for (const table of ["users", "students", "teachers", "rfid_cards", "attendance_records", "sms_notifications"]) {
    rows[table] = (await db.query(`select * from public.${table} order by id`)).rows
  }
  return rows
}
async function rejected(action, pattern) {
  await db.exec("savepoint expected_failure")
  try { await assert.rejects(action, pattern) }
  finally { await db.exec("rollback to expected_failure; release expected_failure") }
}
async function save(options = {}) {
  return (await db.query("select public.save_rfid_card($1, $2, $3, $4, $5, $6) as id", [
    options.operation ?? "save", options.status ?? "Active", options.student === undefined ? 1 : options.student,
    options.uid === undefined ? uids[0] : options.uid, options.card ?? null,
    options.date === undefined ? "2026-09-06" : options.date,
  ])).rows[0].id
}
const status = (card, value) => save({ operation: "status", card, status: value, student: null, uid: null, date: null })
const move = (card, student, value = "Active") => save({ operation: "assign", card, student, status: value, uid: null })
const cards = async () => (await db.query("select * from public.rfid_cards order by id")).rows

// Run actual server actions against this database. Each mocked HTTP RPC maps to
// one savepoint so a rejected request does not abort the surrounding test fixture.
function actionFixture() {
  const calls = [], paths = []
  let denied = false
  const supabase = { rpc: async (rpc, p) => {
    calls.push({ rpc, p })
    assert.equal(rpc, "save_rfid_card")
    await db.exec("savepoint http_request")
    try {
      const result = await db.query("select public.save_rfid_card($1, $2, $3, $4, $5, $6) as id",
        [p.p_operation, p.p_status, p.p_student_id, p.p_uid, p.p_card_id, p.p_assigned_date])
      await db.exec("release http_request")
      return { data: result.rows[0].id, error: null }
    } catch (error) {
      await db.exec("rollback to http_request; release http_request")
      return { data: null, error: { message: error.message, code: error.code } }
    }
  } }
  const source = createSourceLoader({
    "next/cache": { revalidatePath: path => paths.push(path) },
    "@/features/auth/server": { requireRole: async role => {
      assert.equal(role, "admin")
      if (denied) throw Error("Access denied")
    } },
    "@/services/supabase/server": { createServerSupabaseClient: async () => supabase },
    "@/services/supabase/admin": { createAdminSupabaseClient: () => { throw Error("Unexpected privileged client") } },
  })
  return { cards: source("src/features/rfid/actions.ts"), students: source("src/features/students/actions.ts"),
    calls, paths, deny: () => { denied = true } }
}
const formInput = { studentId: 1, rfidNumber: uids[0], cardStatus: "Active", assignedDate: "2026-09-06" }

before(async () => {
  await db.exec(`create role authenticated; create role anon; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    create publication supabase_realtime;`)
  for (const file of (await readdir(directory)).filter(file => file.endsWith(".sql") && file < name).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"))
  }
  for (const [role, id] of Object.entries(ids)) await db.query(
    "insert into auth.users(id, email, raw_app_meta_data) values ($1, $2, $3)",
    [id, `${role}@example.test`, JSON.stringify({ role: role === "other" ? "student" : role })])
  for (const [i, role] of ["student", "other"].entries()) await db.query(`insert into public.students
    (id, user_id, student_id, full_name, email, parent_name, parent_contact_number, program_id, year_level, section, campus)
    select $1, $2, $3, $3, $4, 'Guardian', '+639171234567', id, '2nd Year', '21001', 'Main Campus'
    from public.programs where program_code = 'BSIT'`, [i + 1, ids[role], `Student ${i}`, `${role}@example.test`])
  await db.exec(`insert into public.rfid_cards(id, student_id, rfid_number, card_status) values
    (101, 1, 'aa:bb:cc:dd', 'Active'), (102, 1, 'OLD-PRINTED-NUMBER', 'Lost'),
    (103, 2, '11-22-33-44', 'Active');
    insert into public.attendance_records(id, student_id, rfid_card_id, attendance_date, time_in, attendance_status, campus)
    values (1, 1, 101, '2026-09-01', '06:00', 'Present', 'Main Campus');
    insert into public.sms_notifications(attendance_id, student_id, parent_contact_number, message)
    values (1, 1, '+639171234567', 'Retained arrival');`)
  original = await snapshot()
  migration = await readFile(new URL(name, directory), "utf8")
  await db.exec(migration)
})
beforeEach(async () => { await db.exec("begin"); await identity() })
afterEach(async () => db.exec("rollback; reset role"))
after(async () => db.close())

test("migration and reapplication preserve every legacy card, history, SMS and account", async () => {
  assert.deepEqual(await snapshot(), original)
  await db.exec("reset role")
  await db.exec(body(migration))
  assert.deepEqual(await snapshot(), original)
})

test("documented rollback preserves new and legacy records; forward reapplication restores saves", async () => {
  const id = await save()
  const before = await snapshot()
  await db.exec("reset role")
  const docs = await readFile(new URL("../supabase/migrations/README.md", import.meta.url), "utf8")
  const rollback = docs.match(/<!-- p03-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec(body(rollback))
  assert.deepEqual(await snapshot(), before)
  assert.equal((await db.query("select to_regprocedure('public.normalize_rfid_uid(text)') as f")).rows[0].f, null)
  await db.exec(body(migration))
  await identity()
  assert.equal(await save({ uid: "00-00-00-11" }), id)
})

test("TypeScript and SQL agree on complete UID bytes and separator normalization", async () => {
  const valid = [...uids, " aA:bB:0c:0D ", "AA-BB-0C-0D", "AA BB 0C 0D", "aabb0c0d", "04A1B2C3D4E580", "00010203040506070809"]
  const invalid = ["", "1234", "1234567890", "GG:00:00:11", "00:00-00:11", "0:0:0:11", "0000001", "0x00000011", "00  00 00 11", "AA\nBB\nCC\nDD", "CARD-1", "00:00:00:00:00:11", " ".repeat(65) + "00000011", "\u00a000000011"]
  for (const input of [...valid, ...invalid]) {
    const actual = (await db.query("select public.normalize_rfid_uid($1) as uid", [input])).rows[0].uid
    assert.equal(actual, normalizeRfidUid(input), input)
    assert.equal(actual !== null, valid.includes(input), input)
  }
})

test("all five user-provided test UIDs register without losing leading zeros", async () => {
  for (const uid of uids) await save({ uid, status: "Inactive" })
  assert.deepEqual((await cards()).filter(row => row.id < 101).map(row => row.rfid_number), uids.map(normalizeRfidUid))
  assert.equal((await cards()).find(row => row.id === 101).card_status, "Active")
})

test("replacement retires only the previous active card and preserves attendance/SMS", async () => {
  const id = await save()
  assert.equal((await cards()).find(row => row.id === id).card_status, "Active")
  assert.equal((await cards()).find(row => row.id === 101).card_status, "Deactivated")
  assert.equal((await cards()).find(row => row.id === 102).card_status, "Lost")
  const after = await snapshot()
  assert.deepEqual(after.attendance_records, original.attendance_records)
  assert.deepEqual(after.sms_notifications, original.sms_notifications)
})

test("repeat requests and equivalent UID styles reuse one card ID", async () => {
  const id = await save()
  for (const uid of ["00000011", "00-00-00-11", "00 00 00 11"]) assert.equal(await save({ uid }), id)
  assert.equal((await cards()).filter(row => normalizeRfidUid(row.rfid_number) === "00000011").length, 1)
  assert.equal(await save({ uid: "AA-BB-CC-DD" }), 101)
  assert.equal((await cards()).find(row => row.id === 101).rfid_number, "aa:bb:cc:dd")
})

for (const operation of ["insert", "update"]) test(`${operation} failure restores the previous active card and every row`, async () => {
  if (operation === "update") await save({ status: "Inactive" })
  const before = await snapshot()
  await db.exec(`reset role;
    create function public.fail_p03() returns trigger language plpgsql as $$
    begin if new.rfid_number = '00000011' then raise exception 'injected card failure'; end if; return new; end; $$;
    create trigger fail_p03 before ${operation} on public.rfid_cards for each row execute function public.fail_p03();`)
  await identity()
  await rejected(() => save(), /injected card failure/)
  assert.deepEqual(await snapshot(), before)
})

test("a failed status activation also restores the previous active card", async () => {
  const id = await save({ status: "Lost" })
  const before = await snapshot()
  await db.exec(`reset role;
    create function public.fail_p03() returns trigger language plpgsql as $$
    begin if new.rfid_number = '00000011' and new.card_status = 'Active' then raise exception 'injected activation failure'; end if; return new; end; $$;
    create trigger fail_p03 before update on public.rfid_cards for each row execute function public.fail_p03();`)
  await identity()
  await rejected(() => status(id, "Active"), /injected activation/)
  assert.deepEqual(await snapshot(), before)
})

test("UID entry cannot silently take another student's card", async () => {
  await rejected(() => save({ uid: "11223344" }), /another student/)
  assert.deepEqual(await snapshot(), original)
})

test("explicit reassignment without history retires the destination's active card", async () => {
  await move(103, 1)
  assert.equal((await cards()).find(row => row.id === 103).student_id, 1)
  assert.equal((await cards()).find(row => row.id === 101).card_status, "Deactivated")
})

test("history prevents moving or changing physical identity, preserving both holders' cards", async () => {
  await rejected(() => move(101, 2), /history/)
  await rejected(() => db.exec("update public.rfid_cards set rfid_number = 'ABCDEF01' where id = 101"), /history/)
  assert.deepEqual(await snapshot(), original)
})

for (const state of ["inactive", "archived"]) test(`${state} holder cannot activate through any operation`, async () => {
  const id = await save({ status: "Inactive" })
  await db.query("update public.students set status = $1 where id = 1", [state])
  const before = await snapshot()
  for (const action of [() => save(), () => status(id, "Active"), () => move(103, 1)]) await rejected(action, /must be active/)
  assert.deepEqual(await snapshot(), before)
  await status(id, "Lost")
})

test("disabled linked account cannot activate even if the profile is active", async () => {
  await db.query("update public.users set status = 'inactive' where id = $1", [ids.student])
  await rejected(() => save(), /must be active/)
})

test("legacy invalid UID can be retired but cannot be newly activated", async () => {
  await status(102, "Deactivated")
  await rejected(() => status(102, "Active"), /legacy card/)
  assert.equal((await cards()).find(row => row.id === 102).rfid_number, "OLD-PRINTED-NUMBER")
})

test("direct older-client writes enforce normalized uniqueness and active holder eligibility", async () => {
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'AA-BB-CC-DD', 'Inactive')"), /unique/)
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'PRINTED-UID', 'Inactive')"), /hexadecimal/)
  await db.exec("update public.students set status = 'inactive' where id = 1")
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number) values (1, '00000022')"), /must be active/)
})

test("one-active-card constraint remains enforced for direct writes", async () => {
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number) values (1, '00000022')"), /unique/)
  assert.deepEqual(await snapshot(), original)
})

test("status-only changes preserve assigned date and other card statuses", async () => {
  const id = await save({ date: "2026-09-01" })
  for (const state of ["Lost", "Inactive", "Deactivated", "Active"]) await status(id, state)
  assert.equal((await cards()).find(row => row.id === id).assigned_date.toISOString().slice(0, 10), "2026-09-01")
})

test("bad requests and missing targets fail without changing cards", async () => {
  for (const options of [{ uid: "WRONG" }, { student: 9999 }, { operation: "assign", card: 9999, uid: null },
    { operation: "unknown" }, { date: null }, { operation: "status", card: 101 }]) {
    await rejected(() => save(options))
  }
  assert.deepEqual(await snapshot(), original)
})

for (const role of ["teacher", "student"]) test(`${role} cannot call any card management operation`, async () => {
  await identity(role)
  for (const action of [() => save(), () => move(103, 1), () => status(101, "Lost")]) await rejected(action, /administrator/)
})

test("inactive admin and anonymous caller cannot call the save RPC", async () => {
  await db.query("update public.users set status = 'inactive' where id = $1", [ids.admin])
  await rejected(() => save(), /administrator/)
  await db.exec("reset role; set local role anon")
  await rejected(() => save(), /permission denied/)
})

test("read-only inventory identifies legacy values and detects equivalent collisions", async () => {
  await db.exec("reset role")
  const inventory = await readFile(new URL("../supabase/verify_rfid_uid_inventory.sql", import.meta.url), "utf8")
  assert.deepEqual((await db.query(inventory)).rows.map(row => row.issue), ["legacy_invalid"])
  await db.exec("drop trigger rfid_cards_guard_write on public.rfid_cards; drop index public.rfid_cards_normalized_uid_unique")
  await db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'AABBCCDD', 'Inactive')")
  assert.equal((await db.query(inventory)).rows.filter(row => row.issue === "collision").length, 2)
  const before = await snapshot()
  await rejected(() => db.exec(body(migration)), /Equivalent RFID UIDs/)
  assert.deepEqual(await snapshot(), before)
})

test("both admin screens normalize the same UID and reissue the same card through one RPC", async () => {
  const f = actionFixture()
  assert.equal((await f.cards.registerRfidCardAction(formInput)).ok, true)
  assert.equal((await f.students.assignRfidCardAction({ ...formInput, rfidNumber: "00-00-00-11" })).ok, true)
  assert.deepEqual(f.calls[0], f.calls[1])
  assert.equal(f.calls.length, 2)
  assert.equal((await cards()).filter(row => row.rfid_number === "00000011").length, 1)
  assert.deepEqual(f.paths, ["/admin/rfid-cards", "/admin/students", "/admin/rfid-cards", "/admin/students"])
})

test("both screens reject malformed UIDs before any database request", async () => {
  const f = actionFixture()
  for (const action of [f.cards.registerRfidCardAction, f.students.assignRfidCardAction]) {
    const result = await action({ ...formInput, rfidNumber: "0008450565" })
    assert.equal(result.ok, false)
    assert(result.fieldErrors.rfidNumber)
  }
  assert.equal(f.calls.length, 0)
})

test("both screens reject inactive holders and other owners identically", async () => {
  const f = actionFixture()
  for (const input of [{ ...formInput, rfidNumber: "11223344" }, formInput]) {
    if (input === formInput) await db.exec("update public.students set status = 'inactive' where id = 1")
    const before = await snapshot()
    const first = await f.cards.registerRfidCardAction(input)
    const second = await f.students.assignRfidCardAction(input)
    assert.equal(first.ok, false)
    assert.deepEqual(first, second)
    assert.deepEqual(await snapshot(), before)
  }
  assert.equal(f.paths.length, 0)
})

test("both screens report injected replacement failure while retaining old card", async () => {
  await db.exec(`reset role;
    create function public.fail_p03() returns trigger language plpgsql as $$
    begin raise exception 'injected card failure'; end; $$;
    create trigger fail_p03 before insert on public.rfid_cards for each row execute function public.fail_p03();`)
  await identity()
  const f = actionFixture()
  for (const action of [f.cards.registerRfidCardAction, f.students.assignRfidCardAction]) {
    assert.equal((await action(formInput)).ok, false)
    assert.deepEqual(await snapshot(), original)
  }
})

test("explicit reassignment and status actions use the same transactional writer", async () => {
  const f = actionFixture()
  assert.equal((await f.cards.assignRfidCardAction({ id: 103, studentId: 1, cardStatus: "Active", assignedDate: "2026-09-06" })).ok, true)
  assert.equal((await f.cards.setRfidCardStatusAction({ id: 103, cardStatus: "Lost" })).ok, true)
  assert.deepEqual(f.calls.map(call => call.p.p_operation), ["assign", "status"])
  assert.equal((await cards()).find(row => row.id === 103).card_status, "Lost")
})

test("all server actions authorize before any database call", async () => {
  const f = actionFixture()
  f.deny()
  for (const action of [f.cards.registerRfidCardAction, f.students.assignRfidCardAction,
    f.cards.assignRfidCardAction, f.cards.setRfidCardStatusAction]) await assert.rejects(action(formInput), /Access denied/)
  assert.equal(f.calls.length, 0)
})
