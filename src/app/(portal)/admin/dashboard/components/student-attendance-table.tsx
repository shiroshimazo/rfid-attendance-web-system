"use client"

import * as React from "react"
import { Search, UsersRound } from "lucide-react"

import {
  AttendanceStatusBadge,
  RfidStatusBadge,
} from "@/components/attendance-status-badge"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StudentAttendanceRow } from "@/features/attendance/dashboard"
import { formatClockTime, formatNumber } from "@/lib/format"

const PAGE_SIZE = 10

const statusFilters = ["All", "Present", "Late", "Absent", "NoRecord"] as const

type StatusFilter = (typeof statusFilters)[number]

export function StudentAttendanceTable({
  students,
  today,
}: {
  students: StudentAttendanceRow[]
  today: string
}) {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("All")
  const [visible, setVisible] = React.useState(PAGE_SIZE)

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()

    return students.filter((student) => {
      if (status !== "All" && student.status !== status) return false
      if (!needle) return true

      return (
        student.name.toLowerCase().includes(needle) ||
        student.studentId.toLowerCase().includes(needle) ||
        student.section.toLowerCase().includes(needle) ||
        student.yearLevel.toLowerCase().includes(needle)
      )
    })
  }, [students, query, status])

  // Any filter change restarts paging so the list never opens mid-way down.
  React.useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [query, status])

  const rows = filtered.slice(0, visible)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance Status</CardTitle>
        <CardDescription>
          Live time-in and time-out records for {today}
        </CardDescription>
        <CardAction className="col-start-1 row-start-3 flex w-full flex-col gap-2 justify-self-stretch sm:col-start-2 sm:row-start-1 sm:w-auto sm:flex-row sm:items-center sm:justify-self-end">
          <div className="relative w-full sm:w-56">
            <Label htmlFor="student-search" className="sr-only">
              Search students
            </Label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="student-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, ID, or section"
              className="h-8 pl-8"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Filter by attendance status"
              className="w-full sm:w-48"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {statusFilters.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All statuses" : option === "NoRecord" ? "No tap recorded yet" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        {students.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="No active students"
            description="Add students in Manage Students to start tracking attendance."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching students"
            description="Adjust the search text or status filter to widen the results."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-3">Name</TableHead>
                  <TableHead className="hidden px-3 md:table-cell">
                    Year Level
                  </TableHead>
                  <TableHead className="hidden px-3 lg:table-cell">
                    Section
                  </TableHead>
                  <TableHead className="px-3">Attendance Status</TableHead>
                  <TableHead className="px-3 text-right">Time In</TableHead>
                  <TableHead className="px-3 text-right">Time Out</TableHead>
                  <TableHead className="hidden px-3 sm:table-cell">
                    RFID Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((student) => (
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
                    <TableCell className="px-3 text-right tabular-nums">
                      {formatClockTime(student.timeIn)}
                    </TableCell>
                    <TableCell className="px-3 text-right tabular-nums">
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

      {rows.length > 0 ? (
        <CardFooter className="justify-between gap-3">
          <p
            aria-live="polite"
            className="text-sm text-muted-foreground tabular-nums"
          >
            Showing {formatNumber(rows.length)} of {formatNumber(filtered.length)}{" "}
            students
          </p>
          {visible < filtered.length ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisible((current) => current + PAGE_SIZE)}
            >
              Show more
            </Button>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}
