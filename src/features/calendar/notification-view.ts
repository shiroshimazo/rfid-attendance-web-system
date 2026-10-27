import type { CalendarBellRow } from "@/services/calendar/query"
import { calendarLabels } from "@/features/calendar/admin-view"
import { formatDateValue } from "@/lib/format"

export function isCalendarUnread(updatedAt: string, readAt: string | null): boolean {
  if (!readAt) return true
  const read = Date.parse(readAt), updated = Date.parse(updatedAt)
  return Number.isFinite(read) && Number.isFinite(updated) && read < updated
}

export function latestUnreadCalendarEntry(entries: CalendarBellRow[]) {
  return entries.filter(entry => isCalendarUnread(entry.updated_at, entry.read_at))
    .sort((a, b) => b.published_at.localeCompare(a.published_at) || b.id - a.id)[0]
}

export function calendarToastContent(entry: CalendarBellRow) {
  const state = entry.attendance_impact === "no_classes" ? "No classes" : entry.attendance_impact === "online_manual" ? "Online class" : ""
  return {
    title: state ? `${state}: ${entry.title}` : entry.title,
    description: `${entry.tags.map(tag => calendarLabels[tag] ?? tag).join(", ")} · ${calendarLabels[entry.attendance_impact]} · ${formatDateValue(entry.starts_on)}${entry.ends_on !== entry.starts_on ? ` – ${formatDateValue(entry.ends_on)}` : ""} · ${entry.campuses.join(", ") || "All campuses"}`,
  }
}

export function claimCalendarSessionToast(userId: string, storage: Pick<Storage, "getItem" | "setItem">): boolean {
  try {
    const key = `calendar-login-toast:${userId}`
    if (storage.getItem(key)) return false
    storage.setItem(key, "shown")
    return true
  } catch {
    // Skip the optional toast when storage is blocked so refreshes cannot repeat it.
    return false
  }
}
