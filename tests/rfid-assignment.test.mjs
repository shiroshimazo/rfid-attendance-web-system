import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { after, afterEach, before, beforeEach, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const db = new PGlite()
const directory = new URL("../supabase/migrations/", import.meta.url)
const name = "202609110001_atomic_rfid_assignment.sql"
const inventoryName = "202609250001_rfid_card_inventory.sql"
const load = createSourceLoader()
const { normalizeRfidUid } = load("src/lib/rfid-uid.ts")
const uids = ["00:00:00:11", "00:00:00:22", "00:00:00:33", "00:00:00:44", "00:00:00:55"]
const ids = { admin: "10000000-0000-4000-8000-000000000001", teacher: "20000000-0000-4000-8000-000000000001",
  student: "30000000-0000-4000-8000-000000000001", other: "30000000-0000-4000-8000-000000000002" }
let migration, inventory, original
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
// Storing a card is the default request: no holder, inactive until assigned.
async function save(options = {}) {
  return (await db.query("select public.save_rfid_card($1, $2, $3, $4, $5, $6) as id", [
    options.operation ?? "save", options.status ?? "Inactive", options.student ?? null,
    options.uid === undefined ? uids[0] : options.uid, options.card ?? null,
    options.date === undefined ? "2026-09-06" : options.date,
  ])).rows[0].id
}
const assign = (card, student, value = "Active", date = "2026-09-06") =>
  save({ operation: "assign", card, student, status: value, uid: null, date })
const release = (card, value = "Inactive") =>
  save({ operation: "release", card, status: value, uid: null, date: null })
const status = (card, value) =>
  save({ operation: "status", card, status: value, uid: null, date: null })
const cards = async () => (await db.query("select * from public.rfid_cards order by id")).rows
const card = async id => (await cards()).find(row => row.id === id)

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
    "@/services/audit/log": { auditActivity: async (_event, _entity, operation) => operation(), auditRoute: async (_event, _entity, operation) => operation() },
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
const storeInput = { rfidNumber: uids[0], cardStatus: "Inactive", assignedDate: "2026-09-06" }
const assignInput = { studentId: 1, cardId: 103, cardStatus: "Active", assignedDate: "2026-09-06" }

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
  inventory = await readFile(new URL(inventoryName, directory), "utf8")
  await db.exec(migration)
  await db.exec(inventory)
})
beforeEach(async () => { await db.exec("begin"); await identity() })
afterEach(async () => db.exec("rollback; reset role"))
after(async () => db.close())

test("both migrations and their reapplication preserve every legacy card, history, SMS and account", async () => {
  assert.deepEqual(await snapshot(), original)
  await db.exec("reset role")
  await db.exec(body(migration))
  await db.exec(body(inventory))
  assert.deepEqual(await snapshot(), original)
})

