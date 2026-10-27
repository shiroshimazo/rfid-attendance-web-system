import { fetchSubjectAttendance } from "@/services/attendance/subject-attendance"
import type { SubjectAttendanceRow } from "@/features/subject-attendance/model"
import { format, parseISO, subDays } from "date-fns"
import { calendarDateSchema } from "@/features/calendar/schema"
import { type CalendarAttendanceInputs } from "@/features/calendar/attendance-state"
import { fetchCalendarAttendanceState } from "@/services/calendar/attendance-state"
import { buildReportCalendar, type ReportCalendarException } from "@/features/reports/calendar-model"
import { syncReportCalendar } from "@/features/reports/calendar"

import { schoolDateKey } from "@/lib/school-time"
import { requireRole } from "@/features/auth/server"
import type { StudentRfidStatus } from "@/features/attendance/dashboard"
import {
  isAttendanceStatus,
  recordStatus,
  type AttendanceRecordStatus, type AttendanceDisplayStatus,
} from "@/features/attendance/status"
import {
  fetchReportsSnapshot,
  type AttendanceStatus,
  type ReportStudentRow,
  type ReportSmsRow,
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
  calendar?: CalendarAttendanceInputs
}

export interface ReportsKpis {
  totalStudents: number
  representedStudents: number
  totalPresent: number
  totalAbsent: number
  rfidScans: number
  noClasses: number
  onlineManual: number
  attendanceRate: number | null
}

export interface SummaryPoint {
  date: string
  label: string
  present: number
  absent: number
  rate: number | null
}

export interface GroupBreakdown {
  group: string
  present: number
  absent: number
  total: number
  rate: number | null
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
  campus: string
  total: number
  /** Present includes late arrivals; both mean the student tapped in. */
  present: number
  late: number
  absent: number
  rate: number | null
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
  campus: string
  status: Exclude<AttendanceDisplayStatus, "NoRecord">
  recordedStatus: AttendanceRecordStatus
  calendarCampus: string | null
  rfidStatus: StudentRfidStatus
  rfidNumber: string
  rfidCardId: number
  studentStatus: string
}

export interface ReportsData {
  calendarExceptions: ReportCalendarException[]
  subjectAttendance: SubjectAttendanceRow[]
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
  attendanceLogs: AttendanceLog[]
  smsLogs: (ReportSmsRow & { studentName: string; studentId: string; attendanceDate: string })[]
}

export type ReportsSearchParams = Record<
  string,
  string | string[] | undefined
>

const DEFAULT_RANGE_DAYS = 7
const RECENT_LOG_LIMIT = 50

export function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""

  return value ?? ""
}

function readDateKey(value: string) {
  const candidate = value.trim()

  const parsed = calendarDateSchema.safeParse(candidate)
  return parsed.success ? parsed.data : null
}

