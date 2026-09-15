"use server"

import { auditActivity } from "@/services/audit/log"

import { revalidatePath } from "next/cache"

import { PILOT_PROGRAM_CODE } from "@/features/academic/pilot"
import {
  catalogSpelling,
  catalogStatusSchema,
  createCourseSchema,
  createProgramSchema,
  createSectionSchema,
  isAssignableGrouping,
  isPilotProgramCode,
  programArchiveBlocker,
  updateCourseSchema,
  updateProgramSchema,
  updateSectionSchema,
  type CatalogStatusInput,
  type CreateCourseInput,
  type CreateProgramInput,
  type CreateSectionInput,
  type ProgramUsage,
  type UpdateCourseInput,
  type UpdateProgramInput,
  type UpdateSectionInput,
} from "@/features/academic/schema"
import { requireRole } from "@/features/auth/server"
import {
  describeError as describeDatabaseError,
  failure,
  flattenIssues,
  nullable,
  success,
  validationFailureMessage,
  type ActionResult,
} from "@/features/shared/actions"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

const ACADEMIC_PATH = "/admin/academic"

type Supabase = Awaited<ReturnType<typeof createServerSupabaseClient>>

type AccountStatus = "active" | "inactive" | "archived"

/** Either the row a change may go ahead on, or the reason it may not. */
type Checked<T> = { ok: T } | { refused: ActionResult }

/** Pickers on these pages read the catalog, so they refresh with it. */
function refreshCatalogViews() {
  for (const path of [
    ACADEMIC_PATH,
    "/admin/students",
    "/admin/teachers",
    "/admin/schedules/subject-schedules",
  ]) {
    revalidatePath(path)
  }
}

const duplicateMessages = {
  programCode: "A program with that code already exists.",
  courseCode: "A subject with that code already exists in this program.",
  sectionCode: "That section already exists for this program, year level, and campus.",
} as const

/** Unique violations become a message on the field that caused them. */
function describeError(
  error: { message: string; code?: string },
  field: keyof typeof duplicateMessages
) {
  const message = describeDatabaseError(error, duplicateMessages[field])

  return failure(message, error.code === "23505" ? { [field]: message } : undefined)
}

interface ProgramRecord {
  id: number
  program_code: string
  status: AccountStatus
}

function readProgram(supabase: Supabase, id: number) {
  return supabase
    .from("programs")
    .select("id, program_code, status")
    .eq("id", id)
    .maybeSingle<ProgramRecord>()
}

/** New subjects and groupings need a program that is still in the catalog. */
async function openProgram(
  supabase: Supabase,
  id: number
): Promise<Checked<ProgramRecord>> {
  const { data, error } = await readProgram(supabase, id)

  if (error) return { refused: failure(error.message) }

  if (!data) {
    const message = "That program no longer exists."
    return { refused: failure(message, { programId: message }) }
  }

  if (data.status === "archived") {
    const message = `Restore ${data.program_code} before adding to it.`
    return { refused: failure(message, { programId: message }) }
  }

  return { ok: data }
}

export async function createProgramAction(
  input: CreateProgramInput
): Promise<ActionResult> {
  return auditActivity("create_program", "programs", async () => {
    await requireRole("admin")

    const parsed = createProgramSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("programs").insert({
      program_code: values.programCode,
      program_name: values.programName,
      department: nullable(values.department),
      status: values.status,
    })

    if (error) return describeError(error, "programCode")

    refreshCatalogViews()

    return success(
      isPilotProgramCode(values.programCode)
        ? `${values.programCode} was added.`
        : `${values.programCode} was added to the catalog. Only ${PILOT_PROGRAM_CODE} can be assigned during the pilot.`
    )
  })
}

export async function updateProgramAction(
  input: UpdateProgramInput
): Promise<ActionResult> {
  return auditActivity("update_program", "programs", async () => {
    await requireRole("admin")

    const parsed = updateProgramSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const { data: existing, error: readError } = await readProgram(supabase, values.id)

    if (readError) return failure(readError.message)
    if (!existing) return failure("That program no longer exists.")
    if (existing.status === "archived") {
      return failure("Restore this program before editing it.")
    }

    // The pilot lock and the schedule RPCs match BSIT by code and need it active.
    if (isPilotProgramCode(existing.program_code)) {
      if (!isPilotProgramCode(values.programCode)) {
        const message = `The pilot lock matches ${PILOT_PROGRAM_CODE} by code, so it cannot change while the pilot runs.`
        return failure(message, { programCode: message })
      }

      if (values.status !== "active") {
        const message = "The pilot program stays active while the pilot runs."
        return failure(message, { status: message })
      }
    }

    // This updates the catalog row only. subject_attendance keeps the
    // program_code it captured at confirmation time; renaming must never
    // backfill or rewrite that historical snapshot.
    const { error } = await supabase
      .from("programs")
      .update({
        program_code: values.programCode,
        program_name: values.programName,
        department: nullable(values.department),
        status: values.status,
      })
      .eq("id", values.id)

    if (error) return describeError(error, "programCode")

    refreshCatalogViews()

    return success(`${values.programCode} was updated.`)
  })
}

