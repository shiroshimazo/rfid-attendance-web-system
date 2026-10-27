import type { CalendarEntryRow } from "@/services/calendar/query"
import { suggestCalendarImpact, type CalendarEntryValues, type CalendarTag } from "@/features/calendar/schema"

export function calendarFormValues(date: string, entry?: CalendarEntryRow): CalendarEntryValues {
  return {
    title: entry?.title ?? "", description: entry?.description ?? null, reason: entry?.reason ?? null,
    location: entry?.location ?? null, tags: (entry?.tags ?? ["event"]) as CalendarTag[],
    attendanceImpact: entry?.attendance_impact ?? "normal", audience: entry?.audience ?? "everyone",
    campuses: entry?.campuses ?? [], startsOn: entry?.starts_on ?? date, endsOn: entry?.ends_on ?? date,
    startTime: entry?.start_time?.slice(0, 5) ?? null, endTime: entry?.end_time?.slice(0, 5) ?? null,
    isPinned: entry?.is_pinned ?? false,
  }
}

export function calendarTagChange(values: CalendarEntryValues, tags: CalendarTag[]): CalendarEntryValues {
  const attendanceImpact = suggestCalendarImpact(tags)
  return { ...values, tags, attendanceImpact, ...(attendanceImpact === "normal" ? {} : {
    audience: "everyone", startTime: null, endTime: null,
  }) }
}

export function calendarScopeLocked(entry: CalendarEntryRow | undefined, today: string): boolean {
  return Boolean(entry && entry.status !== "draft" && entry.attendance_impact !== "normal" && entry.starts_on < today)
}

export function calendarLifecycleOptions(entry: CalendarEntryRow) {
  if (entry.status === "published") return ["cancel"] as const
  if (entry.status === "cancelled") return ["republish"] as const
  return entry.published_at ? ["publish"] as const : ["publish", "delete"] as const
}
