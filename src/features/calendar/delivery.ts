import { requireRole } from "@/features/auth/server"
import { calendarDateSchema, calendarEmailStatuses, calendarEmailTypes } from "@/features/calendar/schema"
import { fetchCalendarDeliveryLog, type CalendarDeliveryFilters } from "@/services/calendar/query"
import type { CalendarSearchParams } from "@/features/calendar/admin-view"

const PAGE_SIZE = 10

export async function getCalendarDeliveryPanel(params: CalendarSearchParams) {
  await requireRole("admin")
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : ""
  const integer = (key: string) => /^\d+$/.test(value(key)) && Number.isSafeInteger(Number(value(key))) && Number(value(key)) > 0 ? Number(value(key)) : undefined
  const filters: CalendarDeliveryFilters = {
    search: (value("search") || value("entry")).trim().slice(0, 160) || undefined,
    type: calendarEmailTypes.find(type => type === value("type")),
    status: calendarEmailStatuses.find(status => status === value("status")),
    from: calendarDateSchema.safeParse(value("from")).data,
    to: calendarDateSchema.safeParse(value("to")).data,
  }
  if (filters.from && filters.to && filters.from > filters.to) [filters.from, filters.to] = [filters.to, filters.from]
  const requestedPage = integer("page") ?? 1
  const initial = await fetchCalendarDeliveryLog(requestedPage, PAGE_SIZE, filters)
  const pageCount = Math.max(1, Math.ceil(initial.total / PAGE_SIZE))
  const page = Math.min(requestedPage, pageCount)
  const result = page === requestedPage ? initial : await fetchCalendarDeliveryLog(page, PAGE_SIZE, filters)
  return { ...result, filters, page, pageCount }
}
export type CalendarDeliveryPanel = Awaited<ReturnType<typeof getCalendarDeliveryPanel>>
