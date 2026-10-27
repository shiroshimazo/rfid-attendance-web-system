import { format, parseISO, startOfWeek } from "date-fns"
import type { CalendarMonthDayRow, AttendanceDayMarkRow } from "@/services/calendar/query"

export type CalendarAttendanceStatus = "Normal" | "NoClasses" | "OnlineManual"
export type EffectiveCalendarDay = Pick<CalendarMonthDayRow, "entry_id" | "attendance_date" | "campus" | "attendance_impact">
export type CalendarAttendanceMark = Pick<AttendanceDayMarkRow, "student_id" | "attendance_date" | "status" | "campus" | "calendar_entry_id">
export interface CalendarAttendanceState {
  status: CalendarAttendanceStatus
  campus: string
  calendarEntryId: number | null
}

/** Today/future use the campus view; history uses only immutable student snapshots. */
export function createCalendarAttendanceResolver({ today, effectiveDays, marks }: {
  today: string; effectiveDays: EffectiveCalendarDay[]; marks: CalendarAttendanceMark[]
}) {
  const effective = new Map<string, Map<string, CalendarAttendanceState>>()
  const historical = new Map<string, Map<number, CalendarAttendanceState>>()
  for (const row of effectiveDays) {
    if (row.attendance_date < today) continue
    const campuses = effective.get(row.attendance_date) ?? new Map<string, CalendarAttendanceState>()
    const status = row.attendance_impact === "online_manual" ? "OnlineManual" : "NoClasses"
    if (campuses.get(row.campus)?.status !== "OnlineManual") campuses.set(row.campus, { status, campus: row.campus, calendarEntryId: row.entry_id })
    effective.set(row.attendance_date, campuses)
  }
  for (const row of marks) {
    if (row.attendance_date >= today) continue
    const students = historical.get(row.attendance_date) ?? new Map<number, CalendarAttendanceState>()
    students.set(row.student_id, { status: row.status, campus: row.campus, calendarEntryId: row.calendar_entry_id })
    historical.set(row.attendance_date, students)
  }
  return (studentId: number, campus: string, date: string): CalendarAttendanceState => {
    const state = date < today ? historical.get(date)?.get(studentId) : effective.get(date)?.get(campus)
    return state ? { ...state } : { status: "Normal", campus, calendarEntryId: null }
  }
}
export type CalendarAttendanceResolver = ReturnType<typeof createCalendarAttendanceResolver>

/** Callers supply scoped student/session dates; missing taps are never finalized as Absent. */
export interface CalendarStudentDay {
  student_id: number
  attendance_date: string
  campus: string
  attendance_status?: string | null
}
export interface CalendarAttendanceCounts {
  totalStudentDays: number
  expectedStudentDays: number
  present: number
  late: number
  absent: number
  noClasses: number
  onlineManual: number
  noRecord: number
  legacyRecords: number
  rateDenominator: number
  rate: number | null
}

function emptyCounts(): CalendarAttendanceCounts {
  return { totalStudentDays: 0, expectedStudentDays: 0, present: 0, late: 0, absent: 0, noClasses: 0, onlineManual: 0, noRecord: 0, legacyRecords: 0, rateDenominator: 0, rate: null }
}

function finish(counts: CalendarAttendanceCounts) {
  // Keep the existing recorded-decision denominator until absence finalization is defined.
  counts.rateDenominator = counts.present + counts.absent
  counts.rate = counts.rateDenominator ? counts.present / counts.rateDenominator * 100 : null
  return counts
}

function tallyDates(days: Iterable<CalendarStudentDay>, resolve: CalendarAttendanceResolver) {
  const dates = new Map<string, CalendarAttendanceCounts>()
  const seen = new Map<string, Map<number, CalendarStudentDay>>()
  for (const day of days) {
    const students = seen.get(day.attendance_date) ?? new Map<number, CalendarStudentDay>()
    const previous = students.get(day.student_id)
    if (previous) {
      if (previous.campus !== day.campus || (previous.attendance_status ?? null) !== (day.attendance_status ?? null)) throw new Error("Conflicting attendance data for the same student and date.")
      continue
    }
    students.set(day.student_id, day); seen.set(day.attendance_date, students)
    const counts = dates.get(day.attendance_date) ?? emptyCounts()
    const state = resolve(day.student_id, day.campus, day.attendance_date).status
    counts.totalStudentDays++
    if (state === "NoClasses") counts.noClasses++
    else if (state === "OnlineManual") counts.onlineManual++
    else {
      counts.expectedStudentDays++
      if (day.attendance_status === "Present" || day.attendance_status === "Late") {
        counts.present++
        if (day.attendance_status === "Late") counts.late++
      } else if (day.attendance_status === "Absent") counts.absent++
      else if (!day.attendance_status || day.attendance_status === "NoRecord") counts.noRecord++
      else counts.legacyRecords++
    }
    dates.set(day.attendance_date, counts)
  }
  return dates
}

function addCounts(target: CalendarAttendanceCounts, source: CalendarAttendanceCounts) {
  for (const key of ["totalStudentDays", "expectedStudentDays", "present", "late", "absent", "noClasses", "onlineManual", "noRecord", "legacyRecords"] as const) target[key] += source[key]
  return target
}

export function summarizeCalendarAttendance(days: Iterable<CalendarStudentDay>, resolve: CalendarAttendanceResolver): CalendarAttendanceCounts {
  const totals = emptyCounts()
  for (const counts of tallyDates(days, resolve).values()) addCounts(totals, counts)
  return finish(totals)
}

export interface CalendarAttendanceTrendPoint extends CalendarAttendanceCounts {
  key: string
  label: string
}

/** Weighted buckets retain fully excluded dates as null-rate points; no dates are invented. */
export function buildCalendarAttendanceTrend(days: Iterable<CalendarStudentDay>, resolve: CalendarAttendanceResolver) {
  const daily = [...tallyDates(days, resolve)].sort(([a], [b]) => a.localeCompare(b))
  const weekly = new Map<string, CalendarAttendanceCounts>(), monthly = new Map<string, CalendarAttendanceCounts>()
  for (const [date, counts] of daily) {
    const week = format(startOfWeek(parseISO(date), { weekStartsOn: 1 }), "yyyy-MM-dd")
    const month = date.slice(0, 7)
    weekly.set(week, addCounts(weekly.get(week) ?? emptyCounts(), counts))
    monthly.set(month, addCounts(monthly.get(month) ?? emptyCounts(), counts))
  }
  const point = (key: string, label: string, counts: CalendarAttendanceCounts): CalendarAttendanceTrendPoint => ({ key, label, ...finish(counts) })
  return {
    daily: daily.slice(-14).map(([date, counts]) => point(date, format(parseISO(date), "MMM d"), counts)),
    weekly: [...weekly].slice(-12).map(([week, counts]) => point(week, `Wk ${format(parseISO(week), "MMM d")}`, counts)),
    monthly: [...monthly].slice(-6).map(([month, counts]) => point(month, format(parseISO(`${month}-01`), "MMM yyyy"), counts)),
  }
}
