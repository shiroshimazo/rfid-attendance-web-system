import { z } from "zod"

export const accountStatuses = ["active", "inactive", "archived"] as const

export const genderOptions = ["Male", "Female", "Prefer not to say"] as const

export const civilStatusOptions = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
] as const

/** HTML date inputs submit `yyyy-MM-dd`, or an empty string when untouched. */
export const optionalDate = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Use the date picker to choose a valid date",
  })

export const optionalText = (max: number) => z.string().trim().max(max)

export const requiredText = (max: number, message: string) =>
  z.string().trim().min(2, message).max(max)

export const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || URL.canParse(value), {
    message: "Enter a full image URL, or leave this empty",
  })

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email"))

export const passwordFields = {
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use at most 72 characters"),
  confirmPassword: z.string(),
}

export const passwordsMatch = {
  check: (values: { password: string; confirmPassword: string }) =>
    values.password === values.confirmPassword,
  message: "Passwords do not match",
}

/**
 * Add-and-edit dialogs share one schema, so the mode travels with the values
 * and the credential rules only apply while creating an account.
 */
export function applyCredentialRules(
  values: {
    mode: "create" | "edit"
    password: string
    confirmPassword: string
  },
  ctx: z.RefinementCtx
) {
  if (values.mode !== "create") return

  if (values.password.length < 8) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Use at least 8 characters",
    })
    return
  }

  if (!passwordsMatch.check(values)) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: passwordsMatch.message,
    })
  }
}

export const databaseIdSchema = z.coerce.number().int().positive()

/** Selects submit strings, so catalog ids are coerced back to numbers. */
export const selectedId = (message: string) =>
  z.coerce.number().int(message).positive(message)
