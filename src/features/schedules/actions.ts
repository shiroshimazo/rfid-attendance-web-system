"use server"

import { revalidatePath } from "next/cache"

import { assertPilotProgram } from "@/features/academic/validation"
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
import { createServerSupabaseClient } from "@/services/supabase/server"

const SCHEDULES_PATH = "/admin/schedules"

function describeError(error: { message: string; code?: string }) {
  return describeDatabaseError(
    error,
    "That section already has a schedule row for one of those days."
  )
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

  const { error } = await supabase.rpc("save_schedule_week", {
    p_program_id: values.programId,
    p_year: values.yearLevel,
    p_section: values.section,
    p_campus: values.campus,
    p_days: values.days,
    p_time: values.timeStart,
    p_grace: values.graceMinutes,
    p_status: values.status,
  })
  if (error) return failure(describeError(error))

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

  const { error } = await supabase.rpc("set_schedule_week_status", {
    p_program_id: values.programId,
    p_year: values.yearLevel,
    p_section: values.section,
    p_campus: values.campus,
    p_status: values.status,
  })
  if (error) return failure(describeError(error))

  revalidatePath(SCHEDULES_PATH)

  return success(
    values.status === "active"
      ? `Section ${values.section} is now active.`
      : `Section ${values.section} is now inactive.`
  )
}
