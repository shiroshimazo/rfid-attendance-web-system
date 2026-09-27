import { requireRole } from "@/features/auth/server"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchSubjectEnrollments, fetchSubjectSchedules } from "@/services/attendance/subject-attendance"

interface EnrollmentStudent {
  id: number
  year_level: string
  section: string
  campus: string
  program: { program_code: string; program_name: string } | null
}

export async function getCurrentEnrollment() {
  const account = await requireRole("student")
  const supabase = await createServerSupabaseClient()
  const { data: student, error } = await supabase.from("students")
    .select("id, year_level, section, campus, program:programs(program_code, program_name)")
    .eq("user_id", account.id).maybeSingle<EnrollmentStudent>()
  if (error) throw new Error(error.message)
  if (!student) throw new Error("No student record is linked to this account. Contact an administrator.")
  const [enrollments, schedules] = await Promise.all([fetchSubjectEnrollments(), fetchSubjectSchedules()])
  const enrolledIds = new Set(enrollments.filter(row => row.student_id === student.id && row.active).map(row => row.schedule_id))
  return { student, schedules: schedules.filter(row => row.status === "active" && enrolledIds.has(row.id)) }
}
