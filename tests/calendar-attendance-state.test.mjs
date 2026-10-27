import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader()
const { createCalendarAttendanceResolver, summarizeCalendarAttendance, buildCalendarAttendanceTrend } = load("src/features/calendar/attendance-state.ts")
const today = "2026-11-05"
const effective = (campus, attendance_impact = "no_classes", attendance_date = today, entry_id = 1) => ({ entry_id, campus, attendance_impact, attendance_date })
const mark = (student_id, attendance_date, campus, status = "NoClasses", calendar_entry_id = 1) => ({ student_id, attendance_date, campus, status, calendar_entry_id })
const day = (student_id, campus, attendance_status, attendance_date = today) => ({ student_id, campus, attendance_status, attendance_date })
const normal = createCalendarAttendanceResolver({ today, effectiveDays: [], marks: [] })

test("effective states use exact campus/date, inclusive expanded days, and online precedence in either order", () => {
  const rows = [effective("Main Campus"), effective("Main Campus", "online_manual", "2026-11-06", 2), effective("Bulacan Campus", "no_classes", "2026-11-06", 3)]
  const resolve = createCalendarAttendanceResolver({ today, effectiveDays: rows, marks: [] })
  assert.equal(resolve(1, "Main Campus", today).status, "NoClasses")
  assert.equal(resolve(1, "main campus", today).status, "Normal")
  assert.equal(resolve(1, "MV Campus", today).status, "Normal")
  assert.equal(resolve(2, "Main Campus", "2026-11-06").status, "OnlineManual")
  assert.equal(resolve(2, "Main Campus", "2026-11-07").status, "Normal")
  // An all-campus publication arrives as one effective-view row per active campus.
  for (const campus of ["Main Campus", "Bulacan Campus"]) assert.notEqual(resolve(9, campus, "2026-11-06").status, "Normal")
  for (const overlap of [[effective("Main Campus"), effective("Main Campus", "online_manual", today, 2)], [effective("Main Campus", "online_manual", today, 2), effective("Main Campus")]]) {
    assert.equal(createCalendarAttendanceResolver({ today, effectiveDays: overlap, marks: [] })(1, "Main Campus", today).calendarEntryId, 2)
  }
  const state = resolve(1, "Main Campus", today)
  state.status = "Normal"
  assert.equal(resolve(1, "Main Campus", today).status, "NoClasses")
})

test("past snapshots retain student, campus and status after transfers/cancellations; missing history is never reconstructed", () => {
  const past = "2026-11-04"
  const resolve = createCalendarAttendanceResolver({ today, effectiveDays: [effective("MV Campus", "online_manual", past, 20), effective("MV Campus", "online_manual")], marks: [mark(1, past, "Main Campus", "NoClasses", 7), mark(2, past, "Bulacan Campus", "OnlineManual", 8), mark(1, today, "Old Campus")] })
  assert.deepEqual(resolve(1, "MV Campus", past), { status: "NoClasses", campus: "Main Campus", calendarEntryId: 7 })
  assert.deepEqual(resolve(2, "MV Campus", past), { status: "OnlineManual", campus: "Bulacan Campus", calendarEntryId: 8 })
  assert.equal(resolve(3, "MV Campus", past).status, "Normal")
  assert.equal(resolve(1, "MV Campus", today).status, "OnlineManual")
  const cancelled = createCalendarAttendanceResolver({ today, effectiveDays: [], marks: [mark(1, past, "Main Campus"), mark(1, today, "Main Campus")] })
  assert.equal(cancelled(1, "Main Campus", today).status, "Normal")
  assert.equal(cancelled(1, "Main Campus", past).status, "NoClasses")
})

test("mixed campuses exclude retained RFID evidence on exceptions and keep provisional/legacy records separate", () => {
  const resolve = createCalendarAttendanceResolver({ today, effectiveDays: [effective("Main Campus"), effective("Bulacan Campus", "online_manual")], marks: [] })
  const days = [day(1, "Main Campus", "Present"), day(2, "Bulacan Campus", "Absent"), day(3, "MV Campus", "Present"), day(4, "MV Campus", "Late"), day(5, "MV Campus", "Absent"), day(6, "MV Campus", null), day(7, "MV Campus", "Excused"), day(8, "MV Campus", "NoRecord")]
  const original = structuredClone(days)
  const counts = summarizeCalendarAttendance(days, resolve)
  assert.deepEqual(counts, { totalStudentDays: 8, expectedStudentDays: 6, present: 2, late: 1, absent: 1, noClasses: 1, onlineManual: 1, noRecord: 2, legacyRecords: 1, rateDenominator: 3, rate: 2 / 3 * 100 })
  assert.deepEqual(days, original)
  assert.deepEqual(summarizeCalendarAttendance([...days, days[0]], resolve), counts)
  assert.throws(() => summarizeCalendarAttendance([...days, { ...days[2], attendance_status: "Absent" }], resolve), /Conflicting attendance data/)
})

