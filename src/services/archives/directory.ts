import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchAllRows } from "@/services/supabase/pagination"
import { archiveCategories, type ArchiveCategory, type ArchiveDirectory, type ArchiveRecord } from "@/features/archives/model"
import { weekdayLabel } from "@/features/subject-attendance/model"
import { formatClockTime } from "@/lib/format"

interface ArchivedRow {
  id: number
  archived_at: string | null
  archive_reason: string | null
  full_name?: string
  student_id?: string
  teacher_id?: string
  department?: string
  year_level?: string
  section?: string
  campus?: string | null
  day_of_week?: number
  time_start?: string
  time_end?: string
  course?: { course_code: string; course_name: string } | null
  teacher?: { full_name: string } | null
}
const columns: Record<ArchiveCategory, string> = {
  students: "id, full_name, student_id, year_level, section, campus, archived_at, archive_reason",
  teachers: "id, full_name, teacher_id, department, archived_at, archive_reason",
  subject_schedules: "id, year_level, section, campus, day_of_week, time_start, time_end, course:courses(course_code, course_name), teacher:teachers(full_name), archived_at, archive_reason",
  class_schedules: "id, year_level, section, campus, day_of_week, time_start, archived_at, archive_reason",
}
export async function fetchArchiveDirectory(): Promise<ArchiveDirectory> {
  const supabase = await createServerSupabaseClient()
  const groups = await Promise.all(archiveCategories.map(async ({ key }) => {
    try {
      const rows = await fetchAllRows<ArchivedRow>((from, to) => supabase.from(key).select(columns[key])
        .eq("status", "archived").order("archived_at", { ascending: false, nullsFirst: false }).order("id")
        .range(from, to).returns<ArchivedRow[]>())
      const records: ArchiveRecord[] = rows.map(row => ({
        id: row.id, category: key, archivedAt: row.archived_at, reason: row.archive_reason,
        name: row.full_name ?? (key === "subject_schedules" ? [row.course?.course_code, row.course?.course_name].filter(Boolean).join(" - ") || `Subject schedule #${row.id}` : `Section ${row.section}`),
        details: [key === "students" ? row.student_id : key === "teachers" ? row.teacher_id : row.teacher?.full_name,
          row.department, row.year_level, row.section, row.campus ?? (key === "class_schedules" ? "All campuses" : undefined),
          row.day_of_week === undefined ? undefined : weekdayLabel(row.day_of_week),
          row.time_start ? formatClockTime(row.time_start) + (row.time_end ? ` - ${formatClockTime(row.time_end)}` : "") : undefined,
        ].filter(Boolean).join(" ? "),
      }))
      return [key, { records }] as const
    } catch (error) {
      return [key, { records: [], error: error instanceof Error ? error.message : "Archived records could not be loaded." }] as const
    }
  }))
  return Object.fromEntries(groups) as ArchiveDirectory
}
