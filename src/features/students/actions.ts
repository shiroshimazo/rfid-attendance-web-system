"use server"

import { revalidatePath } from "next/cache"

import { assertPilotProgram } from "@/features/academic/validation"
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
import { accountStatuses } from "@/features/shared/schema"
import {
  createStudentSchema,
  rfidAssignmentSchema,
  studentIdSchema,
  updateStudentSchema,
  type CreateStudentInput,
  type RfidAssignmentInput,
  type UpdateStudentInput,
} from "@/features/students/schema"
import { createAdminSupabaseClient } from "@/services/supabase/admin"
import { createServerSupabaseClient } from "@/services/supabase/server"

const STUDENTS_PATH = "/admin/students"

function describeError(error: { message: string; code?: string }) {
  return describeDatabaseError(
    error,
    "A student with that ID or email already exists."
  )
}

function describeCardError(error: { message: string; code?: string }) {
  return describeDatabaseError(
    error,
    "That RFID number is already registered to another student."
  )
}

/** Columns written by both the create and the edit paths. */
function studentColumns(values: {
  studentId: string
  fullName: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  address: string
  contactNumber: string
  email: string
  profilePicture: string
  parentName: string
  parentContactNumber: string
  programId: number
  yearLevel: string
  section: string
  campus: string
  status: (typeof accountStatuses)[number]
}) {
  return {
    student_id: values.studentId,
    full_name: values.fullName,
    gender: nullable(values.gender),
    date_of_birth: nullable(values.dateOfBirth),
    place_of_birth: nullable(values.placeOfBirth),
    address: nullable(values.address),
    contact_number: nullable(values.contactNumber),
    email: values.email,
    profile_picture: nullable(values.profilePicture),
    parent_name: values.parentName,
    parent_contact_number: values.parentContactNumber,
    program_id: values.programId,
    year_level: values.yearLevel,
    section: values.section,
    campus: values.campus,
    status: values.status,
  }
}

export async function createStudentAction(
  input: CreateStudentInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = createStudentSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const programError = await assertPilotProgram(supabase, values.programId)
  if (programError) return failure(programError)

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
    app_metadata: { role: "student" },
    user_metadata: { full_name: values.fullName },
  })

  if (created.error || !created.data.user) {
    return failure(
      created.error?.message ?? "The login account could not be created."
    )
  }

  const userId = created.data.user.id

  const { error: studentError } = await supabase.rpc("save_student_profile", {
    p_user_id: userId,
    p_profile: studentColumns(values),
  })

  if (studentError) {
    const cleanup = await cleanupFailedProfileCreation(admin, "students", userId, studentError.code)
    return failure(describeError(studentError) + cleanup)
  }

  revalidatePath(STUDENTS_PATH)
  revalidatePath("/admin/rfid-cards")

  return success(`${values.fullName} was added.`)
}

export async function updateStudentAction(
  input: UpdateStudentInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = updateStudentSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const programError = await assertPilotProgram(supabase, values.programId)
  if (programError) return failure(programError)

  const { data: existing, error: existingError } = await supabase
    .from("students")
    .select("id, user_id, email")
    .eq("id", values.id)
    .maybeSingle<{ id: number; user_id: string; email: string }>()

  if (existingError) return failure(describeError(existingError))
  if (!existing) return failure("That student record no longer exists.")

  const emailChanged = existing.email.toLowerCase() !== values.email
  let admin: ReturnType<typeof createAdminSupabaseClient> | undefined
  if (emailChanged) {
    try { admin = createAdminSupabaseClient() }
    catch { return failure("Supabase administration is not configured. No changes were saved.") }
  }

  const { error: updateError } = await supabase.rpc("save_student_profile", {
    p_id: values.id,
    p_profile: studentColumns(values),
  })
  if (updateError) return failure(describeError(updateError))

  // Non-email edits commit together. Email remains Auth-owned even if its API fails.
  const emailResult = admin ? await changeManagedLoginEmail(admin, existing.user_id, values.email) : null
  revalidatePath(STUDENTS_PATH)
  revalidatePath("/admin/rfid-cards")
  if (emailResult) return emailResult

  return success(`${values.fullName} was updated.`)
}

export async function setStudentStatusAction(
  id: number,
  status: (typeof accountStatuses)[number]
): Promise<ActionResult> {
  await requireRole("admin")

  const parsedId = studentIdSchema.safeParse(id)

  if (!parsedId.success || !accountStatuses.includes(status)) {
    return failure("That request was not valid.")
  }

  const supabase = await createServerSupabaseClient()

  const { data: student, error: readError } = await supabase
    .from("students")
    .select("id, user_id, full_name")
    .eq("id", parsedId.data)
    .maybeSingle<{ id: number; user_id: string; full_name: string }>()

  if (readError) return failure(describeError(readError))
  if (!student) return failure("That student record no longer exists.")

  // The database synchronizes account status and retires the active card
  // atomically, just as it does when status changes through the edit dialog.
  const { error: studentError } = await supabase
    .from("students")
    .update({ status })
    .eq("id", student.id)

  if (studentError) return failure(describeError(studentError))

  revalidatePath(STUDENTS_PATH)
  revalidatePath("/admin/rfid-cards")

  return success(
    status === "archived"
      ? `${student.full_name} was archived.`
      : status === "inactive"
        ? `${student.full_name} was made inactive.`
        : `${student.full_name} was restored.`
  )
}

/**
 * Registers or re-issues the RFID card behind a student. The schema allows
 * only one active card per student, so a replacement retires the previous one
 * before the new number becomes active.
 */
export async function assignRfidCardAction(
  input: RfidAssignmentInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = rfidAssignmentSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, full_name")
    .eq("id", values.studentId)
    .maybeSingle<{ id: number; full_name: string }>()

  if (studentError) return failure(describeError(studentError))
  if (!student) return failure("That student record no longer exists.")

  const { data: owner, error: ownerError } = await supabase
    .from("rfid_cards")
    .select("id, student_id, card_status")
    .eq("rfid_number", values.rfidNumber)
    .maybeSingle<{ id: number; student_id: number; card_status: string }>()

  if (ownerError) return failure(describeCardError(ownerError))

  if (owner && owner.student_id !== student.id) {
    return failure(
      "That RFID number is already registered to another student."
    )
  }

  if (values.cardStatus === "Active") {
    const { error: retireError } = await supabase
      .from("rfid_cards")
      .update({ card_status: "Deactivated" })
      .eq("student_id", student.id)
      .eq("card_status", "Active")
      .neq("rfid_number", values.rfidNumber)

    if (retireError) return failure(describeCardError(retireError))
  }

  const cardValues = {
    student_id: student.id,
    rfid_number: values.rfidNumber,
    card_status: values.cardStatus,
    assigned_date: values.assignedDate,
  }

  const { error: writeError } = owner
    ? await supabase.from("rfid_cards").update(cardValues).eq("id", owner.id)
    : await supabase.from("rfid_cards").insert(cardValues)

  if (writeError) return failure(describeCardError(writeError))

  revalidatePath(STUDENTS_PATH)

  return success(
    `${values.rfidNumber} is now ${values.cardStatus.toLowerCase()} for ${student.full_name}.`
  )
}
