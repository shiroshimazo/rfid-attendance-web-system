import { Badge } from "@/components/ui/badge"
import type { SmsStatus } from "@/features/attendance/student-dashboard"
import { cn } from "@/lib/utils"

const smsStatusStyles: Record<SmsStatus, string> = {
  Sent: "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300",
  Pending:
    "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300",
  Failed:
    "border-destructive/25 bg-destructive/10 text-destructive dark:text-red-300",
}

const smsStatusLabels: Record<SmsStatus, string> = {
  Sent: "Sent",
  Pending: "Pending",
  Failed: "Failed",
}

export function SmsStatusBadge({ status }: { status: SmsStatus }) {
  return (
    <Badge variant="outline" className={cn(smsStatusStyles[status])}>
      {smsStatusLabels[status]}
    </Badge>
  )
}