test("zero eligible or finalized attendance returns null, never a synthetic zero rate or absence", () => {
  for (const impact of ["no_classes", "online_manual"]) {
    const resolve = createCalendarAttendanceResolver({ today, effectiveDays: [effective("Main Campus", impact)], marks: [] })
    const counts = summarizeCalendarAttendance([day(1, "Main Campus", "Absent")], resolve)
    assert.equal(counts.expectedStudentDays, 0); assert.equal(counts.rate, null); assert.equal(counts.absent, 0)
  }
  const missing = summarizeCalendarAttendance([day(1, "Main Campus", null)], normal)
  assert.equal(missing.expectedStudentDays, 1); assert.equal(missing.rateDenominator, 0); assert.equal(missing.rate, null); assert.equal(missing.absent, 0)
  assert.equal(summarizeCalendarAttendance([], normal).rate, null)
  assert.equal(summarizeCalendarAttendance([day(1, "Main Campus", "Absent")], normal).rate, 0)
})

test("trend buckets use weighted decisions, Monday weeks, calendar months, and retain fully excluded dates", () => {
  const resolve = createCalendarAttendanceResolver({ today: "2027-01-04", effectiveDays: [], marks: [mark(4, "2027-01-03", "Main Campus")] })
  const days = [day(1, "MV Campus", "Present", "2026-12-31"), day(2, "MV Campus", "Absent", "2027-01-01"), day(3, "MV Campus", "Absent", "2027-01-01"), day(4, "Main Campus", null, "2027-01-03"), day(5, "MV Campus", "NoRecord", "2027-01-04")]
  const trend = buildCalendarAttendanceTrend(days, resolve)
  assert.deepEqual(trend.weekly.map(point => point.key), ["2026-12-28", "2027-01-04"])
  assert.equal(trend.weekly[0].rate, 1 / 3 * 100); assert.equal(trend.weekly[0].expectedStudentDays, 3)
  assert.equal(trend.daily.find(point => point.key === "2027-01-03").rate, null)
  assert.equal(trend.weekly[1].rate, null)
  assert.deepEqual(trend.monthly.map(point => [point.key, point.rate]), [["2026-12", 100], ["2027-01", 0]])
  assert.deepEqual(buildCalendarAttendanceTrend([], normal), { daily: [], weekly: [], monthly: [] })
  const many = Array.from({ length: 400 }, (_, index) => {
    const date = new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10)
    return day(1, "Main Campus", "Present", date)
  })
  const capped = buildCalendarAttendanceTrend(many, normal)
  assert.equal(capped.daily.length, 14); assert.equal(capped.weekly.length, 12); assert.equal(capped.monthly.length, 6)
})

function queryClient(resolve) {
  return { from(table) {
    const calls = []
    const query = { then: (yes, no) => Promise.resolve().then(() => resolve(table, calls)).then(yes, no) }
    for (const name of ["select", "gte", "lte", "lt", "order", "range"]) query[name] = (...args) => { calls.push([name, ...args]); return query }
    return query
  } }
}

test("state reads separate Manila past from current truth, page past response caps and never use source-entry joins", async () => {
  const calls = []
  const effectiveRows = [effective("Main Campus"), effective("MV Campus", "online_manual")]
  const marks = [mark(1, "2026-11-04", "Old Campus"), mark(2, "2026-11-04", "MV Campus")]
  const client = queryClient((table, methods) => {
    calls.push([table, methods])
    const range = methods.find(call => call[0] === "range")
    const data = table === "attendance_day_marks" ? marks : effectiveRows
    return { data: data.slice(range[1], range[1] + 1), error: null }
  })
  const fetch = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => client } })("src/services/calendar/attendance-state.ts").fetchCalendarAttendanceState
  const result = await fetch("2026-11-01", "2026-11-06", new Date("2026-11-04T16:00:00Z"))
  assert.equal(result.today, today); assert.deepEqual(result.effectiveDays, effectiveRows); assert.deepEqual(result.marks, marks)
  for (const [table, methods] of calls) {
    const select = methods.find(call => call[0] === "select")[1]
    assert.doesNotMatch(select, /calendar_entries\(/)
    const expected = table === "attendance_day_marks" ? ["lt", "attendance_date", today] : ["gte", "attendance_date", today]
    assert.ok(methods.some(call => JSON.stringify(call) === JSON.stringify(expected)))
  }
  assert.equal(createCalendarAttendanceResolver(result)(1, "Main Campus", "2026-11-04").campus, "Old Campus")
})

test("state reads validate range, skip irrelevant sources, accept long history and propagate query failures", async () => {
  const calls = []
  let failed = false
  const client = queryClient(table => { calls.push(table); return { data: [], error: failed ? { message: "State unavailable" } : null } })
  const fetch = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => client } })("src/services/calendar/attendance-state.ts").fetchCalendarAttendanceState
  const now = new Date("2026-11-04T15:59:59Z")
  for (const [from, to] of [["bad", today], ["0000-01-01", today], ["2026-11-05", "2026-11-01"]]) await assert.rejects(() => fetch(from, to, now))
  assert.equal(calls.length, 0)
  await fetch("2020-01-01", "2022-12-31", now)
  assert.deepEqual(calls, ["attendance_day_marks"])
  calls.length = 0
  const result = await fetch("2026-11-04", "2026-11-05", now)
  assert.equal(result.today, "2026-11-04"); assert.deepEqual(calls, ["calendar_attendance_days"])
  failed = true
  await assert.rejects(() => fetch(today, today, now), /State unavailable/)
  await assert.rejects(() => fetch("2020-01-01", "2020-12-31", now), /State unavailable/)
})
