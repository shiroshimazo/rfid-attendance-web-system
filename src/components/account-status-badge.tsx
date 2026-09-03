import { Badge } from "@/components/ui/badge"
import type { AccountStatus } from "@/features/teachers/directory"
import { cn } from "@/lib/utils"

const accountStatusStyles: Record<AccountStatus, string> = {
  active:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300",
  inactive:
    "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300",
  archived: "border-border bg-muted text-muted-foreground",
}

const accountStatusLabels: Record<AccountStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
}

export function AccountStatusBadge({
  status,
  className,
}: {
  status: AccountStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(accountStatusStyles[status], className)}
    >
      {accountStatusLabels[status]}
    </Badge>
  )
}

export { accountStatusLabels }
