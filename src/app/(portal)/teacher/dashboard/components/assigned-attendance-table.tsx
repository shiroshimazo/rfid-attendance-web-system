"use client"

import * as React from "react"
import { UsersRound } from "lucide-react"

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
  AttendanceStatus,
  StudentRfidStatus,
  TeacherStudentAttendanceRow,
} from "@/features/attendance/teacher-dashboard"
import { formatClockTime, formatNumber } from "@/lib/format"

type SortColumn =
  | "name"
  | "yearLevel"
  | "section"
  | "status"
  | "timeIn"
  | "timeOut"
  | "rfidStatus"

const PAGE_SIZE = 10

const statusOrder: Record<AttendanceStatus, number> = {
  Present: 0,
  Late: 1,
  Excused: 2,
  Absent: 3,
}

const rfidOrder: Record<StudentRfidStatus, number> = {
  Active: 0,
  Inactive: 1,
  Lost: 2,
  Deactivated: 3,
  Unassigned: 4,
}

const collator = new Intl.Collator(undefined, { numeric: true })

function compareTimes(a: string | null, b: string | null) {
  if (a === b) return 0
  if (a === null) return 1
  if (b === null) return -1

  return a.localeCompare(b)
}

function compareRows(
  a: TeacherStudentAttendanceRow,
  b: TeacherStudentAttendanceRow,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
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
    case "rfidStatus":
      return (rfidOrder[a.rfidStatus] - rfidOrder[b.rfidStatus]) * factor
    default:
      return collator.compare(a.name, b.name) * factor
  }
}

export function AssignedAttendanceTable({
  students,
  today,
}: {
  students: TeacherStudentAttendanceRow[]
  today: string
}) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "name",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)

  const sorted = React.useMemo(
    () =>
      [...students].sort((a, b) => compareRows(a, b, sort.column, sort.direction)),
    [students, sort]
  )

  React.useEffect(() => {
    setPage(1)
  }, [students])

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
        <CardTitle>Today&apos;s Assigned Attendance</CardTitle>
        <CardDescription>
          Time-in and time-out taps for assigned students on {today}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="No assigned students"
            description="Students in your class assignments appear here once enrolled."
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
                    column="yearLevel"
                    label="Year Level"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
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
                    className="hidden px-3 sm:table-cell"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="px-3">
                      <span className="font-medium">{student.name}</span>
                      <span className="block text-xs text-muted-foreground tabular-nums md:hidden">
                        {student.studentId} · {student.yearLevel} ·{" "}
                        {student.section}
                      </span>
                      <span className="hidden text-xs text-muted-foreground tabular-nums md:block">
                        {student.studentId}
                      </span>
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      {student.yearLevel}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {student.section}
                    </TableCell>
                    <TableCell className="px-3">
                      <AttendanceStatusBadge status={student.status} />
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums sm:table-cell">
                      {formatClockTime(student.timeIn)}
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums sm:table-cell">
                      {formatClockTime(student.timeOut)}
                    </TableCell>
                    <TableCell className="hidden px-3 sm:table-cell">
                      <RfidStatusBadge status={student.rfidStatus} />
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
