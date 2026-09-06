import { revalidatePath } from "next/cache"
import { failure, success, type ActionResult } from "@/features/shared/actions"
import type { RfidCardStatus } from "@/services/rfid/cards"
import { createServerSupabaseClient } from "@/services/supabase/server"

type CardWrite = {
  operation: "save" | "assign" | "status"
  studentId?: number
  rfidNumber?: string
  id?: number
  cardStatus: RfidCardStatus
  assignedDate?: string
}

/** Callers authorize and parse input; the RPC repeats authorization and owns
 * holder checks, UID lookup, history protection, retirement and final write. */
export async function writeRfidCard(values: CardWrite): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.rpc("save_rfid_card", {
    p_operation: values.operation,
    p_student_id: values.studentId ?? null,
    p_uid: values.rfidNumber ?? null,
    p_card_id: values.id ?? null,
    p_status: values.cardStatus,
    p_assigned_date: values.assignedDate ?? null,
  })
  if (error) {
    const message = error.code === "23505" && !error.message.startsWith("That UID belongs")
      ? "That UID is already registered or another card became active. Reload before retrying."
      : error.code === "23503"
        ? "The card or student no longer exists, or attendance history prevents changing the holder."
        : error.message
    return failure(message)
  }
  revalidatePath("/admin/rfid-cards")
  revalidatePath("/admin/students")
  return success(values.operation === "status" ? `Card is now ${values.cardStatus.toLowerCase()}.` : "RFID card assignment saved.")
}
