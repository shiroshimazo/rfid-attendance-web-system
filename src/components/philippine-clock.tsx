"use client"

import { useEffect, useState } from "react"
import NumberFlow, { NumberFlowGroup } from "@number-flow/react"

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})
const numberFormat = { minimumIntegerDigits: 2, useGrouping: false } as const
const clockDigits = { 1: { max: 5 } }

export function PhilippineClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      setNow(new Date())
      // Read wall time each tick so background tabs never accumulate drift.
      timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    tick()
    const refresh = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer)
        tick()
      }
    }
    document.addEventListener("visibilitychange", refresh)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])

  const parts = now ? formatter.formatToParts(now) : []
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value

  return (
    <time
      dateTime={now?.toISOString()}
      aria-label={now ? `Philippine time: ${formatter.format(now)}` : "Philippine time"}
      title="Philippine time (Asia/Manila, UTC+8)"
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium tabular-nums sm:text-sm"
    >
      <span aria-hidden="true" className="text-muted-foreground">PH</span>
      <span aria-hidden="true" className="inline-flex w-[11ch] items-center justify-end">
        {now ? (
          <NumberFlowGroup>
            <NumberFlow value={Number(part("hour"))} locales="en-US" format={numberFormat} trend={1} />
            <span>:</span>
            <NumberFlow value={Number(part("minute"))} locales="en-US" format={numberFormat} digits={clockDigits} trend={1} />
            <span>:</span>
            <NumberFlow value={Number(part("second"))} locales="en-US" format={numberFormat} digits={clockDigits} trend={1} />
            <span className="ml-1">{part("dayPeriod")}</span>
          </NumberFlowGroup>
        ) : (
          <span>--:--:-- --</span>
        )}
      </span>
    </time>
  )
}
