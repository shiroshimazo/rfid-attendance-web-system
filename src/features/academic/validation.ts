import type { SupabaseClient } from "@supabase/supabase-js"
import { PILOT_PROGRAM_CODE } from "@/features/academic/pilot"

/** Check the actual catalog before creating Auth accounts or saving profiles. */
export async function assertPilotProgram(supabase: SupabaseClient, programId: number) {
  const { data, error } = await supabase.from("programs")
    .select("id, program_code").eq("id", programId)
    .maybeSingle<{ id: number; program_code: string }>()
  if (error) return error.message
  if (!data) return "That program no longer exists."
  return data.program_code.trim().toUpperCase() === PILOT_PROGRAM_CODE
    ? null : "Program must be BSIT during the pilot."
}

export async function assertPilotAssignments(
  supabase: SupabaseClient, assignments: { programId: number; courseId: number }[]
) {
  for (const programId of new Set(assignments.map(row => row.programId))) {
    const error = await assertPilotProgram(supabase, programId)
    if (error) return error
  }
  const { data, error } = await supabase.from("courses").select("id, program_id")
    .in("id", [...new Set(assignments.map(row => row.courseId))])
  if (error) return error.message
  if (assignments.some(row => !data?.some(course => course.id === row.courseId && course.program_id === row.programId))) {
    return "The selected subject does not belong to BSIT."
  }
  return null
}
