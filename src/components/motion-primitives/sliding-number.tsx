"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

const SPRING = { stiffness: 260, damping: 32, mass: 0.6 } as const

/** One 0-9 slot of a rolling digit column. */
function DigitSlot({ value, digit }: { value: MotionValue<number>; digit: number }) {
  const y = useTransform(value, (latest) => {
    const place = ((latest % 10) + 10) % 10
    const offset = (10 + digit - place) % 10
    // Take the shorter way round, so 9 rolls up to 0 instead of down through 8.
    return `${offset > 5 ? offset * 100 - 1000 : offset * 100}%`
  })

  return (
    <motion.span
      aria-hidden
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {digit}
    </motion.span>
  )
}

/** A single column that slides between digits as the number changes. */
function Digit({ value, place }: { value: number; place: number }) {
  const target = Math.floor(value / place)
  const animated = useSpring(target, SPRING)

  React.useEffect(() => {
    animated.set(target)
  }, [animated, target])

  return (
    <span className="relative inline-block w-[1ch] overflow-hidden">
      {/* Reserves the line box; the sliding digits are positioned over it. */}
      <span className="invisible">0</span>
      {Array.from({ length: 10 }, (_, digit) => (
        <DigitSlot key={digit} value={animated} digit={digit} />
      ))}
    </span>
  )
}

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

/**
 * Animated counter: each digit column slides to its new value, so a KPI that
 * changes on a live refresh reads as a change rather than a silent swap. Falls
 * back to plain text when the viewer asked for reduced motion.
 */
export function SlidingNumber({
  value,
  decimalPlaces = 0,
  suffix,
  grouping = true,
  className,
}: SlidingNumberProps) {
  const reduceMotion = useReducedMotion()

  const safe = Number.isFinite(value) ? value : 0
  const isNegative = safe < 0
  const fixed = Math.abs(safe).toFixed(decimalPlaces)
  const [integerPart, fractionPart = ""] = fixed.split(".")

  const label = `${isNegative ? "-" : ""}${
    grouping
      ? Number(integerPart).toLocaleString("en-US")
      : integerPart
  }${fractionPart ? `.${fractionPart}` : ""}${suffix ?? ""}`

  if (reduceMotion) {
    return (
      <span className={cn("tabular-nums", className)}>{label}</span>
    )
  }

  const integerValue = Number(integerPart)
  const fractionValue = Number(fractionPart || "0")
  const integerDigits = integerPart.length
  const groupSize = 3

  return (
    <span
      className={cn("inline-flex items-baseline tabular-nums", className)}
      role="img"
      aria-label={label}
    >
      {isNegative ? <span aria-hidden>-</span> : null}

      {Array.from({ length: integerDigits }, (_, index) => {
        const place = 10 ** (integerDigits - 1 - index)
        const remaining = integerDigits - 1 - index
        const needsSeparator =
          grouping && remaining > 0 && remaining % groupSize === 0

        return (
          <React.Fragment key={place}>
            <Digit value={integerValue} place={place} />
            {needsSeparator ? <span aria-hidden>,</span> : null}
          </React.Fragment>
        )
      })}

      {fractionPart ? (
        <>
          <span aria-hidden>.</span>
          {Array.from({ length: fractionPart.length }, (_, index) => (
            <Digit
              key={`fraction-${index}`}
              value={fractionValue}
              place={10 ** (fractionPart.length - 1 - index)}
            />
          ))}
        </>
      ) : null}

      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </span>
  )
}
