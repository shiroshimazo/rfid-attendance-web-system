import { requireRole } from "@/features/auth/server"
import type { ProgramOption } from "@/features/teachers/directory"
import {
  fetchTeacherAttendanceSnapshot,
  type AttendanceStatus,
  type TeacherAttendanceSnapshot,
} from "@/services/attendance/teacher-attendance"
import type { AttendancePanelQuery } from "@/services/attendance/panel"

export * from "@/features/attendance/schema"
export type {
  AttendancePanelQuery,
  AttendanceStatus,
  TeacherAttendanceSnapshot,
  ProgramOption,
}
export type { StudentRfidStatus } from "@/features/attendance/dashboard"
import type { StudentRfidStatus } from "@/features/attendance/dashboard"

export interface TeacherAttendancePanelKpis {
  totalAssigned: number
  /** Present includes late arrivals; both mean the student tapped in. */
  present: number
  late: number
  absent: number
}

export interface TeacherAttendancePanelRow {
  id: number
  studentId: string
  name: string
  programCode: string
  programName: string
  yearLevel: string
  section: string
  status: AttendanceStatus
  timeIn: string | null
  timeOut: string | null
  rfidStatus: StudentRfidStatus
}

export interface TeacherAttendancePanelOptions {
  programs: ProgramOption[]
  yearLevels: string[]
  sections: string[]
}

export interface TeacherAttendancePanelData {
  date: string
  query: AttendancePanelQuery
  kpis: TeacherAttendancePanelKpis
  rows: TeacherAttendancePanelRow[]
  cohortSize: number
  options: TeacherAttendancePanelOptions
  hasStudents: boolean
}

/** Present and Late both mean the student physically tapped in. */
function isAttended(status: AttendanceStatus) {
  return status === "Present" || status === "Late"
}

function distinctSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true })
  )
}

function matchesSearch(
  student: TeacherAttendanceSnapshot["students"][number],
  needle: string
) {
  if (!needle) return true

  const haystacks = [student.full_name, student.student_id].map((value) =>
    value.toLowerCase()
  )

  return haystacks.some((haystack) => haystack.includes(needle))
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildTeacherAttendancePanelData(
  snapshot: TeacherAttendanceSnapshot,
  query: AttendancePanelQuery
): TeacherAttendancePanelData {
  const { students, attendance, cards, programs } = snapshot
  const date = snapshot.date
  const needle = query.search.trim().toLowerCase()

  const recordsByStudent = new Map(
    attendance
      .filter((record) => record.attendance_date === date)
      .map((record) => [record.student_id, record])
  )

  const rfidByStudent = new Map<number, StudentRfidStatus>()

  for (const card of cards) {
    // An active card always wins over a lost or deactivated one.
    if (rfidByStudent.get(card.student_id) === "Active") continue
    rfidByStudent.set(card.student_id, card.card_status)
  }

  const cohort: TeacherAttendancePanelRow[] = students
    .filter((student) => {
      if (query.programId !== null && student.program_id !== query.programId) {
        return false
      }
      if (query.yearLevel !== null && student.year_level !== query.yearLevel) {
        return false
      }
      if (query.section !== null && student.section !== query.section) {
        return false
      }

      return matchesSearch(student, needle)
    })
    .map((student) => {
      const record = recordsByStudent.get(student.id)

      return {
        id: student.id,
        studentId: student.student_id,
        name: student.full_name,
        programCode: student.program?.program_code ?? "—",
        programName: student.program?.program_name ?? "Unknown program",
        yearLevel: student.year_level,
        section: student.section,
        status: record?.attendance_status ?? "Absent",
        timeIn: record?.time_in ?? null,
        timeOut: record?.time_out ?? null,
        rfidStatus: rfidByStudent.get(student.id) ?? "Unassigned",
      }
    })

  const totalAssigned = cohort.length
  const present = cohort.filter((row) => isAttended(row.status)).length
  const late = cohort.filter((row) => row.status === "Late").length
  const excused = cohort.filter((row) => row.status === "Excused").length

  return {
    date,
    query: { ...query, date },
    kpis: {
      totalAssigned,
      present,
      late,
      absent: Math.max(0, totalAssigned - present - excused),
    },
    rows:
      query.status === "all"
        ? cohort
        : cohort.filter((row) => row.status === query.status),
    cohortSize: totalAssigned,
    options: {
      programs: programs.map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
      yearLevels: distinctSorted(
        students.map((student) => student.year_level)
      ),
      sections: distinctSorted(students.map((student) => student.section)),
    },
    hasStudents: students.length > 0,
  }
}

/** Server-side entry point used by the teacher attendance route. */
export async function getTeacherAttendancePanelData(
  query: AttendancePanelQuery
): Promise<TeacherAttendancePanelData> {
  const account = await requireRole("teacher")
  const snapshot = await fetchTeacherAttendanceSnapshot({
    authUserId: account.id,
    date: query.date,
  })

  return buildTeacherAttendancePanelData(snapshot, query)
}
