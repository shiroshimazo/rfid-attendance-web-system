import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchAllRows } from "@/services/supabase/pagination"
import type { SubjectAttendanceRow, SubjectSchedule, SubjectStudent } from "@/features/subject-attendance/model"

export async function fetchSubjectAttendance(range: { from?: string; to?: string } = {}) {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<SubjectAttendanceRow>((from, to) => {
    let query = supabase.from("subject_attendance").select("id, schedule_id, student_id, attendance_date, attendance_status, time_start, time_end, student_number, student_name, teacher_name, course_code, course_name, program_code, year_level, section, campus, confirmed_at")
    if (range.from) query = query.gte("attendance_date", range.from)
    if (range.to) query = query.lte("attendance_date", range.to)
    return query.order("attendance_date", { ascending: false }).order("id", { ascending: false }).range(from, to).returns<SubjectAttendanceRow[]>()
  })
}

export async function fetchSubjectSchedules() {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<SubjectSchedule>((from, to) => supabase.from("subject_schedules")
    .select("id, program_id, teacher_id, course_id, year_level, section, campus, day_of_week, time_start, time_end, status, course:courses(course_code, course_name), teacher:teachers(full_name)")
    .order("day_of_week").order("time_start").order("id").range(from, to).returns<SubjectSchedule[]>())
}

export async function fetchSubjectStudents() {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<SubjectStudent>((from, to) => supabase.from("students")
    .select("id, student_id, full_name, program_id, year_level, section, campus")
    .eq("status", "active").order("full_name").order("id").range(from, to).returns<SubjectStudent[]>())
}

export interface SubjectAssignment {
  id: number
  year_level: string | null
  section: string | null
  campus: string | null
  teacher: { full_name: string; status: string } | null
  course: { course_code: string; course_name: string } | null
}

export async function fetchSubjectAssignments() {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<SubjectAssignment>((from, to) => supabase.from("teacher_assignments")
    .select("id, year_level, section, campus, teacher:teachers(full_name, status), course:courses(course_code, course_name)")
    .eq("status", "active").order("id").range(from, to).returns<SubjectAssignment[]>())
}
