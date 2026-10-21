import { z } from "zod"

import {
  emailField,
  optionalText,
  optionalUrl,
  passwordFields,
  passwordsMatch,
  requiredText,
} from "@/features/shared/schema"

/**
 * `public.users` only carries the role, status, and email, so the personal
 * details below live in Supabase Auth user metadata.
 *
 * `currentPassword` is never stored. It is only required when a protected
 * detail (email, phone, photo) changes, so a borrowed session cannot take
 * over the account.
 */
export const adminProfileSchema = z.object({
  fullName: requiredText(120, "Full name is required"),
  email: emailField,
  phoneNumber: optionalText(32),
  avatarUrl: optionalUrl,
  currentPassword: z.string().max(200, "Password is too long").optional(),
})

export const changePasswordSchema = z
  .object(passwordFields)
  .refine(passwordsMatch.check, {
    path: ["confirmPassword"],
    message: passwordsMatch.message,
  })

/** Self-service password change: the current password must be proven first. */
export const changeOwnPasswordSchema = z
  .object({
    ...passwordFields,
    currentPassword: z
      .string({ error: "Enter your current password" })
      .min(1, "Enter your current password"),
  })
  .refine(passwordsMatch.check, {
    path: ["confirmPassword"],
    message: passwordsMatch.message,
  })

export type AdminProfileValues = z.infer<typeof adminProfileSchema>
export type AdminProfileInput = z.input<typeof adminProfileSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
export type ChangePasswordInput = z.input<typeof changePasswordSchema>
export type ChangeOwnPasswordValues = z.infer<typeof changeOwnPasswordSchema>
export type ChangeOwnPasswordInput = z.input<typeof changeOwnPasswordSchema>
