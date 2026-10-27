import { requireRole } from "@/features/auth/server"
import { auditActivity } from "@/services/audit/log"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { calendarDateSchema } from "@/features/calendar/schema"

/** Admin report/export reconciliation; no revalidation during server rendering. */
export async function syncReportCalendar(from: string, to: string) {
  return auditActivity("sync_attendance_day_marks", "attendance_day_marks", async () => {
    await requireRole("admin")
    const start = calendarDateSchema.parse(from), end = calendarDateSchema.parse(to)
    if (start > end) throw new Error("End date cannot be before start date.")
    const client = await createServerSupabaseClient()
    const { data, error } = await client.rpc("sync_attendance_day_marks", { p_from: start, p_to: end })
    if (error || !data || !Number.isInteger(data.inserted) || !Number.isInteger(data.deleted) || data.inserted < 0 || data.deleted < 0) throw new Error("Calendar attendance marks could not be synchronized. The report was not generated.")
  })
}
