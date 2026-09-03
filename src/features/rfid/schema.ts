import { z } from "zod"

import {
  databaseIdSchema,
  requiredDate,
  rfidCardStatuses,
  rfidNumberField,
  selectedId,
} from "@/features/shared/schema"

export { rfidCardStatuses }

const issuedOn = requiredDate("Choose the date the card was issued")

/** Fields shared by the browser form and the authoritative server schema. */
const cardFields = {
  rfidNumber: rfidNumberField,
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: issuedOn,
}

/** The combobox holds the student id as a string, so the form stays flat. */
export const rfidCardFormSchema = z.object({
  ...cardFields,
  studentId: z.string().min(1, "Select a student"),
})

export const registerRfidCardSchema = z.object({
  ...cardFields,
  studentId: selectedId("Select a student"),
})

export const rfidCardAssignmentFormSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: issuedOn,
})

export const rfidCardAssignmentSchema = z.object({
  id: databaseIdSchema,
  studentId: selectedId("Select a student"),
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: issuedOn,
})

export const rfidCardStatusFormSchema = z.object({
  cardStatus: z.enum(rfidCardStatuses),
})

export const rfidCardStatusSchema = z.object({
  id: databaseIdSchema,
  cardStatus: z.enum(rfidCardStatuses),
})

export type RfidCardFormValues = z.infer<typeof rfidCardFormSchema>
export type RfidCardAssignmentValues = z.infer<
  typeof rfidCardAssignmentFormSchema
>
export type RfidCardStatusValues = z.infer<typeof rfidCardStatusFormSchema>
export type RegisterRfidCardInput = z.input<typeof registerRfidCardSchema>
export type RfidCardAssignmentInput = z.input<typeof rfidCardAssignmentSchema>
export type RfidCardStatusInput = z.input<typeof rfidCardStatusSchema>