export async function createCourseAction(
  input: CreateCourseInput
): Promise<ActionResult> {
  return auditActivity("create_course", "courses", async () => {
    await requireRole("admin")

    const parsed = createCourseSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const program = await openProgram(supabase, values.programId)

    if ("refused" in program) return program.refused

    const { error } = await supabase.from("courses").insert({
      program_id: values.programId,
      course_code: values.courseCode,
      course_name: values.courseName,
      status: values.status,
    })

    if (error) return describeError(error, "courseCode")

    refreshCatalogViews()

    return success(
      isPilotProgramCode(program.ok.program_code) && values.status === "active"
        ? `${values.courseCode} was added. Teacher assignment pickers offer it now.`
        : `${values.courseCode} was added to the ${program.ok.program_code} catalog.`
    )
  })
}

export async function updateCourseAction(
  input: UpdateCourseInput
): Promise<ActionResult> {
  return auditActivity("update_course", "courses", async () => {
    await requireRole("admin")

    const parsed = updateCourseSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const { data: existing, error: readError } = await supabase
      .from("courses")
      .select("id, status")
      .eq("id", values.id)
      .maybeSingle<{ id: number; status: AccountStatus }>()

    if (readError) return failure(readError.message)
    if (!existing) return failure("That subject no longer exists.")
    if (existing.status === "archived") {
      return failure("Restore this subject before editing it.")
    }

    // This updates the catalog row only, and never program_id: (id, program_id)
    // anchors the composite keys from teacher_assignments and subject_schedules.
    // subject_attendance keeps the course_code and course_name it captured at
    // confirmation time; renaming must never backfill or rewrite that snapshot.
    const { error } = await supabase
      .from("courses")
      .update({
        course_code: values.courseCode,
        course_name: values.courseName,
        status: values.status,
      })
      .eq("id", values.id)

    if (error) return describeError(error, "courseCode")

    refreshCatalogViews()

    return success(`${values.courseCode} was updated.`)
  })
}

export async function createSectionAction(
  input: CreateSectionInput
): Promise<ActionResult> {
  return auditActivity("create_section", "academic_sections", async () => {
    await requireRole("admin")

    const parsed = createSectionSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const program = await openProgram(supabase, values.programId)

    if ("refused" in program) return program.refused

    // Reuse the catalog's spelling when only letter case differs, so "2nd year"
    // cannot become a second grouping that never matches stored placements.
    let spellings: { year_level: string; campus: string }[]

    try {
      spellings = await fetchAllRows<{ year_level: string; campus: string }>(
        (from, to) =>
          supabase
            .from("academic_sections")
            .select("year_level, campus")
            .order("id", { ascending: true })
            .range(from, to)
            .returns<{ year_level: string; campus: string }[]>()
      )
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "The class groupings could not be read."
      )
    }

    const yearLevel = catalogSpelling(
      values.yearLevel,
      spellings.map((row) => row.year_level)
    )
    const campus = catalogSpelling(values.campus, spellings.map((row) => row.campus))

    const { error } = await supabase.from("academic_sections").insert({
      program_id: values.programId,
      year_level: yearLevel,
      section_code: values.sectionCode,
      campus,
    })

    if (error) return describeError(error, "sectionCode")

    refreshCatalogViews()

    const label = `Section ${values.sectionCode} (${campus})`

    return success(
      isAssignableGrouping({
        programCode: program.ok.program_code,
        yearLevel,
        sectionCode: values.sectionCode,
        campus,
      })
        ? `${label} was added.`
        : `${label} was added to the catalog. It cannot be assigned during the pilot.`
    )
  })
}

export async function updateSectionAction(
  input: UpdateSectionInput
): Promise<ActionResult> {
  return auditActivity("update_section", "academic_sections", async () => {
    await requireRole("admin")

    const parsed = updateSectionSchema.safeParse(input)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await createServerSupabaseClient()

    const { data: existing, error: readError } = await supabase
      .from("academic_sections")
      .select("id, section_code, campus, status")
      .eq("id", values.id)
      .maybeSingle<{ id: number; section_code: string; campus: string; status: AccountStatus }>()

    if (readError) return failure(readError.message)
    if (!existing) return failure("That class grouping no longer exists.")
    if (existing.status === "archived") {
      return failure("Restore this class grouping before editing it.")
    }

    // Only status changes. Students, schedules, and attendance store the section
    // as text, so renaming its code, year level, or campus would orphan them.
    const { error } = await supabase
      .from("academic_sections")
      .update({ status: values.status })
      .eq("id", values.id)

    if (error) return failure(describeDatabaseError(error))

    refreshCatalogViews()

    return success(`Section ${existing.section_code} (${existing.campus}) was updated.`)
  })
}

