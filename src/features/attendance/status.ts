/** The current business contract. Historical database values are read as strings. */
export type AttendanceStatus = "Present" | "Late" | "Absent"

/** Display-only compatibility marker; never a writable status or filter option. */
export type AttendanceRecordStatus = AttendanceStatus | "LegacyRecord"
/** Display-only calendar states never become writable attendance decisions. */
export type AttendanceDisplayStatus = AttendanceRecordStatus | "NoRecord" | "NoClasses" | "OnlineManual"

export function isAttendanceStatus(value: string): value is AttendanceStatus {
  return value === "Present" || value === "Late" || value === "Absent"
}

/** Preserve old rows without relabeling them as a current attendance decision. */
export function recordStatus(value: string): AttendanceRecordStatus {
  return isAttendanceStatus(value) ? value : "LegacyRecord"
}
