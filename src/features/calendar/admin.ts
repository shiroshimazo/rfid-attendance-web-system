import { requireRole } from "@/features/auth/server"
import { fetchAdminCalendarEntries, fetchCalendarCampuses } from "@/services/calendar/query"
import { fetchAdminCalendarOverview, fetchCalendarDeliveryStatuses } from "@/services/calendar/admin"
import { calendarDays, monthBounds, type AdminCalendarQuery } from "@/features/calendar/admin-view"

export async function getAdminCalendarPanel(query: AdminCalendarQuery) {
  await requireRole("admin")
  const bounds = monthBounds(query.month)
  const upcomingEnd = new Date(`${query.today}T00:00:00Z`)
  upcomingEnd.setUTCDate(upcomingEnd.getUTCDate() + 29)
  const listPromise = query.tab === "list" ? fetchAdminCalendarEntries(query).then(async initial => {
    const page = Math.min(query.page, Math.max(1, Math.ceil(initial.total / query.pageSize)))
    const list = page === query.page ? initial : await fetchAdminCalendarEntries({ ...query, page })
    const deliveryRows = await fetchCalendarDeliveryStatuses(list.entries.map(entry => entry.id))
    return { list, page, deliveryRows }
  }) : Promise.resolve({
    list: { entries: [], total: 0, page: query.page, pageSize: query.pageSize },
    page: query.page, deliveryRows: [],
  })
  const [overview, campuses, { list, page, deliveryRows }] = await Promise.all([
    fetchAdminCalendarOverview(bounds.start, bounds.end, bounds.next, query.today, upcomingEnd.toISOString().slice(0, 10)),
    fetchCalendarCampuses(), listPromise,
  ])
  const deliveries: Record<number, { Pending: number; Sent: number; Failed: number }> = {}
  for (const row of deliveryRows) {
    deliveries[row.calendar_entry_id] ??= { Pending: 0, Sent: 0, Failed: 0 }
    deliveries[row.calendar_entry_id][row.status]++
  }
  const days = calendarDays(overview.entries, query.month)
  const noClasses = Object.values(days).filter(entries => entries.some(entry => entry.status === "published" && entry.attendance_impact === "no_classes")).length
  return { query: { ...query, page }, entries: overview.entries, list, campuses, deliveries,
    kpis: { upcoming: overview.upcoming, noClasses, published: overview.published, failed: overview.failed } }
}
export type AdminCalendarPanel = Awaited<ReturnType<typeof getAdminCalendarPanel>>
