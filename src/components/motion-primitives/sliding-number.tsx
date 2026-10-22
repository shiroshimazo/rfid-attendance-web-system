"use client"

import NumberFlow from "@number-flow/react"
import { motion, useReducedMotion } from "motion/react"

import { useContentReady } from "@/hooks/use-content-ready"
import { cn } from "@/lib/utils"

export interface SlidingNumberProps {
  value: number
  /** Fixed decimals, e.g. 1 for a percentage such as 92.4. */
  decimalPlaces?: number
  /** Rendered after the digits, e.g. `%` or ` min`. */
  suffix?: string
  /** Group the integer part in thousands, matching `formatNumber`. */
  grouping?: boolean
  className?: string
}

export function SlidingNumber({
  value,
  decimalPlaces = 0,
  suffix,
  grouping = true,
  className,
}: SlidingNumberProps) {
  const ready = useContentReady()
  const reduceMotion = useReducedMotion()
  const safe = Number.isFinite(value) ? value : 0
  const format = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: grouping,
  }
  const label = `${new Intl.NumberFormat("en-US", format).format(safe)}${suffix ?? ""}`

  return (
    <motion.span
      layout={!reduceMotion}
      layoutRoot
      transition={{ type: "spring", duration: 0.9, bounce: 0 }}
      className={cn("inline-flex items-baseline tabular-nums", className)}
      role="img"
      aria-label={label}
    >
      <NumberFlow
        aria-hidden
        value={ready || reduceMotion ? safe : 0}
        locales="en-US"
        format={format}
        suffix={suffix}
        animated={!reduceMotion}
      />
    </motion.span>
  )
}
