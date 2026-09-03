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
import type { ProgramOption } from "@/features/teachers/directory"

interface ProgramItem {
  value: string
  label: string
}

/**
 * Type-ahead picker for degree programs. Values are program ids as strings so
 * the surrounding form stays a plain string record.
 */
export function ProgramCombobox({
  id,
  programs,
  value,
  onChange,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string
  programs: ProgramOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}) {
  const items = React.useMemo<ProgramItem[]>(
    () =>
      programs.map((program) => ({
        value: String(program.id),
        label: `${program.code} — ${program.name}`,
      })),
    [programs]
  )

  const selected = items.find((item) => item.value === value) ?? null

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(item: ProgramItem | null) => onChange(item?.value ?? "")}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder="Search programs"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        showClear={Boolean(selected)}
      />
      <ComboboxContent>
        <ComboboxEmpty>No matching program.</ComboboxEmpty>
        <ComboboxList>
          {(item: ProgramItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
