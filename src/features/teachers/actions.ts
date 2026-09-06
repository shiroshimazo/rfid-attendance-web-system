"use server"

import { revalidatePath } from "next/cache"

import { assertPilotAssignments } from "@/features/academic/validation"
import { changeManagedLoginEmail, cleanupFailedProfileCreation } from "@/features/shared/management"
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
import {
  accountStatuses,
  createTeacherSchema,
  teacherIdSchema,
  updateTeacherSchema,
  type CreateTeacherInput,
  type UpdateTeacherInput,
} from "@/features/teachers/schema"
import { createAdminSupabaseClient } from "@/services/supabase/admin"
import { createServerSupabaseClient } from "@/services/supabase/server"

const TEACHERS_PATH = "/admin/teachers"

function describeError(error: { message: string; code?: string }) {
  return describeDatabaseError(
    error,
    "A teacher with that ID or email already exists."
  )
}

type AssignmentValues = {
  programId: number
  courseId: number
  yearLevel: string
  section: string
  campus: string
}

function assignmentRows(assignments: AssignmentValues[]) {
  // Identical rows would violate the uniqueness constraint, so collapse them.
  const seen = new Set<string>()

  return assignments.flatMap((assignment) => {
    const row = {
      program_id: assignment.programId,
      course_id: assignment.courseId,
      year_level: assignment.yearLevel,
      section: assignment.section,
      campus: assignment.campus,
    }
    const key = JSON.stringify(row)

    if (seen.has(key)) return []
    seen.add(key)

    return [row]
  })
}

export async function createTeacherAction(
  input: CreateTeacherInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = createTeacherSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const assignmentValidation = await assertPilotAssignments(supabase, values.assignments)
  if (assignmentValidation) return failure(assignmentValidation)

  let admin: ReturnType<typeof createAdminSupabaseClient>

  try {
    admin = createAdminSupabaseClient()
  } catch (error) {
    return failure(
      error instanceof Error
        ? error.message
        : "Supabase administration is not configured."
    )
  }

  // The login account is created with the service role, which never leaves
  // this server action. Everything after it runs under the admin's own
  // session, so Row Level Security still applies.
  const created = await admin.auth.admin.createUser({
    email: values.email,
    password: values.password,
    email_confirm: true,
    app_metadata: { role: "teacher" },
    user_metadata: { full_name: values.fullName },
  })

  if (created.error || !created.data.user) {
    return failure(
      created.error?.message ?? "The login account could not be created."
    )
  }

  const userId = created.data.user.id

  const { error: teacherError } = await supabase.rpc("save_teacher_profile", {
    p_user_id: userId,
    p_profile: {
      teacher_id: values.teacherId,
      full_name: values.fullName,
      gender: nullable(values.gender),
      date_of_birth: nullable(values.dateOfBirth),
      civil_status: nullable(values.civilStatus),
      email: values.email,
      phone_number: nullable(values.phoneNumber),
      profile_picture: nullable(values.profilePicture),
      department: values.department,
      date_hired: nullable(values.dateHired),
      status: values.status,
    },
    p_assignments: assignmentRows(values.assignments),
  })

  if (teacherError) {
    const cleanup = await cleanupFailedProfileCreation(admin, "teachers", userId, teacherError.code)
    return failure(describeError(teacherError) + cleanup)
  }

  revalidatePath(TEACHERS_PATH)

  return success(`${values.fullName} was added.`)
}

export async function updateTeacherAction(
  input: UpdateTeacherInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = updateTeacherSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const assignmentValidation = await assertPilotAssignments(supabase, values.assignments)
  if (assignmentValidation) return failure(assignmentValidation)

  const { data: existing, error: existingError } = await supabase
    .from("teachers")
    .select("id, user_id, email")
    .eq("id", values.id)
    .maybeSingle<{ id: number; user_id: string; email: string }>()

  if (existingError) return failure(describeError(existingError))
  if (!existing) return failure("That teacher record no longer exists.")

  const emailChanged = existing.email.toLowerCase() !== values.email
  let admin: ReturnType<typeof createAdminSupabaseClient> | undefined
  if (emailChanged) {
    try { admin = createAdminSupabaseClient() }
    catch { return failure("Supabase administration is not configured. No changes were saved.") }
  }

  const { error: updateError } = await supabase.rpc("save_teacher_profile", {
    p_id: values.id,
    p_profile: {
      teacher_id: values.teacherId,
      full_name: values.fullName,
      gender: nullable(values.gender),
      date_of_birth: nullable(values.dateOfBirth),
      civil_status: nullable(values.civilStatus),
      email: values.email,
      phone_number: nullable(values.phoneNumber),
      profile_picture: nullable(values.profilePicture),
      department: values.department,
      date_hired: nullable(values.dateHired),
      status: values.status,
    },
    p_assignments: assignmentRows(values.assignments),
  })
  if (updateError) return failure(describeError(updateError))

  const emailResult = admin ? await changeManagedLoginEmail(admin, existing.user_id, values.email) : null
  revalidatePath(TEACHERS_PATH)
  if (emailResult) return emailResult

  return success(`${values.fullName} was updated.`)
}

export async function setTeacherStatusAction(
  id: number,
  status: (typeof accountStatuses)[number]
): Promise<ActionResult> {
  await requireRole("admin")

  const parsedId = teacherIdSchema.safeParse(id)

  if (!parsedId.success || !accountStatuses.includes(status)) {
    return failure("That request was not valid.")
  }

  const supabase = await createServerSupabaseClient()

  const { data: teacher, error: readError } = await supabase
    .from("teachers")
    .select("id, user_id, full_name")
    .eq("id", parsedId.data)
    .maybeSingle<{ id: number; user_id: string; full_name: string }>()

  if (readError) return failure(describeError(readError))
  if (!teacher) return failure("That teacher record no longer exists.")

  // Account and assignment status follow this profile write atomically.
  const { error: teacherError } = await supabase
    .from("teachers")
    .update({ status })
    .eq("id", teacher.id)

  if (teacherError) return failure(describeError(teacherError))

  revalidatePath(TEACHERS_PATH)

  return success(
    status === "archived"
      ? `${teacher.full_name} was archived.`
      : status === "inactive"
        ? `${teacher.full_name} was made inactive.`
        : `${teacher.full_name} was restored.`
  )
}