test("documented P03 rollback preserves records; reapplying both migrations restores storing and assigning", async () => {
  const id = await save()
  const before = await snapshot()
  await db.exec("reset role")
  const docs = await readFile(new URL("../supabase/migrations/README.md", import.meta.url), "utf8")
  const rollback = docs.match(/<!-- p03-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec(body(rollback))
  assert.deepEqual(await snapshot(), before)
  assert.equal((await db.query("select to_regprocedure('public.normalize_rfid_uid(text)') as f")).rows[0].f, null)
  await db.exec(body(migration))
  await db.exec(body(inventory))
  await identity()
  assert.equal(await save({ uid: "00-00-00-11" }), id)
  await assign(id, 1)
  assert.equal((await card(id)).student_id, 1)
})

test("documented inventory rollback requires every stored card to have a holder first", async () => {
  const id = await save()
  const docs = await readFile(new URL("../supabase/migrations/README.md", import.meta.url), "utf8")
  const rollback = docs.match(/<!-- inventory-rollback:start -->\s*```sql\s*([\s\S]*?)```/)[1]
  await db.exec("reset role")
  await rejected(() => db.exec(body(rollback)), /contains null values/)
  await identity()
  await assign(id, 1, "Inactive")
  await db.exec("reset role")
  await db.exec(body(rollback))
  await db.exec(body(migration))
  await identity()
  // The restored P03 writer registers a card for a student in one request.
  assert.equal(typeof (await db.query(
    "select public.save_rfid_card('save', 'Inactive', 1, '00:00:00:33', null, '2026-09-06') as id")).rows[0].id, "number")
})

test("TypeScript and SQL agree on complete UID bytes and separator normalization", async () => {
  const valid = [...uids, " aA:bB:0c:0D ", "AA-BB-0C-0D", "AA BB 0C 0D", "aabb0c0d", "04A1B2C3D4E580", "00010203040506070809"]
  const invalid = ["", "1234", "1234567890", "GG:00:00:11", "00:00-00:11", "0:0:0:11", "0000001", "0x00000011", "00  00 00 11", "AA\nBB\nCC\nDD", "CARD-1", "00:00:00:00:00:11", " ".repeat(65) + "00000011", " 00000011"]
  for (const input of [...valid, ...invalid]) {
    const actual = (await db.query("select public.normalize_rfid_uid($1) as uid", [input])).rows[0].uid
    assert.equal(actual, normalizeRfidUid(input), input)
    assert.equal(actual !== null, valid.includes(input), input)
  }
})

test("all five user-provided test UIDs are stored unassigned without losing leading zeros", async () => {
  for (const uid of uids) await save({ uid })
  const stored = (await cards()).filter(row => row.id < 101)
  assert.deepEqual(stored.map(row => row.rfid_number), uids.map(normalizeRfidUid))
  assert.deepEqual([...new Set(stored.map(row => row.student_id))], [null])
  assert.deepEqual([...new Set(stored.map(row => row.card_status))], ["Inactive"])
  assert.equal((await card(101)).card_status, "Active")
})

test("a stored card stays unassigned and cannot be activated before a student receives it", async () => {
  const id = await save({ uid: uids[1] })
  assert.equal((await card(id)).student_id, null)
  await rejected(() => save({ uid: uids[2], status: "Active" }), /Assign this card/)
  await rejected(() => status(id, "Active"), /Assign this card/)
  await rejected(() => db.query("update public.rfid_cards set card_status = 'Active' where id = $1", [id]), /Assign this card/)
  await assign(id, 1)
  assert.equal((await card(id)).student_id, 1)
  assert.equal((await card(id)).card_status, "Active")
})

test("assignment retires only the previous active card and preserves attendance/SMS", async () => {
  const id = await assign(await save(), 1)
  assert.equal((await card(id)).card_status, "Active")
  assert.equal((await card(101)).card_status, "Deactivated")
  assert.equal((await card(102)).card_status, "Lost")
  const after = await snapshot()
  assert.deepEqual(after.attendance_records, original.attendance_records)
  assert.deepEqual(after.sms_notifications, original.sms_notifications)
})

test("release returns a card to the card list and refuses one with attendance history", async () => {
  await release(103)
  assert.equal((await card(103)).student_id, null)
  assert.equal((await card(103)).card_status, "Inactive")
  await rejected(() => release(103), /already unassigned/)
  await rejected(() => release(101), /Attendance history keeps/)
  assert.equal((await card(101)).student_id, 1)
})

test("repeat registration and equivalent UID styles reuse one stored card", async () => {
  const id = await save()
  for (const uid of ["00000011", "00-00-00-11", "00 00 00 11"]) assert.equal(await save({ uid }), id)
  assert.equal((await cards()).filter(row => normalizeRfidUid(row.rfid_number) === "00000011").length, 1)
  await rejected(() => save({ uid: "AA-BB-CC-DD" }), /already assigned to a student/)
  assert.equal((await card(101)).rfid_number, "aa:bb:cc:dd")
})

test("editing a stored card rewrites its UID and refuses one another card holds", async () => {
  const id = await save()
  assert.equal(await save({ card: id, uid: "00:00:00:55" }), id)
  assert.equal((await card(id)).rfid_number, "00000055")
  await rejected(() => save({ card: id, uid: "aa:bb:cc:dd" }), /another card/)
  await rejected(() => save({ card: id, uid: "CARD-1" }), /hexadecimal/)
  assert.equal((await card(id)).student_id, null, "editing details never changes the holder")
})

test("editing keeps the holder of an assigned card and refuses a UID with attendance history", async () => {
  assert.equal(await save({ card: 103, uid: "00:00:00:55", status: "Active" }), 103)
  assert.equal((await card(103)).student_id, 2)
  assert.equal((await card(103)).rfid_number, "00000055")
  await rejected(() => save({ card: 101, uid: "00:00:00:44", status: "Active" }), /Attendance history/)
})

test("editing a legacy number to a verified UID allows activation and retires the old card", async () => {
  await save({ card: 102, uid: "00:00:00:22", status: "Active" })
  assert.equal((await card(102)).rfid_number, "00000022")
  assert.equal((await card(102)).student_id, 1)
  assert.equal((await card(101)).card_status, "Deactivated")
  assert.deepEqual((await snapshot()).attendance_records, original.attendance_records)
})

for (const operation of ["insert", "update"]) test(`${operation} failure restores every row`, async () => {
  if (operation === "update") await save()
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
  const id = await assign(await save(), 1, "Inactive")
  const before = await snapshot()
  await db.exec(`reset role;
    create function public.fail_p03() returns trigger language plpgsql as $$
    begin if new.rfid_number = '00000011' and new.card_status = 'Active' then raise exception 'injected activation failure'; end if; return new; end; $$;
    create trigger fail_p03 before update on public.rfid_cards for each row execute function public.fail_p03();`)
  await identity()
  await rejected(() => status(id, "Active"), /injected activation/)
  assert.deepEqual(await snapshot(), before)
})

test("registering a UID a student already holds is refused", async () => {
  await rejected(() => save({ uid: "11223344" }), /already assigned to a student/)
  assert.deepEqual(await snapshot(), original)
})

test("assignment without history retires the destination's active card", async () => {
  await assign(103, 1)
  assert.equal((await card(103)).student_id, 1)
  assert.equal((await card(101)).card_status, "Deactivated")
})

test("history prevents moving or changing physical identity, preserving both holders' cards", async () => {
  await rejected(() => assign(101, 2), /history/)
  await rejected(() => db.exec("update public.rfid_cards set rfid_number = 'ABCDEF01' where id = 101"), /history/)
  assert.deepEqual(await snapshot(), original)
})

for (const state of ["inactive", "archived"]) test(`${state} holder cannot activate through any operation`, async () => {
  const id = await assign(await save(), 1, "Inactive")
  await db.query("update public.students set status = $1 where id = 1", [state])
  const before = await snapshot()
  for (const action of [() => status(id, "Active"), () => assign(id, 1), () => assign(103, 1),
    () => save({ card: id, status: "Active" })]) await rejected(action, /must be active/)
  assert.deepEqual(await snapshot(), before)
  await status(id, "Lost")
})

test("disabled linked account cannot activate even if the profile is active", async () => {
  await db.query("update public.users set status = 'inactive' where id = $1", [ids.student])
  await rejected(() => assign(103, 1), /must be active/)
})

test("legacy invalid UID can be retired but cannot be newly activated", async () => {
  await status(102, "Deactivated")
  await rejected(() => status(102, "Active"), /legacy card/)
  assert.equal((await card(102)).rfid_number, "OLD-PRINTED-NUMBER")
})

test("direct older-client writes enforce normalized uniqueness and holder eligibility", async () => {
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'AA-BB-CC-DD', 'Inactive')"), /unique/)
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'PRINTED-UID', 'Inactive')"), /hexadecimal/)
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (null, '00000022', 'Active')"), /Assign this card/)
  await db.exec("update public.students set status = 'inactive' where id = 1")
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number) values (1, '00000022')"), /must be active/)
})

