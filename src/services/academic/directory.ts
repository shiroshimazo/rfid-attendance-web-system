import type { SupabaseClient } from "@supabase/supabase-js"

import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"
import type { AccountStatus, ProgramRow } from "@/services/teachers/directory"

export type { AccountStatus, ProgramRow }

/** A subject. The table stays `public.courses`. */
export interface CatalogCourseRow {
  id: number
  program_id: number
  course_code: string
  course_name: string
  status: AccountStatus
}

/** One year level, section, and campus grouping from `public.academic_sections`. */
export interface AcademicSectionRow {
  id: number
  program_id: number
  year_level: string
  section_code: string
  campus: string
  status: AccountStatus
}

/** A student's placement, reduced to what the catalog usage counts need. */
export interface PlacementRow {
  program_id: number
  year_level: string | null
  section: string | null
  campus: string | null
  status: AccountStatus
}

/** A teaching assignment or subject schedule, reduced the same way. */
export interface CourseUsageRow extends PlacementRow {
  course_id: number
}

export interface AcademicCatalogSnapshot {
  programs: ProgramRow[]
  courses: CatalogCourseRow[]
  sections: AcademicSectionRow[]
  students: PlacementRow[]
  assignments: CourseUsageRow[]
  schedules: CourseUsageRow[]
}

const sectionColumns = "id, program_id, year_level, section_code, campus, status"

const courseUsageColumns = "program_id, course_id, year_level, section, campus, status"

/** Every class grouping, whatever its status, for the pickers and the catalog. */
export function fetchAcademicSections(supabase: SupabaseClient) {
  return fetchAllRows<AcademicSectionRow>((from, to) =>
    supabase
      .from("academic_sections")
      .select(sectionColumns)
      .order("id", { ascending: true })
      .range(from, to)
      .returns<AcademicSectionRow[]>()
  )
}

/**
 * Reads the catalog and what still uses it with the caller's own session, so
 * Row Level Security decides what is visible. No service-role key is involved.
 */
export async function fetchAcademicCatalogSnapshot(): Promise<AcademicCatalogSnapshot> {
  const supabase = await createServerSupabaseClient()

  const [programs, courses, sections, students, assignments, schedules] =
    await Promise.all([
      fetchAllRows<ProgramRow>((from, to) =>
        supabase
          .from("programs")
          .select("id, program_code, program_name, department, status")
          .order("id", { ascending: true })
          .range(from, to)
          .returns<ProgramRow[]>()
      ),
      fetchAllRows<CatalogCourseRow>((from, to) =>
        supabase
          .from("courses")
          .select("id, program_id, course_code, course_name, status")
          .order("id", { ascending: true })
          .range(from, to)
          .returns<CatalogCourseRow[]>()
      ),
      fetchAcademicSections(supabase),
      fetchAllRows<PlacementRow>((from, to) =>
        supabase
          .from("students")
          .select("program_id, year_level, section, campus, status")
          .order("id", { ascending: true })
          .range(from, to)
          .returns<PlacementRow[]>()
      ),
      fetchAllRows<CourseUsageRow>((from, to) =>
        supabase
          .from("teacher_assignments")
          .select(courseUsageColumns)
          .order("id", { ascending: true })
          .range(from, to)
          .returns<CourseUsageRow[]>()
      ),
      fetchAllRows<CourseUsageRow>((from, to) =>
        supabase
          .from("subject_schedules")
          .select(courseUsageColumns)
          .order("id", { ascending: true })
          .range(from, to)
          .returns<CourseUsageRow[]>()
      ),
    ])

  return { programs, courses, sections, students, assignments, schedules }
}
