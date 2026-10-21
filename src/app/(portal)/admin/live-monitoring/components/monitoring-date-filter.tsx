"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

import { useMonitoringUpdate } from "./monitoring-update-provider"

interface MonitoringDateFilterProps {
  /** Inclusive `yyyy-MM-dd` range the page currently shows. */
  from: string
  to: string
}

/**
 * Date range control for live monitoring. The markup stays a plain GET form,
 * so it still works without JavaScript, but a scripted submit updates the URL
 * in place. The table then refetches on its own and the rest of the panel
 * stays on screen.
 */
export function MonitoringDateFilter({ from, to }: MonitoringDateFilterProps) {
  const pathname = usePathname()
  const update = useMonitoringUpdate()
  const [range, setRange] = React.useState({ from, to })

  if (!update) throw Error("Monitoring date filter requires MonitoringUpdateProvider")

  const { isPending, applyRange, applyToday } = update

  // A new range in the URL wins over the local draft.
  React.useEffect(() => {
    setRange({ from, to })
  }, [from, to])

  return (
    <form
      action={pathname}
      method="get"
      onSubmit={event => {
        event.preventDefault()
        applyRange(range.from, range.to)
      }}
      aria-busy={isPending}
      className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
    >
      <input type="hidden" name="from" value={range.from} readOnly />
      <input type="hidden" name="to" value={range.to} readOnly />
      <div className="space-y-2">
        <Label htmlFor="monitoring-from">From date</Label>
        <DatePicker
          id="monitoring-from"
          value={range.from}
          onChange={value => setRange(current => ({ ...current, from: value }))}
          clearable={false}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monitoring-to">To date</Label>
        <DatePicker
          id="monitoring-to"
          value={range.to}
          onChange={value => setRange(current => ({ ...current, to: value }))}
          clearable={false}
          className="h-10"
        />
      </div>
      <Button type="submit" className="min-h-10" disabled={isPending}>Apply dates</Button>
      <Button asChild variant="outline" className="min-h-10">
        {/* The link still works without JavaScript; the click is handled in place. */}
        <Link href={pathname} onClick={event => {
          event.preventDefault()
          applyToday()
        }}>Today</Link>
      </Button>
    </form>
  )
}
