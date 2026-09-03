"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/features/auth/server"
import {
  adminProfileSchema,
  changePasswordSchema,
  type AdminProfileInput,
  type ChangePasswordInput,
} from "@/features/profiles/schema"
import {
  failure,
  flattenIssues,
  nullable,
  success,
  validationFailureMessage,
  type ActionResult,
} from "@/features/shared/actions"
import { createServerSupabaseClient } from "@/services/supabase/server"

const SETTINGS_PATH = "/admin/settings"
const STUDENT_PROFILE_PATH = "/student/profile"

/** Supabase Auth errors are technical, so the common ones are reworded. */
function describeAuthError(error: { message: string; code?: string }) {
  if (error.code === "email_exists" || error.code === "email_address_not_authorized") {
    return "That email address is already used by another account."
  }

  if (error.code === "same_password") {
    return "Choose a password that is different from the current one."
  }

  if (error.code === "weak_password") {
    return "That password is too easy to guess. Choose a stronger one."
  }

  if (error.code === "over_email_send_rate_limit") {
    return "Too many confirmation emails were requested. Try again in a few minutes."
  }

  return error.message
}

export async function updateAdminProfileAction(
  input: AdminProfileInput
): Promise<ActionResult> {
  const account = await requireRole("admin")

  const parsed = adminProfileSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()
  const emailChanged = values.email !== account.email.toLowerCase()

  // The personal details have no column in `public.users`, so they are kept in
  // Auth user metadata. `phone` stays in metadata rather than the Auth phone
  // field, which would start an SMS verification the system does not use.
  const { data, error } = await supabase.auth.updateUser({
    ...(emailChanged ? { email: values.email } : {}),
    data: {
      full_name: values.fullName,
      avatar_url: nullable(values.avatarUrl),
      phone: nullable(values.phoneNumber),
    },
  })

  if (error || !data.user) {
    const message = error
      ? describeAuthError(error)
      : "The profile could not be saved."

    return failure(message, emailChanged ? { email: message } : undefined)
  }

  const emailApplied =
    emailChanged && data.user.email?.toLowerCase() === values.email

  if (emailApplied) {
    // A database trigger already mirrors `auth.users.email` into this row; the
    // explicit write keeps the two in step even if that trigger is missing.
    const { error: rowError } = await supabase
      .from("users")
      .update({ email: values.email })
      .eq("id", account.id)

    if (rowError) {
      return failure(
        `The login email was changed, but the account record still reads ${account.email}. ${rowError.message}`
      )
    }
  }

  revalidatePath(SETTINGS_PATH)
  // The sidebar reads the name and email from the same account.
  revalidatePath("/admin", "layout")

  if (emailChanged && !emailApplied) {
    return success(
      `Profile saved. Confirm the change from the message sent to ${values.email} before signing in with it.`
    )
  }

  return success("Your profile was updated.")
}

export async function changeAdminPasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = changePasswordSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const supabase = await createServerSupabaseClient()

  // Supabase hashes and stores the credential; the plain value is never kept.
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    const message = describeAuthError(error)
    return failure(message, { password: message })
  }

  revalidatePath(SETTINGS_PATH)

  return success("Your password was changed.")
}

export async function changeStudentPasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult> {
  await requireRole("student")

  const parsed = changePasswordSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const supabase = await createServerSupabaseClient()

  // Supabase hashes and stores the credential; the plain value is never kept.
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    const message = describeAuthError(error)
    return failure(message, { password: message })
  }

  revalidatePath(STUDENT_PROFILE_PATH)

  return success("Your password was changed.")
}
