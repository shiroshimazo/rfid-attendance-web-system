"use client"

import * as React from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const presets = [
  {
    label: "Today",
    getRange: () => {
      const today = new Date()
      return { from: today, to: today }
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const yesterday = subDays(new Date(), 1)
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: "Last 7 days",
    getRange: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    getRange: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "This month",
    getRange: () => {
      const today = new Date()
      return {
        from: startOfMonth(today),
        to: endOfMonth(today),
      }
    },
  },
]

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  /** Fired when Apply is pressed, so callers commit only a finished range. */
  onApply?: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  onApply,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const [range, setRange] = React.useState<DateRange | undefined>(value)

  React.useEffect(() => {
    setRange(value)
  }, [value])

  const updateRange = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onChange?.(newRange)
  }

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return format(date, "MMM d, yyyy")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 w-full justify-between rounded-lg px-3 font-normal",
            "hover:bg-background",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="size-4 text-muted-foreground" />

            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  !range?.from && "text-muted-foreground"
                )}
              >
                {range?.from
                  ? formatDate(range.from)
                  : "From"}
              </span>

              <span className="text-muted-foreground">
                →
              </span>

              <span
                className={cn(
                  !range?.to && "text-muted-foreground"
                )}
              >
                {range?.to
                  ? formatDate(range.to)
                  : "To"}
              </span>
            </div>
          </div>

          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto overflow-hidden rounded-xl p-0"
      >
        <div className="flex">

          {/* Presets */}
          <div className="hidden w-40 border-r bg-muted/20 p-3 sm:block">
            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Presets
            </div>

            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    updateRange(preset.getRange())
                  }}
                  className={cn(
                    "w-full rounded-md px-2.5 py-2 text-left text-sm",
                    "transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div>
            <div className="border-b px-4 py-3 sm:hidden">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    From
                  </p>
                  <div className="rounded-md border px-3 py-2 text-sm">
                    {range?.from
                      ? formatDate(range.from)
                      : "Select date"}
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    To
                  </p>
                  <div className="rounded-md border px-3 py-2 text-sm">
                    {range?.to
                      ? formatDate(range.to)
                      : "Select date"}
                  </div>
                </div>
              </div>
            </div>

            <Calendar
              mode="range"
              selected={range}
              onSelect={updateRange}
              numberOfMonths={2}
              defaultMonth={range?.from}
              disabled={{ after: new Date() }}
              autoFocus
              className="p-3"
            />

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-xs text-muted-foreground">
                {range?.from && range?.to ? (
                  <>
                    {formatDate(range.from)} →{" "}
                    {formatDate(range.to)}
                  </>
                ) : (
                  "Select a date range"
                )}
              </div>

              <Button
                size="sm"
                onClick={() => {
                  onApply?.(range)
                  setOpen(false)
                }}
                disabled={!range?.from || !range?.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}