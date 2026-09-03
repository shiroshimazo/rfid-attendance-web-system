import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

/** Inline placeholder for panels whose query returned no rows. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center",
        className
      )}
    >
      <Icon aria-hidden className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium text-balance">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  )
}
