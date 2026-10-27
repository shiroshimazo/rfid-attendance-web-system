"use client"

import * as React from "react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { calendarDate, calendarDateKey, calendarLabels } from "@/features/calendar/admin-view"
import type { CalendarEntryRow } from "@/services/calendar/query"

const DaysContext = React.createContext<Record<string, CalendarEntryRow[]>>({})
const impactColor = (entry: CalendarEntryRow) => entry.status === "cancelled" ? "bg-muted-foreground" : entry.status === "draft" ? "border border-foreground bg-background" : entry.attendance_impact === "no_classes" ? "bg-destructive" : entry.attendance_impact === "online_manual" ? "bg-blue-500" : "bg-emerald-600"

function EntryDayButton(props: React.ComponentProps<typeof CalendarDayButton>) {
  const days = React.useContext(DaysContext)
  const entries = days[calendarDateKey(props.day.date)] ?? []
  return <CalendarDayButton {...props} className="h-16 min-w-10 gap-1 rounded-md sm:h-20" aria-label={`${props["aria-label"] ?? calendarDateKey(props.day.date)}. ${entries.length} announcements${entries.length ? `: ${entries.map(entry => `${entry.title}, ${calendarLabels[entry.status]}`).join("; ")}` : ""}`}>
    <span>{props.day.date.getDate()}</span>
    <span aria-hidden className="flex h-3 items-center gap-1">
      {entries.slice(0, 3).map(entry => <span key={entry.id} className={`size-1.5 rounded-full ${impactColor(entry)}`} />)}
      {entries.length > 3 && <span className="text-[10px]">+{entries.length - 3}</span>}
    </span>
  </CalendarDayButton>
}

export function MonthCalendar({ days, month, date, today, onSelect, onMonthChange }: {
  days: Record<string, CalendarEntryRow[]>; month: string; date: string; today: string
  onSelect: (date: string) => void; onMonthChange: (month: string, date: string) => void
}) {
  return <DaysContext.Provider value={days}><Calendar mode="single" required selected={calendarDate(date)} month={calendarDate(`${month}-01`)} today={calendarDate(today)}
    startMonth={calendarDate("0001-01-01")} endMonth={calendarDate("9998-12-01")} showOutsideDays={false}
    onSelect={value => { if (value) onSelect(calendarDateKey(value)) }} onMonthChange={value => onMonthChange(calendarDateKey(value).slice(0, 7), calendarDateKey(value))}
    className="w-full p-0 [--cell-size:3rem]" classNames={{ root: "w-full", month_grid: "w-full border-collapse", weekdays: "flex", weekday: "flex-1 text-xs text-muted-foreground", week: "mt-1 flex w-full" }} components={{ DayButton: EntryDayButton }} /></DaysContext.Provider>
}
