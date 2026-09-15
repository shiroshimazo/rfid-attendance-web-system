import { z } from "zod"

import {
  PILOT_CAMPUSES,
  PILOT_PROGRAM_CODE,
  PILOT_SECTION_CODES,
  PILOT_SECTIONS,
  PILOT_YEAR_LEVEL,
  isPilotCampus,
  isPilotSection,
} from "@/features/academic/pilot"
import {
  accountStatuses,
  databaseIdSchema,
  optionalText,
  selectedId,
} from "@/features/shared/schema"
import { formatNumber } from "@/lib/format"

type AccountStatus = (typeof accountStatuses)[number]

/** Forms choose between these; archiving is a separate, confirmed action. */
export const catalogFormStatuses = ["active", "inactive"] as const

export type CatalogFormStatus = (typeof catalogFormStatuses)[number]

/** `course` is a subject: the table stays `public.courses`. */
export const catalogKinds = ["program", "course", "section"] as const

export type CatalogKind = (typeof catalogKinds)[number]

export const academicTabs = ["programs", "subjects", "sections"] as const

export type AcademicTab = (typeof academicTabs)[number]

/** `?tab=subjects` deep-links a tab; anything else opens Programs. */
export function parseAcademicTab(
  value: string | string[] | undefined
): AcademicTab {
  const candidate = (Array.isArray(value) ? value[0] : value)
    ?.trim()
    .toLowerCase()

  return academicTabs.find((tab) => tab === candidate) ?? "programs"
}

