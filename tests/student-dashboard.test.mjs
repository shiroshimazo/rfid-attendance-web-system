import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const student = {
  id: 1, full_name: "Pilot Student", student_id: "S-1",
  year_level: "2nd Year", section: "21001", campus: "Main Campus",
  profile_picture: null,
}
const today = "2026-09-04"
const makeSnapshot = (status) => ({
  student, cards: [], sms: null,
  attendance: status ? {
    id: 1, attendance_status: status, time_in: "06:16:00", time_out: "12:30:00",
  } : null,
  history: status ? [{
    attendance_date: today, attendance_status: status, time_out: "12:30:00",
  }] : [],
})
const load = createSourceLoader({
  "@/features/auth/server": {},
  "@/services/attendance/student-dashboard": {},
  "@/services/attendance/student-attendance": {},
})
const { buildStudentDashboardData, countPersonalAbsentDays } = load("src/features/attendance/student-dashboard.ts")
const { buildStudentAttendanceData } = load("src/features/attendance/student-attendance.ts")
const { schoolDateKey } = load("src/lib/school-time.ts")
const { TodayAttendanceCard } = load("src/app/(portal)/student/dashboard/components/today-attendance-card.tsx")

for (const status of ["Present", "Late", "Excused", "Absent"]) {
  test(`${status}: today's card and history preserve the recorded status`, () => {
    const snapshot = makeSnapshot(status)
    const data = buildStudentDashboardData(snapshot, today)
    const history = buildStudentAttendanceData({
      cards: [], sms: [], records: [{
        ...snapshot.attendance, attendance_date: today,
        campus: student.campus, rfid_card_id: 1,
      }],
    }, today)
    const attended = status === "Present" || status === "Late"
    assert.equal(data.attendance.status, status)
    assert.equal(data.attendance.status, history.rows[0].status)
    assert.equal(data.attendance.timeIn, attended ? "06:16:00" : null)
    assert.equal(data.attendance.timeOut, attended ? "12:30:00" : null)
    assert.equal(data.kpis.totalPresent, attended ? 1 : 0)
    assert.equal(data.kpis.totalLate, status === "Late" ? 1 : 0)
    assert.equal(data.kpis.totalAbsent, status === "Absent" ? 1 : 0)
    assert.equal(data.kpis.totalAbsent, history.kpis.totalAbsent)
    const html = renderToStaticMarkup(createElement(TodayAttendanceCard, { attendance: data.attendance }))
    assert.match(html, new RegExp(`>${status}</span>`))
    assert.doesNotMatch(html, /No tap recorded yet/)
    if (attended) {
      assert.match(html, /6:16 AM/)
      assert.match(html, /12:30 PM/)
    }
  })
}

for (const [name, instant] of [
  ["before class", "2026-09-03T21:00:00Z"],
  ["unscheduled Sunday", "2026-09-06T04:00:00Z"],
]) {
  test(`No record ${name} remains provisional with null times`, () => {
    const date = schoolDateKey(new Date(instant))
    const snapshot = makeSnapshot(null)
    snapshot.history = [{ attendance_date: "2026-09-01", attendance_status: "Late", time_out: null }]
    const data = buildStudentDashboardData(snapshot, date)
    assert.deepEqual(data.attendance, { status: "NoRecord", timeIn: null, timeOut: null })
    assert.equal(data.kpis.totalAbsent, 0)
    assert.equal(data.kpis.totalPresent, 1)
    const html = renderToStaticMarkup(createElement(TodayAttendanceCard, { attendance: data.attendance }))
    assert.match(html, /No tap recorded yet/)
    assert.match(html, /Absence is finalized by school policy, not by a missing tap/)
    assert.doesNotMatch(html, />Absent<|second tap/)
  })
}

test("empty history has no absences, and loading still renders", () => {
  const data = buildStudentDashboardData(makeSnapshot(null), today)
  assert.equal(data.attendance.status, "NoRecord")
  assert.deepEqual(data.kpis, { totalPresent: 0, totalLate: 0, totalAbsent: 0, totalRfidTaps: 0 })
  const { DashboardSkeleton } = load("src/app/(portal)/student/dashboard/components/dashboard-skeleton.tsx")
  assert.match(renderToStaticMarkup(createElement(DashboardSkeleton)), /aria-busy="true"/)
})

test("only stored absences through today count; gaps, Excused and future records do not", () => {
  const history = [
    ["2026-08-28", "Present"], ["2026-08-29", "Absent"],
    ["2026-09-01", "Excused"], ["2026-09-02", "Late"],
    [today, "Absent"], [today, "Absent"], ["2026-09-07", "Absent"],
  ].map(([attendance_date, attendance_status]) => ({ attendance_date, attendance_status }))
  assert.equal(countPersonalAbsentDays(history, today), 2)
  assert.equal(countPersonalAbsentDays([], today), 0)
  assert.equal(countPersonalAbsentDays([{ attendance_date: today, attendance_status: "NoRecord" }], today), 0)
})

test("a first tap preserves its status and the second-tap hint until time out", () => {
  for (const status of ["Present", "Late"]) {
    const snapshot = makeSnapshot(status)
    snapshot.attendance.time_out = null
    const data = buildStudentDashboardData(snapshot, today)
    assert.deepEqual(data.attendance, { status, timeIn: "06:16:00", timeOut: null })
    assert.match(renderToStaticMarkup(createElement(TodayAttendanceCard, { attendance: data.attendance })), /second tap/)
  }
})

test("Manila midnight and year boundaries are independent of the host timezone", () => {
  assert.equal(schoolDateKey(new Date("2026-09-03T15:59:59Z")), "2026-09-03")
  assert.equal(schoolDateKey(new Date("2026-09-03T16:00:00Z")), today)
  assert.equal(schoolDateKey(new Date("2026-12-31T16:00:00Z")), "2027-01-01")
})

test("dashboard query and history aggregation use the same Manila date", async () => {
  let query
  const serverLoad = createSourceLoader({
    "@/features/auth/server": { requireRole: async (role) => {
      assert.equal(role, "student")
      return { id: "student-user" }
    } },
    "@/services/attendance/student-dashboard": { fetchStudentDashboardSnapshot: async (input) => {
      query = input
      return makeSnapshot(null)
    } },
    "@/services/attendance/student-attendance": { fetchStudentAttendanceSnapshot: async () => ({ records: [], cards: [], sms: [] }) },
  })
  const now = new Date("2026-09-03T16:00:00Z")
  const dashboard = await serverLoad("src/features/attendance/student-dashboard.ts").getStudentDashboardData(now)
  const history = await serverLoad("src/features/attendance/student-attendance.ts").getStudentAttendanceData(now)
  assert.deepEqual(query, { authUserId: "student-user", date: today })
  assert.equal(dashboard.today, today)
  assert.equal(history.today, today)
})
