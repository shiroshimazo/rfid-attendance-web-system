import { z } from "zod"

export function calendarEmailAppUrl(): string | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_APP_URL?.trim() || "")
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null
    return url.origin
  } catch {
    return null
  }
}

function mailbox(value: string): boolean {
  if (/[\r\n]/.test(value)) return false
  const address = value.match(/^[^<>]+ <([^<>]+)>$/)?.[1] ?? value
  return z.email().safeParse(address).success
}

function configuration() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CALENDAR_EMAIL_FROM?.trim()
  const replyTo = process.env.CALENDAR_EMAIL_REPLY_TO?.trim()
  if (!apiKey || /\s/.test(apiKey) || !from || !mailbox(from) || (replyTo && !mailbox(replyTo)) || !calendarEmailAppUrl()) return null
  return { apiKey, from, replyTo }
}

export function isResendConfigured(): boolean {
  return configuration() !== null
}

export interface ResendMessage {
  to: string
  subject: string
  html: string
  text: string
}

export type ResendBatchResult =
  | { status: "accepted"; providerIds: string[] }
  | { status: "rejected" | "unknown"; errorMessage: string }

// Callers persist and chunk payloads; this adapter sends one batch without retries.
export async function sendResendBatch(messages: ResendMessage[], idempotencyKey: string): Promise<ResendBatchResult> {
  const config = configuration()
  if (!config) return { status: "rejected", errorMessage: "Calendar email is not configured." }
  if (messages.length < 1 || messages.length > 100 || !/^[A-Za-z0-9_/-]{1,256}$/.test(idempotencyKey) || messages.some(message =>
    !z.email().safeParse(message.to).success || !message.subject.trim() || /[\r\n]/.test(message.subject) || !message.html || !message.text
  )) return { status: "rejected", errorMessage: "Invalid calendar email batch." }
  try {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(messages.map(message => ({
        from: config.from, to: [message.to], subject: message.subject, html: message.html, text: message.text,
        ...(config.replyTo ? { reply_to: config.replyTo } : {}),
      }))),
    })
    if (!response.ok) return {
      status: response.status >= 500 || response.status === 408 ? "unknown" : "rejected",
      errorMessage: `Email provider returned HTTP ${response.status}.`,
    }
    const payload = await response.json()
    if (!Array.isArray(payload?.data) || payload.data.length !== messages.length ||
      !payload.data.every((item: { id?: unknown } | null) => typeof item?.id === "string" && item.id.trim())) {
      return { status: "unknown", errorMessage: "Email provider returned an unexpected response." }
    }
    return { status: "accepted", providerIds: payload.data.map((item: { id: string }) => item.id) }
  } catch {
    return { status: "unknown", errorMessage: "Email request failed or timed out; acceptance is unknown." }
  }
}
