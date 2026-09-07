import type {
  AttendanceStatus,
  RfidCardStatus,
} from "@/services/attendance/dashboard"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus, RfidCardStatus }

export interface ReportsSnapshotRange {
  fromDate: string
  toDate: string
}

export interface ReportStudentRow {
  id: number
  student_id: string
  full_name: string
  year_level: string
  section: string
  program_id: number
  campus: string
  status: string
}

export interface ReportAttendanceRow {
  id: number
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: string
  campus: string
  rfid_card_id: number
}

export interface ReportProgramRow {
  id: number
  program_code: string
  program_name: string
}

export interface ReportRfidCardRow {
  id: number
  rfid_number: string
  student_id: number
  card_status: RfidCardStatus
}

export interface ReportSmsRow {
  id: number
  attendance_id: number
  student_id: number
  parent_contact_number: string
  message: string
  sms_status: "Pending" | "Sent" | "Failed"
  sent_at: string | null
  created_at: string
}

export interface ReportsSnapshot {
  students: ReportStudentRow[]
  attendance: ReportAttendanceRow[]
  programs: ReportProgramRow[]
  rfidCards: ReportRfidCardRow[]
  sms: ReportSmsRow[]
}

export async function fetchReportsSnapshot({
  fromDate,
  toDate,
}: ReportsSnapshotRange): Promise<ReportsSnapshot> {
  const supabase = await createServerSupabaseClient()

  const [students, attendance, programs, rfidCards, sms] = await Promise.all([
    fetchAllRows<ReportStudentRow>((from, to) =>
      supabase
        .from("students")
        .select("id, student_id, full_name, year_level, section, program_id, campus, status")
        .order("full_name", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to)
        .returns<ReportStudentRow[]>()
    ),
    fetchAllRows<ReportAttendanceRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "id, student_id, attendance_date, time_in, time_out, attendance_status, campus, rfid_card_id"
        )
        .gte("attendance_date", fromDate)
        .lte("attendance_date", toDate)
        .order("attendance_date", { ascending: true })
        .order("time_in", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to)
        .returns<ReportAttendanceRow[]>()
    ),
    fetchAllRows<ReportProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name")
        .order("program_code", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to)
        .returns<ReportProgramRow[]>()
    ),
    fetchAllRows<ReportRfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("id, student_id, rfid_number, card_status")
        .order("student_id", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to)
        .returns<ReportRfidCardRow[]>()
    ),
    // Range is the linked attendance date, including late/retried notifications.
    fetchAllRows<ReportSmsRow>((from, to) =>
      supabase.from("sms_notifications")
        .select("id, attendance_id, student_id, parent_contact_number, message, sms_status, sent_at, created_at, attendance_records!inner(attendance_date)")
        .gte("attendance_records.attendance_date", fromDate)
        .lte("attendance_records.attendance_date", toDate)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to).returns<ReportSmsRow[]>()
    ),
  ])

  return { students, attendance, programs, rfidCards, sms }
}
