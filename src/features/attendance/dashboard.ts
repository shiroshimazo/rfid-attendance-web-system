import { buildDashboardCalendar, type DashboardAttendanceStatus, type CampusAttendanceState } from "@/features/attendance/calendar-dashboard"
import { summarizeCalendarAttendance, type CalendarAttendanceInputs } from "@/features/calendar/attendance-state"
import { fetchCalendarAttendanceState } from "@/services/calendar/attendance-state"
import {
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"

import { isAttendanceStatus, recordStatus } from "@/features/attendance/schema"
import { schoolDateKey } from "@/lib/school-time"
import {
  fetchAdminDashboardSnapshot,
  type AttendanceRow,
  type AttendanceStatus,
  type DashboardSnapshot,
  type RfidCardStatus,
  type StudentRow,
} from "@/services/attendance/dashboard"

export type { AttendanceRowStatus } from "@/features/attendance/schema"
export type { AttendanceStatus, RfidCardStatus }

/** A student with no card row at all, as opposed to one with an inactive card. */
export type StudentRfidStatus = RfidCardStatus | "Unassigned"

export type TrendRange = "daily" | "weekly" | "monthly"

export interface DashboardKpis {
  totalStudents: number
  /** Present includes late arrivals; both mean the student tapped in. */
  presentToday: number
  expectedStudents: number
  lateToday: number
  absentToday: number
  /** Present (including Late) / (Present + Absent), as a percentage. */
  attendanceRate: number | null
  /** Time-in taps plus time-out taps recorded today. */
  rfidTapsToday: number
}

export interface TrendPoint {
  key: string
  label: string
  present: number
  absent: number
  rate: number | null
}

export type TrendSeries = Record<TrendRange, TrendPoint[]>

export interface GroupBreakdown {
  group: string
  present: number
  absent: number
  total: number
  rate: number | null
}

export interface StatusSlice {
  status: DashboardAttendanceStatus
  count: number
}

export interface StudentAttendanceRow {
  id: number
  studentId: string
  name: string
  programCode: string
  yearLevel: string
  section: string
  status: DashboardAttendanceStatus
  timeIn: string | null
  timeOut: string | null
  rfidStatus: StudentRfidStatus
}

export interface AdminDashboardData {
  /** The yyyy-MM-dd date this snapshot was built for. */
  today: string
  campusStates: CampusAttendanceState[]
  kpis: DashboardKpis
  trend: TrendSeries
  byProgram: GroupBreakdown[]
  byYearLevel: GroupBreakdown[]
  bySection: GroupBreakdown[]
  distribution: StatusSlice[]
  students: StudentAttendanceRow[]
  hasAttendanceHistory: boolean
}

const WEEKLY_POINTS = 12
const MONTHLY_POINTS = 6
const WEEK_OPTIONS = { weekStartsOn: 1 } as const

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

function historyStart(now: Date) {
  const monthStart = startOfMonth(subMonths(now, MONTHLY_POINTS - 1))
  const weekStart = startOfWeek(subWeeks(now, WEEKLY_POINTS - 1), WEEK_OPTIONS)

  return monthStart < weekStart ? monthStart : weekStart
}

/** Orders 1st Year before 10th Year before Grade 11, then alphabetically. */
function compareGroupLabels(a: string, b: string) {
  const numberA = Number.parseInt(a, 10)
  const numberB = Number.parseInt(b, 10)
  const hasA = Number.isFinite(numberA)
  const hasB = Number.isFinite(numberB)

  if (hasA && hasB && numberA !== numberB) return numberA - numberB
  if (hasA !== hasB) return hasA ? -1 : 1

  return a.localeCompare(b)
}

function buildBreakdown(
  students: StudentRow[], todayByStudent: Map<number, AttendanceRow>,
  groupOf: (student: StudentRow) => string, calendarData: ReturnType<typeof buildDashboardCalendar>
): GroupBreakdown[] {
  const groups = new Map<string, StudentRow[]>()
  for (const student of students) {
    const key = groupOf(student).trim() || "Unassigned"
    const group = groups.get(key) ?? []
    group.push(student); groups.set(key, group)
  }
  return [...groups].map(([group, roster]) => {
    const counts = summarizeCalendarAttendance(roster.map(student => ({ student_id: student.id, campus: student.campus, attendance_date: calendarData.today, attendance_status: todayByStudent.get(student.id)?.attendance_status })), calendarData.resolve)
    return { group, present: counts.present, absent: counts.absent, total: roster.length, rate: counts.rate }
  }).sort((a, b) => compareGroupLabels(a.group, b.group))
}

function buildRfidStatusMap(cards: DashboardSnapshot["cards"]) {
  const byStudent = new Map<number, StudentRfidStatus>()

  for (const card of cards) {
    // Stored cards without a holder belong to no student's status.
    if (card.student_id === null) continue
    // An active card always wins over a lost or deactivated one.
    if (byStudent.get(card.student_id) === "Active") continue
    byStudent.set(card.student_id, card.card_status)
  }

  return byStudent
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildAdminDashboardData(
  snapshot: DashboardSnapshot,
  today: string,
  calendar?: CalendarAttendanceInputs,
): AdminDashboardData {
  const { students, attendance, cards } = snapshot
  const activeStudentIds = new Set(students.map((student) => student.id))
  const scopedAttendance = attendance.filter((record) =>
    activeStudentIds.has(record.student_id) && record.attendance_date <= today
  )

  const todayRecords = scopedAttendance.filter(
    (record) => record.attendance_date === today
  )
  const todayByStudent = new Map(
    todayRecords.map((record) => [record.student_id, record])
  )

  const calendarData = buildDashboardCalendar(students, scopedAttendance, today, calendar)
  const { counts } = calendarData
  const currentRecords = todayRecords.filter(record => isAttendanceStatus(record.attendance_status))
  const timeOutTaps = currentRecords.filter(record => record.time_out).length
  const rfidStatusByStudent = buildRfidStatusMap(cards)

  return {
    today,
    campusStates: calendarData.campusStates,
    kpis: {
      totalStudents: students.length,
      presentToday: counts.present,
      expectedStudents: counts.expectedStudentDays,
      lateToday: counts.late,
      absentToday: counts.absent,
      attendanceRate: counts.rate,
      rfidTapsToday: currentRecords.length + timeOutTaps,
    },
    trend: calendarData.trend,
    byProgram: buildBreakdown(
      students,
      todayByStudent,
      (student) => student.program?.program_code ?? "Unassigned", calendarData
    ),
    byYearLevel: buildBreakdown(
      students,
      todayByStudent,
      (student) => student.year_level, calendarData
    ),
    bySection: buildBreakdown(
      students,
      todayByStudent,
      (student) => student.section, calendarData
    ),
    distribution: calendarData.distribution,
    students: students.map((student) => {
      const record = todayByStudent.get(student.id)
      const calendarStatus = calendarData.todayStates.get(student.id)!.status

      return {
        id: student.id,
        studentId: student.student_id,
        name: student.full_name,
        programCode: student.program?.program_code ?? "Unassigned",
        yearLevel: student.year_level,
        section: student.section,
        status: calendarStatus !== "Normal" ? calendarStatus : record ? recordStatus(record.attendance_status) : "NoRecord",
        timeIn: record?.time_in ?? null,
        timeOut: record?.time_out ?? null,
        rfidStatus: rfidStatusByStudent.get(student.id) ?? "Unassigned",
      }
    }),
    hasAttendanceHistory: scopedAttendance.length > 0 || calendarData.hasHistory,
  }
}

/** Server-side entry point used by the admin dashboard route. */
export async function getAdminDashboardData(
  now: Date = new Date()
): Promise<AdminDashboardData> {
  const today = schoolDateKey(now)
  const fromDate = toDateKey(historyStart(parseISO(today)))
  const [snapshot, calendar] = await Promise.all([
    fetchAdminDashboardSnapshot({ fromDate, toDate: today }),
    fetchCalendarAttendanceState(fromDate, today, now),
  ])
  return buildAdminDashboardData(snapshot, today, calendar)
}
