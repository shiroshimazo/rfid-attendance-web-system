import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"
import type { AccountStatus, ProgramRow } from "@/services/teachers/directory"

export type { AccountStatus, ProgramRow }

export type RfidCardStatus = "Active" | "Inactive" | "Lost" | "Deactivated"

export interface StudentRow {
  id: number
  user_id: string
  student_id: string
  full_name: string
  profile_picture: string | null
  gender: string | null
  date_of_birth: string | null
  place_of_birth: string | null
  address: string | null
  contact_number: string | null
  email: string
  parent_name: string
  parent_contact_number: string
  year_level: string
  section: string
  campus: string
  program_id: number
  status: AccountStatus
  created_at: string
}

export interface RfidCardRow {
  id: number
  student_id: number
  rfid_number: string
  card_status: RfidCardStatus
  assigned_date: string
}

export interface StudentDirectorySnapshot {
  students: StudentRow[]
  cards: RfidCardRow[]
  programs: ProgramRow[]
}

const studentColumns =
  "id, user_id, student_id, full_name, profile_picture, gender, date_of_birth, place_of_birth, address, contact_number, email, parent_name, parent_contact_number, year_level, section, campus, program_id, status, created_at"

/**
 * Reads the student directory with the caller's own session, so Row Level
 * Security decides what is visible. No service-role key is involved.
 */
export async function fetchStudentDirectorySnapshot(): Promise<StudentDirectorySnapshot> {
  const supabase = await createServerSupabaseClient()

  const [students, cards, programs] = await Promise.all([
    fetchAllRows<StudentRow>((from, to) =>
      supabase
        .from("students")
        .select(studentColumns)
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<StudentRow[]>()
    ),
    fetchAllRows<RfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("id, student_id, rfid_number, card_status, assigned_date")
        .order("assigned_date", { ascending: false })
        .range(from, to)
        .returns<RfidCardRow[]>()
    ),
    fetchAllRows<ProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name, department, status")
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<ProgramRow[]>()
    ),
  ])

  return { students, cards, programs }
}
