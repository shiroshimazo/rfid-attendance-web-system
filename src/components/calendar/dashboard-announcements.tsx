import { requireCurrentAccount } from "@/features/auth/server"
import { fetchDashboardPosts } from "@/services/calendar/query"
import { AnnouncementPosts } from "./announcement-posts"

export async function DashboardAnnouncements() {
  const account = await requireCurrentAccount()
  if (account.role === "admin") return null
  let entries
  try { entries = await fetchDashboardPosts() }
  catch { return null }
  return entries.length ? <AnnouncementPosts entries={entries} role={account.role} /> : null
}
