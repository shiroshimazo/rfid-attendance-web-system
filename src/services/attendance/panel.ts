import type { AttendanceStatus } from "@/services/attendance/dashboard"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus }

/**
 * Roster filters, not database statuses: "NoRecord" selects students with no
 * stored row for the date, so it is applied after the rows are read.
 */
export type AttendanceFilterStatus = AttendanceStatus | "NoRecord" | "all"

export interface AttendancePanelFilters {
  date: string
  status?: AttendanceFilterStatus
  programId?: number | null
  yearLevel?: string | null
  section?: string | null
  search?: string
}

export interface AttendancePanelQuery {
  date: string
  status: AttendanceFilterStatus
  programId: number | null
  yearLevel: string | null
  section: string | null
  search: string
}

export interface AttendanceProgramRef {
  program_code: string
  program_name: string
}

export interface AttendancePanelStudentRow {
  id: number
  student_id: string
  full_name: string
  year_level: string
  section: string
  program_id: number
  program: AttendanceProgramRef | null
}

export interface AttendancePanelAttendanceRow {
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: string
}

export interface AttendanceProgramRow {
  id: number
  program_code: string
  program_name: string
  department: string | null
}

export interface AttendancePlacementRow {
  year_level: string
  section: string
}

export interface AttendancePanelSnapshot {
  query: AttendancePanelQuery
  students: AttendancePanelStudentRow[]
  attendance: AttendancePanelAttendanceRow[]
  programs: AttendanceProgramRow[]
  placements: AttendancePlacementRow[]
}

const studentColumns =
  "id, student_id, full_name, year_level, section, program_id, program:programs(program_code, program_name)"

const SEARCH_MAX_LENGTH = 80

function toSearchPattern(search: string) {
  const cleaned = search
    .replace(/[,()*\%"]/g, " ")
    .trim()
    .slice(0, SEARCH_MAX_LENGTH)

  return cleaned === "" ? null : `%${cleaned}%`
}

function resolveQuery(filters: AttendancePanelFilters): AttendancePanelQuery {
  return {
    date: filters.date,
    status: filters.status ?? "all",
    programId: filters.programId ?? null,
    yearLevel: filters.yearLevel?.trim() || null,
    section: filters.section?.trim() || null,
    search: filters.search?.trim() ?? "",
  }
}

export async function fetchAttendancePanelSnapshot(
  filters: AttendancePanelFilters
): Promise<AttendancePanelSnapshot> {
  const query = resolveQuery(filters)
  const pattern = toSearchPattern(query.search)
  const supabase = await createServerSupabaseClient()

  const [students, attendance, programs, placements] = await Promise.all([
    fetchAllRows<AttendancePanelStudentRow>((from, to) => {
      let request = supabase
        .from("students")
        .select(studentColumns)
        .eq("status", "active")

      if (query.programId !== null) {
        request = request.eq("program_id", query.programId)
      }
      if (query.yearLevel !== null) {
        request = request.eq("year_level", query.yearLevel)
      }
      if (query.section !== null) {
        request = request.eq("section", query.section)
      }
      if (pattern !== null) {
        request = request.or(
          `full_name.ilike.${pattern},student_id.ilike.${pattern}`
        )
      }

      return request
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<AttendancePanelStudentRow[]>()
    }),
    fetchAllRows<AttendancePanelAttendanceRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "student_id, attendance_date, time_in, time_out, attendance_status"
        )
        .eq("attendance_date", query.date)
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<AttendancePanelAttendanceRow[]>()
    ),
    fetchAllRows<AttendanceProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name, department")
        .eq("status", "active")
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<AttendanceProgramRow[]>()
    ),
    fetchAllRows<AttendancePlacementRow>((from, to) =>
      supabase
        .from("students")
        .select("year_level, section")
        .eq("status", "active")
        .order("year_level", { ascending: true })
        .range(from, to)
        .returns<AttendancePlacementRow[]>()
    ),
  ])

  return { query, students, attendance, programs, placements }
}
