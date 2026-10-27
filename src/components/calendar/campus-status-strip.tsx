import type { CampusAttendanceState } from "@/features/attendance/calendar-dashboard"
import { AttendanceStatusBadge } from "@/components/attendance-status-badge"

export function CampusStatusStrip({ states }: { states: CampusAttendanceState[] }) {
  if (!states.length) return null
  return <section aria-label="Campus attendance exceptions today" className="space-y-2 rounded-lg border bg-muted/30 p-4">
    <ul className="flex flex-wrap gap-x-6 gap-y-3">{states.map(state => <li key={state.campus} className="flex flex-wrap items-center gap-2 text-sm"><AttendanceStatusBadge status={state.status} /><span className="font-medium">{state.campus}</span><span className="text-muted-foreground tabular-nums">{state.students} students</span></li>)}</ul>
    <p className="text-xs text-muted-foreground">These students are excluded from today&apos;s daily RFID attendance rate. Online attendance is confirmed in Subject Attendance. Recorded taps and SMS remain in history.</p>
  </section>
}
