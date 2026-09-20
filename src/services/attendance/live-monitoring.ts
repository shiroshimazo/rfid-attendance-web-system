import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export interface LiveMonitoringRecord {
  id: number
  attendance_date: string
  time_in: string | null
  time_out: string | null
  student: {
    student_id: string
    full_name: string
    section: string
    program_id: number
    program: { program_code: string; program_name: string } | null
  } | null
  card: { rfid_number: string } | null
}

/** Read today's recorded taps using the administrator's session and existing RLS. */
export async function fetchLiveMonitoringRecords(date: string) {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<LiveMonitoringRecord>((from, to) => supabase
    .from("attendance_records")
    .select(`id, attendance_date, time_in, time_out,
      student:students!attendance_records_student_id_fkey(student_id, full_name, section, program_id, program:programs(program_code, program_name)),
      card:rfid_cards!attendance_card_belongs_to_student_fk(rfid_number)`)
    .eq("attendance_date", date)
    .in("attendance_status", ["Present", "Late"])
    .order("id", { ascending: false })
    .range(from, to)
    .returns<LiveMonitoringRecord[]>())
}
