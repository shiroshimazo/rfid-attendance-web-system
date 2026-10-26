import { schoolDateKey } from "@/lib/school-time"
import { calendarDateSchema, calendarTags, calendarStatuses, calendarAudiences, calendarAttendanceImpacts } from "@/features/calendar/schema"
import type { CalendarEntryRow } from "@/services/calendar/query"

export type CalendarSearchParams = Record<string, string | string[] | undefined>
export const calendarLabels: Record<string, string> = {
  all: "All", draft: "Draft", published: "Published", cancelled: "Cancelled",
  normal: "Normal", no_classes: "No classes", online_manual: "Online / manual",
  everyone: "Everyone", teachers: "Teachers", students: "Students", event: "Event",
  online_class: "Online class", holiday: "Holiday", exam: "Exam", deadline: "Deadline", meeting: "Meeting", other: "Other",
}

export function calendarDate(value: string): Date {
  return new Date(`${value}T12:00:00`)
}
export function calendarDateKey(value: Date): string {
  return `${String(value.getFullYear()).padStart(4, "0")}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
}
export function monthBounds(month: string) {
  const first = calendarDate(`${month}-01`)
  const next = new Date(first)
  next.setMonth(next.getMonth() + 1)
  const last = new Date(next)
  last.setDate(0)
  return { start: calendarDateKey(first), end: calendarDateKey(last), next: calendarDateKey(next) }
}
function validDate(value: string) {
  const parsed = calendarDateSchema.safeParse(value)
  return parsed.success && parsed.data === value
}

export function parseAdminCalendarQuery(params: CalendarSearchParams, now = new Date()) {
  const one = (key: string) => typeof params[key] === "string" ? params[key] as string : ""
  const option = <T extends string>(key: string, choices: readonly T[]): T | "all" => choices.includes(one(key) as T) ? one(key) as T : "all"
  const today = schoolDateKey(now)
  const requestedDate = one("date")
  const month = /^\d{4}-\d{2}$/.test(one("month")) && validDate(`${one("month")}-01`)
    && one("month") >= "0001-01" && one("month") <= "9998-12"
    ? one("month") : validDate(requestedDate) && requestedDate < "9999-01-01" ? requestedDate.slice(0, 7) : today.slice(0, 7)
  const date = validDate(requestedDate) && requestedDate.startsWith(month) ? requestedDate : today.startsWith(month) ? today : `${month}-01`
  let from = validDate(one("from")) ? one("from") : ""
  let to = validDate(one("to")) ? one("to") : ""
  if (from && to && from > to) [from, to] = [to, from]
  const page = Number(one("page"))
  return { month, date, tab: one("tab") === "list" ? "list" : "calendar", today,
    search: one("search").trim().slice(0, 160), status: option("status", calendarStatuses),
    tag: option("tag", calendarTags), impact: option("impact", calendarAttendanceImpacts),
    audience: option("audience", calendarAudiences), campus: one("campus").trim().slice(0, 160) || "all",
    from, to, page: Number.isSafeInteger(page) && page > 0 && page <= 100000 ? page : 1, pageSize: 20 }
}
export type AdminCalendarQuery = ReturnType<typeof parseAdminCalendarQuery>

export function calendarDays(entries: CalendarEntryRow[], month: string) {
  const { start, end } = monthBounds(month)
  const days: Record<string, CalendarEntryRow[]> = {}
  for (const entry of entries) {
    const first = entry.starts_on > start ? entry.starts_on : start
    const last = entry.ends_on < end ? entry.ends_on : end
    for (const day = calendarDate(first); calendarDateKey(day) <= last; day.setDate(day.getDate() + 1)) {
      const key = calendarDateKey(day)
      ;(days[key] ??= []).push(entry)
    }
  }
  return days
}
