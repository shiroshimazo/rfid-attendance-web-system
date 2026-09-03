import { requireRole } from "@/features/auth/server"
import { createServerSupabaseClient } from "@/services/supabase/server"

export interface StudentProfile {
  fullName: string
  studentId: string
  yearLevel: string
  section: string
  campus: string
  email: string
  contactNumber: string | null
  profilePicture: string | null
  lastSignInAt: string | null
}

interface StudentProfileRow {
  full_name: string
  student_id: string
  year_level: string
  section: string
  campus: string
  email: string
  contact_number: string | null
  profile_picture: string | null
}

/**
 * Reads the signed-in student's own profile row. Row Level Security already
 * restricts `students` to the owning student, so no service-role key is
 * involved. Academic fields are read-only; only the password can change.
 */
export async function getStudentProfile(): Promise<StudentProfile> {
  const account = await requireRole("student")
  const supabase = await createServerSupabaseClient()

  const [{ data: student, error: studentError }, { data, error: userError }] =
    await Promise.all([
      supabase
        .from("students")
        .select(
          "full_name, student_id, year_level, section, campus, email, contact_number, profile_picture"
        )
        .eq("user_id", account.id)
        .maybeSingle<StudentProfileRow>(),
      supabase.auth.getUser(),
    ])

  if (studentError) throw new Error(studentError.message)
  if (userError) throw new Error(userError.message)
  if (!student) {
    throw new Error(
      "No student record is linked to this account. Contact an administrator."
    )
  }

  return {
    fullName: student.full_name,
    studentId: student.student_id,
    yearLevel: student.year_level,
    section: student.section,
    campus: student.campus,
    email: student.email,
    contactNumber: student.contact_number,
    profilePicture: student.profile_picture,
    lastSignInAt: data.user?.last_sign_in_at ?? null,
  }
}
