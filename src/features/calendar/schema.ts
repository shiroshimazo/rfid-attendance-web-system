import { z } from "zod"

import { optionalText } from "@/features/shared/schema"
import { schoolDateKey } from "@/lib/school-time"

export const calendarTags = [
  "event", "no_classes", "online_class", "holiday",
  "exam", "deadline", "meeting", "other",
] as const
export const calendarAttendanceImpacts = ["normal", "no_classes", "online_manual"] as const
export const calendarAudiences = ["everyone", "teachers", "students"] as const
export const calendarStatuses = ["draft", "published", "cancelled"] as const
export const attendanceDayStatuses = ["NoClasses", "OnlineManual"] as const
export const calendarEmailTypes = ["published", "updated", "cancelled"] as const
export const calendarEmailStatuses = ["Pending", "Sent", "Failed"] as const

export type CalendarTag = (typeof calendarTags)[number]
export type CalendarAttendanceImpact = (typeof calendarAttendanceImpacts)[number]

export function suggestCalendarImpact(tags: readonly CalendarTag[]): CalendarAttendanceImpact {
  if (tags.includes("online_class")) return "online_manual"
  if (tags.includes("no_classes")) return "no_classes"
  return "normal"
}

export const calendarDateSchema = z.string().trim().pipe(z.iso.date()).refine(
  (value) => !value.startsWith("0000-"),
  "Choose a date in year 0001 or later"
)

export const calendarCampusesSchema = z.array(
  z.string().trim().min(1, "Campus cannot be blank")
).transform((campuses) => [...new Set(campuses)])

const optionalTime = z.string().trim().regex(
  /^$|^([01]\d|2[0-3]):[0-5]\d$/,
  "Use a 24-hour time, such as 06:00"
).nullish().transform((value) => value || null)

const nullableText = (max: number) => optionalText(max).nullish()
  .transform((value) => value || null)

function validateDateRange(
  values: { startsOn: string; endsOn: string },
  ctx: z.RefinementCtx
) {
  if (values.endsOn < values.startsOn) {
    ctx.addIssue({ code: "custom", path: ["endsOn"], message: "End date cannot be before start date" })
  }
  // UTC arithmetic keeps inclusive date ranges independent of the host timezone.
  const days = (Date.parse(`${values.endsOn}T00:00:00Z`) - Date.parse(`${values.startsOn}T00:00:00Z`)) / 86_400_000 + 1
  if (days > 366) {
    ctx.addIssue({ code: "custom", path: ["endsOn"], message: "Choose a range of 366 days or less" })
  }
}

export const calendarDateRangeSchema = z.object({
  startsOn: calendarDateSchema,
  endsOn: calendarDateSchema,
}).superRefine(validateDateRange)

// Lifecycle fields belong to the database RPCs, not the editable entry payload.
export const calendarEntrySchema = z.strictObject({
  ...calendarDateRangeSchema.shape,
  title: optionalText(160).min(1, "Title is required"),
  description: nullableText(5_000),
  reason: nullableText(500),
  location: nullableText(200),
  tags: z.array(z.enum(calendarTags)).min(1, "Choose at least one tag")
    .transform((tags) => [...new Set(tags)]),
  attendanceImpact: z.enum(calendarAttendanceImpacts),
  audience: z.enum(calendarAudiences),
  campuses: calendarCampusesSchema,
  startTime: optionalTime,
  endTime: optionalTime,
  isPinned: z.boolean().default(false),
}).superRefine((values, ctx) => {
  validateDateRange(values, ctx)
  const issue = (path: keyof typeof values, message: string) =>
    ctx.addIssue({ code: "custom", path: [path], message })

  if (values.attendanceImpact !== suggestCalendarImpact(values.tags)) {
    issue("attendanceImpact", "Attendance impact must match the no-classes and online-class tags")
  }
  if (values.attendanceImpact !== "normal") {
    if (values.audience !== "everyone") issue("audience", "Attendance-impacting entries must target everyone")
    if (!values.reason) issue("reason", "A reason is required for attendance-impacting entries")
    if (values.startTime !== null || values.endTime !== null) {
      issue("startTime", "Attendance-impacting entries must be all-day")
    }
  }
  if ((values.startTime === null) !== (values.endTime === null)) {
    issue(values.startTime === null ? "startTime" : "endTime", "Set both times or leave both empty")
  }
  if (values.startTime !== null || values.endTime !== null) {
    if (values.startsOn !== values.endsOn) issue("endsOn", "Timed entries must be on a single day")
  }
  if (values.startTime !== null && values.endTime !== null && values.endTime <= values.startTime) {
    issue("endTime", "End time must be after start time")
  }
})

/** Apply only on first publish/republish; saving drafts and historical edits have separate rules. */
export function calendarPublishSchema(now: Date = new Date()) {
  const today = schoolDateKey(now)
  return calendarEntrySchema.superRefine((values, ctx) => {
    if (values.attendanceImpact !== "normal" && values.startsOn < today) {
      ctx.addIssue({ code: "custom", path: ["startsOn"], message: "Attendance-impacting entries cannot be published before today" })
    }
  })
}

export type CalendarEntryInput = z.input<typeof calendarEntrySchema>
export type CalendarEntryValues = z.output<typeof calendarEntrySchema>
