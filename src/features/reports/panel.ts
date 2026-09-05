import { format, isValid, parseISO, subDays } from "date-fns"

import type { StudentRfidStatus } from "@/features/attendance/dashboard"
import {
  isAttendanceStatus,
  recordStatus,
  type AttendanceRecordStatus,
} from "@/features/attendance/status"
import {
  fetchReportsSnapshot,
  type AttendanceStatus,
  type ReportStudentRow,
  type ReportsSnapshot,
} from "@/services/reports/snapshot"

export type { AttendanceStatus, StudentRfidStatus }

export interface ReportsRange {
  from: string
  to: string
}

export interface ReportsBuildOptions {
  fromDate: string
  toDate: string
  generatedAt: Date
}

export interface ReportsKpis {
  totalStudents: number
  totalPresent: number
  totalAbsent: number
  rfidScans: number
}

export interface SummaryPoint {
  date: string
  label: string
  present: number
  absent: number
}

export interface GroupBreakdown {
  group: string
  present: number
  absent: number
  total: number
  rate: number
}

export interface StatusSlice {
  status: AttendanceStatus
  count: number
}

export interface SectionBreakdown {
  key: string
  program: string
  yearLevel: string
  section: string
  total: number
  /** Present includes late arrivals; both mean the student tapped in. */
  present: number
  late: number
  absent: number
  rate: number
}

export interface AttendanceLog {
  id: number
  time: string
  timeIn: string
  timeOut: string | null
  date: string
  studentName: string
  studentId: string
  program: string
  yearLevel: string
  section: string
  status: AttendanceRecordStatus
  rfidStatus: StudentRfidStatus
}

export interface ReportsData {
  range: ReportsRange
  rangeLabel: string
  generatedAtLabel: string
  sessionDays: number
  kpis: ReportsKpis
  summary: SummaryPoint[]
  byProgram: GroupBreakdown[]
  byYearLevel: GroupBreakdown[]
  byProgramYear: GroupBreakdown[]
  distribution: StatusSlice[]
  bySection: SectionBreakdown[]
  recentLogs: AttendanceLog[]
}

export type ReportsSearchParams = Record<
  string,
  string | string[] | undefined
>

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DEFAULT_RANGE_DAYS = 7
const RECENT_LOG_LIMIT = 50
const MAX_GROUPS = 12

export function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""

  return value ?? ""
}

function readDateKey(value: string) {
  const candidate = value.trim()

  return DATE_KEY_PATTERN.test(candidate) && isValid(parseISO(candidate))
    ? candidate
    : null
}

export function parseReportsRange(
  params: ReportsSearchParams,
  now: Date = new Date()
): ReportsRange {
  const to = readDateKey(firstValue(params.to)) ?? toDateKey(now)
  const from =
    readDateKey(firstValue(params.from)) ??
    toDateKey(subDays(parseISO(to), DEFAULT_RANGE_DAYS - 1))

  return from > to ? { from: to, to: from } : { from, to }
}

export function formatRangeLabel(from: string, to: string) {
  const start = parseISO(from)
  const end = parseISO(to)

  if (from === to) return format(start, "d MMMM yyyy")

  const sameYear = format(start, "yyyy") === format(end, "yyyy")

  return `${format(start, sameYear ? "d MMM" : "d MMM yyyy")} to ${format(end, "d MMM yyyy")}`
}

function isAttended(status: string) {
  return status === "Present" || status === "Late"
}

function rateOf(present: number, expected: number) {
  return expected > 0 ? (present / expected) * 100 : 0
}

interface Tally {
  present: number
  late: number
  absent: number
}

function emptyTally(): Tally {
  return { present: 0, late: 0, absent: 0 }
}

function compareGroupLabels(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true })
}

function buildGroups(
  students: ReportStudentRow[],
  tallies: Map<number, Tally>,
  groupOf: (student: ReportStudentRow) => string
): GroupBreakdown[] {
  const groups = new Map<string, { present: number; absent: number; total: number }>()

  for (const student of students) {
    const key = groupOf(student).trim() || "Unassigned"
    const bucket = groups.get(key) ?? { present: 0, absent: 0, total: 0 }
    const tally = tallies.get(student.id) ?? emptyTally()

    bucket.total += 1
    bucket.present += tally.present
    bucket.absent += tally.absent

    groups.set(key, bucket)
  }

  return [...groups.entries()]
    .map(([group, bucket]) => {
      const expected = bucket.present + bucket.absent

      return {
        group,
        present: bucket.present,
        absent: bucket.absent,
        total: bucket.total,
        rate: rateOf(bucket.present, expected),
      }
    })
    .sort((a, b) => compareGroupLabels(a.group, b.group))
}

