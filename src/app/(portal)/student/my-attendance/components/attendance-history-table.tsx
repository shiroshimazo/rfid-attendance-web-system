"use client"

import * as React from "react"
import { CalendarX2, Eye } from "lucide-react"

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
import { SmsStatusBadge } from "@/components/sms-status-badge"
import { Button } from "@/components/ui/button"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StudentAttendanceRow } from "@/features/attendance/student-attendance"
import { formatClockTime, formatDateValue, formatNumber } from "@/lib/format"

import { AttendanceDetailDialog } from "./attendance-detail-dialog"

type SortColumn =
  | "date"
  | "status"
  | "timeIn"
  | "timeOut"
  | "rfidStatus"
  | "smsStatus"

const PAGE_SIZE = 10

const statusOrder: Record<StudentAttendanceRow["status"], number> = {
  Present: 0,
  Late: 1,
  Excused: 2,
  Absent: 3,
}

function compareTimes(a: string | null, b: string | null) {
  if (a === b) return 0
  if (a === null) return 1
  if (b === null) return -1

  return a.localeCompare(b)
}

function compareRows(
  a: StudentAttendanceRow,
  b: StudentAttendanceRow,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    case "timeIn":
      return compareTimes(a.timeIn, b.timeIn) * factor
    case "timeOut":
      return compareTimes(a.timeOut, b.timeOut) * factor
    case "rfidStatus":
      return a.rfidStatus.localeCompare(b.rfidStatus) * factor
    case "smsStatus":
      return (a.smsStatus ?? "").localeCompare(b.smsStatus ?? "") * factor
    default:
      return a.date.localeCompare(b.date) * factor
  }
}

export function AttendanceHistoryTable({
  rows,
}: {
  rows: StudentAttendanceRow[]
}) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "date",
    direction: "desc",
  })
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<StudentAttendanceRow | null>(
    null
  )

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
        <CardTitle>Attendance history</CardTitle>
        <CardDescription>
          Every recorded tap day, newest first. Select a row for full details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No attendance records yet"
            description="History appears here once the first RFID tap is recorded."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="date"
                    label="Date"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
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
                  <SortableHeader
                    column="rfidStatus"
                    label="RFID Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="smsStatus"
                    label="SMS Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <TableHead className="px-3">
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-3 font-medium tabular-nums">
                      {formatDateValue(row.date)}
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
                    <TableCell className="hidden px-3 md:table-cell">
                      <RfidStatusBadge status={row.rfidStatus} />
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      {row.smsStatus ? (
                        <SmsStatusBadge status={row.smsStatus} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`View details for ${formatDateValue(row.date)}`}
                        onClick={() => setSelected(row)}
                      >
                        <Eye aria-hidden />
                      </Button>
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
            {formatNumber(sorted.length)} records
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <AttendanceDetailDialog
        record={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </Card>
  )
}
