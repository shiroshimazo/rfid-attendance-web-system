import nodemailer from "nodemailer"
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
  const user = process.env.GMAIL_SMTP_USER?.trim()
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD?.replace(/\s/g, "")
  const replyTo = process.env.CALENDAR_EMAIL_REPLY_TO?.trim()
  if (!user || !z.email().safeParse(user).success || !pass || (replyTo && !mailbox(replyTo)) || !calendarEmailAppUrl()) return null
  return { user, pass, replyTo }
}

export function isSmtpConfigured(): boolean {
  return configuration() !== null
}

export interface EmailMessage { to: string; subject: string; html: string; text: string }
export type EmailResult =
  | { status: "accepted"; providerId: string }
  | { status: "rejected" | "unknown"; errorMessage: string }

export async function sendSmtpBatch(messages: EmailMessage[]): Promise<EmailResult[]> {
  const config = configuration()
  if (!config) return messages.map(() => ({ status: "rejected", errorMessage: "Calendar email is not configured. Set GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD, and check NEXT_PUBLIC_APP_URL." }))
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true,
  })
  const results: EmailResult[] = []
  try {
    for (const message of messages) {
      if (!z.email().safeParse(message.to).success || !message.subject.trim() || /[\r\n]/.test(message.subject) || !message.html || !message.text) {
        results.push({ status: "rejected", errorMessage: "Invalid calendar email message." })
        continue
      }
      try {
        const info = await transport.sendMail({
          from: { name: "School Calendar", address: config.user }, to: message.to,
          subject: message.subject, html: message.html, text: message.text,
          ...(config.replyTo ? { replyTo: config.replyTo } : {}),
        })
        results.push(info.accepted?.length && info.messageId
          ? { status: "accepted", providerId: info.messageId }
          : { status: "unknown", errorMessage: "SMTP acceptance could not be confirmed. Check the sender mailbox before retrying." })
      } catch (error) {
        const failure = error as { code?: string; responseCode?: number }
        const rejected = failure.code === "EAUTH" || (typeof failure.responseCode === "number" && failure.responseCode >= 400 && failure.responseCode < 600)
        results.push({ status: rejected ? "rejected" : "unknown", errorMessage: failure.code === "EAUTH"
          ? "Gmail sign-in failed. Check GMAIL_SMTP_USER and the Google App Password."
          : rejected ? `Gmail rejected the email (SMTP ${failure.responseCode}).`
          : "SMTP connection failed; acceptance is unknown. Check the sender mailbox before retrying." })
      }
    }
  } finally { transport.close() }
  return results
}
