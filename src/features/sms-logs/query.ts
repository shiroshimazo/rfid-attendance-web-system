import { schoolDateKey } from "@/lib/school-time"

export const smsStatuses = ["Pending", "Sent", "Failed"] as const
export type SmsStatus = typeof smsStatuses[number]
export type SmsLogParams = Record<string, string | string[] | undefined>
export interface SmsLogQuery { status: SmsStatus | "all"; from: string; to: string; page: number }
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? ""
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value

export function parseSmsLogQuery(params: SmsLogParams, now = new Date()): SmsLogQuery {
  const from = validDate(first(params.from)) ? first(params.from) : schoolDateKey(new Date(now.getTime() - 6 * 86400000))
  const to = validDate(first(params.to)) ? first(params.to) : schoolDateKey(now)
  const status = first(params.status)
  const page = Number(first(params.page))
  return {
    status: smsStatuses.includes(status as SmsStatus) ? status as SmsStatus : "all",
    from: from <= to ? from : to,
    to: from <= to ? to : from,
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 1000000) : 1,
  }
}

export function smsLogPageUrl(query: SmsLogQuery, page: number) {
  return `/admin/sms-logs?${new URLSearchParams({ ...query, page: String(page) })}`
}

export function smsStatusLabel(status: SmsStatus) {
  return status === "Failed" ? "Failed (Not Sent)" : status
}

export function deliveryResultLabel(result: string | null, enabled: boolean) {
  switch (result) {
    case "accepted": return "Accepted by SMS provider"
    case "rejected": return "Rejected by SMS provider"
    case "invalid_recipient": return "Invalid recipient number"
    case "unknown": return "Delivery outcome unknown; check provider logs"
    case "attempt_started": return "Send attempt started; final outcome not recorded"
    default: return result ?? (enabled ? "No send attempt recorded" : "Automatic sending disabled for this record")
  }
}
