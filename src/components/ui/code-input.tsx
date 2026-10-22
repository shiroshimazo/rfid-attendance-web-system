"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Verification codes carry six digits, one box per digit. */
const CODE_LENGTH = 6

interface CodeInputProps
  extends Omit<
    React.ComponentProps<"input">,
    | "value"
    | "onChange"
    | "type"
    | "maxLength"
    | "minLength"
    | "pattern"
    | "inputMode"
    | "autoComplete"
    | "id"
    | "name"
    | "size"
    | "width"
    | "height"
  > {
  /** Digits entered so far, e.g. "1234". */
  value: string
  onChange: (value: string) => void
  /** Number of boxes. Defaults to six. */
  length?: number
  /** Base id; every box is named `${id}-${index}`. */
  id?: string
  /** Name of the group of boxes, read by screen readers. */
  label?: string
}

/**
 * Verification code field split into one box per digit. Typing advances to the
 * next box, backspace walks back, and a pasted or autofilled code lands across
 * the boxes. The parent keeps the single joined string.
 */
function CodeInput({
  className,
  value,
  onChange,
  length = CODE_LENGTH,
  id = "code",
  label = "Verification code",
  disabled,
  autoFocus,
  "aria-invalid": ariaInvalid,
  ...props
}: CodeInputProps) {
  const digits = value.replace(/\D/g, "").slice(0, length)
  const boxes = React.useRef<Array<HTMLInputElement | null>>([])
  const isInvalid = ariaInvalid === true || ariaInvalid === "true"

  const cells = React.useMemo(() => {
    const next: string[] = []
    for (let index = 0; index < length; index++) next.push(digits[index] ?? "")
    return next
  }, [digits, length])
  // Focus handlers fire before React re-renders, so read the latest cells from a ref.
  const cellsRef = React.useRef(cells)
  React.useEffect(() => {
    cellsRef.current = cells
  }, [cells])

  const focusBox = (index: number) => {
    const box = boxes.current[index]
    if (!box) return
    box.focus()
    box.select()
  }

  /** Writes the boxes back to the parent, keeping the digits contiguous. */
  const commit = (next: string[]) => {
    cellsRef.current = next
    onChange(next.join(""))
  }

  const clearFrom = (index: number) => {
    const next = cellsRef.current.slice()
    for (let i = index; i < length; i++) next[i] = ""
    commit(next)
  }

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.value.replace(/\D/g, "")
    if (!typed) {
      // Emptied box clears its own digits; a rejected non-digit is ignored.
      if (event.target.value === "") clearFrom(index)
      return
    }
    if (typed.length > 1) {
      // A pasted or autofilled code arrives whole; spread it over the boxes.
      if (typed.length === 2 && typed[0] === cellsRef.current[index]) {
        const next = cellsRef.current.slice()
        next[index] = typed[1]
        commit(next)
        if (index < length - 1) focusBox(index + 1)
        return
      }
      const next = cellsRef.current.slice()
      let last = index
      for (let i = 0; i < typed.length && index + i < length; i++) {
        next[index + i] = typed[i]
        last = index + i
      }
      commit(next)
      focusBox(last)
      return
    }
    const next = cellsRef.current.slice()
    next[index] = typed
    commit(next)
    if (index < length - 1) focusBox(index + 1)
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      if (cellsRef.current[index]) {
        clearFrom(index)
      } else if (index > 0) {
        focusBox(index - 1)
        clearFrom(index - 1)
      }
      return
    }
    if (event.key === "Delete") {
      event.preventDefault()
      clearFrom(index)
      return
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      focusBox(index - 1)
      return
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault()
      focusBox(index + 1)
    }
  }

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!pasted) return
    const start = pasted.length >= length ? 0 : index
    const next = cellsRef.current.slice()
    let last = start
    for (let i = 0; i < pasted.length && start + i < length; i++) {
      next[start + i] = pasted[i]
      last = start + i
    }
    commit(next)
    focusBox(last)
  }

  const handleFocus = (index: number, event: React.FocusEvent<HTMLInputElement>) => {
    const firstEmpty = cellsRef.current.findIndex((cell) => cell === "")
    if (firstEmpty !== -1 && firstEmpty < index) {
      // Digits stay contiguous, so typing continues in the first empty box.
      focusBox(firstEmpty)
      return
    }
    event.target.select()
  }

  return (
    <div
      data-slot="code-input"
      role="group"
      aria-label={label}
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element
          }}
          id={`${id}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={cells[index]}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={ariaInvalid}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => handleFocus(index, event)}
          className={cn(
            "h-11 w-9 rounded-md border border-input bg-transparent text-center text-lg font-semibold tabular-nums shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground sm:h-12 sm:w-11",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            isInvalid && "border-destructive ring-destructive/20 dark:ring-destructive/40",
            "dark:bg-input/30"
          )}
        />
      ))}
    </div>
  )
}

export { CodeInput, CODE_LENGTH }
