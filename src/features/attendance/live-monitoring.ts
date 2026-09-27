import type { LiveMonitoringRecord } from "@/services/attendance/live-monitoring"
import { schoolDateKey } from "@/lib/school-time"

export type MonitoringParams = Record<string, string | string[] | undefined>

export function parseMonitoringRange(params: MonitoringParams, now = new Date()) {
  const today = schoolDateKey(now)
  const date = (value: string | string[] | undefined) => {
    const text = Array.isArray(value) ? value[0] : value
    return text && /^\d{4}-\d{2}-\d{2}$/.test(text) && Number.isFinite(Date.parse(text)) && new Date(text).toISOString().slice(0, 10) === text ? text : today
  }
  const from = date(params.from)
  const to = date(params.to)
  return { from: from <= to ? from : to, to: from <= to ? to : from }
}

export interface LiveMonitoringRow {
  id: number
  attendanceDate: string
  studentId: string
  name: string
  section: string
  programId: string
  programCode: string
  programName: string
  rfidNumber: string
  timeIn: string | null
  timeOut: string | null
}

export interface LiveMonitoringFilters {
  search: string
  tap: "all" | "in" | "out"
  program: string
  section: string
}

export function buildLiveMonitoringRows(records: LiveMonitoringRecord[]): LiveMonitoringRow[] {
  return records.filter(record => record.time_in || record.time_out).map(record => ({
    id: record.id,
    attendanceDate: record.attendance_date,
    studentId: record.student?.student_id ?? "",
    name: record.student?.full_name ?? "Unknown student",
    section: record.student?.section ?? "",
    programId: record.student ? String(record.student.program_id) : "",
    programCode: record.student?.program?.program_code ?? "",
    programName: record.student?.program?.program_name ?? "Unknown program",
    // Use the card on this attendance record, not the student's current card.
    rfidNumber: record.card?.rfid_number ?? "",
    timeIn: record.time_in,
    timeOut: record.time_out,
  })).sort((a, b) =>
    b.attendanceDate.localeCompare(a.attendanceDate) ||
    (b.timeOut ?? b.timeIn ?? "").localeCompare(a.timeOut ?? a.timeIn ?? "") || b.id - a.id
  )
}

export function filterLiveMonitoringRows(rows: LiveMonitoringRow[], filters: LiveMonitoringFilters) {
  const search = filters.search.trim().toLowerCase()
  return rows.filter(row => {
    if (filters.tap === "in" && (!row.timeIn || row.timeOut)) return false
    if (filters.tap === "out" && !row.timeOut) return false
    if (filters.program !== "all" && row.programId !== filters.program) return false
    if (filters.section !== "all" && row.section !== filters.section) return false
    return !search || [row.name, row.studentId, row.section, row.programCode, row.programName, row.rfidNumber]
      .some(value => value.toLowerCase().includes(search))
  })
}