const noUsage: ProgramUsage = {
  courses: 0,
  students: 0,
  sections: 0,
  assignments: 0,
  schedules: 0,
}

/** Counted before writing: a foreign-key error would not say what to fix. */
async function countProgramUsage(
  supabase: Supabase,
  programId: number
): Promise<Checked<ProgramUsage>> {
  const head = { count: "exact", head: true } as const

  const counted = await Promise.all([
    supabase.from("courses").select("id", head).eq("program_id", programId).neq("status", "archived"),
    supabase.from("students").select("id", head).eq("program_id", programId).neq("status", "archived"),
    supabase.from("academic_sections").select("id", head).eq("program_id", programId).neq("status", "archived"),
    supabase.from("teacher_assignments").select("id", head).eq("program_id", programId).eq("status", "active"),
    supabase.from("subject_schedules").select("id", head).eq("program_id", programId).eq("status", "active"),
  ])

  const failed = counted.find((response) => response.error)

  if (failed?.error) return { refused: failure(failed.error.message) }

  const [courses, students, sections, assignments, schedules] = counted.map(
    (response) => response.count ?? 0
  )

  return { ok: { courses, students, sections, assignments, schedules } }
}

/** Restoring under an archived program would offer it for a program nobody can pick. */
async function archivedProgramRefusal(supabase: Supabase, programId: number) {
  const { data, error } = await readProgram(supabase, programId)

  if (error) return failure(error.message)
  if (data?.status === "archived") return failure(`Restore ${data.program_code} first.`)

  return null
}

async function checkProgramStatus(
  supabase: Supabase,
  id: number,
  status: "active" | "archived"
): Promise<Checked<string>> {
  const { data, error } = await readProgram(supabase, id)

  if (error) return { refused: failure(error.message) }
  if (!data) return { refused: failure("That program no longer exists.") }

  if (status === "archived") {
    const isPilot = isPilotProgramCode(data.program_code)
    const usage = isPilot ? { ok: noUsage } : await countProgramUsage(supabase, id)

    if ("refused" in usage) return usage

    const blocker = programArchiveBlocker({
      code: data.program_code,
      isPilot,
      usage: usage.ok,
    })

    if (blocker) return { refused: failure(blocker) }
  }

  return { ok: data.program_code }
}

async function checkCourseStatus(
  supabase: Supabase,
  id: number,
  status: "active" | "archived"
): Promise<Checked<string>> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, course_code, program_id")
    .eq("id", id)
    .maybeSingle<{ id: number; course_code: string; program_id: number }>()

  if (error) return { refused: failure(error.message) }
  if (!data) return { refused: failure("That subject no longer exists.") }

  if (status === "active") {
    const refusal = await archivedProgramRefusal(supabase, data.program_id)
    if (refusal) return { refused: refusal }
  }

  return { ok: data.course_code }
}

async function checkSectionStatus(
  supabase: Supabase,
  id: number,
  status: "active" | "archived"
): Promise<Checked<string>> {
  const { data, error } = await supabase
    .from("academic_sections")
    .select("id, section_code, campus, program_id")
    .eq("id", id)
    .maybeSingle<{ id: number; section_code: string; campus: string; program_id: number }>()

  if (error) return { refused: failure(error.message) }
  if (!data) return { refused: failure("That class grouping no longer exists.") }

  if (status === "active") {
    const refusal = await archivedProgramRefusal(supabase, data.program_id)
    if (refusal) return { refused: refusal }
  }

  return { ok: `Section ${data.section_code} (${data.campus})` }
}

const catalogTables = {
  program: "programs",
  course: "courses",
  section: "academic_sections",
} as const

/**
 * Archive or restore. Catalog entries are referenced by students, assignments,
 * schedules, and attendance, so they are archived and never deleted.
 */
export async function setCatalogStatusAction(
  input: CatalogStatusInput
): Promise<ActionResult> {
  return auditActivity("set_catalog_status", "academic_catalog", async () => {
    await requireRole("admin")

    const parsed = catalogStatusSchema.safeParse(input)

    if (!parsed.success) return failure("That request was not valid.")

    const { kind, id, status } = parsed.data
    const supabase = await createServerSupabaseClient()

    const checked =
      kind === "program"
        ? await checkProgramStatus(supabase, id, status)
        : kind === "course"
          ? await checkCourseStatus(supabase, id, status)
          : await checkSectionStatus(supabase, id, status)

    if ("refused" in checked) return checked.refused

    const { error } = await supabase
      .from(catalogTables[kind])
      .update({ status })
      .eq("id", id)

    if (error) return failure(describeDatabaseError(error))

    refreshCatalogViews()

    return success(
      status === "archived" ? `${checked.ok} was archived.` : `${checked.ok} was restored.`
    )
  })
}
