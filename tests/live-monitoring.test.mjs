import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader()
const { buildLiveMonitoringRows, filterLiveMonitoringRows, parseMonitoringRange } = load("src/features/attendance/live-monitoring.ts")
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

test("history defaults to today in PHT, validates dates, and normalizes reversed ranges", () => {
  const now = new Date("2026-09-20T17:00:00Z")
  assert.deepEqual(parseMonitoringRange({}, now), { from: "2026-09-21", to: "2026-09-21" })
  assert.deepEqual(parseMonitoringRange({ from: "2026-02-30", to: "bad" }, now), { from: "2026-09-21", to: "2026-09-21" })
  assert.deepEqual(parseMonitoringRange({ from: ["2026-09-20"], to: "2026-09-01" }, now), { from: "2026-09-01", to: "2026-09-20" })
  const rows = buildLiveMonitoringRows([record(1, "23:00:00"), { ...record(2, "01:00:00"), attendance_date: "2026-09-21" }])
  assert.deepEqual(rows.map(row => row.id), [2, 1])
  assert.equal(rows[0].attendanceDate, "2026-09-21")
})

test("service reads an inclusive history range, paginates, and joins the recorded card", async () => {
  const calls = []
  let page = 0
  const builder = Object.fromEntries(["from", "select", "gte", "lte", "in", "order", "range"].map(method => [method, (...args) => {
    calls.push([method, ...args]); return builder
  }]))
  builder.returns = async () => ({ data: page++ === 0 ? [record(1, "08:00:00")] : [], error: null })
  const service = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: async () => builder } })("src/services/attendance/live-monitoring.ts")
  assert.equal((await service.fetchLiveMonitoringRecords("2026-09-01", "2026-09-20")).length, 1)
  assert.deepEqual(calls.find(call => call[0] === "gte"), ["gte", "attendance_date", "2026-09-01"])
  assert.deepEqual(calls.find(call => call[0] === "lte"), ["lte", "attendance_date", "2026-09-20"])
  assert(calls.some(call => call[0] === "select" && call[1].includes("attendance_card_belongs_to_student_fk")))
  assert.deepEqual(calls.find(call => call[0] === "in"), ["in", "attendance_status", ["Present", "Late"]])
  assert.equal(page, 2)
})

test("page enforces administrator access before reading records and uses the school date", async () => {
  let authorized = false, reads = 0, fail = false
  let expectedFrom = "2026-09-20", expectedTo = "2026-09-20"
  const UsbAttendanceReader = () => null
  const pageLoad = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); if (!authorized) throw Error("denied") } },
    "@/services/attendance/live-monitoring": { fetchLiveMonitoringRecords: async (from, to) => {
      assert.equal(from, expectedFrom); assert.equal(to, expectedTo); reads++
      if (fail) throw Error("Connection unavailable")
      return []
    } },
    "@/lib/school-time": { schoolDateKey: () => "2026-09-20" },
    "@/components/live-refresh": { LiveRefresh: () => null },
    "@/components/usb-attendance-reader": { UsbAttendanceReader, UsbAttendanceProvider: () => null },
    "./components/monitoring-table": { MonitoringTable: () => null },
  })
  const Page = pageLoad("src/app/(portal)/admin/live-monitoring/page.tsx").default
  const props = { searchParams: Promise.resolve({}) }
  await assert.rejects(() => Page(props), /denied/)
  assert.equal(reads, 0)
  authorized = true
  const page = await Page(props)
  assert.equal(reads, 1)
  const refresh = page.props.children[0]
  assert.deepEqual(refresh.props.tables, ["attendance_records", "students", "programs", "rfid_cards"])
  assert.equal(refresh.props.debounceMs, 300)
  assert.equal(page.props.children[2].type, UsbAttendanceReader)
  const Layout = pageLoad("src/app/(portal)/admin/layout.tsx").default
  assert.equal((await Layout({ children: "panel" })).props.children, "panel")
  expectedFrom = "2026-09-01"
  expectedTo = "2026-09-10"
  const history = await Page({ searchParams: Promise.resolve({ from: expectedFrom, to: expectedTo }) })
  const dateForm = history.props.children[3]
  assert.equal(dateForm.props.action, "/admin/live-monitoring")
  assert.equal(dateForm.props.children[0].props.children[1].props.defaultValue, expectedFrom)
  assert.equal(dateForm.props.children[1].props.children[1].props.defaultValue, expectedTo)
  expectedFrom = expectedTo = "2026-09-20"
  fail = true
  const failedPage = await Page(props)
  assert.equal(failedPage.props.children.at(-1).props.message, "Connection unavailable")
  assert.equal(failedPage.props.children[0].type, refresh.type)
})
