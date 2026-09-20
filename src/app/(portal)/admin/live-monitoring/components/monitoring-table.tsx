"use client"

import { useMemo, useState } from "react"
import { ScanLine, Search } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { TablePagination } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { filterLiveMonitoringRows, type LiveMonitoringFilters, type LiveMonitoringRow } from "@/features/attendance/live-monitoring"
import { formatClockTime, formatNumber } from "@/lib/format"

const PAGE_SIZE = 20
const emptyFilters: LiveMonitoringFilters = { search: "", tap: "all", program: "all", section: "all" }

export function MonitoringTable({ rows }: { rows: LiveMonitoringRow[] }) {
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const programs = useMemo(() => [...new Map(rows.filter(row => row.programId).map(row =>
    [row.programId, { id: row.programId, label: row.programCode || row.programName }]
  )).values()].sort((a, b) => a.label.localeCompare(b.label)), [rows])
  const sections = useMemo(() => [...new Set(rows.map(row => row.section).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [rows])
  const filtered = useMemo(() => filterLiveMonitoringRows(rows, filters), [rows, filters])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const filtersActive = Object.keys(emptyFilters).some(key => filters[key as keyof LiveMonitoringFilters] !== emptyFilters[key as keyof LiveMonitoringFilters])

  function updateFilters(patch: Partial<LiveMonitoringFilters>) {
    setFilters(current => ({ ...current, ...patch }))
    setPage(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today’s student taps</CardTitle>
        <CardDescription>One row per student. Taps In shows students awaiting tap out; Taps Out shows completed tap outs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div role="search" aria-label="Filter live monitoring" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,2fr)_1fr_1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="monitoring-search">Search</Label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="monitoring-search" className="pl-9" placeholder="Name, student ID, or RFID number" value={filters.search}
                onChange={event => updateFilters({ search: event.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monitoring-tap">Taps In/Out</Label>
            <Select value={filters.tap} onValueChange={value => updateFilters({ tap: value as LiveMonitoringFilters["tap"] })}>
              <SelectTrigger id="monitoring-tap" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All taps</SelectItem>
                <SelectItem value="in">Taps In (awaiting out)</SelectItem>
                <SelectItem value="out">Taps Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monitoring-program">Program</Label>
            <Select value={filters.program} onValueChange={value => updateFilters({ program: value })}>
              <SelectTrigger id="monitoring-program" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {programs.map(program => <SelectItem key={program.id} value={program.id}>{program.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monitoring-section">Section</Label>
            <Select value={filters.section} onValueChange={value => updateFilters({ section: value })}>
              <SelectTrigger id="monitoring-section" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sections</SelectItem>
                {sections.map(section => <SelectItem key={section} value={section}>{section}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="self-end" disabled={!filtersActive} onClick={() => updateFilters(emptyFilters)}>Clear filters</Button>
        </div>
        {visible.length === 0 ? (
          <EmptyState icon={ScanLine} title={filtersActive ? "No matching taps" : "No taps yet today"}
            description={filtersActive ? "Change or clear the filters to see more students." : "Students appear automatically when their RFID tap is recorded."} />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader><TableRow className="bg-muted/50">
                {["Name", "Section", "Program", "RFID Number", "Tap IN", "Tap Out"].map(label => <TableHead key={label} className="px-3">{label}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {visible.map(row => <TableRow key={row.id}>
                  <TableCell className="px-3 font-medium">{row.name}</TableCell>
                  <TableCell className="px-3">{row.section || "—"}</TableCell>
                  <TableCell className="px-3" title={row.programName}>{row.programCode || row.programName}</TableCell>
                  <TableCell className="px-3 font-mono">{row.rfidNumber || "—"}</TableCell>
                  <TableCell className="px-3 tabular-nums">{formatClockTime(row.timeIn)}</TableCell>
                  <TableCell className="px-3 tabular-nums">{row.timeOut ? formatClockTime(row.timeOut) : <span className="text-muted-foreground">Awaiting tap out</span>}</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
          {filtered.length ? `Showing ${formatNumber(start + 1)}–${formatNumber(start + visible.length)} of ${formatNumber(filtered.length)} students` : "0 students"}
        </p>
        {pageCount > 1 ? <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} /> : null}
      </CardFooter>
    </Card>
  )
}
