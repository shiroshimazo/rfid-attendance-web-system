import { z } from "zod"

import { isPilotSection, PILOT_YEAR_LEVEL } from "@/features/academic/pilot"
import { databaseIdSchema, requiredText } from "@/features/shared/schema"

/**
 * Schedule rows are never deleted: a row that disappears would silently mean
 * "never Late" (Late Attendance Ruling, rule 5). Administrators therefore
 * switch a schedule between active and inactive instead.
 */
export const scheduleStatuses = ["active", "inactive"] as const

export type ScheduleStatus = (typeof scheduleStatuses)[number]

export const scheduleSessions = ["morning", "afternoon"] as const

export type ScheduleSession = (typeof scheduleSessions)[number]

/** Monday to Friday only: the pilot seeds no weekend rows. */
export const scheduleDays = [
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
] as const

export const scheduleDayValues: readonly number[] = scheduleDays.map(
  (day) => day.value
)

const dayShortLabels = new Map<number, string>(
  scheduleDays.map((day) => [day.value, day.short])
)

/** `Mon`, `Sat`, or the raw number for a day the pilot does not name. */
export function dayShortLabel(value: number) {
  return dayShortLabels.get(value) ?? `Day ${value}`
}

export type ScheduleSearchParams = Record<
  string,
  string | string[] | undefined
>

export interface SchedulePanelQuery {
  search: string
  session: ScheduleSession | "all"
  day: number | "all"
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""

  return value ?? ""
}

function readSession(value: string): ScheduleSession | "all" {
  const candidate = value.trim().toLowerCase()

  return scheduleSessions.find((session) => session === candidate) ?? "all"
}

function readDay(value: string): number | "all" {
  const parsed = Number.parseInt(value.trim(), 10)

  return scheduleDayValues.includes(parsed) ? parsed : "all"
}

export function parseSchedulePanelQuery(
  params: ScheduleSearchParams
): SchedulePanelQuery {
  return {
    search: firstValue(params.search).trim(),
    session: readSession(firstValue(params.session)),
    day: readDay(firstValue(params.day)),
  }
}

export function isSchedulePanelFiltered(query: SchedulePanelQuery) {
  return query.search !== "" || query.session !== "all" || query.day !== "all"
}

/** 24-hour `HH:mm`, the value an `<input type="time">` submits. */
const timeField = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a 24-hour time, such as 06:00")

/** The dialog holds grace as text, so it is validated as digits first. */
const graceTextField = z
  .string()
  .trim()
  .regex(/^\d{1,3}$/, "Enter whole minutes, 0 to 240")
  .refine((value) => Number(value) <= 240, {
    message: "Grace must be 240 minutes or less",
  })

const daysField = z
  .array(z.number().int().min(0).max(6))
  .min(1, "Choose at least one class day")
  .max(7)

export const scheduleDialogSchema = z.object({
  timeStart: timeField,
  graceMinutes: graceTextField,
  status: z.enum(scheduleStatuses),
  days: daysField,
})

/**
 * Program and year level travel with the request so the server can re-check
 * them, but the dialog never lets an administrator change either one.
 */
export const scheduleIdentitySchema = z.object({
  programId: databaseIdSchema,
  yearLevel: requiredText(40, "Year level is required").refine(
    (value) => value === PILOT_YEAR_LEVEL,
    { message: `Only ${PILOT_YEAR_LEVEL} is supported in the pilot` }
  ),
  section: requiredText(40, "Section is required").refine(isPilotSection, {
    message: "Section must be a pilot section (21001-21010)",
  }),
  campus: z.union([z.string().trim().min(1).max(80), z.null()]),
})

export const updateScheduleSchema = scheduleIdentitySchema.extend({
  timeStart: timeField,
  graceMinutes: z.coerce
    .number()
    .int("Grace must be whole minutes")
    .min(0, "Grace cannot be negative")
    .max(240, "Grace must be 240 minutes or less"),
  status: z.enum(scheduleStatuses),
  days: daysField,
})

export const scheduleStatusSchema = scheduleIdentitySchema.extend({
  status: z.enum(scheduleStatuses),
})

export type ScheduleDialogValues = z.infer<typeof scheduleDialogSchema>
export type UpdateScheduleInput = z.input<typeof updateScheduleSchema>
export type ScheduleStatusInput = z.input<typeof scheduleStatusSchema>

const TIME_PATTERN = /^(\d{1,2}):(\d{2})/

/** Trims a PostgreSQL `time` (`06:00:00`) down to an `HH:mm` input value. */
export function toTimeInput(value: string) {
  const match = TIME_PATTERN.exec(value)

  if (!match) return "00:00"

  return `${match[1].padStart(2, "0")}:${match[2]}`
}

/** Late cutoff arithmetic: class start plus the grace window. */
export function addMinutesToTime(time: string, minutes: number) {
  const match = TIME_PATTERN.exec(time)

  if (!match) return time

  const total = Number(match[1]) * 60 + Number(match[2]) + minutes
  const wrapped = ((total % 1440) + 1440) % 1440

  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(
    wrapped % 60
  ).padStart(2, "0")}`
}

export function sessionOfTime(time: string): ScheduleSession {
  return Number(toTimeInput(time).slice(0, 2)) < 12 ? "morning" : "afternoon"
}

/**
 * One section's whole week, the unit an administrator edits. Declared here,
 * beside the schemas, so client components never reach into the service layer.
 */
export interface ScheduleView {
  key: string
  programId: number
  programCode: string
  yearLevel: string
  section: string
  campus: string | null
  session: ScheduleSession
  /** Weekdays with a row that has not been retired, ascending. */
  days: number[]
  timeStart: string
  /** Informational only in v1: early departure is never flagged. */
  timeEnd: string | null
  graceMinutes: number
  lateCutoff: string
  status: ScheduleStatus
  /** True when the section's days disagree on start time or grace. */
  hasVariance: boolean
  updatedAt: string
}

export interface ScheduleKpis {
  sectionsScheduled: number
  morningSections: number
  afternoonSections: number
  averageGrace: number
}

export interface ScheduleDirectory {
  query: SchedulePanelQuery
  schedules: ScheduleView[]
  kpis: ScheduleKpis
  /** Sections in the pilot scope that have no schedule row at all. */
  unscheduledSections: string[]
  totalSections: number
  isFiltered: boolean
}
