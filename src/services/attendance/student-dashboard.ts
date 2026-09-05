import type {
  AttendanceStatus,
  RfidCardStatus,
} from "@/services/attendance/dashboard"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus, RfidCardStatus }

export type SmsStatus = "Pending" | "Sent" | "Failed"

export interface StudentDashboardStudentRow {
  id: number
  student_id: string
  full_name: string
  profile_picture: string | null
  year_level: string
  section: string
  campus: string
}

export interface StudentDashboardAttendanceRow {
  id: number
  time_in: string
  time_out: string | null
  attendance_status: string
}

export interface StudentDashboardCardRow {
  rfid_number: string
  card_status: RfidCardStatus
  assigned_date: string
}

export interface StudentDashboardSmsRow {
  sms_status: SmsStatus
  sent_at: string | null
}

export interface StudentDashboardHistoryRow {
  attendance_date: string
  attendance_status: string
  time_out: string | null
}

export interface StudentDashboardSnapshot {
  student: StudentDashboardStudentRow
  attendance: StudentDashboardAttendanceRow | null
  cards: StudentDashboardCardRow[]
  sms: StudentDashboardSmsRow | null
  history: StudentDashboardHistoryRow[]
}

export interface StudentDashboardSnapshotInput {
  /** Auth user id; resolved to exactly one row via `students.user_id`. */
  authUserId: string
  /** Inclusive `yyyy-MM-dd` date, normally today. */
  date: string
}

/**
 * Reads only the signed-in student's own rows. Row Level Security already
 * restricts these tables to the owning student, so no service-role key is
 * involved. Every query is scoped by the resolved student id.
 */
export async function fetchStudentDashboardSnapshot({
  authUserId,
  date,
}: StudentDashboardSnapshotInput): Promise<StudentDashboardSnapshot> {
  const supabase = await createServerSupabaseClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select(
      "id, student_id, full_name, profile_picture, year_level, section, campus"
    )
    .eq("user_id", authUserId)
    .maybeSingle<StudentDashboardStudentRow>()

  if (studentError) throw new Error(studentError.message)
  if (!student) {
    throw new Error(
      "No student record is linked to this account. Contact an administrator."
    )
  }

  const [
    { data: attendance, error: attendanceError },
    { data: cards, error: cardsError },
    { data: history, error: historyError },
  ] = await Promise.all([
    supabase
      .from("attendance_records")
      .select("id, time_in, time_out, attendance_status")
      .eq("student_id", student.id)
      .eq("attendance_date", date)
      .maybeSingle<StudentDashboardAttendanceRow>(),
    supabase
      .from("rfid_cards")
      .select("rfid_number, card_status, assigned_date")
      .eq("student_id", student.id)
      .order("assigned_date", { ascending: false })
      .returns<StudentDashboardCardRow[]>(),
    supabase
      .from("attendance_records")
      .select("attendance_date, attendance_status, time_out")
      .eq("student_id", student.id)
      .order("attendance_date", { ascending: true })
      .returns<StudentDashboardHistoryRow[]>(),
  ])

  if (attendanceError) throw new Error(attendanceError.message)
  if (cardsError) throw new Error(cardsError.message)
  if (historyError) throw new Error(historyError.message)

  let sms: StudentDashboardSmsRow | null = null

  // The parent notification belongs to today's tap, so there is nothing to
  // read until the first tap creates an attendance record.
  if (attendance) {
    const { data: smsRow, error: smsError } = await supabase
      .from("sms_notifications")
      .select("sms_status, sent_at")
      .eq("attendance_id", attendance.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<StudentDashboardSmsRow>()

    if (smsError) throw new Error(smsError.message)
    sms = smsRow
  }

  return { student, attendance, cards: cards ?? [], sms, history: history ?? [] }
}
