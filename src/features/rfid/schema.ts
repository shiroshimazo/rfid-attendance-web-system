import { z } from "zod"

import {
  databaseIdSchema,
  requiredDate,
  rfidCardStatuses,
  rfidNumberField,
} from "@/features/shared/schema"

export { rfidCardStatuses }

const issuedOn = requiredDate("Choose the date the card was recorded")

/**
 * This directory stores cards; it never picks a holder. Fields are shared by
 * the browser form and the authoritative server schema.
 */
const cardFields = {
  rfidNumber: rfidNumberField,
  cardStatus: z.enum(rfidCardStatuses),
  assignedDate: issuedOn,
}

export const rfidCardFormSchema = z.object(cardFields)

export const registerRfidCardSchema = z.object(cardFields)

/** Editing a stored card covers its printed UID, status, and date. */
export const editRfidCardSchema = z.object({
  ...cardFields,
  id: databaseIdSchema,
})

export const rfidCardStatusFormSchema = z.object({
  cardStatus: z.enum(rfidCardStatuses),
})

export const rfidCardStatusSchema = z.object({
  id: databaseIdSchema,
  cardStatus: z.enum(rfidCardStatuses),
})

export type RfidCardFormValues = z.infer<typeof rfidCardFormSchema>
export type RfidCardStatusValues = z.infer<typeof rfidCardStatusFormSchema>
export type RegisterRfidCardInput = z.input<typeof registerRfidCardSchema>
export type EditRfidCardInput = z.input<typeof editRfidCardSchema>
export type RfidCardStatusInput = z.input<typeof rfidCardStatusSchema>
