import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type AttendanceStatus = "Present" | "Late" | "Absent" | "Excused"

export type RfidCardStatus = "Active" | "Inactive" | "Lost" | "Deactivated"

export interface ProgramRef {
  program_code: string
  program_name: string
}

export interface StudentRow {
  id: number
  student_id: string
  full_name: string
  year_level: string
  section: string
  program_id: number
  program: ProgramRef | null
}

export interface AttendanceRow {
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: AttendanceStatus
}

export interface RfidCardRow {
  student_id: number
  card_status: RfidCardStatus
}

export interface DashboardSnapshot {
  students: StudentRow[]
  attendance: AttendanceRow[]
  cards: RfidCardRow[]
}

export interface DashboardSnapshotRange {
  /** Inclusive `yyyy-MM-dd` lower bound for attendance history. */
  fromDate: string
  /** Inclusive `yyyy-MM-dd` upper bound, normally today. */
  toDate: string
}

/**
 * Reads every row the admin dashboard aggregates from. Row Level Security
 * already restricts these tables to admin and teacher accounts, so no
 * service-role key is involved.
 */
export async function fetchAdminDashboardSnapshot({
  fromDate,
  toDate,
}: DashboardSnapshotRange): Promise<DashboardSnapshot> {
  const supabase = await createServerSupabaseClient()

  const [students, attendance, cards] = await Promise.all([
    fetchAllRows<StudentRow>((from, to) =>
      supabase
        .from("students")
        .select(
          "id, student_id, full_name, year_level, section, program_id, program:programs(program_code, program_name)"
        )
        .eq("status", "active")
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<StudentRow[]>()
    ),
    fetchAllRows<AttendanceRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "student_id, attendance_date, time_in, time_out, attendance_status"
        )
        .gte("attendance_date", fromDate)
        .lte("attendance_date", toDate)
        .order("attendance_date", { ascending: true })
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<AttendanceRow[]>()
    ),
    fetchAllRows<RfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("student_id, card_status")
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<RfidCardRow[]>()
    ),
  ])

  return { students, attendance, cards }
}
