import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"
import type { AccountStatus, ProgramRow } from "@/services/teachers/directory"

export type { AccountStatus, ProgramRow }

export type RfidCardStatus = "Active" | "Inactive" | "Lost" | "Deactivated"

export interface RfidCardRow {
  id: number
  student_id: number
  rfid_number: string
  card_status: RfidCardStatus
  assigned_date: string
  created_at: string
  updated_at: string
}

/** Only the student columns the card directory renders or filters on. */
export interface CardHolderRow {
  id: number
  student_id: string
  full_name: string
  email: string
  program_id: number
  year_level: string
  section: string
  campus: string
  status: AccountStatus
}

export interface RfidCardDirectorySnapshot {
  cards: RfidCardRow[]
  students: CardHolderRow[]
  programs: ProgramRow[]
}

const cardColumns =
  "id, student_id, rfid_number, card_status, assigned_date, created_at, updated_at"

const holderColumns =
  "id, student_id, full_name, email, program_id, year_level, section, campus, status"

/**
 * Reads every registered card with the caller's own session, so Row Level
 * Security decides what is visible. No service-role key is involved.
 */
export async function fetchRfidCardDirectorySnapshot(): Promise<RfidCardDirectorySnapshot> {
  const supabase = await createServerSupabaseClient()

  const [cards, students, programs] = await Promise.all([
    fetchAllRows<RfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select(cardColumns)
        .order("assigned_date", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to)
        .returns<RfidCardRow[]>()
    ),
    fetchAllRows<CardHolderRow>((from, to) =>
      supabase
        .from("students")
        .select(holderColumns)
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<CardHolderRow[]>()
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

  return { cards, students, programs }
}
