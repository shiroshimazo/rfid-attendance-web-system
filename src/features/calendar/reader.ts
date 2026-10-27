import { requireRole } from "@/features/auth/server"
import { parseAdminCalendarQuery, monthBounds, type CalendarSearchParams } from "@/features/calendar/admin-view"
import { fetchReaderCalendarEntries, fetchUpcomingCalendarEntries } from "@/services/calendar/query"

export async function getReaderCalendarPanel(role: "teacher" | "student", params: CalendarSearchParams) {
  await requireRole(role)
  const { month, date, today } = parseAdminCalendarQuery(params)
  const bounds = monthBounds(month)
  const [entries, upcoming] = await Promise.all([
    fetchReaderCalendarEntries(bounds.start, bounds.end), fetchUpcomingCalendarEntries(),
  ])
  return { month, date, today, entries, upcoming }
}
export type ReaderCalendarPanel = Awaited<ReturnType<typeof getReaderCalendarPanel>>
