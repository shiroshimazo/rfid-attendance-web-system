"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Every stored number is Philippine mobile E.164: +63 followed by 10 digits. */
const COUNTRY_CODE = "+63"
const SUBSCRIBER_LENGTH = 10

/**
 * Reduces any stored shape (+639171234567, 639171234567, 09171234567) down to
 * the 10 subscriber digits the field actually edits.
 */
function toSubscriberDigits(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("63")) digits = digits.slice(2)
  else if (digits.startsWith("0")) digits = digits.slice(1)
  return digits.slice(0, SUBSCRIBER_LENGTH)
}

interface PhoneInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  /** Full E.164 value, e.g. "+639171234567". Empty string when unset. */
  value: string
  onChange: (value: string) => void
}

/**
 * Contact number field with a non-editable +63 prefix; the user types only the
 * 10 subscriber digits while the form keeps the full E.164 string.
 */
function PhoneInput({
  className,
  value,
  onChange,
  disabled,
  placeholder = "9171234567",
  "aria-invalid": ariaInvalid,
  ...props
}: PhoneInputProps) {
  const subscriber = toSubscriberDigits(value ?? "")
  const isInvalid = ariaInvalid === true || ariaInvalid === "true"

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = toSubscriberDigits(event.target.value)
    onChange(digits ? `${COUNTRY_CODE}${digits}` : "")
  }

  return (
    <div
      data-slot="phone-input"
      className={cn(
        "flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        isInvalid &&
          "border-destructive ring-destructive/20 dark:ring-destructive/40",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      <span
        aria-hidden
        className="select-none pl-3 pr-1 text-base text-muted-foreground md:text-sm"
      >
        {COUNTRY_CODE}
      </span>
      <input
        type="tel"
        inputMode="numeric"
        maxLength={SUBSCRIBER_LENGTH}
        value={subscriber}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="h-full w-full min-w-0 rounded-r-md bg-transparent py-1 pr-3 text-base outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
        {...props}
      />
    </div>
  )
}

export { PhoneInput, toSubscriberDigits }
