"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { CalendarDays, CalendarOff } from "lucide-react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TablePagination } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { calendarDate, calendarDateKey, calendarDays, calendarLabels } from "@/features/calendar/admin-view"
import { calendarTags, calendarStatuses, calendarAudiences, calendarAttendanceImpacts } from "@/features/calendar/schema"
import type { AdminCalendarPanel } from "@/features/calendar/admin"
import type { CalendarEntryRow } from "@/services/calendar/query"

const DaysContext = React.createContext<Record<string, CalendarEntryRow[]>>({})
const dateLabel = (date: string) => calendarDate(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
const scope = (entry: CalendarEntryRow) => entry.campuses.join(", ") || "All campuses"
const impactColor = (entry: CalendarEntryRow) => entry.status === "cancelled" ? "bg-muted-foreground" : entry.status === "draft" ? "border border-foreground bg-background" : entry.attendance_impact === "no_classes" ? "bg-destructive" : entry.attendance_impact === "online_manual" ? "bg-blue-500" : "bg-emerald-600"

function EntryDayButton(props: React.ComponentProps<typeof CalendarDayButton>) {
  const days = React.useContext(DaysContext)
  const entries = days[calendarDateKey(props.day.date)] ?? []
  return <CalendarDayButton {...props} className="h-16 min-w-10 gap-1 rounded-md sm:h-20" aria-label={`${props["aria-label"] ?? dateLabel(calendarDateKey(props.day.date))}. ${entries.length} announcements${entries.length ? `: ${entries.map(entry => `${entry.title}, ${calendarLabels[entry.status]}`).join("; ")}` : ""}`}>
    <span>{props.day.date.getDate()}</span>
    <span aria-hidden className="flex h-3 items-center gap-1">
      {entries.slice(0, 3).map(entry => <span key={entry.id} className={`size-1.5 rounded-full ${impactColor(entry)}`} />)}
      {entries.length > 3 && <span className="text-[10px]">+{entries.length - 3}</span>}
    </span>
  </CalendarDayButton>
}

function EntryDetails({ entry }: { entry: CalendarEntryRow }) {
  return <article className="space-y-2 rounded-lg border p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h3 className="min-w-0 break-words font-medium">{entry.title}</h3>
      <Badge variant={entry.status === "published" ? "default" : "outline"}>{calendarLabels[entry.status]}</Badge>
    </div>
    <div className="flex flex-wrap gap-1">{entry.tags.map(tag => <Badge variant="secondary" key={tag}>{calendarLabels[tag] ?? tag}</Badge>)}</div>
    <dl className="grid gap-1 text-sm">
      <div><dt className="inline text-muted-foreground">Attendance: </dt><dd className="inline">{calendarLabels[entry.attendance_impact]}</dd></div>
      <div><dt className="inline text-muted-foreground">Campus: </dt><dd className="inline">{scope(entry)}</dd></div>
      <div><dt className="inline text-muted-foreground">Audience: </dt><dd className="inline">{calendarLabels[entry.audience]}</dd></div>
      <div><dt className="inline text-muted-foreground">Dates: </dt><dd className="inline">{dateLabel(entry.starts_on)}{entry.ends_on !== entry.starts_on && ` – ${dateLabel(entry.ends_on)}`}</dd></div>
      <div><dt className="inline text-muted-foreground">Time: </dt><dd className="inline">{entry.start_time ? `${entry.start_time.slice(0, 5)} – ${entry.end_time?.slice(0, 5)} PHT` : "All day"}</dd></div>
      {entry.location && <div><dt className="inline text-muted-foreground">Location: </dt><dd className="inline">{entry.location}</dd></div>}
    </dl>
    {entry.reason && <p className="whitespace-pre-wrap break-words text-sm"><span className="font-medium">Reason: </span>{entry.reason}</p>}
    {entry.description && <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{entry.description}</p>}
  </article>
}

function FilterSelect({ name, label, value, options }: { name: string; label: string; value: string; options: readonly string[] }) {
  return <div className="space-y-1.5"><Label htmlFor={`calendar-${name}`}>{label}</Label>
    <Select name={name} defaultValue={value}><SelectTrigger id={`calendar-${name}`} className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="all">All {label.toLowerCase()}</SelectItem>{options.map(option => <SelectItem key={option} value={option}>{calendarLabels[option] ?? option}</SelectItem>)}</SelectContent>
    </Select>
  </div>
}

export function CalendarPanel({ panel }: { panel: AdminCalendarPanel }) {
  const { query, kpis } = panel
  const router = useRouter(), pathname = usePathname(), searchParams = useSearchParams()
  const [pending, startTransition] = React.useTransition()
  const days = React.useMemo(() => calendarDays(panel.entries, query.month), [panel.entries, query.month])
  function navigate(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value === "all") params.delete(key)
      else params.set(key, value)
    }
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }))
  }
  function selectDate(date: string) { navigate({ date, month: date.slice(0, 7), tab: "calendar" }) }
  const summary = [
    ["Upcoming entries", kpis.upcoming, "Published entries active within the next 30 days, including today."],
    ["No-class days", kpis.noClasses, "Distinct dates in this month with no classes on at least one campus."],
    ["Published this month", kpis.published, "Currently published entries with a publication date in this month."],
    ["Failed emails", kpis.failed, "Failed deliveries across all announcements."],
  ] as const
  return <div aria-busy={pending} className="flex min-w-0 flex-col gap-4 md:gap-6">
    <section aria-label="Calendar summary across all campuses" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map(([label, value, description]) => <Card key={label} className="gap-3"><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-3xl tabular-nums">{value.toLocaleString("en-PH")}</CardTitle></CardHeader><CardFooter className="text-xs text-muted-foreground">{description}</CardFooter></Card>)}
    </section>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1.5"><Label htmlFor="calendar-month">Calendar month</Label><Input id="calendar-month" type="month" min="0001-01" max="9998-12" value={query.month} className="w-48" onChange={event => { if (event.target.value) navigate({ month: event.target.value, date: `${event.target.value}-01` }) }} /></div>
      <p className="text-xs text-muted-foreground">Philippines time · Summary across all campuses{pending ? " · Updating…" : ""}</p>
    </div>
    <Tabs value={query.tab} onValueChange={tab => navigate({ tab })}>
      <TabsList aria-label="Calendar views"><TabsTrigger value="calendar">Calendar</TabsTrigger><TabsTrigger value="list">All announcements</TabsTrigger></TabsList>
      <TabsContent value="calendar" className="mt-4">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card className="min-w-0"><CardHeader><CardTitle>{calendarDate(`${query.month}-01`).toLocaleDateString("en-PH", { month: "long", year: "numeric" })}</CardTitle><CardDescription>Choose a date to view announcements across all campuses.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="hidden sm:block"><DaysContext.Provider value={days}><Calendar mode="single" required selected={calendarDate(query.date)} month={calendarDate(`${query.month}-01`)} today={calendarDate(query.today)}
                startMonth={calendarDate("0001-01-01")} endMonth={calendarDate("9998-12-01")} showOutsideDays={false}
                onSelect={date => { if (date) selectDate(calendarDateKey(date)) }} onMonthChange={date => navigate({ month: calendarDateKey(date).slice(0, 7), date: calendarDateKey(date) })}
                className="w-full p-0 [--cell-size:3rem]" classNames={{ root: "w-full", month_grid: "w-full border-collapse", weekdays: "flex", weekday: "flex-1 text-xs text-muted-foreground", week: "mt-1 flex w-full" }} components={{ DayButton: EntryDayButton }} /></DaysContext.Provider></div>
              <div className="space-y-3 sm:hidden">
                <Label htmlFor="calendar-date">Selected date</Label><Input id="calendar-date" type="date" value={query.date} onChange={event => { if (event.target.value) selectDate(event.target.value) }} />
                {Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).map(([date, entries]) => <div key={date} className="rounded-lg border p-3"><Button variant="link" className="h-auto px-0" onClick={() => selectDate(date)} aria-pressed={date === query.date}>{dateLabel(date)}</Button><ul className="space-y-1 text-sm">{entries.map(entry => <li className="break-words" key={entry.id}>{entry.title} <span className="text-muted-foreground">· {calendarLabels[entry.status]}</span></li>)}</ul></div>)}
              </div>
              {!panel.entries.length && <EmptyState icon={CalendarOff} title="No announcements this month" description="Choose another month to browse school announcements." />}
              <p className="text-xs text-muted-foreground">Dots: green = normal, red = no classes, blue = online/manual, outlined = draft, grey = cancelled.</p>
            </CardContent>
          </Card>
          <Card className="min-w-0"><CardHeader><CardTitle>{dateLabel(query.date)}</CardTitle><CardDescription>{(days[query.date] ?? []).length} announcements · All campuses</CardDescription></CardHeader><CardContent className="space-y-3">
            {(days[query.date] ?? []).length ? days[query.date].map(entry => <EntryDetails key={entry.id} entry={entry} />) : <EmptyState icon={CalendarDays} title="No announcements on this date" description="Select another day to see its details." />}
          </CardContent></Card>
        </div>
      </TabsContent>
      <TabsContent value="list" className="mt-4 space-y-4">
        <Card><CardHeader><CardTitle>Find announcements</CardTitle><CardDescription>Filters apply to this list, across all dates. Campus filters include all-campus entries.</CardDescription></CardHeader><CardContent>
          <form role="search" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); navigate({ ...Object.fromEntries([...data.entries()].map(([key, value]) => [key, String(value)])), page: null }) }}>
            <div className="space-y-1.5"><Label htmlFor="calendar-search">Search titles</Label><Input id="calendar-search" name="search" defaultValue={query.search} maxLength={160} placeholder="Search announcements" /></div>
            <FilterSelect name="status" label="Statuses" value={query.status} options={calendarStatuses} /><FilterSelect name="tag" label="Tags" value={query.tag} options={calendarTags} /><FilterSelect name="impact" label="Attendance impacts" value={query.impact} options={calendarAttendanceImpacts} />
            <FilterSelect name="campus" label="Campuses" value={query.campus} options={[...new Set([...panel.campuses, ...(query.campus !== "all" ? [query.campus] : [])])]} /><FilterSelect name="audience" label="Audiences" value={query.audience} options={calendarAudiences} />
            <div className="space-y-1.5"><Label htmlFor="calendar-from">From date</Label><Input id="calendar-from" name="from" type="date" defaultValue={query.from} /></div><div className="space-y-1.5"><Label htmlFor="calendar-to">To date</Label><Input id="calendar-to" name="to" type="date" defaultValue={query.to} /></div>
            <div className="flex gap-2 sm:col-span-2 xl:col-span-4"><Button type="submit" disabled={pending}>Apply filters</Button><Button type="button" variant="outline" disabled={pending} onClick={() => navigate({ search: null, status: null, tag: null, impact: null, campus: null, audience: null, from: null, to: null, page: null })}>Clear filters</Button></div>
          </form>
        </CardContent></Card>
        <Card className="min-w-0"><CardHeader><CardTitle>All announcements</CardTitle><CardDescription>{panel.list.total.toLocaleString("en-PH")} matching announcements</CardDescription></CardHeader><CardContent>
          {!panel.list.entries.length ? <EmptyState icon={CalendarOff} title="No matching announcements" description="Clear filters or choose a wider date range." /> : <Table><TableHeader><TableRow>{["Title", "Tags", "Impact", "Audience", "Campuses", "Dates", "Status", "Published", "Email status"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>
            {panel.list.entries.map(entry => <TableRow key={entry.id}>
              <TableCell><Button variant="link" className="h-auto max-w-64 justify-start whitespace-normal px-0 text-left" onClick={() => selectDate(entry.starts_on)}>{entry.title}</Button>{entry.is_pinned && <Badge variant="outline" className="ml-2">Pinned</Badge>}</TableCell>
              <TableCell><div className="flex max-w-48 flex-wrap gap-1">{entry.tags.map(tag => <Badge variant="secondary" key={tag}>{calendarLabels[tag] ?? tag}</Badge>)}</div></TableCell>
              <TableCell>{calendarLabels[entry.attendance_impact]}</TableCell><TableCell>{calendarLabels[entry.audience]}</TableCell><TableCell className="max-w-48 whitespace-normal">{scope(entry)}</TableCell>
              <TableCell className="tabular-nums">{dateLabel(entry.starts_on)}{entry.ends_on !== entry.starts_on && <><br />to {dateLabel(entry.ends_on)}</>}</TableCell><TableCell><Badge variant={entry.status === "published" ? "default" : "outline"}>{calendarLabels[entry.status]}</Badge></TableCell>
              <TableCell>{entry.published_at ? new Date(entry.published_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", month: "short", day: "numeric", year: "numeric" }) : "Not published"}</TableCell>
              <TableCell>{panel.deliveries[entry.id] ? <div className="space-y-1">{Object.entries(panel.deliveries[entry.id]).filter(([, count]) => count > 0).map(([status, count]) => <div key={status} className="text-xs tabular-nums">{status}: {count}</div>)}</div> : "No deliveries"}</TableCell>
            </TableRow>)}
          </TableBody></Table>}
        </CardContent><CardFooter className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm tabular-nums text-muted-foreground">Page {query.page} of {Math.max(1, Math.ceil(panel.list.total / query.pageSize))}</p><TablePagination page={query.page} pageCount={Math.ceil(panel.list.total / query.pageSize)} onPageChange={page => navigate({ page: String(page) })} /></CardFooter></Card>
      </TabsContent>
    </Tabs>
  </div>
}
