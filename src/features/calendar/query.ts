import { schoolDateKey } from "@/lib/school-time"
export { isCalendarUnread } from "@/features/calendar/notification-view"
import type {
  CalendarEntryRow,
  CalendarMonthDayRow,
  CalendarBellRow,
  DashboardPostRow,
  CampusOptionRow,
  RecipientCountRow,
  CalendarEmailDeliveryRow,
  AdminListParams,
  AdminListResult,
} from "@/services/calendar/query"
import * as calendarService from "@/services/calendar/query"

export type {
  CalendarEntryRow,
  CalendarMonthDayRow,
  CalendarBellRow,
  DashboardPostRow,
  CampusOptionRow,
  RecipientCountRow,
  CalendarEmailDeliveryRow,
  AdminListParams,
  AdminListResult,
}

/**
 * Admin list with filters and pagination.
 */
export async function getAdminCalendarEntries(
  params: AdminListParams
): Promise<AdminListResult> {
  return calendarService.fetchAdminCalendarEntries(params)
}

/**
 * Month grid data for the calendar view.
 * Returns expanded attendance-impacting days per campus.
 */
export async function getCalendarMonthGrid(
  year: number,
  month: number
): Promise<CalendarMonthDayRow[]> {
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`
  const monthEnd = schoolDateKey(new Date(year, month, 0))
  return calendarService.fetchCalendarMonthGrid({ monthStart, monthEnd })
}

/**
 * Day detail entries for a specific date.
 */
export async function getCalendarDayEntries(
  date: string,
  role: "admin" | "teacher" | "student"
): Promise<CalendarEntryRow[]> {
  return calendarService.fetchCalendarDayEntries(date, role)
}

/**
 * Upcoming entries for teacher/student calendars.
 */
export async function getUpcomingCalendarEntries(days = 30): Promise<CalendarEntryRow[]> {
  return calendarService.fetchUpcomingCalendarEntries(days)
}

/**
 * Distinct campus options for filters.
 */
export async function getCalendarCampuses(): Promise<string[]> {
  return calendarService.fetchCalendarCampuses()
}

/**
 * Recipient count for publish confirmation.
 */
export async function getCalendarEntryRecipientCount(
  entryId: number
): Promise<RecipientCountRow> {
  return calendarService.fetchCalendarEntryRecipientCount(entryId)
}

/**
 * Bell entries for the current user: visible published entries in the
 * ends_on/7-day window, capped at 20, each with the caller's read receipt.
 */
export async function getCalendarBellData(authUserId: string): Promise<CalendarBellRow[]> {
  return calendarService.fetchCalendarBellEntries(authUserId)
}

/**
 * Every visible entry in the bell window without the 20-item cap.
 * Used by mark-all-read so entries beyond the bell cap are still cleared.
 */
export async function getVisibleCalendarEntries(authUserId: string): Promise<CalendarBellRow[]> {
  return calendarService.fetchVisibleCalendarEntries(authUserId)
}

/**
 * Dashboard announcement posts (teacher/student only).
 */
export async function getDashboardPosts(): Promise<DashboardPostRow[]> {
  return calendarService.fetchDashboardPosts()
}

/**
 * Admin delivery log with pagination.
 */
export async function getCalendarDeliveryLog(
  page = 1,
  pageSize = 25
): Promise<{ deliveries: calendarService.CalendarDeliveryLogRow[]; total: number }> {
  return calendarService.fetchCalendarDeliveryLog(page, pageSize)
}

/**
 * Delivery log for a specific entry.
 */
export async function getCalendarEntryDeliveryLog(
  entryId: number
): Promise<CalendarEmailDeliveryRow[]> {
  return calendarService.fetchCalendarEntryDeliveryLog(entryId)
}

/**
 * Seven-day dashboard window, using published_at exactly.
 * The post disappears once published_at is 7 days old or older.
 */
export function isWithinDashboardWindow(
  publishedAt: string,
  now: Date = new Date()
): boolean {
  const published = Date.parse(publishedAt)
  if (!Number.isFinite(published)) return false
  return published > now.getTime() - 7 * 86400000 && published <= now.getTime()
}

/**
 * Deep-link date validation.
 */
export function validateDeepLinkDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return null
  const date = new Date(parsed)
  if (date.toISOString().slice(0, 10) !== value) return null
  return value
}

/**
 * Deep-link month validation.
 */
export function validateDeepLinkMonth(value: string): string | null {
  if (!/^\d{4}-\d{2}$/.test(value)) return null
  const [y, m] = value.split("-").map(Number)
  if (y < 1 || y > 9999 || m < 1 || m > 12) return null
  return value
}