test("one-active-card constraint remains enforced for direct writes", async () => {
  await rejected(() => db.exec("insert into public.rfid_cards(student_id, rfid_number) values (1, '00000022')"), /unique/)
  assert.deepEqual(await snapshot(), original)
})

test("status-only changes preserve assigned date and other card statuses", async () => {
  const id = await assign(await save(), 1, "Inactive", "2026-09-01")
  for (const state of ["Lost", "Inactive", "Deactivated", "Active"]) await status(id, state)
  assert.equal((await card(id)).assigned_date.toISOString().slice(0, 10), "2026-09-01")
  assert.equal((await card(102)).card_status, "Lost")
})

test("bad requests and missing targets fail without changing cards", async () => {
  for (const options of [{ uid: "WRONG" }, { student: 1 }, { operation: "assign", card: 9999, student: 1, uid: null },
    { operation: "assign", card: 101, student: 9999, uid: null }, { operation: "unknown" }, { date: null },
    { operation: "status", card: 101 }, { operation: "release", card: 101, uid: null },
    { operation: "release", card: 9999, uid: null, date: null }]) {
    await rejected(() => save(options))
  }
  assert.deepEqual(await snapshot(), original)
})

for (const role of ["teacher", "student"]) test(`${role} cannot call any card management operation`, async () => {
  await identity(role)
  for (const action of [() => save(), () => assign(103, 1), () => release(103), () => status(101, "Lost")]) {
    await rejected(action, /administrator/)
  }
})

test("inactive admin and anonymous caller cannot call the save RPC", async () => {
  await db.query("update public.users set status = 'inactive' where id = $1", [ids.admin])
  await rejected(() => save(), /administrator/)
  await db.exec("reset role; set local role anon")
  await rejected(() => save(), /permission denied/)
})

test("read-only inventory identifies legacy values and detects equivalent collisions", async () => {
  await db.exec("reset role")
  const inventorySql = await readFile(new URL("../supabase/verify_rfid_uid_inventory.sql", import.meta.url), "utf8")
  assert.deepEqual((await db.query(inventorySql)).rows.map(row => row.issue), ["legacy_invalid"])
  await db.exec("drop trigger rfid_cards_guard_write on public.rfid_cards; drop index public.rfid_cards_normalized_uid_unique")
  await db.exec("insert into public.rfid_cards(student_id, rfid_number, card_status) values (2, 'AABBCCDD', 'Inactive')")
  assert.equal((await db.query(inventorySql)).rows.filter(row => row.issue === "collision").length, 2)
  const before = await snapshot()
  await rejected(() => db.exec(body(migration)), /Equivalent RFID UIDs/)
  assert.deepEqual(await snapshot(), before)
})

