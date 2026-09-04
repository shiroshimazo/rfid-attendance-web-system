"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { format, isValid, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"

import { DateRangePicker as DateRangePickerField } from "@/components/ui/date-range-picker"

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function toDate(value: string) {
  if (!DATE_KEY_PATTERN.test(value)) return undefined

  const parsed = parseISO(value)

  return isValid(parsed) ? parsed : undefined
}

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd")
}

/**
 * Report range control. The popover keeps its own draft range; only Apply
 * writes `from` and `to` to the URL, so the panel refetches once per change.
 */
export function DateRangePicker({ from, to }: { from: string; to: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: toDate(from),
    to: toDate(to),
  })

  React.useEffect(() => {
    setRange({ from: toDate(from), to: toDate(to) })
  }, [from, to])

  function apply(next: DateRange | undefined) {
    if (!next?.from || !next.to) return

    const start = next.from <= next.to ? next.from : next.to
    const end = next.from <= next.to ? next.to : next.from

    const params = new URLSearchParams(searchParams.toString())
    params.set("from", toDateKey(start))
    params.set("to", toDateKey(end))

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div
      className="w-full sm:w-[19rem]"
      data-print="hide"
      aria-busy={isPending}
    >
      <DateRangePickerField value={range} onChange={setRange} onApply={apply} />
    </div>
  )
}
