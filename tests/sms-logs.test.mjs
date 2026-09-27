import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { parseSmsLogQuery, smsLogPageUrl, smsStatusLabel, deliveryResultLabel } = createSourceLoader()("src/features/sms-logs/query.ts")

test("SMS filters validate dates, status and pagination using the school timezone", () => {
  assert.deepEqual(parseSmsLogQuery({}, new Date("2026-09-21T17:00:00Z")), {
    status: "all", from: "2026-09-16", to: "2026-09-22", page: 1,
  })
  const query = parseSmsLogQuery({ from: "2026-09-22", to: "2026-09-01", status: "Failed", page: "2" })
  assert.deepEqual(query, { from: "2026-09-01", to: "2026-09-22", status: "Failed", page: 2 })
  assert.match(smsLogPageUrl(query, 3), /status=Failed.*page=3/)
  const invalid = parseSmsLogQuery({ from: "2026-02-30", status: "Delivered", page: "-2" }, new Date("2026-09-22T00:00:00Z"))
  assert.equal(invalid.from, "2026-09-16")
  assert.equal(invalid.status, "all")
  assert.equal(invalid.page, 1)
})

test("uncertain outcomes are never labeled as sent or failed", () => {
  assert.equal(smsStatusLabel("Pending"), "Pending")
  assert.equal(smsStatusLabel("Failed"), "Failed (Not Sent)")
  assert.match(deliveryResultLabel("unknown", true), /unknown/)
  assert.match(deliveryResultLabel("attempt_started", true), /not recorded/)
  assert.match(deliveryResultLabel(null, false), /disabled/)
})

function service({ denied = false, error = null } = {}) {
  const calls = []
  const builder = {}
  for (const method of ["select", "gte", "lt", "eq", "order", "range"]) {
    builder[method] = (...args) => { calls.push([method, ...args]); return builder }
  }
  builder.returns = async () => ({ data: [], count: 26, error })
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => {
      assert.equal(role, "admin")
      if (denied) throw new Error("Access denied")
    } },
    "@/services/supabase/server": { createServerSupabaseClient: async () => ({
      from: table => { calls.push(["from", table]); return builder },
    }) },
  })
  return { ...load("src/services/sms/logs.ts"), calls }
}

test("SMS query pages at database level with inclusive PHT dates and attendance-linked RFID", async () => {
  const { fetchSmsLogs, calls } = service()
  const result = await fetchSmsLogs({ from: "2026-09-21", to: "2026-09-22", status: "Pending", page: 2 })
  assert.equal(result.pageCount, 2)
  assert.ok(calls.some(call => call[0] === "gte" && call[2] === "2026-09-21T00:00:00+08:00"))
  assert.ok(calls.some(call => call[0] === "lt" && call[2] === "2026-09-22T16:00:00.000Z"))
  assert.ok(calls.some(call => call[0] === "eq" && call[1] === "sms_status" && call[2] === "Pending"))
  assert.deepEqual(calls.find(call => call[0] === "range"), ["range", 25, 49])
  assert.match(calls.find(call => call[0] === "select")[1], /sms_attendance_belongs_to_student_fk.*card:rfid_cards/)
})

test("SMS reader blocks non-admins before querying and propagates database errors", async () => {
  const query = parseSmsLogQuery({})
  const denied = service({ denied: true })
  await assert.rejects(denied.fetchSmsLogs(query), /Access denied/)
  assert.equal(denied.calls.length, 0)
  await assert.rejects(service({ error: { message: "Database unavailable" } }).fetchSmsLogs(query), /Database unavailable/)
})
