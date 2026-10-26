import { after } from "next/server"
import { revalidatePath } from "next/cache"
import { renderCalendarEmail, type CalendarEmailType } from "@/features/calendar/email"
import type { CalendarEntryRow } from "@/services/calendar/query"
import { storeCalendarDeliveries, sendCalendarDeliveries, failedCalendarDeliveries } from "@/services/calendar/email"

export interface CalendarNotification {
  batch_id: string
  type: CalendarEmailType
  entry: CalendarEntryRow
  recipients: { user_id: string; email: string; role: "teacher" | "student" }[]
}

function scheduleDelivery(operation: () => Promise<void>) {
  after(async () => {
    try {
      await operation()
    } catch {
      console.error("Calendar email delivery needs review. Check pending deliveries before retrying.")
    } finally {
      revalidatePath("/admin/schedules/calendar")
    }
  })
}

export async function queueCalendarNotification(notification?: CalendarNotification): Promise<string> {
  if (!notification) return ""
  const recipients = [...new Map(notification.recipients
    .filter(recipient => recipient.role === "teacher" || recipient.role === "student")
    .map(recipient => [recipient.user_id, recipient])).values()]
  if (!recipients.length) return " No recipients matched."
  try {
    const rows = recipients.map(recipient => {
      const rendered = renderCalendarEmail(notification.entry, notification.type, recipient.role)
      return { calendar_entry_id: notification.entry.id, batch_id: notification.batch_id,
        notification_type: notification.type, recipient_user_id: recipient.user_id,
        recipient_email: recipient.email, recipient_role: recipient.role,
        subject: rendered.subject, html_body: rendered.html, text_body: rendered.text }
    })
    // shortcut: no durable worker; inspect interrupted scheduling manually until durable recovery is required.
    await storeCalendarDeliveries(rows)
    scheduleDelivery(() => sendCalendarDeliveries(notification.batch_id))
    return " Email notifications queued."
  } catch {
    return " Calendar saved, but email scheduling failed. Review delivery logs before retrying."
  }
}

export async function queueCalendarEmailRetry(target: { id: number } | { batchId: string }): Promise<boolean> {
  const rows = await failedCalendarDeliveries(target)
  if (!rows.length) return false
  scheduleDelivery(() => sendCalendarDeliveries(rows[0].batch_id, rows))
  return true
}
