import { recordStatus, type AttendanceRecordStatus } from "@/features/attendance/schema"
import type { AttendanceDisplayStatus } from "@/features/attendance/status"
import { createCalendarAttendanceResolver, type CalendarAttendanceInputs } from "@/features/calendar/attendance-state"
import { fetchCalendarAttendanceState } from "@/services/calendar/attendance-state"
import { requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
import {
  countPersonalAbsentDays,
  type StudentCardStatus,
} from "@/features/attendance/student-dashboard"
import {
  fetchStudentAttendanceSnapshot,
  type SmsStatus,
  type StudentAttendanceSnapshot,
} from "@/services/attendance/student-attendance"

export type { SmsStatus, StudentCardStatus }

export interface StudentAttendanceKpis {
  /** Present includes late arrivals; both mean the student tapped in. */
  totalPresent: number
  totalLate: number
  totalAbsent: number
  /** Percentage in the 0-100 range: present / (present + absent). */
  attendanceRate: number | null
  noClasses: number
  onlineManual: number
}

export interface StudentAttendanceRow {
  id: number | string
  hasTap: boolean
  /** Stored `yyyy-MM-dd` date. */
  date: string
  status: Exclude<AttendanceDisplayStatus, "NoRecord">
  recordedStatus?: AttendanceRecordStatus
  tapCampus?: string
  timeIn: string | null
  timeOut: string | null
  campus: string
  rfidNumber: string | null
  rfidStatus: StudentCardStatus
  smsStatus: SmsStatus | null
  smsSentAt: string | null
}

export interface StudentAttendanceData {
  /** The yyyy-MM-dd date this snapshot was built for. */
  today: string
  kpis: StudentAttendanceKpis
  rows: StudentAttendanceRow[]
}

/** Present and Late both mean the student physically tapped in. */
function isAttended(status: string) {
  return status === "Present" || status === "Late"
}

function latestSmsByAttendance(
  sms: StudentAttendanceSnapshot["sms"]
): Map<number, (typeof sms)[number]> {
  // Rows arrive newest-first, so the first row per attendance wins.
  const byAttendance = new Map<number, (typeof sms)[number]>()

  for (const row of sms) {
    if (!byAttendance.has(row.attendance_id)) {
      byAttendance.set(row.attendance_id, row)
    }
  }

  return byAttendance
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildStudentAttendanceData(
  snapshot: StudentAttendanceSnapshot,
  today: string,
  calendar?: CalendarAttendanceInputs,
): StudentAttendanceData {
  if (calendar && !snapshot.student) throw new Error("Student identity is required for calendar attendance history.")
  const resolve = createCalendarAttendanceResolver({ today, effectiveDays: calendar?.effectiveDays ?? [], marks: calendar?.marks ?? [] })
  const cardsById = new Map(snapshot.cards.map((card) => [card.id, card]))
  const smsByAttendance = latestSmsByAttendance(snapshot.sms)

  const rows: StudentAttendanceRow[] = snapshot.records.map((record) => {
    const card = cardsById.get(record.rfid_card_id)
    const smsRow = smsByAttendance.get(record.id)
    const state = snapshot.student ? resolve(snapshot.student.id, snapshot.student.campus, record.attendance_date) : undefined

    return {
      id: record.id,
      hasTap: true,
      date: record.attendance_date,
      status: state && state.status !== "Normal" ? state.status : recordStatus(record.attendance_status),
      recordedStatus: recordStatus(record.attendance_status),
      tapCampus: record.campus,
      timeIn: record.time_in,
      timeOut: record.time_out,
      campus: state && state.status !== "Normal" ? state.campus : record.campus,
      rfidNumber: card?.rfid_number ?? null,
      rfidStatus: card?.card_status ?? "Unassigned",
      smsStatus: smsRow?.sms_status ?? null,
      smsSentAt: smsRow?.sent_at ?? null,
    }
  })
  if (snapshot.student && calendar) {
    const recordedDates = new Set(rows.map(row => row.date))
    const dates = new Set([
      ...calendar.marks.filter(mark => mark.student_id === snapshot.student.id && mark.attendance_date < today).map(mark => mark.attendance_date),
      ...calendar.effectiveDays.filter(day => day.campus === snapshot.student.campus && day.attendance_date === today).map(day => day.attendance_date),
    ])
    for (const date of dates) {
      const state = resolve(snapshot.student.id, snapshot.student.campus, date)
      if (recordedDates.has(date) || state.status === "Normal") continue
      rows.push({ id: `calendar:${snapshot.student.id}:${date}`, hasTap: false, date, status: state.status, campus: state.campus,
        timeIn: null, timeOut: null, rfidNumber: null, rfidStatus: "Unassigned", smsStatus: null, smsSentAt: null })
    }
  }

  const currentRows = rows.filter(row => row.date <= today)
  const totalPresent = currentRows.filter((row) => isAttended(row.status)).length
  const totalLate = currentRows.filter((row) => row.status === "Late").length
  const totalAbsent = countPersonalAbsentDays(currentRows.map(row => ({ attendance_date: row.date, attendance_status: row.status })), today)
  const denominator = totalPresent + totalAbsent

  return {
    today,
    kpis: {
      totalPresent,
      totalLate,
      totalAbsent,
      attendanceRate: denominator > 0 ? (totalPresent / denominator) * 100 : null,
      noClasses: currentRows.filter(row => row.status === "NoClasses").length,
      onlineManual: currentRows.filter(row => row.status === "OnlineManual").length,
    },
    rows,
  }
}

/** Server-side entry point used by the student My Attendance route. */
export async function getStudentAttendanceData(
  now: Date = new Date()
): Promise<StudentAttendanceData> {
  const account = await requireRole("student")
  const snapshot = await fetchStudentAttendanceSnapshot({
    authUserId: account.id,
  })

  const today = schoolDateKey(now)
  const calendar = await fetchCalendarAttendanceState("0001-01-01", today, now)
  return buildStudentAttendanceData(snapshot, today, calendar)
}
