import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchAllRows } from "@/services/supabase/pagination"
import { calendarDateSchema } from "@/features/calendar/schema"
import { schoolDateKey } from "@/lib/school-time"
import type { EffectiveCalendarDay, CalendarAttendanceMark } from "@/features/calendar/attendance-state"

/** Read-only, RLS-scoped inputs; failures propagate rather than becoming Normal days. */
export async function fetchCalendarAttendanceState(fromDate: string, toDate: string, now = new Date()) {
  const from = calendarDateSchema.parse(fromDate), to = calendarDateSchema.parse(toDate)
  if (from > to) throw new Error("End date cannot be before start date.")
  const today = schoolDateKey(now)
  const client = await createServerSupabaseClient()
  const [effectiveDays, marks] = await Promise.all([
    to < today ? Promise.resolve([] as EffectiveCalendarDay[]) : fetchAllRows<EffectiveCalendarDay>((start, end) => client
      .from("calendar_attendance_days").select("entry_id, attendance_date, campus, attendance_impact")
      .gte("attendance_date", from > today ? from : today).lte("attendance_date", to)
      .order("attendance_date").order("campus").order("entry_id").range(start, end)),
    from >= today ? Promise.resolve([] as CalendarAttendanceMark[]) : fetchAllRows<CalendarAttendanceMark>((start, end) => client
      .from("attendance_day_marks").select("student_id, attendance_date, status, campus, calendar_entry_id")
      .gte("attendance_date", from).lte("attendance_date", to).lt("attendance_date", today)
      .order("attendance_date").order("student_id").range(start, end)),
  ])
  return { today, effectiveDays, marks }
}
