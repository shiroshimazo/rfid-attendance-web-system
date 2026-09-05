import { recordStatus, type AttendanceRowStatus } from "@/features/attendance/schema"
import type { ProgramOption } from "@/features/teachers/directory"
import {
  fetchAttendancePanelSnapshot,
  type AttendancePanelQuery,
  type AttendancePanelSnapshot,
} from "@/services/attendance/panel"

export * from "@/features/attendance/schema"
export type { AttendancePanelSnapshot, ProgramOption }

export interface AttendancePanelKpis {
  totalStudents: number
  /** Present includes late arrivals; both mean the student tapped in. */
  present: number
  late: number
  /** Stored absences only; a student with no record yet is not one. */
  absent: number
  /** Students with no record for the date, who may still tap in. */
  noRecord: number
}

export interface AttendancePanelRow {
  id: number
  studentId: string
  name: string
  programCode: string
  programName: string
  yearLevel: string
  section: string
  status: AttendanceRowStatus
  timeIn: string | null
  timeOut: string | null
}

export interface AttendancePanelOptions {
  programs: ProgramOption[]
  yearLevels: string[]
  sections: string[]
}

export interface AttendancePanelData {
  date: string
  query: AttendancePanelQuery
  kpis: AttendancePanelKpis
  rows: AttendancePanelRow[]
  cohortSize: number
  options: AttendancePanelOptions
  hasStudents: boolean
}

function isAttended(status: AttendanceRowStatus) {
  return status === "Present" || status === "Late"
}

function distinctSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true })
  )
}

export function buildAttendancePanelData(
  snapshot: AttendancePanelSnapshot,
  date: string
): AttendancePanelData {
  const { query, students, attendance, programs, placements } = snapshot

  const recordsByStudent = new Map(
    attendance
      .filter((record) => record.attendance_date === date)
      .map((record) => [record.student_id, record])
  )

  const cohort: AttendancePanelRow[] = students.map((student) => {
    const record = recordsByStudent.get(student.id)

    return {
      id: student.id,
      studentId: student.student_id,
      name: student.full_name,
      programCode: student.program?.program_code ?? "—",
      programName: student.program?.program_name ?? "Unknown program",
      yearLevel: student.year_level,
      section: student.section,
      status: record ? recordStatus(record.attendance_status) : "NoRecord",
      timeIn: record?.time_in ?? null,
      timeOut: record?.time_out ?? null,
    }
  })

  const totalStudents = cohort.length
  const present = cohort.filter((row) => isAttended(row.status)).length
  const late = cohort.filter((row) => row.status === "Late").length
  const absent = cohort.filter((row) => row.status === "Absent").length
  const noRecord = cohort.filter((row) => row.status === "NoRecord").length

  return {
    date,
    query: { ...query, date },
    kpis: {
      totalStudents,
      present,
      late,
      absent,
      noRecord,
    },
    rows:
      query.status === "all"
        ? cohort
        : cohort.filter((row) => row.status === query.status),
    cohortSize: totalStudents,
    options: {
      programs: programs.map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
      yearLevels: distinctSorted(
        placements.map((placement) => placement.year_level)
      ),
      sections: distinctSorted(
        placements.map((placement) => placement.section)
      ),
    },
    hasStudents: placements.length > 0,
  }
}

export async function getAttendancePanelData(
  query: AttendancePanelQuery
): Promise<AttendancePanelData> {
  const snapshot = await fetchAttendancePanelSnapshot(query)

  return buildAttendancePanelData(snapshot, query.date)
}
