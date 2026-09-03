import { Badge } from "@/components/ui/badge"
import type {
  AttendanceStatus,
  StudentRfidStatus,
} from "@/features/attendance/dashboard"
import { cn } from "@/lib/utils"

const attendanceStatusStyles: Record<AttendanceStatus, string> = {
  Present:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300",
  Late: "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300",
  Excused:
    "border-sky-600/20 bg-sky-500/10 text-sky-700 dark:border-sky-400/25 dark:text-sky-300",
  Absent:
    "border-destructive/25 bg-destructive/10 text-destructive dark:text-red-300",
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

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <Badge variant="outline" className={cn(attendanceStatusStyles[status])}>
      {status}
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
