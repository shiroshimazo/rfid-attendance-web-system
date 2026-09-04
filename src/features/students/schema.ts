import { z } from "zod"

import { isPilotCampus, isPilotSection, PILOT_YEAR_LEVEL } from "@/features/academic/pilot"
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
  requiredDate,
  requiredText,
  rfidCardStatuses,
  rfidNumberField,
  selectedId,
} from "@/features/shared/schema"

export { accountStatuses, genderOptions, rfidCardStatuses }

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
  // Academic (BSIT 2nd Year pilot scope)
  studentId: requiredText(40, "Student ID is required"),
  yearLevel: requiredText(40, "Year level is required").refine(
    (value) => value === PILOT_YEAR_LEVEL,
    { message: `Only ${PILOT_YEAR_LEVEL} is supported in the pilot` }
  ),
  section: requiredText(40, "Section is required").refine(isPilotSection, {
    message: "Section must be a pilot section (21001-21010)",
  }),
  campus: requiredText(80, "Campus is required").refine(isPilotCampus, {
    message: "Campus must be Main Campus, MV Campus, or Bulacan Campus",
  }),
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

export const rfidAssignmentFormSchema = z.object({
  rfidNumber: rfidNumberField,
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: requiredDate("Choose the date the card was issued"),
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
