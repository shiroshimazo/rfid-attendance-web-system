import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const today = "2026-09-04"
const statuses = ["Present", "Late", "Absent", "NoRecord"]
const students = statuses.map((status, index) => ({
  id: index + 1, student_id: `S-${index + 1}`, full_name: status,
  year_level: "2nd Year", section: "21001", program_id: 1,
  program: { program_code: "BSIT", program_name: "Information Technology" },
}))
const record = (student_id, attendance_status, attendance_date = today) => ({
  student_id, attendance_status, attendance_date,
  time_in: "06:16:00", time_out: "12:30:00",
})
const load = createSourceLoader({
  "@/features/auth/server": {},
  "@/services/attendance/dashboard": {},
  "@/services/attendance/teacher-dashboard": {},
})
const builders = [
  ["admin", load("src/features/attendance/dashboard.ts").buildAdminDashboardData],
  ["teacher", load("src/features/attendance/teacher-dashboard.ts").buildTeacherDashboardData],
]

for (const [role, build] of builders) {
  test(`${role}: recorded statuses and provisional rows agree with KPIs and charts`, () => {
    const attendance = statuses.slice(0, 3).map((status, index) => record(index + 1, status))
    const data = build({ students, attendance, cards: [] }, today)
    assert.deepEqual(data.students.map(row => row.status), statuses)
    assert.equal(data.students[3].timeIn, null)
    assert.equal(data.students[3].timeOut, null)
    assert.equal(data.students[1].timeIn, "06:16:00")
    assert.equal(data.students[1].timeOut, "12:30:00")
    assert.equal(data.kpis.presentToday, 2)
    assert.equal(data.kpis.lateToday, 1)
    assert.equal(data.kpis.absentToday, 1)
    assert(Math.abs(data.kpis.attendanceRate - 200 / 3) < 1e-10)
    assert.deepEqual(data.distribution, statuses.map(status => ({ status, count: 1 })))
    for (const points of Object.values(data.trend)) {
      assert.equal(points[0].present, 2)
      assert.equal(points[0].absent, 1)
      assert.equal(points[0].rate, data.kpis.attendanceRate)
    }
    if (role === "admin") {
      for (const groups of [data.byProgram, data.byYearLevel, data.bySection]) {
        assert.equal(groups[0].absent, 1)
        assert.equal(groups[0].rate, data.kpis.attendanceRate)
        assert.equal(groups[0].total, 4)
      }
    }
  })

  test(`${role}: no taps before class or on an unscheduled day never become absences`, () => {
    for (const date of [today, "2026-09-06"]) {
      const data = build({ students, attendance: [], cards: [] }, date)
      assert(data.students.every(row => row.status === "NoRecord"))
      assert.equal(data.kpis.absentToday, 0)
      assert.equal(data.kpis.attendanceRate, 0)
      assert.equal(data.distribution.find(slice => slice.status === "NoRecord").count, 4)
      for (const points of Object.values(data.trend)) {
        assert.equal(points[0].absent, 0)
        assert.equal(points[0].rate, 0)
      }
    }
  })

  test(`${role}: past gaps, future records and students outside the roster are excluded`, () => {
    const data = build({ students, cards: [], attendance: [
      record(1, "Late", "2026-09-01"),
      record(2, "Absent", "2026-09-02"),
      record(3, "Absent", "2026-09-07"),
      record(999, "Absent"),
    ] }, today)
    assert.equal(data.kpis.absentToday, 0)
    assert.equal(data.distribution.find(slice => slice.status === "NoRecord").count, 4)
    assert.equal(data.trend.daily.reduce((sum, point) => sum + point.absent, 0), 1)
    assert(!data.trend.daily.some(point => point.key > today))
  })

  test(`${role}: empty roster has finite zero totals`, () => {
    const data = build({ students: [], attendance: [], cards: [] }, today)
    assert.equal(data.kpis.attendanceRate, 0)
    assert.equal(data.kpis.absentToday, 0)
    assert.equal(data.distribution.reduce((sum, slice) => sum + slice.count, 0), 0)
  })
}

test("shared badge renders readable labels for all four current display states", () => {
  const { AttendanceStatusBadge } = load("src/components/attendance-status-badge.tsx")
  for (const status of statuses) {
    const html = renderToStaticMarkup(createElement(AttendanceStatusBadge, { status }))
    const label = status === "NoRecord" ? "No tap recorded yet" : status
    assert.match(html, new RegExp(`>${label}</span>`))
  }
})

test("admin and teacher query the same Manila date at midnight", async () => {
  const queries = []
  const serverLoad = createSourceLoader({
    "@/features/auth/server": { requireRole: async () => ({ id: "teacher-user" }) },
    "@/services/attendance/dashboard": { fetchAdminDashboardSnapshot: async (input) => {
      queries.push(input)
      return { students: [], attendance: [], cards: [] }
    } },
    "@/services/attendance/teacher-dashboard": { fetchTeacherDashboardSnapshot: async (input) => {
      queries.push(input)
      return { students: [], attendance: [], cards: [] }
    } },
  })
  const now = new Date("2026-09-03T16:00:00Z")
  const admin = await serverLoad("src/features/attendance/dashboard.ts").getAdminDashboardData(now)
  const teacher = await serverLoad("src/features/attendance/teacher-dashboard.ts").getTeacherDashboardData(now)
  assert.equal(admin.today, today)
  assert.equal(teacher.today, today)
  assert.equal(queries[0].toDate, today)
  assert.equal(queries[1].toDate, today)
  assert.equal(queries[0].fromDate, queries[1].fromDate)
})