export function buildReportsData(
  snapshot: ReportsSnapshot,
  { fromDate, toDate, generatedAt }: ReportsBuildOptions
): ReportsData {
  const { students, attendance, programs, rfidCards } = snapshot

  const studentsById = new Map(students.map((student) => [student.id, student]))
  const programsById = new Map(programs.map((program) => [program.id, program]))

  const scoped = attendance.filter((record) => studentsById.has(record.student_id))

  const rfidStatusByStudent = new Map<number, StudentRfidStatus>()

  for (const card of rfidCards) {
    if (rfidStatusByStudent.get(card.student_id) === "Active") continue
    rfidStatusByStudent.set(card.student_id, card.card_status)
  }

  // Historical values stay in the logs, but cannot create session days or totals.
  const currentRecords = scoped.filter((record) =>
    isAttendanceStatus(record.attendance_status)
  )

  const sessionDates = [
    ...new Set(currentRecords.map((record) => record.attendance_date)),
  ].sort()
  const sessionDays = sessionDates.length
  const totalStudents = students.length

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
    if (record.attendance_status === "Late") {
      studentTally.late += 1
      dateTally.late += 1
    }
    if (absent) {
      studentTally.absent += 1
      dateTally.absent += 1
    }

    talliesByStudent.set(record.student_id, studentTally)
    talliesByDate.set(record.attendance_date, dateTally)
  }

  const totalPresent = presentCount + lateCount
  // Match current dashboards: only an explicit Absent record is a final absence.
  const totalAbsent = absentCount

  const summary: SummaryPoint[] = sessionDates.map((date) => {
    const tally = talliesByDate.get(date) ?? emptyTally()

    return {
      date,
      label: format(parseISO(date), "MMM d"),
      present: tally.present,
      absent: tally.absent,
    }
  })

  const programCodeOf = (student: ReportStudentRow) =>
    programsById.get(student.program_id)?.program_code ?? "Unassigned"

  const sectionGroups = new Map<
    string,
    {
      program: string
      yearLevel: string
      section: string
      total: number
      present: number
      late: number
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
      late: 0,
      absent: 0,
    }
    const tally = talliesByStudent.get(student.id) ?? emptyTally()

    bucket.total += 1
    bucket.present += tally.present
    bucket.late += tally.late
    bucket.absent += tally.absent

    sectionGroups.set(key, bucket)
  }

  const bySection: SectionBreakdown[] = [...sectionGroups.entries()]
    .map(([key, bucket]) => {
      const groupExpected = bucket.present + bucket.absent

      return {
        key,
        program: bucket.program,
        yearLevel: bucket.yearLevel,
        section: bucket.section,
        total: bucket.total,
        present: bucket.present,
        late: bucket.late,
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

  const recentLogs: AttendanceLog[] = [...scoped]
    .sort((a, b) =>
      `${b.attendance_date}T${b.time_in}`.localeCompare(
        `${a.attendance_date}T${a.time_in}`
      )
    )
    .slice(0, RECENT_LOG_LIMIT)
    .map((record) => {
      const student = studentsById.get(record.student_id)

      return {
        id: record.id,
        time: `${record.attendance_date}T${record.time_in}`,
        timeIn: record.time_in,
        timeOut: record.time_out,
        date: record.attendance_date,
        studentName: student?.full_name ?? "Unknown student",
        studentId: student?.student_id ?? "—",
        program: student ? programCodeOf(student) : "—",
        yearLevel: student?.year_level ?? "—",
        section: student?.section ?? "—",
        status: recordStatus(record.attendance_status),
        rfidStatus:
          rfidStatusByStudent.get(record.student_id) ?? "Unassigned",
      }
    })

  const byProgramYear = buildGroups(
    students,
    talliesByStudent,
    (student) => `${programCodeOf(student)} ${student.year_level}`.trim()
  ).slice(0, MAX_GROUPS)

  return {
    range: { from: fromDate, to: toDate },
    rangeLabel: formatRangeLabel(fromDate, toDate),
    generatedAtLabel: format(generatedAt, "d MMM yyyy, h:mm a"),
    sessionDays,
    kpis: {
      totalStudents,
      totalPresent,
      totalAbsent,
      rfidScans: currentRecords.length,
    },
    summary,
    byProgram: buildGroups(
      students,
      talliesByStudent,
      programCodeOf
    ),
    byYearLevel: buildGroups(
      students,
      talliesByStudent,
      (student) => student.year_level
    ),
    byProgramYear,
    distribution: [
      { status: "Present", count: presentCount },
      { status: "Late", count: lateCount },
      { status: "Absent", count: totalAbsent },
    ],
    bySection,
    recentLogs,
  }
}

export async function getAdminReportsData({
  from,
  to,
}: ReportsRange): Promise<ReportsData> {
  const snapshot = await fetchReportsSnapshot({ fromDate: from, toDate: to })

  return buildReportsData(snapshot, {
    fromDate: from,
    toDate: to,
    generatedAt: new Date(),
  })
}
