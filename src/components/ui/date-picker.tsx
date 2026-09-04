"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { Matcher } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Stored form value: the `yyyy-MM-dd` key a date column expects. */
export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function parseDateKey(value: string | undefined) {
  if (!value || !DATE_KEY_PATTERN.test(value)) return undefined

  const parsed = parseISO(value)

  return isValid(parsed) ? parsed : undefined
}

export interface DatePickerProps {
  /** `yyyy-MM-dd`, or an empty string when nothing is chosen. */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  /** Inclusive `yyyy-MM-dd` bounds; days outside them cannot be picked. */
  min?: string
  max?: string
  disabled?: boolean
  /** Offers a Clear action, for fields that may stay empty. */
  clearable?: boolean
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
  className?: string
  id?: string
  name?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

/**
 * Single-date field built on the shadcn Calendar, so every date in the app
 * uses the same popover instead of the browser's native picker.
 */
export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Select date",
  min,
  max,
  disabled,
  clearable = true,
  captionLayout = "dropdown",
  className,
  id,
  name,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selected = parseDateKey(value)
  const minDate = parseDateKey(min)
  const maxDate = parseDateKey(max)

  const disabledDays: Matcher[] = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ]

  // Dropdown captions need explicit bounds, or the year list has nothing to
  // offer beyond the visible month.
  const startMonth = minDate ?? new Date(1940, 0, 1)
  const endMonth = maxDate ?? new Date(new Date().getFullYear() + 5, 11, 31)

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onBlur?.()
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start gap-2 px-3 font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <CalendarIcon aria-hidden className="size-4 text-muted-foreground" />
          {selected ? format(selected, "MMM d, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? maxDate}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          disabled={disabledDays}
          autoFocus
          onSelect={(date) => {
            if (!date) return

            onChange(toDateKey(date))
            setOpen(false)
          }}
        />

        {clearable && selected ? (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange("")
                setOpen(false)
              }}
            >
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
