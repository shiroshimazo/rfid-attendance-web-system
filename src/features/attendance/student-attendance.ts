import { format } from "date-fns"

import { requireRole } from "@/features/auth/server"
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
  totalPresent: number
  totalAbsent: number
  /** Percentage in the 0-100 range: present / (present + absent). */
  attendanceRate: number
}

export interface StudentAttendanceRow {
  id: number
  /** Stored `yyyy-MM-dd` date. */
  date: string
  status: "Present" | "Late" | "Absent" | "Excused"
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

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
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
  today: string
): StudentAttendanceData {
  const cardsById = new Map(snapshot.cards.map((card) => [card.id, card]))
  const smsByAttendance = latestSmsByAttendance(snapshot.sms)

  const rows: StudentAttendanceRow[] = snapshot.records.map((record) => {
    const card = cardsById.get(record.rfid_card_id)
    const smsRow = smsByAttendance.get(record.id)

    return {
      id: record.id,
      date: record.attendance_date,
      status: record.attendance_status,
      timeIn: record.time_in,
      timeOut: record.time_out,
      campus: record.campus,
      rfidNumber: card?.rfid_number ?? null,
      rfidStatus: card?.card_status ?? "Unassigned",
      smsStatus: smsRow?.sms_status ?? null,
      smsSentAt: smsRow?.sent_at ?? null,
    }
  })

  const totalPresent = rows.filter((row) => isAttended(row.status)).length
  const totalAbsent = countPersonalAbsentDays(snapshot.records, today)
  const denominator = totalPresent + totalAbsent

  return {
    today,
    kpis: {
      totalPresent,
      totalAbsent,
      attendanceRate: denominator > 0 ? (totalPresent / denominator) * 100 : 0,
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

  return buildStudentAttendanceData(snapshot, toDateKey(now))
}
