import type { AccountStatus } from "@/features/teachers/directory"

/** `day_of_week` is stored 0-6 with Sunday first, matching Postgres `dow`. */
export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

export function weekdayLabel(day: number) {
  return weekdays[day] ?? "—"
}

export interface SubjectAttendanceRow {
  id: number
  schedule_id: number
  student_id: number
  attendance_date: string
  attendance_status: "Present" | "Late" | "Absent"
  time_start: string
  time_end: string
  student_number: string
  student_name: string
  teacher_name: string
  course_code: string
  course_name: string
  program_code: string
  year_level: string
  section: string
  campus: string
  confirmed_at: string
}

export interface SubjectSchedule {
  id: number
  program_id: number
  teacher_id: number
  course_id: number
  year_level: string
  section: string
  campus: string
  day_of_week: number
  time_start: string
  time_end: string
  status: AccountStatus
  course: { course_code: string; course_name: string } | null
  teacher: { full_name: string } | null
}

export interface SubjectStudent {
  id: number
  student_id: string
  full_name: string
  program_id: number
  year_level: string
  section: string
  campus: string
}

export function belongsToSubject(student: SubjectStudent, schedule: SubjectSchedule) {
  return student.program_id === schedule.program_id && student.year_level === schedule.year_level &&
    student.section === schedule.section && student.campus === schedule.campus
}

/** Each row is one confirmed student/session, never one physical RFID tap. */
export function subjectTotals(rows: SubjectAttendanceRow[]) {
  const present = rows.filter(row => row.attendance_status === "Present").length
  const late = rows.filter(row => row.attendance_status === "Late").length
  const absent = rows.filter(row => row.attendance_status === "Absent").length
  const confirmed = present + late + absent
  return { present, late, absent, confirmed, rate: confirmed ? (present + late) / confirmed * 100 : null }
}

export const subjectAttendancePolicy = "Subject attendance is teacher-confirmed as Present, Late or Absent. Campus taps leave subject sessions unconfirmed. A teacher confirmation creates no RFID time-in/time-out or scans. Rates use confirmed (Present + Late) / (Present + Late + Absent) student-sessions; unconfirmed sessions are excluded."
