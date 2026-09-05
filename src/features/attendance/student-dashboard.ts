import { isAttendanceStatus, recordStatus, type AttendanceRowStatus } from "@/features/attendance/schema"
import { requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
import {
  fetchStudentDashboardSnapshot,
  type SmsStatus,
  type StudentDashboardSnapshot,
} from "@/services/attendance/student-dashboard"

export type { AttendanceRowStatus, SmsStatus }

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
  status: AttendanceRowStatus
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
  /** The Asia/Manila yyyy-MM-dd date this snapshot was built for. */
  today: string
  student: StudentIdentity
  attendance: TodayAttendance
  rfid: StudentRfidInfo
  sms: ParentSmsInfo
  kpis: StudentDashboardKpis
}

/** Preserve the recorded first-tap classification; never infer an absence. */
function resolveTodayStatus(
  attendance: StudentDashboardSnapshot["attendance"]
): TodayAttendance {
  if (
    attendance &&
    (attendance.attendance_status === "Present" ||
      attendance.attendance_status === "Late")
  ) {
    return {
      status: attendance.attendance_status,
      timeIn: attendance.time_in,
      timeOut: attendance.time_out,
    }
  }

  const historical = attendance && !isAttendanceStatus(attendance.attendance_status)

  return {
    status: attendance ? recordStatus(attendance.attendance_status) : "NoRecord",
    timeIn: historical ? attendance.time_in : null,
    timeOut: historical ? attendance.time_out : null,
  }
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
 * An absence is final here only when an Absent status is stored for a date
 * on or before today in Asia/Manila. Missing days, including past weekdays,
 * remain provisional: W08/W09 do not yet define an absence finalization
 * policy or a complete expected-attendance calendar. Historical values are excluded.
 */
export function countPersonalAbsentDays(
  history: PersonalHistoryDay[],
  today: string
): number {
  return new Set(
    history
      .filter(
        (record) =>
          record.attendance_status === "Absent" &&
          record.attendance_date <= today
      )
      .map((record) => record.attendance_date)
  ).size
}

function buildKpis(
  history: StudentDashboardSnapshot["history"],
  today: string
): StudentDashboardKpis {
  const currentHistory = history.filter((record) =>
    isAttendanceStatus(record.attendance_status)
  )

  return {
    totalPresent: currentHistory.filter((record) =>
      isAttended(record.attendance_status)
    ).length,
    totalLate: currentHistory.filter(
      (record) => record.attendance_status === "Late"
    ).length,
    totalAbsent: countPersonalAbsentDays(history, today),
    totalRfidTaps:
      currentHistory.length + currentHistory.filter((record) => record.time_out).length,
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
  const today = schoolDateKey(now)
  const snapshot = await fetchStudentDashboardSnapshot({
    authUserId: account.id,
    date: today,
  })

  return buildStudentDashboardData(snapshot, today)
}
