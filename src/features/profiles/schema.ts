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
 */
export const adminProfileSchema = z.object({
  fullName: requiredText(120, "Full name is required"),
  email: emailField,
  phoneNumber: optionalText(32),
  avatarUrl: optionalUrl,
})

export const changePasswordSchema = z
  .object(passwordFields)
  .refine(passwordsMatch.check, {
    path: ["confirmPassword"],
    message: passwordsMatch.message,
  })

export type AdminProfileValues = z.infer<typeof adminProfileSchema>
export type AdminProfileInput = z.input<typeof adminProfileSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
export type ChangePasswordInput = z.input<typeof changePasswordSchema>
