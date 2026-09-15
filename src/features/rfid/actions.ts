"use server"

import { auditActivity } from "@/services/audit/log"

import { requireRole } from "@/features/auth/server"
import {
  registerRfidCardSchema, rfidCardAssignmentSchema, rfidCardStatusSchema,
  type RegisterRfidCardInput, type RfidCardAssignmentInput, type RfidCardStatusInput,
} from "@/features/rfid/schema"
import { writeRfidCard } from "@/features/rfid/write"
import { failure, flattenIssues, validationFailureMessage, type ActionResult } from "@/features/shared/actions"

export async function registerRfidCardAction(input: RegisterRfidCardInput): Promise<ActionResult> {
  return auditActivity("register_rfid_card", "rfid_cards", async () => {
    await requireRole("admin")
    const parsed = registerRfidCardSchema.safeParse(input)
    if (!parsed.success) return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    return writeRfidCard({ operation: "save", ...parsed.data })
  })
}

/** Explicit reassignment by card ID retains the existing history restriction. */
export async function assignRfidCardAction(input: RfidCardAssignmentInput): Promise<ActionResult> {
  return auditActivity("assign_rfid_card", "rfid_cards", async () => {
    await requireRole("admin")
    const parsed = rfidCardAssignmentSchema.safeParse(input)
    if (!parsed.success) return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    return writeRfidCard({ operation: "assign", ...parsed.data })
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
