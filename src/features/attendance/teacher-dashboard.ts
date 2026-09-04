import {
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"

import { requireRole } from "@/features/auth/server"
import {
  fetchTeacherDashboardSnapshot,
  type AttendanceStatus,
  type TeacherDashboardSnapshot,
} from "@/services/attendance/teacher-dashboard"

export type { AttendanceStatus }
export type {
  StatusSlice,
  StudentRfidStatus,
  TrendRange,
  TrendSeries,
} from "@/features/attendance/dashboard"
import type {
  StatusSlice,
  StudentRfidStatus,
  TrendPoint,
  TrendSeries,
} from "@/features/attendance/dashboard"

export interface TeacherDashboardKpis {
  totalAssigned: number
  /** Present includes late arrivals; both mean the student tapped in. */
  presentToday: number
  lateToday: number
  absentToday: number
  /** Percentage in the 0-100 range. */
  attendanceRate: number
}

export interface TeacherStudentAttendanceRow {
  id: number
  studentId: string
  name: string
  yearLevel: string
  section: string
  status: AttendanceStatus
  timeIn: string | null
  timeOut: string | null
  rfidStatus: StudentRfidStatus
}

export interface TeacherDashboardData {
  /** The yyyy-MM-dd date this snapshot was built for. */
  today: string
  kpis: TeacherDashboardKpis
  trend: TrendSeries
  distribution: StatusSlice[]
  students: TeacherStudentAttendanceRow[]
  hasAttendanceHistory: boolean
}

const DAILY_POINTS = 14
const WEEKLY_POINTS = 12
const MONTHLY_POINTS = 6
const WEEK_OPTIONS = { weekStartsOn: 1 } as const

/** Present and Late both mean the student physically tapped in. */
function isAttended(status: AttendanceStatus) {
  return status === "Present" || status === "Late"
}

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

function historyStart(now: Date) {
  const monthStart = startOfMonth(subMonths(now, MONTHLY_POINTS - 1))
  const weekStart = startOfWeek(subWeeks(now, WEEKLY_POINTS - 1), WEEK_OPTIONS)

  return monthStart < weekStart ? monthStart : weekStart
}

interface DayTally {
  present: number
  excused: number
}

function rateOf(present: number, expected: number) {
  return expected > 0 ? (present / expected) * 100 : 0
}

/**
 * Builds one trend point from the session dates that fall inside a bucket.
 * A session date is a date that produced at least one attendance record, so
 * weekends and holidays never dilute the rate. Today always counts as a
 * session date, which keeps the chart consistent with the KPI cards.
 */
function buildTrendPoint(
  key: string,
  label: string,
  dates: string[],
  tallies: Map<string, DayTally>,
  totalAssigned: number
): TrendPoint {
  let present = 0
  let excused = 0

  for (const date of dates) {
    const tally = tallies.get(date)
    if (!tally) continue
    present += tally.present
    excused += tally.excused
  }

  const expected = totalAssigned * dates.length
  const absent = Math.max(0, expected - present - excused)

  return { key, label, present, absent, rate: rateOf(present, expected) }
}

function buildTrendSeries(
  tallies: Map<string, DayTally>,
  sessionDates: string[],
  totalAssigned: number
): TrendSeries {
  const daily = sessionDates
    .slice(-DAILY_POINTS)
    .map((date) =>
      buildTrendPoint(
        date,
        format(parseISO(date), "MMM d"),
        [date],
        tallies,
        totalAssigned
      )
    )

  const weeklyBuckets = new Map<string, string[]>()
  const monthlyBuckets = new Map<string, string[]>()

  for (const date of sessionDates) {
    const parsed = parseISO(date)
    const weekKey = toDateKey(startOfWeek(parsed, WEEK_OPTIONS))
    const monthKey = format(parsed, "yyyy-MM")

    weeklyBuckets.set(weekKey, [...(weeklyBuckets.get(weekKey) ?? []), date])
    monthlyBuckets.set(monthKey, [...(monthlyBuckets.get(monthKey) ?? []), date])
  }

  const weekly = [...weeklyBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-WEEKLY_POINTS)
    .map(([weekKey, dates]) =>
      buildTrendPoint(
        weekKey,
        `Wk ${format(parseISO(weekKey), "MMM d")}`,
        dates,
        tallies,
        totalAssigned
      )
    )

  const monthly = [...monthlyBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MONTHLY_POINTS)
    .map(([monthKey, dates]) =>
      buildTrendPoint(
        monthKey,
        format(parseISO(`${monthKey}-01`), "MMM yyyy"),
        dates,
        tallies,
        totalAssigned
      )
    )

  return { daily, weekly, monthly }
}

function buildRfidStatusMap(cards: TeacherDashboardSnapshot["cards"]) {
  const byStudent = new Map<number, StudentRfidStatus>()

  for (const card of cards) {
    // An active card always wins over a lost or deactivated one.
    if (byStudent.get(card.student_id) === "Active") continue
    byStudent.set(card.student_id, card.card_status)
  }

  return byStudent
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildTeacherDashboardData(
  snapshot: TeacherDashboardSnapshot,
  today: string
): TeacherDashboardData {
  const { students, attendance, cards } = snapshot
  const assignedIds = new Set(students.map((student) => student.id))
  const scopedAttendance = attendance.filter((record) =>
    assignedIds.has(record.student_id)
  )

  const todayRecords = scopedAttendance.filter(
    (record) => record.attendance_date === today
  )
  const todayByStudent = new Map(
    todayRecords.map((record) => [record.student_id, record])
  )

  const totalAssigned = students.length
  const presentToday = todayRecords.filter((record) =>
    isAttended(record.attendance_status)
  ).length
  const lateToday = todayRecords.filter(
    (record) => record.attendance_status === "Late"
  ).length
  const excusedToday = todayRecords.filter(
    (record) => record.attendance_status === "Excused"
  ).length
  const absentToday = Math.max(0, totalAssigned - presentToday - excusedToday)

  const tallies = new Map<string, DayTally>()

  for (const record of scopedAttendance) {
    const tally = tallies.get(record.attendance_date) ?? {
      present: 0,
      excused: 0,
    }

    if (isAttended(record.attendance_status)) tally.present += 1
    if (record.attendance_status === "Excused") tally.excused += 1

    tallies.set(record.attendance_date, tally)
  }

  const sessionDates = [...new Set([...tallies.keys(), today])].sort()
  const rfidStatusByStudent = buildRfidStatusMap(cards)

  const distribution: StatusSlice[] = (
    [
      { status: "Present", count: presentToday - lateToday },
      { status: "Late", count: lateToday },
      { status: "Excused", count: excusedToday },
      { status: "Absent", count: absentToday },
    ] as StatusSlice[]
  ).filter(
    (slice) =>
      slice.count > 0 || slice.status === "Present" || slice.status === "Absent"
  )

  return {
    today,
    kpis: {
      totalAssigned,
      presentToday,
      lateToday,
      absentToday,
      attendanceRate: rateOf(presentToday, totalAssigned),
    },
    trend: buildTrendSeries(tallies, sessionDates, totalAssigned),
    distribution,
    students: students.map((student) => {
      const record = todayByStudent.get(student.id)

      return {
        id: student.id,
        studentId: student.student_id,
        name: student.full_name,
        yearLevel: student.year_level,
        section: student.section,
        status: record?.attendance_status ?? "Absent",
        timeIn: record?.time_in ?? null,
        timeOut: record?.time_out ?? null,
        rfidStatus: rfidStatusByStudent.get(student.id) ?? "Unassigned",
      }
    }),
    hasAttendanceHistory: scopedAttendance.length > 0,
  }
}

/** Server-side entry point used by the teacher dashboard route. */
export async function getTeacherDashboardData(
  now: Date = new Date()
): Promise<TeacherDashboardData> {
  const account = await requireRole("teacher")
  const today = toDateKey(now)
  const snapshot = await fetchTeacherDashboardSnapshot({
    authUserId: account.id,
    fromDate: toDateKey(historyStart(now)),
    toDate: today,
  })

  return buildTeacherDashboardData(snapshot, today)
}
