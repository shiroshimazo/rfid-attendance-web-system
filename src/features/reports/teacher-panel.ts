import { format, parseISO } from "date-fns"

import { isAttendanceStatus } from "@/features/attendance/status"
import { requireRole } from "@/features/auth/server"
import {
  formatRangeLabel,
  parseReportsRange,
  type ReportsRange,
  type ReportsSearchParams,
} from "@/features/reports/panel"
import {
  fetchTeacherReportsSnapshot,
  type AttendanceStatus,
  type TeacherReportStudentRow,
  type TeacherReportsSnapshot,
} from "@/services/reports/teacher-snapshot"

export { formatRangeLabel, parseReportsRange }
export type { AttendanceStatus, ReportsRange, ReportsSearchParams }

export interface TeacherReportsBuildOptions {
  fromDate: string
  toDate: string
  generatedAt: Date
}

export interface TeacherReportsKpis {
  totalAssigned: number
  totalPresent: number
  totalAbsent: number
  /** Percentage in the 0-100 range. */
  attendanceRate: number
}

export interface TeacherSummaryPoint {
  date: string
  label: string
  present: number
  absent: number
}

export interface TeacherStatusSlice {
  status: AttendanceStatus
  count: number
}

export interface TeacherSectionBreakdown {
  key: string
  program: string
  yearLevel: string
  section: string
  total: number
  present: number
  absent: number
  rate: number
}

export interface TeacherReportsData {
  range: ReportsRange
  rangeLabel: string
  generatedAtLabel: string
  sessionDays: number
  kpis: TeacherReportsKpis
  summary: TeacherSummaryPoint[]
  distribution: TeacherStatusSlice[]
  bySection: TeacherSectionBreakdown[]
}

/** Present and Late both mean the student physically tapped in. */
function isAttended(status: string) {
  return status === "Present" || status === "Late"
}

function rateOf(present: number, expected: number) {
  return expected > 0 ? (present / expected) * 100 : 0
}

interface Tally {
  present: number
  absent: number
}

function emptyTally(): Tally {
  return { present: 0, absent: 0 }
}

function compareGroupLabels(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true })
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildTeacherReportsData(
  snapshot: TeacherReportsSnapshot,
  { fromDate, toDate, generatedAt }: TeacherReportsBuildOptions
): TeacherReportsData {
  const { students, attendance, programs } = snapshot

  const studentsById = new Map(students.map((student) => [student.id, student]))
  const programsById = new Map(programs.map((program) => [program.id, program]))

  const scoped = attendance.filter((record) =>
    studentsById.has(record.student_id)
  )

  const currentRecords = scoped.filter((record) =>
    isAttendanceStatus(record.attendance_status)
  )

  const sessionDates = [
    ...new Set(currentRecords.map((record) => record.attendance_date)),
  ].sort()
  const sessionDays = sessionDates.length
  const totalAssigned = students.length

  const talliesByStudent = new Map<number, Tally>()
  const talliesByDate = new Map<string, Tally>()

  let presentCount = 0
  let lateCount = 0
  let absentCount = 0

  for (const record of currentRecords) {
    const attended = isAttended(record.attendance_status)
    const absent = record.attendance_status === "Absent"

    if (record.attendance_status === "Present") presentCount += 1
    if (record.attendance_status === "Late") lateCount += 1
    if (absent) absentCount += 1

    const studentTally = talliesByStudent.get(record.student_id) ?? emptyTally()
    const dateTally = talliesByDate.get(record.attendance_date) ?? emptyTally()

    if (attended) {
      studentTally.present += 1
      dateTally.present += 1
    }
    if (absent) {
      studentTally.absent += 1
      dateTally.absent += 1
    }

    talliesByStudent.set(record.student_id, studentTally)
    talliesByDate.set(record.attendance_date, dateTally)
  }

  const totalPresent = presentCount + lateCount
  // Match current dashboards without inferring absences from missing/legacy rows.
  const totalAbsent = absentCount

  const summary: TeacherSummaryPoint[] = sessionDates.map((date) => {
    const tally = talliesByDate.get(date) ?? emptyTally()

    return {
      date,
      label: format(parseISO(date), "MMM d"),
      present: tally.present,
      absent: tally.absent,
    }
  })

  const programCodeOf = (student: TeacherReportStudentRow) =>
    programsById.get(student.program_id)?.program_code ?? "Unassigned"

  const sectionGroups = new Map<
    string,
    {
      program: string
      yearLevel: string
      section: string
      total: number
      present: number
      absent: number
    }
  >()

  for (const student of students) {
    const program = programCodeOf(student)
    const yearLevel = student.year_level.trim() || "Unassigned"
    const section = student.section.trim() || "Unassigned"
    const key = `${program}|${yearLevel}|${section}`
    const bucket = sectionGroups.get(key) ?? {
      program,
      yearLevel,
      section,
      total: 0,
      present: 0,
      absent: 0,
    }
    const tally = talliesByStudent.get(student.id) ?? emptyTally()

    bucket.total += 1
    bucket.present += tally.present
    bucket.absent += tally.absent

    sectionGroups.set(key, bucket)
  }

  const bySection: TeacherSectionBreakdown[] = [...sectionGroups.entries()]
    .map(([key, bucket]) => {
      const groupExpected = bucket.present + bucket.absent

      return {
        key,
        program: bucket.program,
        yearLevel: bucket.yearLevel,
        section: bucket.section,
        total: bucket.total,
        present: bucket.present,
        absent: bucket.absent,
        rate: rateOf(bucket.present, groupExpected),
      }
    })
    .sort(
      (a, b) =>
        compareGroupLabels(a.program, b.program) ||
        compareGroupLabels(a.yearLevel, b.yearLevel) ||
        compareGroupLabels(a.section, b.section)
    )

  return {
    range: { from: fromDate, to: toDate },
    rangeLabel: formatRangeLabel(fromDate, toDate),
    generatedAtLabel: format(generatedAt, "d MMM yyyy, h:mm a"),
    sessionDays,
    kpis: {
      totalAssigned,
      totalPresent,
      totalAbsent,
      attendanceRate: rateOf(totalPresent, totalPresent + totalAbsent),
    },
    summary,
    distribution: [
      { status: "Present", count: presentCount },
      { status: "Late", count: lateCount },
      { status: "Absent", count: totalAbsent },
    ],
    bySection,
  }
}

/** Server-side entry point used by the teacher reports route. */
export async function getTeacherReportsData({
  from,
  to,
}: ReportsRange): Promise<TeacherReportsData> {
  const account = await requireRole("teacher")
  const snapshot = await fetchTeacherReportsSnapshot({
    authUserId: account.id,
    fromDate: from,
    toDate: to,
  })

  return buildTeacherReportsData(snapshot, {
    fromDate: from,
    toDate: to,
    generatedAt: new Date(),
  })
}
