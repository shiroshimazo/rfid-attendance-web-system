import { createCalendarAttendanceResolver, type CalendarAttendanceInputs } from "@/features/calendar/attendance-state"
import type { ReportStudentRow, ReportAttendanceRow } from "@/services/reports/snapshot"

export interface ReportExceptionDay {
  studentId: number
  date: string
  campus: string
  status: "NoClasses" | "OnlineManual"
}
export interface ReportCalendarException {
  date: string
  campus: string
  status: "NoClasses" | "OnlineManual"
  students: number
}

export function buildReportCalendar(students: ReportStudentRow[], attendance: ReportAttendanceRow[], from: string, to: string, calendar: CalendarAttendanceInputs) {
  const resolve = createCalendarAttendanceResolver(calendar)
  const byId = new Map(students.map(student => [student.id, student]))
  const campuses = new Map<string, ReportStudentRow[]>()
  for (const student of students) {
    if ((student.status ?? "active") !== "active") continue
    const roster = campuses.get(student.campus) ?? []
    roster.push(student); campuses.set(student.campus, roster)
  }
  const days = new Map<string, ReportExceptionDay>()
  function add(studentId: number, campus: string, date: string) {
    if (date < from || date > to) return
    const state = resolve(studentId, campus, date)
    if (state.status !== "Normal") days.set(`${studentId}:${date}`, { studentId, date, campus: state.campus, status: state.status })
  }
  for (const mark of calendar.marks) if (mark.attendance_date < calendar.today && byId.has(mark.student_id)) add(mark.student_id, mark.campus, mark.attendance_date)
  for (const record of attendance) {
    const student = byId.get(record.student_id)
    if (student) add(student.id, student.campus, record.attendance_date)
  }
  for (const day of calendar.effectiveDays) {
    if (day.attendance_date < calendar.today || day.attendance_date < from || day.attendance_date > to) continue
    for (const student of campuses.get(day.campus) ?? []) add(student.id, student.campus, day.attendance_date)
  }
  const groups = new Map<string, ReportCalendarException>()
  for (const day of days.values()) {
    const key = JSON.stringify([day.date, day.campus, day.status])
    const group = groups.get(key) ?? { date: day.date, campus: day.campus, status: day.status, students: 0 }
    group.students++; groups.set(key, group)
  }
  return { resolve, days: [...days.values()], exceptions: [...groups.values()].sort((a, b) => a.date.localeCompare(b.date) || a.campus.localeCompare(b.campus) || a.status.localeCompare(b.status)) }
}
