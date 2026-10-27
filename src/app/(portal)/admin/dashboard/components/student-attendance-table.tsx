"use client"

import * as React from "react"
import { Search, UsersRound } from "lucide-react"

import {
  AttendanceStatusBadge,
  RfidStatusBadge,
} from "@/components/attendance-status-badge"
import { EmptyState } from "@/components/empty-state"
import { SearchTagInput } from "@/components/search-tag-input"
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
import { matchesAnySearchTagIn } from "@/lib/search-tags"

const PAGE_SIZE = 10

const statusFilters = ["All", "Present", "Late", "Absent", "NoRecord", "NoClasses", "OnlineManual"] as const

type StatusFilter = (typeof statusFilters)[number]

export function StudentAttendanceTable({
  students,
  today,
}: {
  students: StudentAttendanceRow[]
  today: string
}) {
  const [query, setQuery] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<StatusFilter>("All")
  const [visible, setVisible] = React.useState(PAGE_SIZE)

  const filtered = React.useMemo(() => {
    return students.filter((student) => {
      if (status !== "All" && student.status !== status) return false

      return matchesAnySearchTagIn(
        [student.name, student.studentId, student.section, student.yearLevel],
        query
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
            <SearchTagInput
              id="student-search"
              label="Search students"
              value={query}
              onValueChange={setQuery}
              placeholder="Search name, ID, or section"
              size="sm"
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
                  {option === "All" ? "All statuses" : option === "NoRecord" ? "No tap recorded yet" : option === "NoClasses" ? "No classes" : option === "OnlineManual" ? "Online / manual" : option}
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
                  <TableHead className="px-3">Program</TableHead>
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
                    <TableCell className="px-3">{student.programCode}</TableCell>
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
