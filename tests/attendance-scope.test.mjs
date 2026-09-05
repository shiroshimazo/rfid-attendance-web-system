import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const mocks = Object.fromEntries([
  "auth/server", "attendance/dashboard", "attendance/teacher-dashboard",
  "attendance/panel", "attendance/teacher-attendance", "attendance/student-dashboard",
  "attendance/student-attendance", "students/teacher-directory",
  "reports/snapshot", "reports/teacher-snapshot",
].map(path => [path === "auth/server" ? `@/features/${path}` : `@/services/${path}`, {}]))
const load = createSourceLoader(mocks)
const schema = load("src/features/attendance/schema.ts")
const date = "2026-09-04"
const students = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1, student_id: `S-${index + 1}`, full_name: `Student ${index + 1}`,
  program_id: 1, year_level: "2nd Year", section: "21001", campus: "Main Campus",
  program: { program_code: "BSIT", program_name: "Information Technology" },
}))
// The retired value is deliberately confined to compatibility fixtures.
const attendance = ["Present", "Late", "Absent", "Excused"].map((status, index) => ({
  id: index + 1, student_id: index + 1, attendance_status: status,
  attendance_date: date, time_in: "06:16:00", time_out: "12:30:00",
  campus: "Main Campus", rfid_card_id: index + 1,
}))
const snapshot = { students, attendance, cards: [], rfidCards: [],
  programs: [{ id: 1, program_code: "BSIT" }], placements: [], date }
const query = { date, status: "all", programId: null, yearLevel: null, section: null, search: "" }

test("active status filters accept only the approved contract and existing no-tap filter", () => {
  assert.deepEqual(schema.attendanceStatuses, ["Present", "Late", "Absent"])
  assert.deepEqual(schema.attendanceRowStatuses, ["Present", "Late", "Absent", "NoRecord"])
  assert.equal(schema.parseAttendancePanelQuery({ status: "Excused" }).status, "all")
  assert.equal(schema.parseAttendancePanelQuery({ status: "LegacyRecord" }).status, "all")
})

for (const role of ["admin", "teacher"]) {
  test(`${role}: legacy rows remain visible without an active status, chart slice, or attendance count`, () => {
    const featureName = role === "admin" ? "dashboard" : "teacher-dashboard"
    const build = load(`src/features/attendance/${featureName}.ts`)[role === "admin" ? "buildAdminDashboardData" : "buildTeacherDashboardData"]
    const data = build(structuredClone(snapshot), date)
    assert.deepEqual(data.students.map(row => row.status), ["Present", "Late", "Absent", "LegacyRecord", "NoRecord"])
    assert.equal(data.students[3].timeIn, "06:16:00")
    assert.equal(data.kpis.presentToday, 2)
    assert.equal(data.kpis.absentToday, 1)
    assert(Math.abs(data.kpis.attendanceRate - 200 / 3) < 1e-10)
    assert(!("excusedToday" in data.kpis))
    assert(data.distribution.every(slice => ["Present", "Late", "Absent", "NoRecord"].includes(slice.status)))
    if (role === "admin") assert.equal(data.kpis.rfidTapsToday, 6)
  })

  test(`${role}: reports count recorded absences without turning legacy or missing rows into absences`, () => {
    const featureName = role === "admin" ? "panel" : "teacher-panel"
    const build = load(`src/features/reports/${featureName}.ts`)[role === "admin" ? "buildReportsData" : "buildTeacherReportsData"]
    const options = { fromDate: date, toDate: date, generatedAt: new Date(`${date}T08:00:00Z`) }
    const data = build(structuredClone(snapshot), options)
    assert.equal(data.kpis.totalPresent, 2)
    assert.equal(data.kpis.totalAbsent, 1)
    assert.equal(data.bySection[0].absent, 1)
    assert(Math.abs(data.bySection[0].rate - 200 / 3) < 1e-10)
    assert.deepEqual(data.distribution.map(slice => slice.status), ["Present", "Late", "Absent"])
    assert.equal(data.summary[0].absent, 1)
    if (role === "admin") {
      assert.equal(data.recentLogs.find(row => row.id === 4).status, "LegacyRecord")
      assert.equal(data.kpis.rfidScans, 3)
    }
    const legacyOnly = build({ ...snapshot, attendance: [attendance[3]] }, options)
    assert.equal(legacyOnly.kpis.totalPresent, 0)
    assert.equal(legacyOnly.kpis.totalAbsent, 0)
    assert.equal(legacyOnly.sessionDays, 0)
    assert.equal(legacyOnly.bySection[0].rate, 0)
    const noRecords = build({ ...snapshot, attendance: [] }, options)
    assert.equal(noRecords.kpis.totalAbsent, 0)
    assert.equal(noRecords.bySection[0].rate, 0)
  })
}

test("attendance panels and teacher directory preserve legacy record identity and times", () => {
  const admin = load("src/features/attendance/panel.ts").buildAttendancePanelData({ ...snapshot, query }, date)
  const teacher = load("src/features/attendance/teacher-attendance.ts").buildTeacherAttendancePanelData(snapshot, query)
  const directory = load("src/features/students/teacher-directory.ts").buildTeacherStudentsData(snapshot)
  for (const rows of [admin.rows, teacher.rows, directory.students]) {
    assert.equal(rows[3].status, "LegacyRecord")
    assert.equal(rows[3].timeIn, "06:16:00")
    assert.equal(rows[3].timeOut, "12:30:00")
  }
  assert.equal(admin.kpis.absent, 1)
  assert.equal(teacher.kpis.absent, 1)
})

test("student history retains legacy rows and SMS without treating them as attendance or scans", () => {
  const legacy = attendance[3]
  const dashboard = load("src/features/attendance/student-dashboard.ts").buildStudentDashboardData({
    student: students[3], attendance: legacy, history: [legacy], cards: [], sms: null,
  }, date)
  const history = load("src/features/attendance/student-attendance.ts").buildStudentAttendanceData({
    records: [legacy], cards: [], sms: [{ attendance_id: legacy.id, sms_status: "Sent", sent_at: `${date}T00:00:00Z` }],
  }, date)
  assert.equal(dashboard.attendance.status, "LegacyRecord")
  assert.equal(dashboard.attendance.timeIn, legacy.time_in)
  assert.equal(dashboard.kpis.totalRfidTaps, 0)
  assert.equal(history.rows[0].status, "LegacyRecord")
  assert.equal(history.rows[0].smsStatus, "Sent")
  assert.equal(history.kpis.totalPresent, 0)
  assert.equal(history.kpis.totalAbsent, 0)
  assert.equal(history.kpis.attendanceRate, 0)
  const { AttendanceStatusBadge } = load("src/components/attendance-status-badge.tsx")
  const html = renderToStaticMarkup(createElement(AttendanceStatusBadge, { status: history.rows[0].status }))
  assert.match(html, /Historical record/)
  assert.doesNotMatch(html, /Excused|>Absent<|>Present</)
  const { TodayAttendanceCard } = load("src/app/(portal)/student/dashboard/components/today-attendance-card.tsx")
  const cardHtml = renderToStaticMarkup(createElement(TodayAttendanceCard, {
    attendance: { ...dashboard.attendance, timeOut: null },
  }))
  assert.match(cardHtml, /Historical record/)
  assert.doesNotMatch(cardHtml, /second tap/)
  assert.equal(legacy.attendance_status, "Excused")
})