export function parseReportsRange(
  params: ReportsSearchParams,
  now: Date = new Date()
): ReportsRange {
  const to = readDateKey(firstValue(params.to)) ?? schoolDateKey(now)
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
  return expected > 0 ? (present / expected) * 100 : null
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
  { fromDate, toDate, generatedAt, calendar }: ReportsBuildOptions
): ReportsData {
  const { attendance, programs, rfidCards } = snapshot
  const inRange = attendance.filter(record =>
    record.attendance_date >= fromDate && record.attendance_date <= toDate)
  const calendarData = buildReportCalendar(snapshot.students, inRange, fromDate, toDate, calendar ?? { today: schoolDateKey(generatedAt), effectiveDays: [], marks: [] })
  const representedIds = new Set([...inRange.map(record => record.student_id), ...calendarData.days.map(day => day.studentId)])
  const students = snapshot.students.filter(student =>
    (student.status ?? "active") === "active" || representedIds.has(student.id))
  const studentsById = new Map(students.map(student => [student.id, student]))
  const programsById = new Map(programs.map(program => [program.id, program]))
  const scoped = inRange.filter(record => studentsById.has(record.student_id))
  const cardsById = new Map(rfidCards.map(card => [card.id, card]))
  const recordsById = new Map(scoped.map(record => [record.id, record]))

  // Historical values stay in the logs, but cannot create session days or totals.
  const currentRecords = scoped.filter((record) =>
    isAttendanceStatus(record.attendance_status)
  )
  const eligibleRecords = currentRecords.filter(record => calendarData.resolve(record.student_id, studentsById.get(record.student_id)!.campus, record.attendance_date).status === "Normal")

  const sessionDates = [
    ...new Set([...currentRecords.map((record) => record.attendance_date), ...calendarData.days.map(day => day.date)]),
  ].sort()
  const sessionDays = sessionDates.length
  const totalStudents = students.filter(student => (student.status ?? "active") === "active").length

  const talliesByStudent = new Map<number, Tally>()
  const talliesByDate = new Map<string, Tally>()

  let presentCount = 0
  let lateCount = 0
  let absentCount = 0

  for (const record of eligibleRecords) {
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
      rate: rateOf(tally.present, tally.present + tally.absent),
    }
  })

  const programCodeOf = (student: ReportStudentRow) =>
    programsById.get(student.program_id)?.program_code ?? "Unassigned"

  // Program/year/section describe the current profile; campus is captured on
  // each attendance record. A transferred student's old campus stays distinct.
  const sectionGroups = new Map<string, {
    program: string; yearLevel: string; section: string; campus: string
    ids: Set<number>; present: number; late: number; absent: number
  }>()
  function sectionBucket(student: ReportStudentRow, recordedCampus?: string) {
    const program = programCodeOf(student)
    const yearLevel = student.year_level.trim() || "Unassigned"
    const section = student.section.trim() || "Unassigned"
    const campus = recordedCampus?.trim() || student.campus?.trim() || "Unknown campus"
    const key = JSON.stringify([program, yearLevel, section, campus])
    let bucket = sectionGroups.get(key)
    if (!bucket) {
      bucket = { program, yearLevel, section, campus, ids: new Set(), ...emptyTally() }
      sectionGroups.set(key, bucket)
    }
    bucket.ids.add(student.id)
    return bucket
  }
  // Include roster students even without records; never infer their absence.
  for (const student of students) {
    if (!representedIds.has(student.id)) sectionBucket(student)
  }
  for (const record of scoped) {
    const bucket = sectionBucket(studentsById.get(record.student_id)!, record.campus)
    if (calendarData.resolve(record.student_id, studentsById.get(record.student_id)!.campus, record.attendance_date).status !== "Normal") continue
    if (isAttended(record.attendance_status)) bucket.present += 1
    if (record.attendance_status === "Late") bucket.late += 1
    if (record.attendance_status === "Absent") bucket.absent += 1
  }
  for (const day of calendarData.days) sectionBucket(studentsById.get(day.studentId)!, day.campus)
  const bySection: SectionBreakdown[] = [...sectionGroups.entries()]
    .map(([key, { ids, ...bucket }]) => ({
      key, ...bucket, total: ids.size,
      rate: rateOf(bucket.present, bucket.present + bucket.absent),
    }))
    .sort((a, b) => compareGroupLabels(a.program, b.program) ||
      compareGroupLabels(a.yearLevel, b.yearLevel) ||
      compareGroupLabels(a.section, b.section) || compareGroupLabels(a.campus, b.campus))

  const attendanceLogs: AttendanceLog[] = [...scoped]
    .sort((a, b) =>
      `${b.attendance_date}T${b.time_in}`.localeCompare(
        `${a.attendance_date}T${a.time_in}`
      ) || b.id - a.id
    )
    .map((record) => {
      const student = studentsById.get(record.student_id)

      const card = cardsById.get(record.rfid_card_id)
      const state = calendarData.resolve(record.student_id, student!.campus, record.attendance_date)
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
        campus: record.campus || student?.campus || "Unknown campus",
        studentStatus: student?.status ?? "active",
        rfidCardId: record.rfid_card_id,
        rfidNumber: card?.rfid_number ?? "Unavailable",
        status: state.status === "Normal" ? recordStatus(record.attendance_status) : state.status,
        recordedStatus: recordStatus(record.attendance_status),
        calendarCampus: state.status === "Normal" ? null : state.campus,
        rfidStatus:
          card?.card_status ?? "Unassigned",
      }
    })

  const byProgramYear = buildGroups(
    students,
    talliesByStudent,
    (student) => `${programCodeOf(student)} ${student.year_level}`.trim()
  )

  return {
    calendarExceptions: calendarData.exceptions,
    subjectAttendance: [],
    range: { from: fromDate, to: toDate },
    rangeLabel: formatRangeLabel(fromDate, toDate),
    generatedAtLabel: formatReportTimestamp(generatedAt),
    sessionDays,
    kpis: {
      totalStudents,
      representedStudents: new Set(scoped.map(record => record.student_id)).size,
      totalPresent,
      totalAbsent,
      noClasses: calendarData.days.filter(day => day.status === "NoClasses").length,
      onlineManual: calendarData.days.filter(day => day.status === "OnlineManual").length,
      attendanceRate: rateOf(totalPresent, totalPresent + totalAbsent),
      rfidScans: currentRecords.reduce((total, record) => total + (record.time_in ? 1 : 0) + (record.time_out ? 1 : 0), 0),
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
    attendanceLogs,
    recentLogs: attendanceLogs.slice(0, RECENT_LOG_LIMIT),
    smsLogs: (snapshot.sms ?? []).flatMap(sms => {
      const record = recordsById.get(sms.attendance_id)
      if (!record || record.student_id !== sms.student_id) return []
      const student = studentsById.get(sms.student_id)!
      return [{ ...sms, studentName: student.full_name, studentId: student.student_id, attendanceDate: record.attendance_date }]
    }),
  }
}

export async function getAdminReportsData({
  from,
  to,
}: ReportsRange): Promise<ReportsData> {
  await requireRole("admin")
  await syncReportCalendar(from, to)
  const now = new Date()
  const [snapshot, calendar] = await Promise.all([fetchReportsSnapshot({ fromDate: from, toDate: to }), fetchCalendarAttendanceState(from, to, now)])

  const report = buildReportsData(snapshot, { fromDate: from, toDate: to, generatedAt: now, calendar })
  return { ...report, subjectAttendance: await fetchSubjectAttendance({ from, to }) }
}

/** School-zone timestamps; stored attendance clock times are already local. */
export function formatReportTimestamp(value: Date | string) {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila", year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(value)) + " PHT"
}
