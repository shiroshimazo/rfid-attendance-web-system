import type {
  AttendanceStatus,
  RfidCardStatus,
} from "@/services/attendance/dashboard"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus, RfidCardStatus }

export type SmsStatus = "Pending" | "Sent" | "Failed"

export interface StudentAttendanceRecordRow {
  id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: string
  campus: string
  rfid_card_id: number
}

export interface StudentAttendanceCardRow {
  id: number
  rfid_number: string
  card_status: RfidCardStatus
}

export interface StudentAttendanceSmsRow {
  attendance_id: number
  sms_status: SmsStatus
  sent_at: string | null
  created_at: string
}

export interface StudentAttendanceSnapshot {
  records: StudentAttendanceRecordRow[]
  cards: StudentAttendanceCardRow[]
  sms: StudentAttendanceSmsRow[]
}

/**
 * Reads only the signed-in student's own rows. Row Level Security already
 * restricts these tables to the owning student, so no service-role key is
 * involved. Every query is scoped by the resolved student id.
 */
export async function fetchStudentAttendanceSnapshot({
  authUserId,
}: {
  /** Auth user id; resolved to exactly one row via `students.user_id`. */
  authUserId: string
}): Promise<StudentAttendanceSnapshot> {
  const supabase = await createServerSupabaseClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", authUserId)
    .maybeSingle<{ id: number }>()

  if (studentError) throw new Error(studentError.message)
  if (!student) {
    throw new Error(
      "No student record is linked to this account. Contact an administrator."
    )
  }

  const [records, cards, sms] = await Promise.all([
    fetchAllRows<StudentAttendanceRecordRow>((from, to) => supabase
      .from("attendance_records")
      .select("id, attendance_date, time_in, time_out, attendance_status, campus, rfid_card_id")
      .eq("student_id", student.id)
      .order("attendance_date", { ascending: false }).order("id", { ascending: false })
      .range(from, to).returns<StudentAttendanceRecordRow[]>()),
    fetchAllRows<StudentAttendanceCardRow>((from, to) => supabase
      .from("rfid_cards").select("id, rfid_number, card_status")
      .eq("student_id", student.id).order("id", { ascending: true })
      .range(from, to).returns<StudentAttendanceCardRow[]>()),
    fetchAllRows<StudentAttendanceSmsRow>((from, to) => supabase
      .from("sms_notifications").select("attendance_id, sms_status, sent_at, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .range(from, to).returns<StudentAttendanceSmsRow[]>()),
  ])
  return { records, cards, sms }
}
