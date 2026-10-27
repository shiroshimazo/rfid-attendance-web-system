import { ScanLine } from "lucide-react"

import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TodayAttendance } from "@/features/attendance/student-dashboard"
import { formatClockTime } from "@/lib/format"

function TapRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">
        {formatClockTime(value)}
      </dd>
    </div>
  )
}

export function TodayAttendanceCard({
  attendance,
}: {
  attendance: TodayAttendance
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <ScanLine aria-hidden className="size-4" />
          Today&apos;s Attendance
        </CardDescription>
        <CardTitle>
          <AttendanceStatusBadge status={attendance.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attendance.status === "NoClasses" && <p className="mb-3 text-sm">No classes today. RFID taps are not expected.</p>}
        {attendance.status === "OnlineManual" && <p className="mb-3 text-sm">Online class today — attendance is confirmed in Subject Attendance.</p>}
        {(attendance.status === "NoClasses" || attendance.status === "OnlineManual") && (attendance.timeIn || attendance.timeOut) && <p className="mb-3 text-xs text-muted-foreground">Retained RFID evidence for this date:</p>}
        <dl className="space-y-2">
          <TapRow label="Time in" value={attendance.timeIn} />
          <TapRow label="Time out" value={attendance.timeOut} />
        </dl>
        {attendance.status === "NoRecord" ? (
          <p className="mt-3 text-xs text-muted-foreground text-pretty">
            Absence is finalized by school policy, not by a missing tap.
          </p>
        ) : (attendance.status === "Present" || attendance.status === "Late") &&
          attendance.timeIn && !attendance.timeOut ? (
          <p className="mt-3 text-xs text-muted-foreground text-pretty">
            Time out stays empty until the second tap of the day.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
