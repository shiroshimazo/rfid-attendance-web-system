import { schoolDateKey } from "@/lib/school-time"
import { searchTagsFromParams } from "@/lib/search-tags"

export const logEntities = ["users", "students", "teachers", "teacher_assignments", "programs", "courses", "class_schedules", "subject_schedules", "subject_enrollments", "attendance_records", "subject_attendance", "rfid_cards", "rfid_tap_requests", "sms_notifications", "authentication", "archives", "reports", "calendar_entries", "calendar_entry_reads", "attendance_day_marks", "calendar_email_deliveries"] as const
export const logOutcomes = ["success", "failed", "denied"] as const
export type LogParams = Record<string, string | string[] | undefined>
export interface LogQuery { search: string[]; entity: string; outcome: string; from: string; to: string; page: number }
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? ""
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value
export function parseLogQuery(params: LogParams, now = new Date()): LogQuery {
  const today = schoolDateKey(now)
  const weekAgo = schoolDateKey(new Date(now.getTime() - 6 * 86400000))
  const from = validDate(first(params.from)) ? first(params.from) : weekAgo
  const to = validDate(first(params.to)) ? first(params.to) : today
  const page = Number(first(params.page))
  return {
    search: searchTagsFromParams(params.search).map(term => term.replace(/[^\p{L}\p{N} .-]/gu, "").trim().slice(0,100)).filter(Boolean),
    entity: logEntities.includes(first(params.entity) as typeof logEntities[number]) ? first(params.entity) : "all",
    outcome: logOutcomes.includes(first(params.outcome) as typeof logOutcomes[number]) ? first(params.outcome) : "all",
    from: from <= to ? from : to, to: from <= to ? to : from,
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page,1000000) : 1,
  }
}
export function logPageUrl(query: LogQuery, page: number) {
  const params = new URLSearchParams()
  for (const term of query.search) params.append("search", term)
  params.set("entity", query.entity)
  params.set("outcome", query.outcome)
  params.set("from", query.from)
  params.set("to", query.to)
  params.set("page", String(page))
  return `/admin/system-logs?${params.toString()}`
}
export function logLabel(value: string) { return value.replace(/_/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()) }
