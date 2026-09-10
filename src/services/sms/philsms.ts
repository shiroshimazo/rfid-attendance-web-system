import { randomUUID } from "node:crypto"
import { createAdminSupabaseClient } from "@/services/supabase/admin"

export function normalizePhilippineMobile(input: string): string | null {
  const number = input.trim().replace(/[ ()-]/g, "")
  if (/^09\d{9}$/.test(number)) return `63${number.slice(1)}`
  if (/^\+?639\d{9}$/.test(number)) return number.replace(/^\+/, "")
  return null
}

function configuration() {
  if (process.env.PHILSMS_ENABLED !== "true") return null
  const token = process.env.PHILSMS_API_TOKEN?.trim()
  const sender = process.env.PHILSMS_SENDER_ID?.trim()
  const endpoint = process.env.PHILSMS_API_URL?.trim() || "https://app.philsms.com/api/v3/sms/send"
  if (!token || !sender || !/^[A-Za-z0-9 ]{1,11}$/.test(sender) || ![
    "https://app.philsms.com/api/v3/sms/send", "https://dashboard.philsms.com/api/v3/sms/send",
  ].includes(endpoint)) return null
  return { token, sender, endpoint }
}

type Outcome = { result: "accepted" | "rejected" | "unknown"; providerId?: string }
export async function sendPhilSms(config: { token: string; sender: string; endpoint: string }, recipient: string, message: string): Promise<Outcome> {
  try {
    const response = await fetch(config.endpoint, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(8000),
      headers: { Authorization: `Bearer ${config.token}`, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, sender_id: config.sender,
        type: /^[\x20-\x7E\r\n]*$/.test(message) ? "plain" : "unicode", message }),
    })
    const payload = await response.json()
    if (response.ok && payload?.status === "success") {
      const report = Array.isArray(payload.data) ? payload.data[0] : payload.data
      // A top-level success is API acceptance, not proof of handset delivery.
      if (report && typeof report.status === "string" && /^(failed|rejected|undelivered)$/i.test(report.status)) return { result: "rejected" }
      return { result: "accepted", providerId: typeof report?.uid === "string" ? report.uid : undefined }
    }
    if (payload?.status === "error" && response.status < 500) return { result: "rejected" }
    return { result: "unknown" }
  } catch { return { result: "unknown" } }
}

/** Only called after a device-authenticated, committed arrival. Never throws to the tap route. */
export async function deliverArrivalSms(attendanceId: number) {
  const config = configuration()
  if (!config || !Number.isSafeInteger(attendanceId) || attendanceId <= 0) return
  try {
    const supabase = createAdminSupabaseClient()
    const attempt = randomUUID()
    const { data, error } = await supabase.rpc("claim_arrival_sms", { p_attendance_id: attendanceId, p_attempt: attempt })
    if (error || !data) return
    const recipient = normalizePhilippineMobile(data.recipient)
    const outcome = recipient ? await sendPhilSms(config, recipient, data.message) : { result: "invalid_recipient" }
    // The durable claim remains even if persistence fails: retries cannot send twice.
    await supabase.rpc("finish_arrival_sms", { p_id: data.id, p_attempt: attempt,
      p_result: outcome.result, p_provider_id: "providerId" in outcome ? outcome.providerId ?? null : null })
  } catch { /* Attendance is already committed. Never turn SMS failure into tap failure. */ }
}
