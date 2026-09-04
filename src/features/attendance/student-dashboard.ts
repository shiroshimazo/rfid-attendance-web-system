import { addDays, format, parseISO } from "date-fns"

import { requireRole } from "@/features/auth/server"
import {
  fetchStudentDashboardSnapshot,
  type SmsStatus,
  type StudentDashboardSnapshot,
} from "@/services/attendance/student-dashboard"

export type { SmsStatus }

/** Dashboard shows a binary tap state: tapped in or not yet. */
export type TodayAttendanceStatus = "Present" | "Absent"

/**
 * `Active` means an active card is assigned. `Registered` means at least one
 * card row exists but none is active. `Not registered` means no card row.
 */
export type StudentRfidDisplayStatus = "Active" | "Registered" | "Not registered"

/** Underlying card row status backing the display label. */
export type StudentCardStatus =
  | "Active"
  | "Inactive"
  | "Lost"
  | "Deactivated"
  | "Unassigned"

export interface StudentIdentity {
  fullName: string
  studentId: string
  yearLevel: string
  section: string
  campus: string
  profilePicture: string | null
}

export interface TodayAttendance {
  status: TodayAttendanceStatus
  timeIn: string | null
  timeOut: string | null
}

export interface StudentRfidInfo {
  display: StudentRfidDisplayStatus
  cardStatus: StudentCardStatus
  rfidNumber: string | null
  assignedDate: string | null
}

export interface ParentSmsInfo {
  status: SmsStatus | null
  sentAt: string | null
}

export interface StudentDashboardKpis {
  /** Present includes late arrivals; both mean the student tapped in. */
  totalPresent: number
  totalLate: number
  totalAbsent: number
  /** Time-in taps plus time-out taps across all personal records. */
  totalRfidTaps: number
}

export interface StudentDashboardData {
  /** The yyyy-MM-dd date this snapshot was built for. */
  today: string
  student: StudentIdentity
  attendance: TodayAttendance
  rfid: StudentRfidInfo
  sms: ParentSmsInfo
  kpis: StudentDashboardKpis
}

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

/** Present and Late both mean the student tapped in today. */
function resolveTodayStatus(
  attendance: StudentDashboardSnapshot["attendance"]
): TodayAttendance {
  if (
    attendance &&
    (attendance.attendance_status === "Present" ||
      attendance.attendance_status === "Late")
  ) {
    return {
      status: "Present",
      timeIn: attendance.time_in,
      timeOut: attendance.time_out,
    }
  }

  return { status: "Absent", timeIn: null, timeOut: null }
}

function resolveRfidInfo(
  cards: StudentDashboardSnapshot["cards"]
): StudentRfidInfo {
  // An active card always wins over retained historical cards.
  const active = cards.find((card) => card.card_status === "Active")

  if (active) {
    return {
      display: "Active",
      cardStatus: "Active",
      rfidNumber: active.rfid_number,
      assignedDate: active.assigned_date,
    }
  }

  const latest = cards[0]

  if (!latest) {
    return {
      display: "Not registered",
      cardStatus: "Unassigned",
      rfidNumber: null,
      assignedDate: null,
    }
  }

  return {
    display: "Registered",
    cardStatus: latest.card_status,
    rfidNumber: latest.rfid_number,
    assignedDate: latest.assigned_date,
  }
}

/** Present and Late both mean the student physically tapped in. */
function isAttended(status: string) {
  return status === "Present" || status === "Late"
}

/** Minimal history shape shared by the student dashboard and attendance panels. */
export interface PersonalHistoryDay {
  attendance_date: string
  attendance_status: string
}

/**
 * Absent school days = weekdays (Mon-Fri) since the first recorded tap that
 * have neither a tap-in nor an excused record. Taps only exist for days the
 * student attended, so the gap days are the absences.
 */
export function countPersonalAbsentDays(
  history: PersonalHistoryDay[],
  today: string
): number {
  const present = new Set<string>()
  const excused = new Set<string>()

  for (const record of history) {
    if (isAttended(record.attendance_status)) present.add(record.attendance_date)
    if (record.attendance_status === "Excused") excused.add(record.attendance_date)
  }

  const start =
    history.length > 0
      ? history.reduce((a, b) =>
          a.attendance_date < b.attendance_date ? a : b
        ).attendance_date
      : today

  let absent = 0
  let cursor = parseISO(start)
  const end = parseISO(today)

  while (cursor <= end) {
    const day = cursor.getDay()

    if (day !== 0 && day !== 6) {
      const key = format(cursor, "yyyy-MM-dd")
      if (!present.has(key) && !excused.has(key)) absent += 1
    }

    cursor = addDays(cursor, 1)
  }

  return absent
}

function buildKpis(
  history: StudentDashboardSnapshot["history"],
  today: string
): StudentDashboardKpis {
  return {
    totalPresent: history.filter((record) =>
      isAttended(record.attendance_status)
    ).length,
    totalLate: history.filter(
      (record) => record.attendance_status === "Late"
    ).length,
    totalAbsent: countPersonalAbsentDays(history, today),
    totalRfidTaps:
      history.length + history.filter((record) => record.time_out).length,
  }
}

/** Pure aggregation, so the shape can be reasoned about without a database. */
export function buildStudentDashboardData(
  snapshot: StudentDashboardSnapshot,
  today: string
): StudentDashboardData {
  return {
    today,
    student: {
      fullName: snapshot.student.full_name,
      studentId: snapshot.student.student_id,
      yearLevel: snapshot.student.year_level,
      section: snapshot.student.section,
      campus: snapshot.student.campus,
      profilePicture: snapshot.student.profile_picture,
    },
    attendance: resolveTodayStatus(snapshot.attendance),
    rfid: resolveRfidInfo(snapshot.cards),
    sms: {
      status: snapshot.sms?.sms_status ?? null,
      sentAt: snapshot.sms?.sent_at ?? null,
    },
    kpis: buildKpis(snapshot.history, today),
  }
}

/** Server-side entry point used by the student dashboard route. */
export async function getStudentDashboardData(
  now: Date = new Date()
): Promise<StudentDashboardData> {
  const account = await requireRole("student")
  const today = toDateKey(now)
  const snapshot = await fetchStudentDashboardSnapshot({
    authUserId: account.id,
    date: today,
  })

  return buildStudentDashboardData(snapshot, today)
}
