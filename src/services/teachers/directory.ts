import {
  fetchAcademicSections,
  type AcademicSectionRow,
} from "@/services/academic/directory"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AcademicSectionRow }

export type AccountStatus = "active" | "inactive" | "archived"

export interface TeacherRow {
  id: number
  user_id: string
  teacher_id: string
  full_name: string
  profile_picture: string | null
  gender: string | null
  date_of_birth: string | null
  civil_status: string | null
  email: string
  phone_number: string | null
  department: string
  date_hired: string | null
  status: AccountStatus
  created_at: string
}

export interface TeacherAssignmentRow {
  id: number
  teacher_id: number
  program_id: number
  course_id: number
  year_level: string | null
  section: string | null
  campus: string | null
  status: AccountStatus
}

export interface ProgramRow {
  id: number
  program_code: string
  program_name: string
  department: string | null
  status: AccountStatus
}

export interface CourseRow {
  id: number
  program_id: number
  course_code: string
  course_name: string
  /** Archived subjects leave the assignment picker but still label old rows. */
  status: AccountStatus
}

export interface TeacherDirectorySnapshot {
  teachers: TeacherRow[]
  assignments: TeacherAssignmentRow[]
  programs: ProgramRow[]
  courses: CourseRow[]
  /** Class groupings behind the section and campus pickers. */
  sections: AcademicSectionRow[]
}

const teacherColumns =
  "id, user_id, teacher_id, full_name, profile_picture, gender, date_of_birth, civil_status, email, phone_number, department, date_hired, status, created_at"

/**
 * Reads the teacher directory with the caller's own session, so Row Level
 * Security decides what is visible. No service-role key is involved.
 */
export async function fetchTeacherDirectorySnapshot(): Promise<TeacherDirectorySnapshot> {
  const supabase = await createServerSupabaseClient()

  const [teachers, assignments, programs, courses, sections] = await Promise.all([
    fetchAllRows<TeacherRow>((from, to) =>
      supabase
        .from("teachers")
        .select(teacherColumns)
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<TeacherRow[]>()
    ),
    fetchAllRows<TeacherAssignmentRow>((from, to) =>
      supabase
        .from("teacher_assignments")
        .select(
          "id, teacher_id, program_id, course_id, year_level, section, campus, status"
        )
        .order("id", { ascending: true })
        .range(from, to)
        .returns<TeacherAssignmentRow[]>()
    ),
    fetchAllRows<ProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name, department, status")
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<ProgramRow[]>()
    ),
    fetchAllRows<CourseRow>((from, to) =>
      supabase
        .from("courses")
        .select("id, program_id, course_code, course_name, status")
        .order("course_code", { ascending: true })
        .range(from, to)
        .returns<CourseRow[]>()
    ),
    fetchAcademicSections(supabase),
  ])

  return { teachers, assignments, programs, courses, sections }
}
