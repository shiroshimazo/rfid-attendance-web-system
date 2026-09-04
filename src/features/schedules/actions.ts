"use server"

import { revalidatePath } from "next/cache"

import { PILOT_PROGRAM_CODE } from "@/features/academic/pilot"
import { requireRole } from "@/features/auth/server"
import {
  describeError as describeDatabaseError,
  failure,
  flattenIssues,
  success,
  validationFailureMessage,
  type ActionResult,
} from "@/features/shared/actions"
import {
  scheduleStatusSchema,
  updateScheduleSchema,
  type ScheduleStatusInput,
  type UpdateScheduleInput,
} from "@/features/schedules/schema"
import type { ClassScheduleRow } from "@/services/schedules/directory"
import { createServerSupabaseClient } from "@/services/supabase/server"

const SCHEDULES_PATH = "/admin/schedules"

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>

type ScheduleIdentity = {
  programId: number
  yearLevel: string
  section: string
  campus: string | null
}

type ExistingRow = Pick<
  ClassScheduleRow,
  "id" | "day_of_week" | "time_start" | "grace_minutes" | "status"
>

function describeError(error: { message: string; code?: string }) {
  return describeDatabaseError(
    error,
    "That section already has a schedule row for one of those days."
  )
}

/**
 * The pilot locks schedules to BSIT, so the program id is verified against the
 * catalog instead of being trusted from the browser.
 */
async function assertPilotProgram(
  supabase: SupabaseClient,
  programId: number
): Promise<string | null> {
  const { data, error } = await supabase
    .from("programs")
    .select("id, program_code")
    .eq("id", programId)
    .maybeSingle<{ id: number; program_code: string }>()

  if (error) return describeError(error)
  if (!data) return "That program no longer exists."

  if (data.program_code.toUpperCase() !== PILOT_PROGRAM_CODE) {
    return `Schedules are limited to ${PILOT_PROGRAM_CODE} while the pilot runs.`
  }

  return null
}

/** Reads every weekday row behind one section, retired rows included. */
async function readScheduleRows(
  supabase: SupabaseClient,
  identity: ScheduleIdentity
) {
  const query = supabase
    .from("class_schedules")
    .select("id, day_of_week, time_start, grace_minutes, status")
    .eq("program_id", identity.programId)
    .eq("year_level", identity.yearLevel)
    .eq("section", identity.section)

  return identity.campus === null
    ? await query.is("campus", null).returns<ExistingRow[]>()
    : await query.eq("campus", identity.campus).returns<ExistingRow[]>()
}

/**
 * Saves one section's week. Days that are unchecked are retired to `archived`
 * rather than deleted: a deleted row silently means "never Late" (Late
 * Attendance Ruling, rule 5), so removal must stay a deliberate status change.
 */
export async function updateScheduleAction(
  input: UpdateScheduleInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = updateScheduleSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const programError = await assertPilotProgram(supabase, values.programId)

  if (programError) return failure(programError)

  const { data: existing, error: readError } = await readScheduleRows(
    supabase,
    values
  )

  if (readError) return failure(describeError(readError))

  const selected = new Set(values.days)
  const rows = existing ?? []
  const rowByDay = new Map(rows.map((row) => [row.day_of_week, row]))

  const keptIds = [...selected]
    .map((day) => rowByDay.get(day)?.id)
    .filter((id): id is number => typeof id === "number")

  const retiredIds = rows
    .filter((row) => !selected.has(row.day_of_week) && row.status !== "archived")
    .map((row) => row.id)

  const insertedDays = [...selected].filter((day) => !rowByDay.has(day))

  const scheduleValues = {
    time_start: values.timeStart,
    grace_minutes: values.graceMinutes,
    status: values.status,
  }

  if (keptIds.length > 0) {
    const { error } = await supabase
      .from("class_schedules")
      .update(scheduleValues)
      .in("id", keptIds)

    if (error) return failure(describeError(error))
  }

  if (insertedDays.length > 0) {
    const { error } = await supabase.from("class_schedules").insert(
      insertedDays.map((day) => ({
        program_id: values.programId,
        year_level: values.yearLevel,
        section: values.section,
        campus: values.campus,
        day_of_week: day,
        ...scheduleValues,
      }))
    )

    if (error) return failure(describeError(error))
  }

  if (retiredIds.length > 0) {
    const { error } = await supabase
      .from("class_schedules")
      .update({ status: "archived" })
      .in("id", retiredIds)

    if (error) return failure(describeError(error))
  }

  revalidatePath(SCHEDULES_PATH)

  return success(`Section ${values.section} was updated.`)
}

/**
 * Activates or deactivates every live day of a section. Inactive rows are
 * ignored by the late rule, which is how a schedule is switched off without
 * deleting it.
 */
export async function setScheduleStatusAction(
  input: ScheduleStatusInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = scheduleStatusSchema.safeParse(input)

  if (!parsed.success) return failure("That request was not valid.")

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const programError = await assertPilotProgram(supabase, values.programId)

  if (programError) return failure(programError)

  const { data: existing, error: readError } = await readScheduleRows(
    supabase,
    values
  )

  if (readError) return failure(describeError(readError))

  const liveIds = (existing ?? [])
    .filter((row) => row.status !== "archived")
    .map((row) => row.id)

  if (liveIds.length === 0) {
    return failure(
      `Section ${values.section} has no class days. Edit it and choose the days first.`
    )
  }

  const { error } = await supabase
    .from("class_schedules")
    .update({ status: values.status })
    .in("id", liveIds)

  if (error) return failure(describeError(error))

  revalidatePath(SCHEDULES_PATH)

  return success(
    values.status === "active"
      ? `Section ${values.section} is now active.`
      : `Section ${values.section} is now inactive.`
  )
}
