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
}

export interface ReportAttendanceRow {
  id: number
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: AttendanceStatus
}

export interface ReportProgramRow {
  id: number
  program_code: string
  program_name: string
}

export interface ReportRfidCardRow {
  student_id: number
  card_status: RfidCardStatus
}

export interface ReportsSnapshot {
  students: ReportStudentRow[]
  attendance: ReportAttendanceRow[]
  programs: ReportProgramRow[]
  rfidCards: ReportRfidCardRow[]
}

export async function fetchReportsSnapshot({
  fromDate,
  toDate,
}: ReportsSnapshotRange): Promise<ReportsSnapshot> {
  const supabase = await createServerSupabaseClient()

  const [students, attendance, programs, rfidCards] = await Promise.all([
    fetchAllRows<ReportStudentRow>((from, to) =>
      supabase
        .from("students")
        .select("id, student_id, full_name, year_level, section, program_id")
        .eq("status", "active")
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<ReportStudentRow[]>()
    ),
    fetchAllRows<ReportAttendanceRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "id, student_id, attendance_date, time_in, time_out, attendance_status"
        )
        .gte("attendance_date", fromDate)
        .lte("attendance_date", toDate)
        .order("attendance_date", { ascending: true })
        .order("time_in", { ascending: true })
        .range(from, to)
        .returns<ReportAttendanceRow[]>()
    ),
    fetchAllRows<ReportProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name")
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<ReportProgramRow[]>()
    ),
    fetchAllRows<ReportRfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("student_id, card_status")
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<ReportRfidCardRow[]>()
    ),
  ])

  return { students, attendance, programs, rfidCards }
}
