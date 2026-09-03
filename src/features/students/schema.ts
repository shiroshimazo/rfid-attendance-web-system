import { z } from "zod"

import {
  accountStatuses,
  applyCredentialRules,
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

export { accountStatuses, genderOptions }

export const rfidCardStatuses = [
  "Active",
  "Inactive",
  "Lost",
  "Deactivated",
] as const

/** Fields shared by the browser form and the authoritative server schema. */
const studentFields = {
  // Personal
  fullName: requiredText(120, "Full name is required"),
  gender: z.enum(genderOptions).or(z.literal("")),
  dateOfBirth: optionalDate,
  placeOfBirth: optionalText(120),
  address: optionalText(240),
  contactNumber: optionalText(32),
  email: emailField,
  profilePicture: optionalUrl,
  // Parent or guardian
  parentName: requiredText(120, "Parent or guardian name is required"),
  parentContactNumber: z
    .string()
    .trim()
    .min(7, "Parent or guardian contact number is required")
    .max(32),
  // Academic
  studentId: requiredText(40, "Student ID is required"),
  yearLevel: requiredText(40, "Year level is required"),
  section: requiredText(40, "Section is required"),
  campus: requiredText(80, "Campus is required"),
  status: z.enum(accountStatuses),
}

export const studentDialogSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    ...studentFields,
    // The combobox holds the program id as a string.
    programId: z.string().min(1, "Select a program"),
    password: z.string().max(72),
    confirmPassword: z.string(),
  })
  .superRefine(applyCredentialRules)

export const studentProfileSchema = z.object({
  ...studentFields,
  programId: selectedId("Select a program"),
})

export const createStudentSchema = studentProfileSchema
  .extend(passwordFields)
  .refine(passwordsMatch.check, {
    path: ["confirmPassword"],
    message: passwordsMatch.message,
  })

export const updateStudentSchema = studentProfileSchema.extend({
  id: databaseIdSchema,
})

/** RFID numbers are printed in mixed case, so they are normalised upwards. */
export const rfidAssignmentFormSchema = z.object({
  rfidNumber: z
    .string()
    .trim()
    .toUpperCase()
    .min(4, "Enter the number printed on the card")
    .max(64)
    .regex(
      /^[A-Z0-9:-]+$/,
      "Use letters, digits, colons, or hyphens only"
    ),
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the date the card was issued"),
})

export const rfidAssignmentSchema = rfidAssignmentFormSchema.extend({
  studentId: databaseIdSchema,
})

export const studentIdSchema = databaseIdSchema

export type StudentDialogValues = z.infer<typeof studentDialogSchema>
export type RfidAssignmentValues = z.infer<typeof rfidAssignmentFormSchema>
export type CreateStudentInput = z.input<typeof createStudentSchema>
export type UpdateStudentInput = z.input<typeof updateStudentSchema>
export type RfidAssignmentInput = z.input<typeof rfidAssignmentSchema>
