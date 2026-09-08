"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/features/auth/server"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { confirmSubjectSchema, createSubjectScheduleSchema, subjectScheduleIdSchema } from "@/features/subject-attendance/schema"

function refreshSubjectViews() {
  for (const path of ["/admin/schedules", "/admin/dashboard", "/admin/attendance", "/admin/reports", "/teacher/dashboard", "/teacher/attendance", "/teacher/reports", "/student/dashboard", "/student/my-attendance"]) revalidatePath(path)
}

export async function confirmSubjectAction(input: unknown) {
  await requireRole("teacher")
  const parsed = confirmSubjectSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Choose a student, session date, and Present or Absent." }
  const value = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.rpc("confirm_subject_attendance", {
    p_schedule_id: value.scheduleId, p_student_id: value.studentId, p_date: value.date,
    p_status: value.status, p_expected_confirmed_at: value.expectedConfirmedAt,
  })
  if (error) return { ok: false, message: error.code === "23505" ? "This subject session already has a confirmation under a previous schedule. Review the retained history." : error.message }
  refreshSubjectViews()
  return { ok: true, message: `Subject attendance confirmed ${value.status}.` }
}

export async function createSubjectScheduleAction(input: unknown) {
  await requireRole("admin")
  const parsed = createSubjectScheduleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Select an assignment, weekday, and valid start/end times." }
  const value = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.rpc("create_subject_schedule", {
    p_assignment_id: value.assignmentId, p_day: value.day, p_start: value.start, p_end: value.end,
  })
  if (error) return { ok: false, message: error.code === "23505" ? "An active schedule already exists for that subject and time." : error.message }
  refreshSubjectViews()
  return { ok: true, message: "Subject schedule added." }
}

export async function retireSubjectScheduleAction(input: unknown) {
  await requireRole("admin")
  const parsed = subjectScheduleIdSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Select a valid subject schedule." }
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.rpc("retire_subject_schedule", { p_id: parsed.data })
  if (error) return { ok: false, message: error.message }
  refreshSubjectViews()
  return { ok: true, message: "Subject schedule retired; confirmations retained." }
}
