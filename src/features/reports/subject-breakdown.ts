import type { SubjectAttendanceRow } from "@/features/subject-attendance/model"

type SubjectSession = Pick<SubjectAttendanceRow,
  "schedule_id" | "attendance_date" | "time_start" | "time_end" |
  "course_code" | "course_name" | "teacher_name" | "program_code" |
  "year_level" | "section" | "campus"
>

export function subjectBreakdown(rows: SubjectAttendanceRow[]) {
  const groups = new Map<string, SubjectSession & { key: string; present: number; late: number; absent: number }>()
  for (const row of rows) {
    const session: SubjectSession = {
      schedule_id: row.schedule_id, attendance_date: row.attendance_date,
      time_start: row.time_start, time_end: row.time_end,
      course_code: row.course_code, course_name: row.course_name,
      teacher_name: row.teacher_name, program_code: row.program_code,
      year_level: row.year_level, section: row.section, campus: row.campus,
    }
    const key = JSON.stringify(session)
    const group = groups.get(key) ?? { ...session, key, present: 0, late: 0, absent: 0 }
    if (row.attendance_status === "Present") group.present++
    if (row.attendance_status === "Late") group.late++
    if (row.attendance_status === "Absent") group.absent++
    groups.set(key, group)
  }
  return [...groups.values()].sort((a, b) =>
    b.attendance_date.localeCompare(a.attendance_date) ||
    a.time_start.localeCompare(b.time_start) || a.course_code.localeCompare(b.course_code)
  )
}
