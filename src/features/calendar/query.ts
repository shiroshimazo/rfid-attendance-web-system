import { schoolDateKey } from "@/lib/school-time"
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
 * Bell unread entries for the current user.
 */
export async function getCalendarBellData(): Promise<CalendarBellRow[]> {
  return calendarService.fetchCalendarBellData()
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
): Promise<{ deliveries: CalendarEmailDeliveryRow[]; total: number }> {
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
 * Seven-day boundary helper for dashboard posts.
 * Returns true if the entry's published_at is within 7 days of today (inclusive).
 */
export function isWithinDashboardWindow(publishedAt: string): boolean {
  const today = schoolDateKey(new Date())
  const weekAgo = schoolDateKey(new Date(Date.now() - 7 * 86400000))
  return publishedAt >= weekAgo && publishedAt <= today
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