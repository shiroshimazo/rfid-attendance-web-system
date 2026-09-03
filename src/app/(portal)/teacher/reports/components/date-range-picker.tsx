"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function DateRangePicker({ from, to }: { from: string; to: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [draft, setDraft] = React.useState({ from, to })

  React.useEffect(() => {
    setDraft({ from, to })
  }, [from, to])

  const isValid =
    DATE_KEY_PATTERN.test(draft.from) &&
    DATE_KEY_PATTERN.test(draft.to) &&
    draft.to >= draft.from

  function commit(next: { from: string; to: string }) {
    setDraft(next)

    if (
      !DATE_KEY_PATTERN.test(next.from) ||
      !DATE_KEY_PATTERN.test(next.to) ||
      next.to < next.from
    ) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("from", next.from)
    params.set("to", next.to)

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-col gap-1" data-print="hide">
      <div className="flex flex-wrap items-end gap-2" aria-busy={isPending}>
        <div className="space-y-1">
          <Label htmlFor="reports-from" className="text-xs">
            From
          </Label>
          <Input
            id="reports-from"
            type="date"
            className="h-9 w-40"
            value={draft.from}
            max={draft.to}
            aria-invalid={!isValid}
            onChange={(event) =>
              commit({ from: event.target.value, to: draft.to })
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="reports-to" className="text-xs">
            To
          </Label>
          <Input
            id="reports-to"
            type="date"
            className="h-9 w-40"
            value={draft.to}
            min={draft.from}
            aria-invalid={!isValid}
            aria-describedby={isValid ? undefined : "reports-range-error"}
            onChange={(event) =>
              commit({ from: draft.from, to: event.target.value })
            }
          />
        </div>
      </div>

      {isValid ? null : (
        <p id="reports-range-error" role="alert" className="text-xs text-destructive">
          The end date must fall on or after the start date.
        </p>
      )}
    </div>
  )
}
