import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader()
const { buildLiveMonitoringRows, filterLiveMonitoringRows } = load("src/features/attendance/live-monitoring.ts")
const filters = { search: "", tap: "all", program: "all", section: "all" }
const record = (id, timeIn, timeOut = null) => ({
  id, attendance_date: "2026-09-20", time_in: timeIn, time_out: timeOut,
  student: { student_id: `S-${id}`, full_name: `Student ${id}`, section: id === 1 ? "A" : "B",
    program_id: id, program: { program_code: `P${id}`, program_name: `Program ${id}` } },
  card: { rfid_number: `0000000${id}` },
})

test("latest tap sorts first, missing taps stay absent, and the recorded card is retained", () => {
  const rows = buildLiveMonitoringRows([record(1, "08:00:00"), record(2, "07:00:00", "12:00:00"), record(3, null)])
  assert.deepEqual(rows.map(row => row.id), [2, 1])
  assert.equal(rows[1].rfidNumber, "00000001")
  assert.equal(rows[1].timeOut, null)
  assert.equal(buildLiveMonitoringRows([{ ...record(1, "08:00:00"), student: null, card: null }])[0].name, "Unknown student")
})

test("search and combined filters distinguish pending tap outs from completed tap outs", () => {
  const rows = buildLiveMonitoringRows([record(1, "08:00:00"), record(2, "07:00:00", "12:00:00")])
  assert.deepEqual(filterLiveMonitoringRows(rows, { ...filters, tap: "in" }).map(row => row.id), [1])
  assert.deepEqual(filterLiveMonitoringRows(rows, { ...filters, tap: "out" }).map(row => row.id), [2])
  for (const search of [" STUDENT 1 ", "s-1", "00000001", "program 1"]) {
    assert.equal(filterLiveMonitoringRows(rows, { ...filters, search, tap: "in", program: "1", section: "A" }).length, 1)
  }
  assert.equal(filterLiveMonitoringRows(rows, { ...filters, program: "1", section: "B" }).length, 0)
})

test("service scopes to today's attended records, paginates, and joins the recorded card", async () => {
  const calls = []
  let page = 0
  const builder = Object.fromEntries(["from", "select", "eq", "in", "order", "range"].map(method => [method, (...args) => {
    calls.push([method, ...args]); return builder
  }]))
  builder.returns = async () => ({ data: page++ === 0 ? [record(1, "08:00:00")] : [], error: null })
  const service = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: async () => builder } })("src/services/attendance/live-monitoring.ts")
  assert.equal((await service.fetchLiveMonitoringRecords("2026-09-20")).length, 1)
  assert(calls.some(call => call[0] === "eq" && call[1] === "attendance_date" && call[2] === "2026-09-20"))
  assert(calls.some(call => call[0] === "select" && call[1].includes("attendance_card_belongs_to_student_fk")))
  assert.deepEqual(calls.find(call => call[0] === "in"), ["in", "attendance_status", ["Present", "Late"]])
  assert.equal(page, 2)
})

test("page enforces administrator access before reading records and uses the school date", async () => {
  let authorized = false, reads = 0, fail = false
  const pageLoad = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); if (!authorized) throw Error("denied") } },
    "@/services/attendance/live-monitoring": { fetchLiveMonitoringRecords: async date => {
      assert.equal(date, "2026-09-20"); reads++
      if (fail) throw Error("Connection unavailable")
      return []
    } },
    "@/lib/school-time": { schoolDateKey: () => "2026-09-20" },
    "@/components/live-refresh": { LiveRefresh: () => null },
    "./components/monitoring-table": { MonitoringTable: () => null },
  })
  const Page = pageLoad("src/app/(portal)/admin/live-monitoring/page.tsx").default
  await assert.rejects(Page, /denied/)
  assert.equal(reads, 0)
  authorized = true
  const page = await Page()
  assert.equal(reads, 1)
  const refresh = page.props.children[0]
  assert.deepEqual(refresh.props.tables, ["attendance_records", "students", "programs", "rfid_cards"])
  assert.equal(refresh.props.debounceMs, 300)
  fail = true
  const failedPage = await Page()
  assert.equal(failedPage.props.children[2].props.message, "Connection unavailable")
  assert.equal(failedPage.props.children[0].type, refresh.type)
})
