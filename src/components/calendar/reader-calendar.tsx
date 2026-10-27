"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { CalendarDays, CalendarOff } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/empty-state"
import { MonthCalendar } from "@/components/calendar/month-calendar"
import { calendarDate, calendarDays, calendarLabels, monthBounds } from "@/features/calendar/admin-view"
import type { ReaderCalendarPanel } from "@/features/calendar/reader"
import type { CalendarEntryRow } from "@/services/calendar/query"

const dateLabel = (date: string) => calendarDate(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })

function Announcement({ entry, selectedDate, onSelect }: { entry: CalendarEntryRow; selectedDate?: string; onSelect?: () => void }) {
  return <article className="space-y-2 break-words rounded-lg border p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      {onSelect ? <Button variant="link" className="h-auto min-w-0 max-w-full whitespace-normal px-0 text-left" onClick={onSelect}>{entry.title}</Button> : <h3 className="min-w-0 font-medium">{entry.title}</h3>}
      <Badge variant={entry.status === "cancelled" ? "outline" : "secondary"}>{calendarLabels[entry.status]}</Badge>
    </div>
    <div className="flex flex-wrap gap-1">{entry.is_pinned && <Badge variant="outline">Pinned</Badge>}{entry.tags.map(tag => <Badge variant="secondary" key={tag}>{calendarLabels[tag] ?? tag}</Badge>)}</div>
    <p className="text-sm">Campus: {entry.campuses.join(", ") || "All campuses"}</p>
    <p className="text-sm tabular-nums">{dateLabel(entry.starts_on)}{entry.ends_on !== entry.starts_on && ` – ${dateLabel(entry.ends_on)}`}{entry.start_time ? ` · ${entry.start_time.slice(0, 5)} – ${entry.end_time?.slice(0, 5)} PHT` : " · All day"}</p>
    <p className="text-sm">Attendance: {calendarLabels[entry.attendance_impact]}</p>
    {entry.status === "cancelled" ? <p className="text-sm text-muted-foreground">This announcement is cancelled. It does not apply to today or future attendance.</p> : entry.attendance_impact === "no_classes" ? <p className="text-sm">{selectedDate && selectedDate >= entry.starts_on && selectedDate <= entry.ends_on ? "No classes on this date." : "No classes during these dates."} RFID taps are not expected.</p> : entry.attendance_impact === "online_manual" ? <p className="text-sm">Online class. Attendance is confirmed in Subject Attendance.</p> : null}
    {entry.location && <p className="text-sm">Location: {entry.location}</p>}
    {entry.reason && <p className="whitespace-pre-wrap text-sm">Reason: {entry.reason}</p>}
    {entry.description && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{entry.description}</p>}
  </article>
}

export function ReaderCalendar({ panel }: { panel: ReaderCalendarPanel }) {
  const router = useRouter(), pathname = usePathname(), searchParams = useSearchParams()
  const [pending, startTransition] = React.useTransition()
  const days = React.useMemo(() => calendarDays(panel.entries, panel.month), [panel.entries, panel.month])
  function navigate(month: string, date: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("month", month); params.set("date", date)
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }))
  }
  function selectDate(date: string) { navigate(date.slice(0, 7), date) }
  return <div aria-busy={pending} className="min-w-0 space-y-4 md:space-y-6">
    <div className="flex flex-wrap items-end gap-3"><div className="space-y-2"><Label htmlFor="reader-calendar-month">Month</Label><Input id="reader-calendar-month" type="month" min="0001-01" max="9998-12" value={panel.month} onChange={event => { if (/^\d{4}-\d{2}$/.test(event.target.value)) navigate(event.target.value, `${event.target.value}-01`) }} /></div><Button variant="outline" disabled={pending} onClick={() => selectDate(panel.today)}>Today</Button></div>
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <Card className="min-w-0"><CardHeader><CardTitle>{calendarDate(`${panel.month}-01`).toLocaleDateString("en-PH", { month: "long", year: "numeric" })}</CardTitle><CardDescription>Choose a date to view announcements for your campus and audience.</CardDescription></CardHeader><CardContent className="space-y-4">
        <div className="hidden sm:block"><MonthCalendar days={days} month={panel.month} date={panel.date} today={panel.today} onSelect={selectDate} onMonthChange={navigate} /></div>
        <div className="space-y-3 sm:hidden"><Label htmlFor="reader-calendar-date">Selected date</Label><Input id="reader-calendar-date" type="date" min={`${panel.month}-01`} max={monthBounds(panel.month).end} value={panel.date} onChange={event => { if (event.target.value) selectDate(event.target.value) }} />
          {Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).map(([date, entries]) => <section key={date} className="space-y-2 rounded-lg border p-3"><Button variant="link" className="h-auto px-0" onClick={() => selectDate(date)} aria-pressed={date === panel.date}>{dateLabel(date)}</Button><ul className="space-y-2 text-sm">{entries.map(entry => <li key={entry.id} className="break-words"><span className="font-medium">{entry.title}</span> · {calendarLabels[entry.status]} · {calendarLabels[entry.attendance_impact]}<span className="block text-muted-foreground">Campus: {entry.campuses.join(", ") || "All campuses"}</span></li>)}</ul></section>)}
        </div>
        {!panel.entries.length && <EmptyState icon={CalendarOff} title="No announcements this month" description="Choose another month to browse school announcements." />}
        <p className="text-xs text-muted-foreground">Green: normal event. Red: no classes. Blue: online / manual. Grey: cancelled. Each date includes announcement titles and status labels.</p>
      </CardContent></Card>
      <Card className="min-w-0"><CardHeader><CardTitle>{dateLabel(panel.date)}</CardTitle><CardDescription>{(days[panel.date] ?? []).length} announcements</CardDescription></CardHeader><CardContent className="space-y-3">
        {(days[panel.date] ?? []).length ? days[panel.date].map(entry => <Announcement key={entry.id} entry={entry} selectedDate={panel.date} />) : <EmptyState icon={CalendarDays} title="No announcements on this date" description="Select another day to see its details." />}
      </CardContent></Card>
    </div>
    <Card className="min-w-0"><CardHeader><CardTitle>Upcoming announcements</CardTitle><CardDescription>Today and the next 29 days, including ongoing announcements. Up to 50 published announcements.</CardDescription></CardHeader><CardContent className="grid gap-3 lg:grid-cols-2">
      {panel.upcoming.length ? panel.upcoming.map(entry => <Announcement key={entry.id} entry={entry} onSelect={() => selectDate(entry.starts_on < panel.today ? panel.today : entry.starts_on)} />) : <p className="text-sm text-muted-foreground">No upcoming announcements.</p>}
    </CardContent></Card>
  </div>
}
