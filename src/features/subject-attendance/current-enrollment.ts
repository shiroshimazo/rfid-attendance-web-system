import "server-only"
import { requireRole } from "@/features/auth/server"
import { createAdminSupabaseClient } from "@/services/supabase/admin"
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
  const currentSchedules = schedules.filter(row => row.status === "active" && enrolledIds.has(row.id))
  const teacherIds = [...new Set(currentSchedules.map(row => row.teacher_id))]
  if (!teacherIds.length) return { student, schedules: currentSchedules }

  // Student RLS intentionally hides teacher profiles. Resolve only names for
  // schedules already authorized by the student's session and active enrollment.
  const { data: teachers, error: teacherError } = await createAdminSupabaseClient()
    .from("teachers").select("id, full_name").in("id", teacherIds)
    .returns<{ id: number; full_name: string }[]>()
  // Keep enrollment usable if the narrow teacher-name grant is not installed.
  if (teacherError) return { student, schedules: currentSchedules, teacherNamesUnavailable: true }
  const names = new Map((teachers ?? []).map(teacher => [teacher.id, teacher.full_name]))
  return {
    student,
    schedules: currentSchedules.map(schedule => ({
      ...schedule,
      teacher: names.has(schedule.teacher_id) ? { full_name: names.get(schedule.teacher_id)! } : null,
    })),
  }
}
