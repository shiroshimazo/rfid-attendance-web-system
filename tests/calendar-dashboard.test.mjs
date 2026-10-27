import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const today = "2026-11-05", past = "2026-11-04"
const students = ["Main Campus", "Main Campus", "MV Campus", "MV Campus", "Bulacan Campus"].map((campus, index) => ({ id: index + 1, student_id: `S-${index + 1}`, full_name: `Student ${index + 1}`, campus, program_id: 1, program: { program_code: "IT" }, year_level: "1st Year", section: "A" }))
const record = (student_id, attendance_status, attendance_date = today, time_out = null) => ({ student_id, attendance_status, attendance_date, time_in: "07:00:00", time_out })
const current = [record(1, "Late", today, "15:00:00"), record(2, "Absent"), record(3, "Present", today, "15:00:00"), record(4, "Absent"), record(5, "Present")]
const calendar = { today, effectiveDays: [ { entry_id: 1, attendance_date: today, campus: "Main Campus", attendance_impact: "no_classes" }, { entry_id: 2, attendance_date: today, campus: "Bulacan Campus", attendance_impact: "online_manual" } ], marks: [{ student_id: 3, attendance_date: past, campus: "Old Campus", status: "NoClasses", calendar_entry_id: 1 }, { student_id: 4, attendance_date: past, campus: "Main Campus", status: "OnlineManual", calendar_entry_id: 2 }] }
const load = createSourceLoader({ "@/features/auth/server": {}, "@/services/attendance/dashboard": {}, "@/services/attendance/teacher-dashboard": {}, "@/services/attendance/student-dashboard": {} })
const builders = [["admin", load("src/features/attendance/dashboard.ts").buildAdminDashboardData], ["teacher", load("src/features/attendance/teacher-dashboard.ts").buildTeacherDashboardData]]

for (const [role, build] of builders) {
  test(`${role}: mixed campus KPIs, distribution, groups and historical trends exclude exceptions while retaining raw taps`, () => {
    const snapshot = { students, attendance: [...current, record(3, "Present", past), record(4, "Absent", past), record(1, "Late", past), record(999, "Present")], cards: [] }
    const original = structuredClone(snapshot)
    const data = build(snapshot, today, calendar)
    assert.equal(data.kpis.expectedStudents, 2); assert.equal(data.kpis.presentToday, 1); assert.equal(data.kpis.absentToday, 1); assert.equal(data.kpis.lateToday, 0); assert.equal(data.kpis.attendanceRate, 50)
    assert.deepEqual(data.students.map(row => row.status), ["NoClasses", "NoClasses", "Present", "Absent", "OnlineManual"])
    assert.equal(data.students[0].timeIn, "07:00:00"); assert.equal(data.students[0].timeOut, "15:00:00")
    assert.deepEqual(data.campusStates, [{ campus: "Bulacan Campus", status: "OnlineManual", students: 1 }, { campus: "Main Campus", status: "NoClasses", students: 2 }])
    assert.equal(data.distribution.reduce((sum, slice) => sum + slice.count, 0), students.length)
    assert.equal(data.trend.daily.find(point => point.key === past).rate, 100)
    assert.equal(data.trend.daily.find(point => point.key === today).rate, 50)
    if (role === "admin") {
      assert.equal(data.kpis.rfidTapsToday, 7)
      for (const groups of [data.byProgram, data.byYearLevel, data.bySection]) { assert.equal(groups[0].rate, 50); assert.equal(groups[0].present, 1); assert.equal(groups[0].total, 5) }
    }
    assert.deepEqual(snapshot, original)
  })

  test(`${role}: current cancellation restores normal decisions; all-exception rates and history-only exception buckets stay null`, () => {
    const snapshot = { students, attendance: current, cards: [] }
    const cancelled = build(snapshot, today, { ...calendar, effectiveDays: [], marks: [...calendar.marks, { student_id: 1, attendance_date: today, status: "NoClasses", campus: "Main Campus", calendar_entry_id: 1 }] })
    assert.equal(cancelled.kpis.attendanceRate, 60); assert.deepEqual(cancelled.campusStates, [])
    const all = build(snapshot, today, { ...calendar, effectiveDays: [...calendar.effectiveDays, { entry_id: 3, attendance_date: today, campus: "MV Campus", attendance_impact: "online_manual" }] })
    assert.equal(all.kpis.expectedStudents, 0); assert.equal(all.kpis.attendanceRate, null); assert.equal(all.kpis.absentToday, 0)
    assert.equal(all.trend.daily.find(point => point.key === today).rate, null)
    assert.equal(all.trend.daily.find(point => point.key === past).rate, null)
  })
}