test("the card screen stores and edits, and the student screen assigns, through one RPC", async () => {
  const f = actionFixture()
  assert.equal((await f.cards.registerRfidCardAction(storeInput)).ok, true)
  const id = (await cards()).find(row => normalizeRfidUid(row.rfid_number) === "00000011").id
  assert.equal((await f.cards.editRfidCardAction({ ...storeInput, id, rfidNumber: "00-00-00-11" })).ok, true)
  assert.equal((await card(id)).student_id, null)
  assert.equal((await f.students.assignRfidCardAction({ ...assignInput, cardId: id })).ok, true)
  assert.equal((await card(id)).student_id, 1)
  assert.equal((await card(101)).card_status, "Deactivated")
  assert.deepEqual(f.calls.map(call => call.p.p_operation), ["save", "save", "assign"])
  assert.deepEqual(f.calls.map(call => call.p.p_uid), ["00000011", "00000011", null])
  assert.equal((await cards()).filter(row => row.rfid_number === "00000011").length, 1)
  assert.deepEqual(f.paths, Array(3).fill(["/admin/rfid-cards", "/admin/students"]).flat())
})

test("the student screen returns a card to the card list and reports history refusals", async () => {
  const f = actionFixture()
  assert.equal((await f.students.releaseRfidCardAction({ cardId: 103 })).ok, true)
  assert.equal((await card(103)).student_id, null)
  const refused = await f.students.releaseRfidCardAction({ cardId: 101 })
  assert.equal(refused.ok, false)
  assert.match(refused.message, /Attendance history/)
  assert.equal((await card(101)).student_id, 1)
  assert.deepEqual(f.calls.map(call => call.p.p_operation), ["release", "release"])
})

test("storing and editing reject malformed UIDs before any database request", async () => {
  const f = actionFixture()
  for (const input of [storeInput, { ...storeInput, id: 101 }]) {
    const action = "id" in input ? f.cards.editRfidCardAction : f.cards.registerRfidCardAction
    const result = await action({ ...input, rfidNumber: "0008450565" })
    assert.equal(result.ok, false)
    assert(result.fieldErrors.rfidNumber)
  }
  assert.equal(f.calls.length, 0)
})

test("the card screen refuses a UID a student holds and the student screen refuses inactive holders", async () => {
  const f = actionFixture()
  const before = await snapshot()
  const taken = await f.cards.registerRfidCardAction({ ...storeInput, rfidNumber: "11223344" })
  assert.equal(taken.ok, false)
  assert.match(taken.message, /already assigned/)
  await db.exec("update public.students set status = 'inactive' where id = 1")
  const inactive = await f.students.assignRfidCardAction(assignInput)
  assert.equal(inactive.ok, false)
  assert.match(inactive.message, /must be active/)
  assert.deepEqual((await snapshot()).rfid_cards, before.rfid_cards)
  assert.equal(f.paths.length, 0)
})

test("both screens report an injected failure while retaining every card", async () => {
  await db.exec(`reset role;
    create function public.fail_p03() returns trigger language plpgsql as $$
    begin raise exception 'injected card failure'; end; $$;
    create trigger fail_p03 before insert or update on public.rfid_cards for each row execute function public.fail_p03();`)
  await identity()
  const f = actionFixture()
  for (const request of [() => f.cards.registerRfidCardAction(storeInput),
    () => f.students.assignRfidCardAction(assignInput)]) {
    assert.equal((await request()).ok, false)
    assert.deepEqual(await snapshot(), original)
  }
})

test("status changes still use the same transactional writer", async () => {
  const f = actionFixture()
  assert.equal((await f.cards.setRfidCardStatusAction({ id: 103, cardStatus: "Lost" })).ok, true)
  assert.deepEqual(f.calls.map(call => call.p.p_operation), ["status"])
  assert.equal((await card(103)).card_status, "Lost")
})

test("all server actions authorize before any database call", async () => {
  const f = actionFixture()
  f.deny()
  for (const action of [() => f.cards.registerRfidCardAction(storeInput),
    () => f.cards.editRfidCardAction({ ...storeInput, id: 101 }),
    () => f.cards.setRfidCardStatusAction({ id: 101, cardStatus: "Lost" }),
    () => f.students.assignRfidCardAction(assignInput),
    () => f.students.releaseRfidCardAction({ cardId: 103 })]) await assert.rejects(action, /Access denied/)
  assert.equal(f.calls.length, 0)
})
