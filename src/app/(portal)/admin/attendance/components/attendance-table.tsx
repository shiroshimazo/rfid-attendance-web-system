"use client"

import * as React from "react"
import { CalendarX2, Search } from "lucide-react"

import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
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
import type {
  AttendancePanelRow,
  AttendanceStatus,
} from "@/features/attendance/panel"
import { formatClockTime, formatNumber } from "@/lib/format"

type SortColumn =
  | "name"
  | "program"
  | "yearLevel"
  | "section"
  | "status"
  | "timeIn"
  | "timeOut"

const PAGE_SIZE = 10

const statusOrder: Record<AttendanceStatus, number> = {
  Present: 0,
  Late: 1,
  Excused: 2,
  Absent: 3,
}

const collator = new Intl.Collator(undefined, { numeric: true })

function compareTimes(a: string | null, b: string | null) {
  if (a === b) return 0
  if (a === null) return 1
  if (b === null) return -1

  return a.localeCompare(b)
}

function compareRows(
  a: AttendancePanelRow,
  b: AttendancePanelRow,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "program":
      return collator.compare(a.programCode, b.programCode) * factor
    case "yearLevel":
      return collator.compare(a.yearLevel, b.yearLevel) * factor
    case "section":
      return collator.compare(a.section, b.section) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    case "timeIn":
      return compareTimes(a.timeIn, b.timeIn) * factor
    case "timeOut":
      return compareTimes(a.timeOut, b.timeOut) * factor
    default:
      return collator.compare(a.name, b.name) * factor
  }
}

export function AttendanceTable({
  rows,
  readableDate,
  hasStudents,
}: {
  rows: AttendancePanelRow[]
  readableDate: string
  hasStudents: boolean
}) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "name",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)

  const sorted = React.useMemo(
    () =>
      [...rows].sort((a, b) => compareRows(a, b, sort.column, sort.direction)),
    [rows, sort]
  )

  React.useEffect(() => {
    setPage(1)
  }, [rows])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance records</CardTitle>
        <CardDescription>
          Time-in and time-out taps for {readableDate}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <EmptyState
            icon={hasStudents ? Search : CalendarX2}
            title={
              hasStudents ? "No matching records" : "No student records yet"
            }
            description={
              hasStudents
                ? "Adjust the search text, date, or filters to widen the results."
                : "Add students to the directory before attendance can be tracked."
            }
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="name"
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
                    label="Attendance Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="timeIn"
                    label="Time In"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 sm:table-cell"
                  />
                  <SortableHeader
                    column="timeOut"
                    label="Time Out"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 sm:table-cell"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-3">
                      <p className="font-medium">{row.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {row.studentId}
                      </p>
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      <Badge
                        variant="outline"
                        className="border-primary/25 bg-primary/5"
                        title={row.programName}
                      >
                        {row.programCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {row.yearLevel}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {row.section}
                    </TableCell>
                    <TableCell className="px-3">
                      <AttendanceStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums sm:table-cell">
                      {formatClockTime(row.timeIn)}
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums sm:table-cell">
                      {formatClockTime(row.timeOut)}
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
            {formatNumber(sorted.length)} students
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
