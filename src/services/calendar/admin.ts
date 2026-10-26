import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchAllRows } from "@/services/supabase/pagination"
import type { CalendarEntryRow } from "./query"

export async function fetchAdminCalendarOverview(monthStart: string, monthEnd: string, nextMonth: string, today: string, upcomingEnd: string) {
  const client = await createServerSupabaseClient()
  const [entries, upcoming, published, failed] = await Promise.all([
    fetchAllRows<CalendarEntryRow>((from, to) => client.from("calendar_entries").select("*")
      .lte("starts_on", monthEnd).gte("ends_on", monthStart).order("starts_on").order("id").range(from, to)),
    client.from("calendar_entries").select("id", { count: "exact", head: true }).eq("status", "published")
      .gte("ends_on", today).lte("starts_on", upcomingEnd),
    client.from("calendar_entries").select("id", { count: "exact", head: true }).eq("status", "published")
      .gte("published_at", `${monthStart}T00:00:00+08:00`).lt("published_at", `${nextMonth}T00:00:00+08:00`),
    client.from("calendar_email_deliveries").select("id", { count: "exact", head: true }).eq("status", "Failed"),
  ])
  for (const result of [upcoming, published, failed]) if (result.error) throw new Error("Calendar summary could not be loaded.")
  return { entries, upcoming: upcoming.count ?? 0, published: published.count ?? 0, failed: failed.count ?? 0 }
}

export async function fetchCalendarDeliveryStatuses(ids: number[]) {
  if (!ids.length) return []
  const client = await createServerSupabaseClient()
  return fetchAllRows<{ calendar_entry_id: number; status: "Pending" | "Sent" | "Failed" }>((from, to) => client
    .from("calendar_email_deliveries").select("calendar_entry_id,status").in("calendar_entry_id", ids).order("id").range(from, to))
}
