"use server"

import { revalidatePath } from "next/cache"

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

function assignmentRows(teacherId: number, assignments: AssignmentValues[]) {
  // Identical rows would violate the uniqueness constraint, so collapse them.
  const seen = new Set<string>()

  return assignments.flatMap((assignment) => {
    const row = {
      teacher_id: teacherId,
      program_id: assignment.programId,
      course_id: assignment.courseId,
      year_level: nullable(assignment.yearLevel),
      section: nullable(assignment.section),
      campus: nullable(assignment.campus),
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

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .insert({
      user_id: userId,
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
    })
    .select("id")
    .single<{ id: number }>()

  if (teacherError || !teacher) {
    // Roll the orphaned login account back so the email can be reused.
    await admin.auth.admin.deleteUser(userId)
    return failure(
      teacherError
        ? describeError(teacherError)
        : "The teacher profile could not be saved."
    )
  }

  const { error: assignmentError } = await supabase
    .from("teacher_assignments")
    .insert(assignmentRows(teacher.id, values.assignments))

  if (assignmentError) {
    await supabase.from("teachers").delete().eq("id", teacher.id)
    await admin.auth.admin.deleteUser(userId)
    return failure(describeError(assignmentError))
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

  const { data: existing, error: existingError } = await supabase
    .from("teachers")
    .select("id, user_id, email")
    .eq("id", values.id)
    .maybeSingle<{ id: number; user_id: string; email: string }>()

  if (existingError) return failure(describeError(existingError))
  if (!existing) return failure("That teacher record no longer exists.")

  const { error: updateError } = await supabase
    .from("teachers")
    .update({
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
    })
    .eq("id", values.id)

  if (updateError) return failure(describeError(updateError))

  // Assignments are replaced wholesale, which keeps the repeatable form and
  // the stored rows in step without diffing every field.
  const { error: clearError } = await supabase
    .from("teacher_assignments")
    .delete()
    .eq("teacher_id", values.id)

  if (clearError) return failure(describeError(clearError))

  const { error: assignmentError } = await supabase
    .from("teacher_assignments")
    .insert(assignmentRows(values.id, values.assignments))

  if (assignmentError) return failure(describeError(assignmentError))

  const { error: accountError } = await supabase
    .from("users")
    .update({ email: values.email, status: values.status })
    .eq("id", existing.user_id)

  if (accountError) return failure(describeError(accountError))

  if (existing.email.toLowerCase() !== values.email) {
    try {
      const admin = createAdminSupabaseClient()
      const { error } = await admin.auth.admin.updateUserById(existing.user_id, {
        email: values.email,
        email_confirm: true,
      })

      if (error) {
        return failure(
          `The profile was saved, but the login email could not be changed: ${error.message}`
        )
      }
    } catch (error) {
      return failure(
        error instanceof Error
          ? error.message
          : "The login email could not be changed."
      )
    }
  }

  revalidatePath(TEACHERS_PATH)

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

  const { error: teacherError } = await supabase
    .from("teachers")
    .update({ status })
    .eq("id", teacher.id)

  if (teacherError) return failure(describeError(teacherError))

  // Assignments follow the profile so an archived teacher stops matching the
  // teacher_can_access_student policy.
  const { error: assignmentError } = await supabase
    .from("teacher_assignments")
    .update({ status })
    .eq("teacher_id", teacher.id)

  if (assignmentError) return failure(describeError(assignmentError))

  const { error: accountError } = await supabase
    .from("users")
    .update({ status })
    .eq("id", teacher.user_id)

  if (accountError) return failure(describeError(accountError))

  revalidatePath(TEACHERS_PATH)

  return success(
    status === "archived"
      ? `${teacher.full_name} was archived.`
      : `${teacher.full_name} was restored.`
  )
}
