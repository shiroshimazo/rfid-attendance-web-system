import type { CalendarEntryRow } from "@/services/calendar/query"
import { calendarEmailAppUrl } from "@/services/email/resend"

export type CalendarEmailType = "published" | "updated" | "cancelled"
export interface RenderedEmail {
  subject: string
  html: string
  text: string
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatDateRange(startsOn: string, endsOn: string, startTime: string | null, endTime: string | null): string {
  if (startsOn === endsOn) {
    if (startTime && endTime) {
      return `${startsOn} ${startTime}\u2013${endTime}`
    }
    return startsOn
  }
  return `${startsOn} to ${endsOn}`
}

function formatCampusScope(campuses: string[]): string {
  if (campuses.length === 0) return "All campuses"
  return campuses.join(", ")
}

function tagLabels(tags: string[]): string {
  return tags.map((tag) => `[${tag.replace("_", " ")}]`).join(" ")
}

const SCHOOL_NAME = "RFID Attendance System"

export function renderCalendarEmail(
  entry: CalendarEntryRow,
  type: CalendarEmailType,
  recipientRole: "teacher" | "student"
): RenderedEmail {
  if (!["teacher", "student"].includes(recipientRole)) throw new Error("Invalid calendar email recipient role.")
  const baseUrl = calendarEmailAppUrl()
  if (!baseUrl) throw new Error("Configure NEXT_PUBLIC_APP_URL for calendar email links.")
  const dateRange = formatDateRange(entry.starts_on, entry.ends_on, entry.start_time, entry.end_time)
  const campusScope = formatCampusScope(entry.campuses)
  const tagsText = tagLabels(entry.tags)
  const viewUrl = `${baseUrl}/${recipientRole}/calendar?date=${encodeURIComponent(entry.starts_on)}`

  const subjectPrefix = (() => {
    switch (type) {
      case "cancelled":
        return "Cancelled:"
      case "updated":
        return "Updated:"
      default:
        switch (entry.attendance_impact) {
          case "no_classes":
            return "[No classes]"
          case "online_manual":
            return "[Online class]"
          default:
            return "[Event]"
        }
    }
  })()

  const subject = type === "cancelled" || type === "updated"
    ? `${subjectPrefix} ${entry.title.replace(/[\r\n]+/g, " ")}`
    : `${subjectPrefix} ${entry.title.replace(/[\r\n]+/g, " ")} \u2014 ${dateRange}`

  const headerHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #f8f9fa; border-radius: 8px; padding: 16px 24px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 18px; color: #111;">${SCHOOL_NAME}</h1>
      </div>
  `

  const headerText = `${SCHOOL_NAME}\n${"=".repeat(SCHOOL_NAME.length)}`

  const commonBody = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; color: #666; margin-bottom: 4px;">${escapeHtml(tagsText)}</div>
        <h2 style="margin: 8px 0 16px; font-size: 22px; color: #111;">${escapeHtml(entry.title)}</h2>
      </div>

      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
        <dl style="margin: 0; font-size: 14px;">
          <dt style="font-weight: 600; color: #374151;">Date</dt>
          <dd style="margin: 4px 0 12px; color: #111;">${escapeHtml(dateRange)}</dd>

          <dt style="font-weight: 600; color: #374151;">Campus</dt>
          <dd style="margin: 4px 0 12px; color: #111;">${escapeHtml(campusScope)}</dd>

          ${entry.location ? `
            <dt style="font-weight: 600; color: #374151;">Location</dt>
            <dd style="margin: 4px 0 12px; color: #111;">${escapeHtml(entry.location)}</dd>
          ` : ""}

          ${entry.reason ? `
            <dt style="font-weight: 600; color: #374151;">Reason</dt>
            <dd style="margin: 4px 0 12px; color: #111;">${escapeHtml(entry.reason)}</dd>
          ` : ""}

          ${entry.description ? `
            <dt style="font-weight: 600; color: #374151;">Details</dt>
            <dd style="margin: 4px 0 12px; color: #111;">${escapeHtml(entry.description)}</dd>
          ` : ""}
        </dl>
      </div>
  `

  const commonBodyText = `
${tagsText}

${entry.title}

Date: ${dateRange}
Campus: ${campusScope}
${entry.location ? `Location: ${entry.location}\n` : ""}${entry.reason ? `Reason: ${entry.reason}\n` : ""}${entry.description ? `Details: ${entry.description}\n` : ""}
  `.trim()

  let specificHtml = ""
  let specificText = ""

  if (type === "cancelled") {
    specificHtml = `
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #991b1b; font-weight: 500;">This announcement has been cancelled.</p>
      </div>
    `
    specificText = "\nThis announcement has been cancelled.\n"
  } else if (entry.attendance_impact === "no_classes") {
    specificHtml = `
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #991b1b; font-weight: 500;">RFID taps are not expected. Attendance is marked No classes.</p>
      </div>
    `
    specificText = "\nRFID taps are not expected. Attendance is marked No classes.\n"
  } else if (entry.attendance_impact === "online_manual") {
    specificHtml = `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #1e40af; font-weight: 500;">Attendance is confirmed by the teacher in Subject Attendance.</p>
      </div>
    `
    specificText = "\nAttendance is confirmed by the teacher in Subject Attendance.\n"
  }

  const ctaHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${escapeHtml(viewUrl)}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">View Calendar</a>
      </div>
  `

  const ctaText = `\nView Calendar: ${viewUrl}\n`

  const footerHtml = `
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
        This is an automated message from ${SCHOOL_NAME}. Please do not reply.
      </p>
    </div>
  `

  const footerText = `\n---\nThis is an automated message from ${SCHOOL_NAME}. Please do not reply.\n`

  const html = headerHtml + commonBody + specificHtml + ctaHtml + footerHtml
  const text = headerText + "\n\n" + commonBodyText + specificText + ctaText + footerText

  return { subject, html, text }
}

