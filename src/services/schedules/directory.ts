import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"
import type { AccountStatus, ProgramRow } from "@/services/teachers/directory"

export type { AccountStatus, ProgramRow }

/** One weekday of one section, as stored by `public.class_schedules`. */
export interface ClassScheduleRow {
  id: number
  program_id: number
  year_level: string
  section: string
  campus: string | null
  day_of_week: number
  time_start: string
  grace_minutes: number
  status: AccountStatus
  updated_at: string
}

export interface ScheduleDirectorySnapshot {
  schedules: ClassScheduleRow[]
  programs: ProgramRow[]
}

const scheduleColumns =
  "id, program_id, year_level, section, campus, day_of_week, time_start, grace_minutes, status, updated_at"

/**
 * Reads every class schedule with the caller's own session, so Row Level
 * Security decides what is visible. No service-role key is involved.
 */
export async function fetchScheduleDirectorySnapshot(): Promise<ScheduleDirectorySnapshot> {
  const supabase = await createServerSupabaseClient()

  const [schedules, programs] = await Promise.all([
    fetchAllRows<ClassScheduleRow>((from, to) =>
      supabase
        .from("class_schedules")
        .select(scheduleColumns)
        .order("section", { ascending: true })
        .order("day_of_week", { ascending: true })
        .range(from, to)
        .returns<ClassScheduleRow[]>()
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

  return { schedules, programs }
}
