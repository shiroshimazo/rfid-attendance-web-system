import { requireRole } from "@/features/auth/server"
import { createServerSupabaseClient } from "@/services/supabase/server"

export interface TeacherAssignment {
  programCode: string
  programName: string
  courseCode: string
  courseName: string
  yearLevel: string | null
  section: string | null
  campus: string | null
}

export interface TeacherProfile {
  fullName: string
  teacherId: string
  department: string
  email: string
  phoneNumber: string | null
  profilePicture: string | null
  assignments: TeacherAssignment[]
  lastSignInAt: string | null
}

interface TeacherProfileRow {
  full_name: string
  teacher_id: string
  department: string
  email: string
  phone_number: string | null
  profile_picture: string | null
}

interface TeacherAssignmentRow {
  year_level: string | null
  section: string | null
  campus: string | null
  program: { program_code: string; program_name: string } | null
  course: { course_code: string; course_name: string } | null
}

/**
 * Reads the signed-in teacher's own profile row and active teaching
 * assignments. Row Level Security already restricts `teachers` and
 * `teacher_assignments` to the owning teacher, so no service-role key is
 * involved. Employment and assignment fields are read-only; only the
 * password can change.
 */
export async function getTeacherProfile(): Promise<TeacherProfile> {
  const account = await requireRole("teacher")
  const supabase = await createServerSupabaseClient()

  const [
    { data: teacher, error: teacherError },
    { data: assignments, error: assignmentsError },
    { data, error: userError },
  ] = await Promise.all([
    supabase
      .from("teachers")
      .select(
        "full_name, teacher_id, department, email, phone_number, profile_picture"
      )
      .eq("user_id", account.id)
      .maybeSingle<TeacherProfileRow>(),
    supabase
      .from("teacher_assignments")
      .select(
        "year_level, section, campus, program:programs(program_code, program_name), course:courses(course_code, course_name)"
      )
      .eq("status", "active")
      .order("id", { ascending: true })
      .returns<TeacherAssignmentRow[]>(),
    supabase.auth.getUser(),
  ])

  if (teacherError) throw new Error(teacherError.message)
  if (assignmentsError) throw new Error(assignmentsError.message)
  if (userError) throw new Error(userError.message)
  if (!teacher) {
    throw new Error(
      "No teacher record is linked to this account. Contact an administrator."
    )
  }

  return {
    fullName: teacher.full_name,
    teacherId: teacher.teacher_id,
    department: teacher.department,
    email: teacher.email,
    phoneNumber: teacher.phone_number,
    profilePicture: teacher.profile_picture,
    assignments: (assignments ?? []).map((assignment) => ({
      programCode: assignment.program?.program_code ?? "—",
      programName: assignment.program?.program_name ?? "Unknown program",
      courseCode: assignment.course?.course_code ?? "—",
      courseName: assignment.course?.course_name ?? "Unknown course",
      yearLevel: assignment.year_level,
      section: assignment.section,
      campus: assignment.campus,
    })),
    lastSignInAt: data.user?.last_sign_in_at ?? null,
  }
}