function listPhrase(items: readonly string[]) {
  if (items.length <= 2) return items.join(" and ")

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

/** The groupings the pilot accepts, for dialogs that may create catalog-only entries. */
export const pilotGroupingScope = `${PILOT_PROGRAM_CODE} ${PILOT_YEAR_LEVEL} sections ${
  PILOT_SECTION_CODES[0]
}–${PILOT_SECTION_CODES[PILOT_SECTION_CODES.length - 1]} at ${listPhrase(PILOT_CAMPUSES)}`

function collapseSpaces(value: string) {
  return value.replace(/\s+/g, " ")
}

/** The catalog's existing spelling when only letter case differs. */
export function catalogSpelling(value: string, existing: readonly string[]) {
  const normalized = collapseSpaces(value.trim())

  return (
    existing.find(
      (candidate) => candidate.toLowerCase() === normalized.toLowerCase()
    ) ?? normalized
  )
}

/** Catalog wording is trimmed and single-spaced so near-duplicates cannot slip in. */
const catalogText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .min(2, message)
    .max(max, `Use at most ${max} characters`)
    .transform(collapseSpaces)

/** The unique indexes compare codes case-insensitively, so codes are stored uppercase. */
const codeField = (label: string, max: number, pattern: RegExp, allowed: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `Use at most ${max} characters`)
    .regex(pattern, `${label} can use ${allowed}`)
    .transform((value) => collapseSpaces(value).toUpperCase())

const codeCharacters = "letters, numbers, spaces, periods, slashes, and hyphens"

export const programFormSchema = z.object({
  programCode: codeField("Program code", 20, /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/, codeCharacters),
  programName: catalogText(120, "Program name is required"),
  department: optionalText(120).transform(collapseSpaces),
  status: z.enum(catalogFormStatuses),
})

export const createProgramSchema = programFormSchema

export const updateProgramSchema = programFormSchema.extend({
  id: databaseIdSchema,
})

/** Browser shape: the program select holds its id as a string. */
export const courseFormSchema = z.object({
  programId: z.string().min(1, "Select a program"),
  courseCode: codeField("Subject code", 30, /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/, codeCharacters),
  courseName: catalogText(160, "Subject name is required"),
  status: z.enum(catalogFormStatuses),
})

export const createCourseSchema = courseFormSchema.extend({
  programId: selectedId("Select a program"),
})

/**
 * No program here: `courses_id_program_unique (id, program_id)` anchors the
 * composite foreign keys from teacher_assignments and subject_schedules.
 */
export const updateCourseSchema = courseFormSchema
  .omit({ programId: true })
  .extend({ id: databaseIdSchema })

export const sectionFormSchema = z.object({
  programId: z.string().min(1, "Select a program"),
  yearLevel: catalogText(40, "Year level is required"),
  sectionCode: codeField("Section code", 20, /^[A-Za-z0-9][A-Za-z0-9-]*$/, "letters, numbers, and hyphens"),
  campus: catalogText(80, "Campus is required"),
})

export const createSectionSchema = sectionFormSchema.extend({
  programId: selectedId("Select a program"),
})

/** Program, year level, section code, and campus are fixed once created. */
export const sectionStatusFormSchema = z.object({
  status: z.enum(catalogFormStatuses),
})

export const updateSectionSchema = sectionStatusFormSchema.extend({
  id: databaseIdSchema,
})

export const catalogStatusSchema = z.object({
  kind: z.enum(catalogKinds),
  id: databaseIdSchema,
  status: z.enum(["active", "archived"]),
})

export type ProgramFormValues = z.infer<typeof programFormSchema>
export type CourseFormValues = z.infer<typeof courseFormSchema>
export type SectionFormValues = z.infer<typeof sectionFormSchema>
export type SectionStatusFormValues = z.infer<typeof sectionStatusFormSchema>
export type CreateProgramInput = z.input<typeof createProgramSchema>
export type UpdateProgramInput = z.input<typeof updateProgramSchema>
export type CreateCourseInput = z.input<typeof createCourseSchema>
export type UpdateCourseInput = z.input<typeof updateCourseSchema>
export type CreateSectionInput = z.input<typeof createSectionSchema>
export type UpdateSectionInput = z.input<typeof updateSectionSchema>
export type CatalogStatusInput = z.input<typeof catalogStatusSchema>

export function isPilotProgramCode(code: string) {
  return code.trim().toUpperCase() === PILOT_PROGRAM_CODE
}

/** Inside the pilot scope, so the student, teacher, and schedule saves accept it. */
export function isAssignableGrouping(grouping: {
  programCode: string
  yearLevel: string
  sectionCode: string
  campus: string
}) {
  return (
    isPilotProgramCode(grouping.programCode) &&
    grouping.yearLevel === PILOT_YEAR_LEVEL &&
    isPilotSection(grouping.sectionCode) &&
    isPilotCampus(grouping.campus)
  )
}

export const catalogStatusFilters = [
  { value: "current", label: "Active and inactive" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All statuses" },
] as const

export type CatalogStatusFilter = (typeof catalogStatusFilters)[number]["value"]

/** Archived entries stay out of the default view, one filter away. */
export function matchesStatusFilter(
  status: AccountStatus,
  filter: CatalogStatusFilter
) {
  if (filter === "all") return true
  if (filter === "current") return status !== "archived"

  return status === filter
}

export type UsagePart = readonly [count: number, singular: string, plural: string]

/** `3 subjects and 41 students`, skipping zero counts. */
export function describeUsage(parts: readonly UsagePart[]) {
  return listPhrase(
    parts
      .filter(([count]) => count > 0)
      .map(
        ([count, singular, plural]) =>
          `${formatNumber(count)} ${count === 1 ? singular : plural}`
      )
  )
}

/** A full sentence, e.g. "3 subjects and 41 students still use this program." */
export function usageSentence(parts: readonly UsagePart[], target: string) {
  const counted = parts.filter(([count]) => count > 0)

  if (counted.length === 0) return ""

  const singular = counted.length === 1 && counted[0][0] === 1

  return `${describeUsage(counted)} still ${singular ? "uses" : "use"} ${target}.`
}

/** What still depends on a program; any of it blocks archiving. */
export interface ProgramUsage {
  courses: number
  students: number
  sections: number
  assignments: number
  schedules: number
}

export function programUsageParts(usage: ProgramUsage): UsagePart[] {
  return [
    [usage.courses, "subject", "subjects"],
    [usage.students, "student", "students"],
    [usage.sections, "class grouping", "class groupings"],
    [usage.assignments, "teaching assignment", "teaching assignments"],
    [usage.schedules, "subject schedule", "subject schedules"],
  ]
}

/** Why a program cannot be archived yet, or null when nothing uses it. */
export function programArchiveBlocker(program: {
  code: string
  isPilot: boolean
  usage: ProgramUsage
}) {
  if (program.isPilot) {
    return `${program.code} is the pilot program, so it stays in the catalog while the pilot runs.`
  }

  const sentence = usageSentence(programUsageParts(program.usage), "this program")

  return sentence ? `${sentence} Archive or reassign them first.` : null
}

/*
 * View models. Declared here, beside the schemas, so client components never
 * reach into the service layer.
 */

export interface ProgramView {
  id: number
  code: string
  name: string
  department: string | null
  status: AccountStatus
  /** The one program students, teachers, and schedules may use during the pilot. */
  isPilot: boolean
  usage: ProgramUsage
}

export interface CourseView {
  id: number
  programId: number
  programCode: string
  programName: string
  programStatus: AccountStatus
  /** Offered to teacher assignments and subject schedules during the pilot. */
  isPilot: boolean
  code: string
  name: string
  status: AccountStatus
  /** Active teaching assignments and subject schedules that name this subject. */
  assignments: number
  schedules: number
}

export interface SectionView {
  id: number
  programId: number
  programCode: string
  programStatus: AccountStatus
  yearLevel: string
  sectionCode: string
  campus: string
  status: AccountStatus
  assignable: boolean
  /** Non-archived students and active teaching assignments placed here. */
  students: number
  assignments: number
}

export interface AcademicKpis {
  activePrograms: number
  archivedPrograms: number
  activeCourses: number
  pilotCourses: number
  activeSections: number
  assignableSections: number
  /** Active entries the pilot cannot assign yet. */
  catalogOnly: number
}

export interface AcademicCatalog {
  programs: ProgramView[]
  courses: CourseView[]
  sections: SectionView[]
  kpis: AcademicKpis
  /** Spellings already in the catalog, suggested when adding a grouping. */
  yearLevels: string[]
  campuses: string[]
}

/** One catalog grouping as offered to the student and teacher pickers. */
export interface ClassGroupingOption {
  programId: number
  yearLevel: string
  sectionCode: string
  campus: string
  status: AccountStatus
  assignable: boolean
}

export function toClassGroupingOptions(
  sections: readonly {
    program_id: number
    year_level: string
    section_code: string
    campus: string
    status: AccountStatus
  }[],
  programs: readonly { id: number; program_code: string }[]
): ClassGroupingOption[] {
  const programCodes = new Map(
    programs.map((program) => [program.id, program.program_code])
  )

  return sections.map((row) => ({
    programId: row.program_id,
    yearLevel: row.year_level,
    sectionCode: row.section_code,
    campus: row.campus,
    status: row.status,
    assignable: isAssignableGrouping({
      programCode: programCodes.get(row.program_id) ?? "",
      yearLevel: row.year_level,
      sectionCode: row.section_code,
      campus: row.campus,
    }),
  }))
}

export interface PickerOption {
  value: string
  label: string
  disabled: boolean
}

interface GroupingScope {
  programId: number | null
  yearLevel: string
}

const sessionLabels = { morning: "Morning", afternoon: "Afternoon" } as const

const pilotSessions = new Map(
  PILOT_SECTIONS.map((section) => [section.code, section.session])
)

const collator = new Intl.Collator(undefined, { numeric: true })

function inScope(
  groupings: readonly ClassGroupingOption[],
  scope: GroupingScope
) {
  if (scope.programId === null) return []

  return groupings.filter(
    (row) =>
      row.programId === scope.programId && row.yearLevel === scope.yearLevel
  )
}

/** Keeps a saved value selectable after its grouping left the catalog. */
function withCurrent(options: PickerOption[], current: string, known: boolean) {
  if (!current || options.some((option) => option.value === current)) {
    return options
  }

  return [
    ...options,
    {
      value: current,
      label: `${current} — ${known ? "No longer offered" : "Not in catalog"}`,
      disabled: false,
    },
  ]
}

/**
 * Active sections for one program and year level. Catalog-only groupings stay
 * visible but disabled, because the pilot saves would reject them.
 */
export function sectionPickerOptions(
  groupings: readonly ClassGroupingOption[],
  scope: GroupingScope & { current: string }
): PickerOption[] {
  const rows = inScope(groupings, scope)
  const active = rows.filter((row) => row.status === "active")
  const codes = [...new Set(active.map((row) => row.sectionCode))].sort(
    collator.compare
  )

  const options = codes.map((code) => {
    const assignable = active.some(
      (row) => row.sectionCode === code && row.assignable
    )
    const session = pilotSessions.get(code)

    return {
      value: code,
      label: !assignable
        ? `${code} — Catalog only`
        : session
          ? `${code} — ${sessionLabels[session]}`
          : code,
      disabled: !assignable,
    }
  })

  return withCurrent(
    options,
    scope.current,
    rows.some((row) => row.sectionCode === scope.current)
  )
}

/** Campuses for the chosen section, or for the whole year level before one is chosen. */
export function campusPickerOptions(
  groupings: readonly ClassGroupingOption[],
  scope: GroupingScope & { section: string; current: string }
): PickerOption[] {
  const rows = inScope(groupings, scope).filter(
    (row) => !scope.section || row.sectionCode === scope.section
  )
  const active = rows.filter((row) => row.status === "active")
  const campuses = [...new Set(active.map((row) => row.campus))].sort(
    collator.compare
  )

  const options = campuses.map((campus) => {
    const assignable = active.some(
      (row) => row.campus === campus && row.assignable
    )

    return {
      value: campus,
      label: assignable ? campus : `${campus} — Catalog only`,
      disabled: !assignable,
    }
  })

  return withCurrent(
    options,
    scope.current,
    rows.some((row) => row.campus === scope.current)
  )
}

/** Whether the campus can still be picked alongside a newly chosen section. */
export function isOfferedCampus(
  groupings: readonly ClassGroupingOption[],
  scope: GroupingScope & { section: string },
  campus: string
) {
  return campusPickerOptions(groupings, { ...scope, current: "" }).some(
    (option) => option.value === campus && !option.disabled
  )
}
