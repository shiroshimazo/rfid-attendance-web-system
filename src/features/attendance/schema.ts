import { format, isValid, parseISO } from "date-fns"

import { schoolDateKey } from "@/lib/school-time"
import type { AttendanceRecordStatus } from "@/features/attendance/status"
export { isAttendanceStatus, recordStatus } from "@/features/attendance/status"
export type { AttendanceRecordStatus } from "@/features/attendance/status"
import type {
  AttendanceFilterStatus,
  AttendancePanelQuery,
  AttendanceStatus,
} from "@/services/attendance/panel"

export type { AttendanceFilterStatus, AttendancePanelQuery, AttendanceStatus }

/**
 * The statuses allowed for new attendance decisions. A student with
 * no record at all is not one of these; see {@link AttendanceRowStatus}.
 */
export const attendanceStatuses = [
  "Present",
  "Late",
  "Absent",
] as const satisfies readonly AttendanceStatus[]

/**
 * What a roster row can show. A missing record stays provisional as
 * "NoRecord": the student may still tap in, so only a stored Absent is final.
 */
export type AttendanceRowStatus = AttendanceRecordStatus | "NoRecord"

export const attendanceRowStatuses = [
  ...attendanceStatuses,
  "NoRecord",
] as const satisfies readonly AttendanceRowStatus[]

export const NO_RECORD_LABEL = "No tap recorded yet"

/**
 * Spells "NoRecord" out for people; every other status reads as itself. Takes a
 * plain string so filter values read straight off a select can be labelled.
 */
export function attendanceStatusLabel(status: string) {
  if (status === "LegacyRecord") return "Historical record"
  return status === "NoRecord" ? NO_RECORD_LABEL : status
}

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

  return schoolDateKey(now)
}

function readStatus(value: string): AttendanceFilterStatus {
  const candidate = value.trim()

  return attendanceRowStatuses.find((status) => status === candidate) ?? "all"
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
