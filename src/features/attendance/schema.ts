import { format, isValid, parseISO } from "date-fns"

import type {
  AttendanceFilterStatus,
  AttendancePanelQuery,
  AttendanceStatus,
} from "@/services/attendance/panel"

export type { AttendanceFilterStatus, AttendancePanelQuery, AttendanceStatus }

export const attendanceStatuses = [
  "Present",
  "Late",
  "Excused",
  "Absent",
] as const satisfies readonly AttendanceStatus[]

export type AttendanceSearchParams = Record<
  string,
  string | string[] | undefined
>

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""

  return value ?? ""
}

function readDate(value: string, now: Date) {
  const candidate = value.trim()

  if (DATE_KEY_PATTERN.test(candidate) && isValid(parseISO(candidate))) {
    return candidate
  }

  return toDateKey(now)
}

function readStatus(value: string): AttendanceFilterStatus {
  const candidate = value.trim()

  return attendanceStatuses.find((status) => status === candidate) ?? "all"
}

function readProgramId(value: string) {
  const parsed = Number.parseInt(value.trim(), 10)

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

export function parseAttendancePanelQuery(
  params: AttendanceSearchParams,
  now: Date = new Date()
): AttendancePanelQuery {
  return {
    date: readDate(firstValue(params.date), now),
    status: readStatus(firstValue(params.status)),
    programId: readProgramId(firstValue(params.program)),
    yearLevel: firstValue(params.yearLevel).trim() || null,
    section: firstValue(params.section).trim() || null,
    search: firstValue(params.search).trim(),
  }
}

export function isAttendancePanelFiltered(query: AttendancePanelQuery) {
  return (
    query.status !== "all" ||
    query.programId !== null ||
    query.yearLevel !== null ||
    query.section !== null ||
    query.search !== ""
  )
}
