import type { CurrentAccount } from "@/features/auth/server"
import { fetchCalendarBellEntries } from "@/services/calendar/query"
import { NotificationBell } from "./notification-bell"

export async function CalendarNotifications({ account }: { account: CurrentAccount }) {
  if (account.role === "admin" || account.status !== "active") return null
  let entries
  try { entries = await fetchCalendarBellEntries(account.id) }
  catch { return null }
  return <NotificationBell key={account.id} entries={entries} userId={account.id} role={account.role} />
}
