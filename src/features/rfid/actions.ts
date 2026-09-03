"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/features/auth/server"
import {
  registerRfidCardSchema,
  rfidCardAssignmentSchema,
  rfidCardStatusSchema,
  type RegisterRfidCardInput,
  type RfidCardAssignmentInput,
  type RfidCardStatusInput,
} from "@/features/rfid/schema"
import {
  describeError as describeDatabaseError,
  failure,
  flattenIssues,
  success,
  validationFailureMessage,
  type ActionResult,
} from "@/features/shared/actions"
import type { RfidCardStatus } from "@/services/rfid/cards"
import { createServerSupabaseClient } from "@/services/supabase/server"

const RFID_CARDS_PATH = "/admin/rfid-cards"
const STUDENTS_PATH = "/admin/students"

interface CardRecord {
  id: number
  student_id: number
  rfid_number: string
  card_status: RfidCardStatus
}

interface HolderRecord {
  id: number
  full_name: string
  status: "active" | "inactive" | "archived"
}

type Supabase = Awaited<ReturnType<typeof createServerSupabaseClient>>

function describeError(error: { message: string; code?: string }) {
  if (error.code === "23503") {
    return "That card is referenced by attendance records under its current holder, so it cannot be moved."
  }

  return describeDatabaseError(
    error,
    "That RFID number is already registered to another student."
  )
}

/** Both admin screens read the same cards, so both are refreshed together. */
function revalidateCardPages() {
  revalidatePath(RFID_CARDS_PATH)
  revalidatePath(STUDENTS_PATH)
}

async function readHolder(supabase: Supabase, studentId: number) {
  return supabase
    .from("students")
    .select("id, full_name, status")
    .eq("id", studentId)
    .maybeSingle<HolderRecord>()
}

/**
 * The schema keeps a partial unique index over active cards, so the previous
 * active card of a student is retired before a new one takes over.
 */
async function retireOtherActiveCards(
  supabase: Supabase,
  studentId: number,
  exceptCardId?: number
) {
  const query = supabase
    .from("rfid_cards")
    .update({ card_status: "Deactivated" })
    .eq("student_id", studentId)
    .eq("card_status", "Active")

  return exceptCardId === undefined ? query : query.neq("id", exceptCardId)
}

function rejectInactiveHolder(holder: HolderRecord) {
  return failure(
    `${holder.full_name} is ${holder.status}, so their card cannot be made active. Restore the student first.`
  )
}

/** Registers a new card number and hands it to the student who will tap it. */
export async function registerRfidCardAction(
  input: RegisterRfidCardInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = registerRfidCardSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data: holder, error: holderError } = await readHolder(
    supabase,
    values.studentId
  )

  if (holderError) return failure(describeError(holderError))
  if (!holder) return failure("That student record no longer exists.")

  const { data: existing, error: existingError } = await supabase
    .from("rfid_cards")
    .select("id")
    .eq("rfid_number", values.rfidNumber)
    .maybeSingle<{ id: number }>()

  if (existingError) return failure(describeError(existingError))

  if (existing) {
    return failure(validationFailureMessage, {
      rfidNumber: "That RFID number is already registered.",
    })
  }

  if (values.cardStatus === "Active") {
    if (holder.status !== "active") return rejectInactiveHolder(holder)

    const { error: retireError } = await retireOtherActiveCards(
      supabase,
      holder.id
    )

    if (retireError) return failure(describeError(retireError))
  }

  const { error: insertError } = await supabase.from("rfid_cards").insert({
    student_id: holder.id,
    rfid_number: values.rfidNumber,
    card_status: values.cardStatus,
    assigned_date: values.assignedDate,
  })

  if (insertError) return failure(describeError(insertError))

  revalidateCardPages()

  return success(`${values.rfidNumber} was registered to ${holder.full_name}.`)
}

/**
 * Moves an existing card to a student, or re-issues it to the same one. A card
 * that already carries attendance history cannot change hands, because those
 * records point at the card and student pair together.
 */
export async function assignRfidCardAction(
  input: RfidCardAssignmentInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = rfidCardAssignmentSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data: card, error: cardError } = await supabase
    .from("rfid_cards")
    .select("id, student_id, rfid_number, card_status")
    .eq("id", values.id)
    .maybeSingle<CardRecord>()

  if (cardError) return failure(describeError(cardError))
  if (!card) return failure("That card is no longer registered.")

  const { data: holder, error: holderError } = await readHolder(
    supabase,
    values.studentId
  )

  if (holderError) return failure(describeError(holderError))
  if (!holder) return failure("That student record no longer exists.")

  const isMoving = card.student_id !== holder.id

  if (isMoving) {
    const { count, error: historyError } = await supabase
      .from("attendance_records")
      .select("id", { count: "exact", head: true })
      .eq("rfid_card_id", card.id)

    if (historyError) return failure(describeError(historyError))

    if (count && count > 0) {
      const records = `${count} attendance record${count === 1 ? "" : "s"}`

      return failure(
        `${card.rfid_number} already has ${records}, so it cannot change hands. Register a new card for ${holder.full_name} instead.`
      )
    }
  }

  if (values.cardStatus === "Active") {
    if (holder.status !== "active") return rejectInactiveHolder(holder)

    const { error: retireError } = await retireOtherActiveCards(
      supabase,
      holder.id,
      card.id
    )

    if (retireError) return failure(describeError(retireError))
  }

  const { error: updateError } = await supabase
    .from("rfid_cards")
    .update({
      student_id: holder.id,
      card_status: values.cardStatus,
      assigned_date: values.assignedDate,
    })
    .eq("id", card.id)

  if (updateError) return failure(describeError(updateError))

  revalidateCardPages()

  return success(
    isMoving
      ? `${card.rfid_number} was assigned to ${holder.full_name}.`
      : `${card.rfid_number} was re-issued to ${holder.full_name}.`
  )
}

/** Changes only the card status, used when a card is lost or retired. */
export async function setRfidCardStatusAction(
  input: RfidCardStatusInput
): Promise<ActionResult> {
  await requireRole("admin")

  const parsed = rfidCardStatusSchema.safeParse(input)

  if (!parsed.success) {
    return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
  }

  const values = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data: card, error: cardError } = await supabase
    .from("rfid_cards")
    .select("id, student_id, rfid_number, card_status")
    .eq("id", values.id)
    .maybeSingle<CardRecord>()

  if (cardError) return failure(describeError(cardError))
  if (!card) return failure("That card is no longer registered.")

  const label = values.cardStatus.toLowerCase()

  if (card.card_status === values.cardStatus) {
    return success(`${card.rfid_number} is already ${label}.`)
  }

  if (values.cardStatus === "Active") {
    const { data: holder, error: holderError } = await readHolder(
      supabase,
      card.student_id
    )

    if (holderError) return failure(describeError(holderError))
    if (!holder) return failure("That student record no longer exists.")
    if (holder.status !== "active") return rejectInactiveHolder(holder)

    const { error: retireError } = await retireOtherActiveCards(
      supabase,
      card.student_id,
      card.id
    )

    if (retireError) return failure(describeError(retireError))
  }

  const { error: updateError } = await supabase
    .from("rfid_cards")
    .update({ card_status: values.cardStatus })
    .eq("id", card.id)

  if (updateError) return failure(describeError(updateError))

  revalidateCardPages()

  return success(`${card.rfid_number} is now ${label}.`)
}
