import { Badge } from "@/components/ui/badge"
import type { StudentRfidStatus } from "@/features/attendance/dashboard"
import {
  attendanceStatusLabel,
  type AttendanceRowStatus,
} from "@/features/attendance/schema"
import { cn } from "@/lib/utils"

const attendanceStatusStyles: Record<AttendanceRowStatus, string> = {
  Present:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300",
  Late: "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300",
  LegacyRecord: "border-border bg-muted text-muted-foreground",
  Absent:
    "border-destructive/25 bg-destructive/10 text-red-700 dark:text-red-300",
  NoRecord: "border-border bg-muted text-foreground",
}

const rfidStatusStyles: Record<StudentRfidStatus, string> = {
  Active:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300",
  Inactive: "border-border bg-muted text-muted-foreground",
  Lost: "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300",
  Deactivated:
    "border-destructive/25 bg-destructive/10 text-destructive dark:text-red-300",
  Unassigned: "border-dashed border-border bg-transparent text-muted-foreground",
}

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceRowStatus
}) {
  return (
    <Badge variant="outline" className={cn(attendanceStatusStyles[status])}>
      {attendanceStatusLabel(status)}
    </Badge>
  )
}

export function RfidStatusBadge({ status }: { status: StudentRfidStatus }) {
  return (
    <Badge variant="outline" className={cn(rfidStatusStyles[status])}>
      {status}
    </Badge>
  )
}
