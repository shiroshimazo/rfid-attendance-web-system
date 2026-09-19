import type { ReactNode } from "react"
import { Info, Lock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

/** Read-only value, shown so a lock is visible rather than implied. */
export function LockedField({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex h-9 items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 text-sm">
        <span className="truncate">{value}</span>
        <Lock aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      ) : null}
    </div>
  )
}

/** States the pilot lock plainly wherever an entry may end up catalog-only. */
export function PilotNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="flex gap-2 rounded-lg border border-amber-600/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:border-amber-400/25 dark:text-amber-200"
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p className="text-pretty">{children}</p>
    </div>
  )
}

/** Whether the pilot can assign an entry today, in words rather than color. */
export function ScopeBadge({ assignable }: { assignable: boolean }) {
  return assignable ? (
    <Badge variant="outline" className="border-primary/25 bg-primary/5">
      Assignable
    </Badge>
  ) : (
    <Badge variant="outline" className="border-dashed text-muted-foreground">
      Unavailable
    </Badge>
  )
}
