import { z } from "zod"

import {
  accountStatuses,
  applyCredentialRules,
  civilStatusOptions,
  databaseIdSchema,
  emailField,
  genderOptions,
  optionalDate,
  optionalText,
  optionalUrl,
  passwordFields,
  passwordsMatch,
  requiredText,
  selectedId,
} from "@/features/shared/schema"

export { accountStatuses, civilStatusOptions, genderOptions }

/** Fields shared by the browser form and the authoritative server schema. */
const teacherFields = {
  fullName: requiredText(120, "Full name is required"),
  gender: z.enum(genderOptions).or(z.literal("")),
  dateOfBirth: optionalDate,
  civilStatus: z.enum(civilStatusOptions).or(z.literal("")),
  email: emailField,
  phoneNumber: optionalText(32),
  profilePicture: optionalUrl,
  teacherId: requiredText(40, "Teacher ID is required"),
  department: requiredText(120, "Department is required"),
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
  programId: selectedId("Select a program"),
  courseId: selectedId("Select a course/subject"),
  ...assignmentFields,
})

const assignmentList = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).min(1, "Add at least one teaching assignment")

export const teacherDialogSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    ...teacherFields,
    assignments: assignmentList(assignmentFormSchema),
    password: z.string().max(72),
    confirmPassword: z.string(),
  })
  .superRefine(applyCredentialRules)

export const teacherProfileSchema = z.object({
  ...teacherFields,
  assignments: assignmentList(assignmentSchema),
})

export const createTeacherSchema = teacherProfileSchema
  .extend(passwordFields)
  .refine(passwordsMatch.check, {
    path: ["confirmPassword"],
    message: passwordsMatch.message,
  })

export const updateTeacherSchema = teacherProfileSchema.extend({
  id: databaseIdSchema,
})

export const teacherIdSchema = databaseIdSchema

export type TeacherDialogValues = z.infer<typeof teacherDialogSchema>
export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>
export type CreateTeacherInput = z.input<typeof createTeacherSchema>
export type UpdateTeacherInput = z.input<typeof updateTeacherSchema>