test("student dashboard excludes historical/current exception decisions, retains tap totals/SMS, and shows subject guidance", () => {
  const build = load("src/features/attendance/student-dashboard.ts").buildStudentDashboardData
  const snapshot = { student: { ...students[2], profile_picture: null }, cards: [], attendance: { id: 1, attendance_status: "Present", time_in: "07:00:00", time_out: null }, sms: { sms_status: "Sent", sent_at: `${today}T00:00:00Z` }, history: [record(3, "Present", past, "15:00:00"), record(3, "Late", "2026-11-03"), record(3, "Present"), record(3, "Present", "2026-11-06")] }
  for (const [impact, status] of [["online_manual", "OnlineManual"], ["no_classes", "NoClasses"]]) {
    const data = build(snapshot, today, { ...calendar, effectiveDays: [{ entry_id: 3, attendance_date: today, campus: "MV Campus", attendance_impact: impact }] })
    assert.equal(data.attendance.status, status); assert.equal(data.attendance.timeIn, "07:00:00")
    assert.deepEqual(data.kpis, { totalPresent: 1, totalLate: 1, totalAbsent: 0, totalRfidTaps: 4 })
    assert.equal(data.sms.status, "Sent")
    const Card = load("src/app/(portal)/student/dashboard/components/today-attendance-card.tsx").TodayAttendanceCard
    const html = renderToStaticMarkup(React.createElement(Card, { attendance: data.attendance }))
    assert.match(html, impact === "online_manual" ? /Subject Attendance/ : /No classes today/)
    assert.match(html, /Retained RFID evidence/); assert.match(html, /7:00 AM/); assert.doesNotMatch(html, /second tap/)
  }
})

test("all server dashboard entry points load calendar state at the same Manila boundary and propagate state failures", async () => {
  let failed = false
  const ranges = []
  const server = createSourceLoader({
    "@/features/auth/server": { requireRole: async () => ({ id: "user" }) },
    "@/services/calendar/attendance-state": { fetchCalendarAttendanceState: async (...args) => { ranges.push(args); if (failed) throw Error("Calendar state unavailable"); return calendar } },
    "@/services/attendance/dashboard": { fetchAdminDashboardSnapshot: async () => ({ students, attendance: current, cards: [] }) },
    "@/services/attendance/teacher-dashboard": { fetchTeacherDashboardSnapshot: async () => ({ students, attendance: current, cards: [] }) },
    "@/services/attendance/student-dashboard": { fetchStudentDashboardSnapshot: async () => ({ student: students[0], attendance: null, cards: [], sms: null, history: [{ attendance_date: "2020-01-01", attendance_status: "Present" }] }) },
  })
  const now = new Date("2026-11-04T16:00:00Z")
  for (const [file, method] of [["dashboard", "getAdminDashboardData"], ["teacher-dashboard", "getTeacherDashboardData"], ["student-dashboard", "getStudentDashboardData"]]) {
    const get = server(`src/features/attendance/${file}.ts`)[method]
    failed = false
    assert.equal((await get(now)).today, today)
    assert.equal(ranges.at(-1)[1], today); assert.equal(ranges.at(-1)[2], now)
    if (file === "student-dashboard") assert.equal(ranges.at(-1)[0], "2020-01-01")
    failed = true
    await assert.rejects(() => get(now), /Calendar state unavailable/)
  }
})

test("null KPI/distribution values render a dash and exception strips expose only scoped campuses", () => {
  const renderLoad = createSourceLoader({
    "@/components/motion-primitives/sliding-number": { SlidingNumber: ({ value, suffix = "" }) => React.createElement("span", null, String(value) + suffix) },
    "@/features/attendance/radial-status-chart": { RadialStatusChart: ({ headline }) => React.createElement("div", null, headline) },
  })
  for (const role of ["admin", "teacher"]) {
    const { KpiCards } = renderLoad(`src/app/(portal)/${role}/dashboard/components/kpi-cards.tsx`)
    const html = renderToStaticMarkup(React.createElement(KpiCards, { data: { today, kpis: { totalStudents: 1, totalAssigned: 1, presentToday: 0, lateToday: 0, absentToday: 0, attendanceRate: null, expectedStudents: 0, rfidTapsToday: 1 }, trend: { daily: [{ rate: null }, { rate: 0 }] } } }))
    assert.match(html, /—/); assert.doesNotMatch(html, /null%|NaN|pts/)
    const Chart = renderLoad(`src/app/(portal)/${role}/dashboard/components/attendance-distribution-chart.tsx`).AttendanceDistributionChart
    const chart = renderToStaticMarkup(React.createElement(Chart, { distribution: [{ status: "NoClasses", count: 1 }], attendanceRate: null }))
    assert.match(chart, /—/); assert.doesNotMatch(chart, /0%|NaN/)
  }
  const { CampusStatusStrip } = renderLoad("src/components/calendar/campus-status-strip.tsx")
  const strip = renderToStaticMarkup(React.createElement(CampusStatusStrip, { states: [{ campus: "Main Campus", status: "NoClasses", students: 2 }] }))
  assert.match(strip, /No classes/); assert.match(strip, /Main Campus/); assert.match(strip, /2 students/); assert.doesNotMatch(strip, /MV Campus/)
})
