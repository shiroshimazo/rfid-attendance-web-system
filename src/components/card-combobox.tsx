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
import type { StoredCardView } from "@/features/students/directory"
import { formatDateValue } from "@/lib/format"

interface CardItem {
  value: string
  label: string
  option: StoredCardView
}

/**
 * Type-ahead picker for registered cards. Values are card ids as strings so the
 * surrounding form stays a plain string record, and the label carries the UID
 * and status so both are searchable.
 */
export function CardCombobox({
  id,
  cards,
  value,
  onChange,
  disabled,
  placeholder = "Search by RFID card number",
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string
  cards: StoredCardView[]
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
  const items = React.useMemo<CardItem[]>(
    () =>
      cards.map((option) => ({
        value: String(option.id),
        label: `${option.rfidNumber} — ${option.cardStatus}`,
        option,
      })),
    [cards]
  )

  const selected = items.find((item) => item.value === value) ?? null

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(item: CardItem | null) => onChange(item?.value ?? "")}
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
        <ComboboxEmpty>No matching card.</ComboboxEmpty>
        <ComboboxList>
          {(item: CardItem) => (
            <ComboboxItem key={item.value} value={item}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-mono tabular-nums">
                  {item.option.rfidNumber}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.option.cardStatus} ·{" "}
                  {item.option.studentId === null
                    ? "Unassigned"
                    : "Held by this student"}{" "}
                  · {formatDateValue(item.option.assignedDate)}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
