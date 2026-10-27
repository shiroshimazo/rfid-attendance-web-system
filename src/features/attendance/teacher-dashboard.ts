import { buildDashboardCalendar, type DashboardAttendanceStatus, type CampusAttendanceState } from "@/features/attendance/calendar-dashboard"
import { type CalendarAttendanceInputs } from "@/features/calendar/attendance-state"
import { fetchCalendarAttendanceState } from "@/services/calendar/attendance-state"
import {
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"

import { recordStatus } from "@/features/attendance/schema"
import { requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
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
  TrendSeries,
} from "@/features/attendance/dashboard"

export interface TeacherDashboardKpis {
  totalAssigned: number
  /** Present includes late arrivals; both mean the student tapped in. */
  presentToday: number
  expectedStudents: number
  lateToday: number
  absentToday: number
  /** Present (including Late) / (Present + Absent), as a percentage. */
  attendanceRate: number | null
}

export interface TeacherStudentAttendanceRow {
  id: number
  studentId: string
  name: string
  yearLevel: string
  section: string
  status: DashboardAttendanceStatus
  timeIn: string | null
  timeOut: string | null
  rfidStatus: StudentRfidStatus
}

export interface TeacherDashboardData {
  /** The yyyy-MM-dd date this snapshot was built for. */
  today: string
  campusStates: CampusAttendanceState[]
  kpis: TeacherDashboardKpis
  trend: TrendSeries
  distribution: StatusSlice[]
  students: TeacherStudentAttendanceRow[]
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
  today: string,
  calendar?: CalendarAttendanceInputs,
): TeacherDashboardData {
  const { students, attendance, cards } = snapshot
  const assignedIds = new Set(students.map((student) => student.id))
  const scopedAttendance = attendance.filter((record) =>
    assignedIds.has(record.student_id) && record.attendance_date <= today
  )

  const todayRecords = scopedAttendance.filter(
    (record) => record.attendance_date === today
  )
  const todayByStudent = new Map(
    todayRecords.map((record) => [record.student_id, record])
  )

  const calendarData = buildDashboardCalendar(students, scopedAttendance, today, calendar)
  const { counts } = calendarData
  const rfidStatusByStudent = buildRfidStatusMap(cards)

  return {
    today,
    campusStates: calendarData.campusStates,
    kpis: {
      totalAssigned: students.length,
      presentToday: counts.present,
      expectedStudents: counts.expectedStudentDays,
      lateToday: counts.late,
      absentToday: counts.absent,
      attendanceRate: counts.rate,
    },
    trend: calendarData.trend,
    distribution: calendarData.distribution,
    students: students.map((student) => {
      const record = todayByStudent.get(student.id)
      const calendarStatus = calendarData.todayStates.get(student.id)!.status

      return {
        id: student.id,
        studentId: student.student_id,
        name: student.full_name,
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

/** Server-side entry point used by the teacher dashboard route. */
export async function getTeacherDashboardData(
  now: Date = new Date()
): Promise<TeacherDashboardData> {
  const account = await requireRole("teacher")
  const today = schoolDateKey(now)
  const fromDate = toDateKey(historyStart(parseISO(today)))
  const [snapshot, calendar] = await Promise.all([
    fetchTeacherDashboardSnapshot({ authUserId: account.id, fromDate, toDate: today }),
    fetchCalendarAttendanceState(fromDate, today, now),
  ])
  return buildTeacherDashboardData(snapshot, today, calendar)
}
