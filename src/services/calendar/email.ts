import { randomUUID } from "node:crypto"
import { createAdminSupabaseClient } from "@/services/supabase/admin"
import { fetchAllRows } from "@/services/supabase/pagination"
import { sendResendBatch } from "@/services/email/resend"
import type { CalendarEmailDeliveryRow } from "@/services/calendar/query"

export type Delivery = CalendarEmailDeliveryRow
export type NewDelivery = Pick<Delivery, "calendar_entry_id" | "batch_id" | "notification_type" |
  "recipient_user_id" | "recipient_email" | "recipient_role" | "subject" | "html_body" | "text_body">

export async function storeCalendarDeliveries(rows: NewDelivery[]) {
  const { error } = await createAdminSupabaseClient().from("calendar_email_deliveries")
    .upsert(rows, { onConflict: "batch_id,recipient_user_id", ignoreDuplicates: true })
  if (error) throw new Error("Calendar email payloads could not be saved.")
}

export async function failedCalendarDeliveries(target: { id: number } | { batchId: string }) {
  const client = createAdminSupabaseClient()
  return fetchAllRows<Delivery>((from, to) => {
    let query = client.from("calendar_email_deliveries").select("*").eq("status", "Failed").eq("retry_allowed", true)
    query = "id" in target ? query.eq("id", target.id) : query.eq("batch_id", target.batchId)
    return query.order("id").range(from, to)
  })
}

/** Authorized server callers only. Claims prevent duplicate callbacks and concurrent retries. */
export async function sendCalendarDeliveries(batchId: string, retryRows?: Delivery[]) {
  const client = createAdminSupabaseClient()
  const rows = retryRows ?? await fetchAllRows<Delivery>((from, to) => client.from("calendar_email_deliveries")
    .select("*").eq("batch_id", batchId).eq("status", "Pending").eq("attempt_count", 0).eq("retry_allowed", true)
    .order("id").range(from, to))
  for (let offset = 0; offset < rows.length; offset += 100) {
    const claimed: Delivery[] = []
    for (const row of rows.slice(offset, offset + 100)) {
      const { data, error } = await client.from("calendar_email_deliveries")
        .update({ status: "Pending", retry_allowed: false, attempt_count: row.attempt_count + 1,
          last_attempt_at: new Date().toISOString(), error_message: null })
        .eq("id", row.id).eq("status", retryRows ? "Failed" : "Pending")
        .eq("attempt_count", row.attempt_count).eq("retry_allowed", true).select("*").maybeSingle<Delivery>()
      if (error) throw new Error("Calendar email attempts could not be claimed.")
      if (data) claimed.push(data)
    }
    if (!claimed.length) continue
    // Unknown acceptance and interrupted claims stay locked for operator review, never blind resend.
    const outcome = await sendResendBatch(claimed.map(row => ({
      to: row.recipient_email, subject: row.subject, html: row.html_body, text: row.text_body,
    })), `calendar/${batchId}/${randomUUID()}`)
    for (const [index, row] of claimed.entries()) {
      const accepted = outcome.status === "accepted"
      const { error } = await client.from("calendar_email_deliveries").update({
        status: accepted ? "Sent" : "Failed", retry_allowed: outcome.status === "rejected",
        resend_email_id: accepted ? outcome.providerIds[index] : null,
        sent_at: accepted ? new Date().toISOString() : null,
        error_message: accepted ? null : outcome.errorMessage,
      }).eq("id", row.id).eq("status", "Pending").eq("attempt_count", row.attempt_count)
      if (error) throw new Error("Calendar email result could not be saved; review provider records before retrying.")
    }
  }
}
