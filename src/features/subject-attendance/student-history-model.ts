import type { SubjectAttendanceRow } from "@/features/subject-attendance/model"

export interface SubjectHistoryFilters {
  search: string
  from: string
  to: string
  subject: string
  result: string
  campus: string
  teacher: string
}
export const emptySubjectFilters: SubjectHistoryFilters = { search: "", from: "", to: "", subject: "", result: "", campus: "", teacher: "" }
export type SubjectHistorySort = "date" | "subject" | "student" | "placement" | "result"

export function filterSubjectHistory(rows: SubjectAttendanceRow[], filters: SubjectHistoryFilters, sort: SubjectHistorySort, direction: "asc" | "desc") {
  const needle = filters.search.trim().toLowerCase()
  return rows.filter(row =>
    (!filters.from || row.attendance_date >= filters.from) &&
    (!filters.to || row.attendance_date <= filters.to) &&
    (!filters.subject || row.course_code === filters.subject) &&
    (!filters.result || row.attendance_status === filters.result) &&
    (!filters.campus || row.campus === filters.campus) &&
    (!filters.teacher || row.teacher_name === filters.teacher) &&
    (!needle || [row.student_name, row.student_number, row.course_code, row.course_name, row.teacher_name, row.section, row.campus, row.program_code, row.year_level].some(value => value.toLowerCase().includes(needle)))
  ).sort((a, b) => {
    const value = (row: SubjectAttendanceRow) => sort === "date" ? `${row.attendance_date} ${row.time_start}` : sort === "subject" ? `${row.course_code} ${row.teacher_name}` : sort === "student" ? row.student_name : sort === "placement" ? `${row.program_code} ${row.year_level} ${row.section} ${row.campus}` : row.attendance_status
    return (value(a).localeCompare(value(b), undefined, { numeric: true }) || a.id - b.id) * (direction === "asc" ? 1 : -1)
  })
}
