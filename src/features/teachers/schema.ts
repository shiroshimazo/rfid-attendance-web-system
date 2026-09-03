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
const optionalDate = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Use the date picker to choose a valid date",
  })

const optionalText = (max: number) => z.string().trim().max(max)

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || URL.canParse(value), {
    message: "Enter a full image URL, or leave this empty",
  })

/** Fields shared by the browser form and the authoritative server schema. */
const teacherFields = {
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  gender: z.enum(genderOptions).or(z.literal("")),
  dateOfBirth: optionalDate,
  civilStatus: z.enum(civilStatusOptions).or(z.literal("")),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  phoneNumber: optionalText(32),
  profilePicture: optionalUrl,
  teacherId: z.string().trim().min(2, "Teacher ID is required").max(40),
  department: z.string().trim().min(2, "Department is required").max(120),
  dateHired: optionalDate,
  status: z.enum(accountStatuses),
}

const assignmentFields = {
  yearLevel: optionalText(40),
  section: optionalText(40),
  campus: optionalText(80),
}

/** Browser shape: every control, including the selects, holds a string. */
export const assignmentFormSchema = z.object({
  programId: z.string().min(1, "Select a program"),
  courseId: z.string().min(1, "Select a course/subject"),
  ...assignmentFields,
})

/** Server shape: the same payload with the catalog ids coerced to numbers. */
export const assignmentSchema = z.object({
  programId: z.coerce
    .number()
    .int("Select a program")
    .positive("Select a program"),
  courseId: z.coerce
    .number()
    .int("Select a course/subject")
    .positive("Select a course/subject"),
  ...assignmentFields,
})

const assignmentList = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).min(1, "Add at least one teaching assignment")

const passwordFields = {
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use at most 72 characters"),
  confirmPassword: z.string(),
}

const passwordsMatch = {
  check: (values: { password: string; confirmPassword: string }) =>
    values.password === values.confirmPassword,
  options: {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  },
}

/**
 * One dialog serves both Add and Edit, so the mode travels with the values and
 * the credential rules only apply while creating an account.
 */
export const teacherDialogSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    ...teacherFields,
    assignments: assignmentList(assignmentFormSchema),
    password: z.string().max(72),
    confirmPassword: z.string(),
  })
  .superRefine((values, ctx) => {
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
        message: passwordsMatch.options.message,
      })
    }
  })

export const teacherProfileSchema = z.object({
  ...teacherFields,
  assignments: assignmentList(assignmentSchema),
})

export const createTeacherSchema = teacherProfileSchema
  .extend(passwordFields)
  .refine(passwordsMatch.check, passwordsMatch.options)

export const updateTeacherSchema = teacherProfileSchema.extend({
  id: z.coerce.number().int().positive(),
})

export const teacherIdSchema = z.coerce.number().int().positive()

export type TeacherDialogValues = z.infer<typeof teacherDialogSchema>
export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>
export type CreateTeacherInput = z.input<typeof createTeacherSchema>
export type UpdateTeacherInput = z.input<typeof updateTeacherSchema>
