"use server"

import { auditActivity } from "@/services/audit/log"

import { requireRole } from "@/features/auth/server"
import {
  editRfidCardSchema, registerRfidCardSchema, rfidCardStatusSchema,
  type EditRfidCardInput, type RegisterRfidCardInput, type RfidCardStatusInput,
} from "@/features/rfid/schema"
import { writeRfidCard } from "@/features/rfid/write"
import { failure, flattenIssues, validationFailureMessage, type ActionResult } from "@/features/shared/actions"

/** Stores a card. Manage Students gives it to a student afterwards. */
export async function registerRfidCardAction(input: RegisterRfidCardInput): Promise<ActionResult> {
  return auditActivity("register_rfid_card", "rfid_cards", async () => {
    await requireRole("admin")
    const parsed = registerRfidCardSchema.safeParse(input)
    if (!parsed.success) return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    return writeRfidCard({ operation: "save", ...parsed.data })
  })
}

/** Edits stored details by card ID; the holder is never changed here. */
export async function editRfidCardAction(input: EditRfidCardInput): Promise<ActionResult> {
  return auditActivity("edit_rfid_card", "rfid_cards", async () => {
    await requireRole("admin")
    const parsed = editRfidCardSchema.safeParse(input)
    if (!parsed.success) return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    return writeRfidCard({ operation: "save", ...parsed.data })
  })
}

export async function setRfidCardStatusAction(input: RfidCardStatusInput): Promise<ActionResult> {
  return auditActivity("set_rfid_card_status", "rfid_cards", async () => {
    await requireRole("admin")
    const parsed = rfidCardStatusSchema.safeParse(input)
    if (!parsed.success) return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    return writeRfidCard({ operation: "status", ...parsed.data })
  })
}
