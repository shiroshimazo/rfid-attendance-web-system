export const archiveCategories = [
  { key: "students", label: "Students" },
  { key: "teachers", label: "Teachers" },
  { key: "subject_schedules", label: "Subject Schedules" },
  { key: "class_schedules", label: "Class Schedules" },
] as const

export type ArchiveCategory = (typeof archiveCategories)[number]["key"]
export interface ArchiveRecord {
  id: number
  category: ArchiveCategory
  name: string
  details: string
  archivedAt: string | null
  reason: string | null
}
export interface ArchiveGroup {
  records: ArchiveRecord[]
  error?: string
}
export type ArchiveDirectory = Record<ArchiveCategory, ArchiveGroup>
