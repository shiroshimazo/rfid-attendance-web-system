import "server-only"
import { requireRole } from "@/features/auth/server"

type SmsBalance =
  | { status: "available"; remaining: string }
  | { status: "unavailable" | "not-configured" }

/** Read account credits without sending SMS or exposing the API token. */
export async function fetchSmsBalance(): Promise<SmsBalance> {
  await requireRole("admin")
  const token = process.env.PHILSMS_API_TOKEN?.trim()
  if (!token) return { status: "not-configured" }
  const endpoint = process.env.PHILSMS_API_URL?.trim() || "https://app.philsms.com/api/v3/sms/send"
  if (!["https://app.philsms.com/api/v3/sms/send", "https://dashboard.philsms.com/api/v3/sms/send"].includes(endpoint)) {
    return { status: "not-configured" }
  }
  try {
    const response = await fetch(new URL("/api/v3/balance", endpoint), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    })
    const payload = await response.json()
    const remaining = payload?.data?.remaining_balance
    if (response.ok && payload?.status === "success" && (
      (typeof remaining === "string" && remaining.trim().length > 0) ||
      (typeof remaining === "number" && Number.isFinite(remaining))
    )) return { status: "available", remaining: String(remaining).trim() }
  } catch { /* A provider outage must not hide recorded SMS logs. */ }
  return { status: "unavailable" }
}
