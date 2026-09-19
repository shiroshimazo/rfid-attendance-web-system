import type { SupabaseClient } from "@supabase/supabase-js"

/** Check the actual catalog before creating Auth accounts or saving profiles. */
export async function assertActiveProgram(supabase: SupabaseClient, programId: number) {
  const { data, error } = await supabase.from("programs")
    .select("id, status").eq("id", programId)
    .maybeSingle<{ id: number; status: string }>()
  if (error) return error.message
  if (!data) return "That program no longer exists."
  return data.status === "active"
    ? null : "Select an active program."
}

export async function assertActiveAssignments(
  supabase: SupabaseClient, assignments: { programId: number; courseId: number }[]
) {
  for (const programId of new Set(assignments.map(row => row.programId))) {
    const error = await assertActiveProgram(supabase, programId)
    if (error) return error
  }
  const { data, error } = await supabase.from("courses").select("id, program_id, status")
    .in("id", [...new Set(assignments.map(row => row.courseId))])
  if (error) return error.message
  if (assignments.some(row => !data?.some(course => course.id === row.courseId && course.program_id === row.programId && course.status === "active"))) {
    return "Select an active subject belonging to the selected program."
  }
  return null
}
