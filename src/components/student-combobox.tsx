"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { StudentCardOption } from "@/features/rfid/cards"

interface StudentItem {
  value: string
  label: string
  option: StudentCardOption
}

/**
 * Type-ahead picker for students. Values are student ids as strings so the
 * surrounding form stays a plain string record, and the label carries the
 * student ID and program so both are searchable.
 */
export function StudentCombobox({
  id,
  students,
  value,
  onChange,
  disabled,
  placeholder = "Search by name, student ID, or program",
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string
  students: StudentCardOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}) {
  // Keep the popup inside its Radix dialog's pointer/focus boundary. Outside
  // dialogs, a null container retains the normal body portal.
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const attachInput = React.useCallback((node: HTMLInputElement | null) => {
    setContainer(node?.closest<HTMLElement>('[data-slot="dialog-content"]') ?? null)
  }, [])
  const items = React.useMemo<StudentItem[]>(
    () =>
      students.map((option) => ({
        value: String(option.id),
        label: `${option.fullName} — ${option.studentId} — ${option.programCode} ${option.section}`,
        option,
      })),
    [students]
  )

  const selected = items.find((item) => item.value === value) ?? null

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(item: StudentItem | null) => onChange(item?.value ?? "")}
      disabled={disabled}
    >
      <ComboboxInput
        ref={attachInput}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        showClear={Boolean(selected)}
      />
      <ComboboxContent container={container}>
        <ComboboxEmpty>No matching student.</ComboboxEmpty>
        <ComboboxList>
          {(item: StudentItem) => (
            <ComboboxItem key={item.value} value={item}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{item.option.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.option.studentId} · {item.option.programCode} ·{" "}
                  {item.option.section}
                  {item.option.activeCardNumber
                    ? ` · holds ${item.option.activeCardNumber}`
                    : ""}
                  {item.option.status !== "active"
                    ? ` · ${item.option.status}`
                    : ""}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
