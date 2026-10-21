"use client"

import * as React from "react"

import { DatePicker, type DatePickerProps } from "@/components/ui/date-picker"

type DatePickerFieldProps = Omit<DatePickerProps, "value" | "onChange" | "name" | "clearable"> & {
  name: string
  defaultValue: string
}

/** A non-empty date field for server-rendered GET filter forms. */
export function DatePickerField({ name, defaultValue, disabled, ...props }: DatePickerFieldProps) {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <>
      <input type="hidden" name={name} value={value} disabled={disabled} />
      <DatePicker {...props} value={value} onChange={setValue} disabled={disabled} clearable={false} />
    </>
  )
}
