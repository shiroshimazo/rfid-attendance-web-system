"use client"

import * as React from "react"
import { ScanLine } from "lucide-react"
import { format, parseISO } from "date-fns"

import {
  AttendanceStatusBadge,
  RfidStatusBadge,
} from "@/components/attendance-status-badge"
import {
  SortableHeader,
  TablePagination,
  nextSortState,
  type SortState,
} from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AttendanceLog } from "@/features/reports/panel"
import { formatClockTime, formatNumber } from "@/lib/format"

type SortColumn =
  | "time"
  | "studentName"
  | "program"
  | "yearLevel"
  | "section"
  | "status"
  | "rfidStatus"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

function compareRows(
  a: AttendanceLog,
  b: AttendanceLog,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "studentName":
      return collator.compare(a.studentName, b.studentName) * factor
    case "program":
      return collator.compare(a.program, b.program) * factor
    case "yearLevel":
      return collator.compare(a.yearLevel, b.yearLevel) * factor
    case "section":
      return collator.compare(a.section, b.section) * factor
    case "status":
      return collator.compare(a.status, b.status) * factor
    case "rfidStatus":
      return collator.compare(a.rfidStatus, b.rfidStatus) * factor
    default:
      return a.time.localeCompare(b.time) * factor
  }
}

export function RecentLogsTable({ logs }: { logs: AttendanceLog[] }) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "time",
    direction: "desc",
  })
  const [page, setPage] = React.useState(1)

  const sorted = React.useMemo(
    () =>
      [...logs].sort((a, b) => compareRows(a, b, sort.column, sort.direction)),
    [logs, sort]
  )

  React.useEffect(() => {
    setPage(1)
  }, [logs])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  return (
    <Card data-print="block">
      <CardHeader>
        <CardTitle>Recent Attendance Logs</CardTitle>
        <CardDescription>
          The 50 newest RFID taps in the selected range.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <EmptyState
            icon={ScanLine}
            title="No taps recorded"
            description="Logs appear once the reader posts attendance for this range."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="time"
                    label="Time"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="studentName"
                    label="Student Name"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="program"
                    label="Program"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="yearLevel"
                    label="Year Level"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="section"
                    label="Section"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="status"
                    label="Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="rfidStatus"
                    label="RFID Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 sm:table-cell"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="px-3">
                      <p className="font-medium tabular-nums">
                        {formatClockTime(log.timeIn)}
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {format(parseISO(log.date), "d MMM yyyy")}
                      </p>
                    </TableCell>
                    <TableCell className="px-3">
                      <p className="font-medium">{log.studentName}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {log.studentId}
                      </p>
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      <Badge
                        variant="outline"
                        className="border-primary/25 bg-primary/5"
                      >
                        {log.program}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {log.yearLevel}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {log.section}
                    </TableCell>
                    <TableCell className="px-3">
                      <AttendanceStatusBadge status={log.status} />
                    </TableCell>
                    <TableCell className="hidden px-3 sm:table-cell">
                      <RfidStatusBadge status={log.rfidStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {visible.length > 0 ? (
        <CardFooter className="flex-wrap justify-between gap-3">
          <p
            aria-live="polite"
            className="text-sm text-muted-foreground tabular-nums"
          >
            Showing {formatNumber(start + 1)} to{" "}
            {formatNumber(start + visible.length)} of{" "}
            {formatNumber(sorted.length)} logs
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}
    </Card>
  )
}
