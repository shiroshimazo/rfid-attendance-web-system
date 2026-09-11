"use client"

import { useId, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
import { SortableHeader, TablePagination, nextSortState, type SortState } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatClockTime } from "@/lib/format"
import { subjectTotals, type SubjectAttendanceRow } from "@/features/subject-attendance/model"
import { emptySubjectFilters, filterSubjectHistory, type SubjectHistoryFilters, type SubjectHistorySort } from "@/features/subject-attendance/student-history-model"

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value || "__all"} onValueChange={value => onChange(value === "__all" ? "" : value)}>
    <SelectTrigger aria-label={label} className="h-10 w-full"><SelectValue placeholder={label} /></SelectTrigger>
    <SelectContent><SelectItem value="__all">All {label.toLowerCase()}</SelectItem>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
  </Select>
}

export function StudentSubjectHistory({ rows }: { rows: SubjectAttendanceRow[] }) {
  const id = useId()
  const [filters, setFilters] = useState<SubjectHistoryFilters>(emptySubjectFilters)
  const [sort, setSort] = useState<SortState<SubjectHistorySort>>({ column: "date", direction: "desc" })
  const [page, setPage] = useState(1)
  function change(key: keyof SubjectHistoryFilters, value: string) { setFilters(old => ({ ...old, [key]: value })); setPage(1) }
  const filtered = filterSubjectHistory(rows, filters, sort.column, sort.direction)
  const totals = subjectTotals(filtered)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  const options = (key: "course_code" | "campus" | "teacher_name") => [...new Set(rows.map(row => row[key]))].sort()
  const labels: Record<keyof SubjectHistoryFilters, string> = { search: "Search", from: "From", to: "To", subject: "Subject", result: "Result", campus: "Campus", teacher: "Teacher" }
  const active = (Object.keys(filters) as (keyof SubjectHistoryFilters)[]).filter(key => filters[key])
  const invalidRange = Boolean(filters.from && filters.to && filters.from > filters.to)
  function onSort(column: SubjectHistorySort) { setSort(old => nextSortState(old, column)); setPage(1) }
  return <Card className="min-w-0">
    <CardHeader><CardTitle>Subject Attendance</CardTitle><CardDescription>Teacher-confirmed as Present, Late or Absent. Rates use confirmed sessions only; campus taps do not confirm classroom attendance.</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-live="polite">
        {[["Present", totals.present], ["Late", totals.late], ["Absent", totals.absent], ["Attendance rate", totals.rate === null ? "No confirmations" : `${totals.rate.toFixed(1)}%`]].map(([label, value]) => <div key={label} className={`rounded-lg border p-4 ${label === "Attendance rate" ? "bg-muted/50" : ""}`}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd></div>)}
      </dl>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_auto_160px_150px_auto]" role="search" aria-label="Filter subject attendance">
        <div className="relative"><Label htmlFor={`${id}-search`} className="sr-only">Search subject attendance</Label><Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input id={`${id}-search`} value={filters.search} onChange={event => change("search", event.target.value)} placeholder="Search student, subject, section…" className="h-10 pl-9" /></div>
        <Popover><PopoverTrigger asChild><Button variant="outline" className="h-10">Date range{filters.from || filters.to ? " · Active" : ""}</Button></PopoverTrigger><PopoverContent className="w-80 space-y-3" align="start"><div className="space-y-1"><Label htmlFor={`${id}-from`}>From date</Label><DatePicker id={`${id}-from`} value={filters.from} max={filters.to || undefined} onChange={value => change("from", value)} /></div><div className="space-y-1"><Label htmlFor={`${id}-to`}>To date</Label><DatePicker id={`${id}-to`} value={filters.to} min={filters.from || undefined} onChange={value => change("to", value)} /></div><p className="text-xs text-muted-foreground">Both dates are included. Leave blank for all dates.</p></PopoverContent></Popover>
        <FilterSelect label="Subjects" value={filters.subject} options={options("course_code")} onChange={value => change("subject", value)} />
        <FilterSelect label="Results" value={filters.result} options={["Present", "Late", "Absent"]} onChange={value => change("result", value)} />
        <Popover><PopoverTrigger asChild><Button variant="outline" className="h-10"><SlidersHorizontal aria-hidden />More filters</Button></PopoverTrigger><PopoverContent className="space-y-3" align="end"><FilterSelect label="Campuses" value={filters.campus} options={options("campus")} onChange={value => change("campus", value)} /><FilterSelect label="Teachers" value={filters.teacher} options={options("teacher_name")} onChange={value => change("teacher", value)} /></PopoverContent></Popover>
      </div>
      {active.length > 0 && <div className="flex flex-wrap items-center gap-2">{active.map(key => <Button key={key} variant="secondary" size="sm" className="h-10 max-w-full rounded-full" onClick={() => change(key, "")} aria-label={`Remove ${labels[key]} filter`}><span className="truncate">{labels[key]}: {filters[key]}</span><X aria-hidden className="size-3" /></Button>)}<Button variant="ghost" className="h-10" onClick={() => { setFilters(emptySubjectFilters); setPage(1) }}>Clear all</Button></div>}
      {invalidRange && <p role="alert" className="text-sm text-destructive">From date must be on or before To date.</p>}
      <div className="overflow-hidden rounded-lg border">
        <Table><TableHeader><TableRow className="bg-muted/40">{([['date','Date / session'],['subject','Subject / teacher'],['student','Student'],['placement','Section / campus'],['result','Result']] as const).map(([column,label]) => <SortableHeader key={column} column={column} label={label} sort={sort} onSort={onSort} />)}<TableHead>RFID</TableHead></TableRow></TableHeader>
          <TableBody>{visible.map(row => <TableRow key={row.id}>
            <TableCell className="align-top tabular-nums"><div className="font-medium">{row.attendance_date}</div><div className="mt-1 text-xs text-muted-foreground">{formatClockTime(row.time_start)}–{formatClockTime(row.time_end)} PHT</div></TableCell>
            <TableCell className="max-w-64 whitespace-normal align-top"><div className="font-medium">{row.course_code}</div><div className="text-xs text-muted-foreground">{row.course_name}</div><div className="mt-1 text-xs text-muted-foreground">{row.teacher_name}</div></TableCell>
            <TableCell className="align-top"><div>{row.student_name}</div><div className="mt-1 text-xs text-muted-foreground">{row.student_number}</div></TableCell>
            <TableCell className="align-top"><div>{row.program_code} · {row.year_level}</div><div className="mt-1 text-xs text-muted-foreground">{row.section} · {row.campus}</div></TableCell>
            <TableCell className="align-top"><AttendanceStatusBadge status={row.attendance_status} /><div className="mt-1 text-xs text-muted-foreground">Teacher confirmed</div></TableCell>
            <TableCell className="align-top text-muted-foreground">— / —<div className="mt-1 max-w-32 whitespace-normal text-xs">Confirmation creates no RFID tap</div></TableCell>
          </TableRow>)}{visible.length === 0 && <TableRow><TableCell colSpan={6} className="h-32 whitespace-normal text-center text-muted-foreground">{rows.length ? "No confirmations match these filters. Adjust or clear the filters." : "No teacher confirmations yet. This does not mean you are absent."}</TableCell></TableRow>}</TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground" aria-live="polite">{filtered.length} confirmed student-session{filtered.length === 1 ? "" : "s"}{active.length ? " matching filters" : ""}. Details reflect confirmation time.</p><TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} /></div>
    </CardContent>
  </Card>
}
