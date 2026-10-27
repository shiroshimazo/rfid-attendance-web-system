import { isAttendanceStatus, type AttendanceDisplayStatus } from "@/features/attendance/status"
import { createCalendarAttendanceResolver, summarizeCalendarAttendance, buildCalendarAttendanceTrend, type CalendarAttendanceInputs, type CalendarAttendanceState, type CalendarStudentDay } from "@/features/calendar/attendance-state"

export type DashboardAttendanceStatus = AttendanceDisplayStatus
export interface CampusAttendanceState {
  campus: string
  status: "NoClasses" | "OnlineManual"
  students: number
}

export function buildDashboardCalendar(
  students: { id: number; campus: string }[],
  attendance: { student_id: number; attendance_date: string; attendance_status: string }[],
  today: string,
  calendar?: CalendarAttendanceInputs,
) {
  const resolve = createCalendarAttendanceResolver({ effectiveDays: calendar?.effectiveDays ?? [], marks: calendar?.marks ?? [], today })
  const byId = new Map(students.map(student => [student.id, student]))
  const todayRecords = new Map(attendance.filter(record => record.attendance_date === today).map(record => [record.student_id, record]))
  const todayDays = students.map(student => ({ student_id: student.id, campus: student.campus, attendance_date: today, attendance_status: todayRecords.get(student.id)?.attendance_status }))
  const todayStates = new Map<number, CalendarAttendanceState>()
  const campuses = new Map<string, CampusAttendanceState>()
  for (const student of students) {
    const state = resolve(student.id, student.campus, today)
    todayStates.set(student.id, state)
    if (state.status !== "Normal") {
      const campus = campuses.get(state.campus) ?? { campus: state.campus, status: state.status, students: 0 }
      campus.students++; campuses.set(state.campus, campus)
    }
  }
  const history = new Map<string, Map<number, CalendarStudentDay>>()
  function add(day: CalendarStudentDay) {
    const date = history.get(day.attendance_date) ?? new Map<number, CalendarStudentDay>()
    if (!date.has(day.student_id)) date.set(day.student_id, day)
    history.set(day.attendance_date, date)
  }
  for (const record of attendance) {
    const student = byId.get(record.student_id)
    if (student && record.attendance_date < today && isAttendanceStatus(record.attendance_status)) add({ ...record, campus: student.campus })
  }
  for (const mark of calendar?.marks ?? []) {
    if (byId.has(mark.student_id) && mark.attendance_date < today) add({ ...mark, attendance_status: null })
  }
  for (const day of todayDays) add(day)
  const trendDays = [...history.values()].flatMap(date => [...date.values()])
  const counts = summarizeCalendarAttendance(todayDays, resolve)
  const distribution: { status: DashboardAttendanceStatus; count: number }[] = [
    { status: "Present", count: counts.present - counts.late }, { status: "Late", count: counts.late },
    { status: "Absent", count: counts.absent }, { status: "NoRecord", count: counts.noRecord },
    { status: "NoClasses", count: counts.noClasses }, { status: "OnlineManual", count: counts.onlineManual },
  ]
  return { today, counts, todayStates, todayDays, resolve,
    trend: buildCalendarAttendanceTrend(trendDays, resolve),
    distribution: distribution.filter(slice => slice.count > 0 || slice.status === "Present" || slice.status === "Absent"),
    campusStates: [...campuses.values()].sort((a, b) => a.campus.localeCompare(b.campus)),
    hasHistory: trendDays.some(day => day.attendance_status || resolve(day.student_id, day.campus, day.attendance_date).status !== "Normal"),
  }
}
