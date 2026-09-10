"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarOff,
  MoreHorizontal,
  Pencil,
  Plus,
  PowerOff,
  RotateCcw,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import {
  AccountStatusBadge,
  accountStatusLabels,
} from "@/components/account-status-badge"
import {
  SortableHeader,
  TablePagination,
  nextSortState,
  type SortState,
} from "@/components/data-table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { accountStatuses } from "@/features/shared/schema"
import { retireSubjectScheduleAction } from "@/features/subject-attendance/actions"
import {
  weekdayLabel,
  weekdays,
  type SubjectSchedule,
} from "@/features/subject-attendance/model"
import {
  SubjectScheduleFormDialog,
  schedulableAssignments,
} from "@/features/subject-attendance/schedule-form-dialog"
import { SubjectScheduleTimeDialog } from "@/features/subject-attendance/schedule-time-dialog"
import type { SubjectAssignment } from "@/services/attendance/subject-attendance"
import { formatClockTime, formatNumber } from "@/lib/format"

type SortColumn = "teacher" | "course" | "section" | "campus" | "day" | "time" | "status"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

function compareRows(
  a: SubjectSchedule,
  b: SubjectSchedule,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "teacher":
      return collator.compare(a.teacher?.full_name ?? "", b.teacher?.full_name ?? "") * factor
    case "course":
      return collator.compare(a.course?.course_code ?? "", b.course?.course_code ?? "") * factor
    case "campus":
      return collator.compare(a.campus, b.campus) * factor
    case "day":
      return (a.day_of_week - b.day_of_week) * factor
    case "time":
      return collator.compare(a.time_start, b.time_start) * factor
    case "status":
      return collator.compare(a.status, b.status) * factor
    default:
      return collator.compare(a.section, b.section) * factor
  }
}

/** One lowercase haystack per row so the search box can stay a substring match. */
function searchText(row: SubjectSchedule) {
  return [
    row.teacher?.full_name,
    row.course?.course_code,
    row.course?.course_name,
    row.section,
    row.campus,
    row.year_level,
    weekdayLabel(row.day_of_week),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export function SubjectSchedulesEditor({
  assignments,
  schedules,
}: {
  assignments: SubjectAssignment[]
  schedules: SubjectSchedule[]
}) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [day, setDay] = React.useState("all")
  const [campus, setCampus] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "day",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [adding, setAdding] = React.useState(false)
  const [editing, setEditing] = React.useState<SubjectSchedule | null>(null)
  const [pendingId, setPendingId] = React.useState<number | null>(null)

  const choices = React.useMemo(
    () => schedulableAssignments(assignments),
    [assignments]
  )

  // Only campuses that actually appear can be filtered, so no option is a dead end.
  const campuses = React.useMemo(
    () => [...new Set(schedules.map((row) => row.campus))].sort((a, b) => collator.compare(a, b)),
    [schedules]
  )

  const isFiltered =
    search.trim() !== "" || day !== "all" || campus !== "all" || status !== "all"

  const filtered = React.useMemo(() => {
    const needle = search.trim().toLowerCase()

    return schedules.filter((row) => {
      if (needle && !searchText(row).includes(needle)) return false
      if (day !== "all" && String(row.day_of_week) !== day) return false
      if (campus !== "all" && row.campus !== campus) return false
      if (status !== "all" && row.status !== status) return false
      return true
    })
  }, [schedules, search, day, campus, status])

  const sorted = React.useMemo(
    () => [...filtered].sort((a, b) => compareRows(a, b, sort.column, sort.direction)),
    [filtered, sort]
  )

  React.useEffect(() => {
    setPage(1)
  }, [search, day, campus, status, schedules])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  function resetFilters() {
    setSearch("")
    setDay("all")
    setCampus("all")
    setStatus("all")
  }

  async function retire(row: SubjectSchedule) {
    setPendingId(row.id)

    try {
      const result = await retireSubjectScheduleAction(row.id)

      if (result.ok) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Could not retire the subject schedule. Refresh and try again.")
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Subject Session Schedules</CardTitle>
        <CardDescription>
          Each subject&apos;s weekday and time, taken from an existing teaching
          assignment. These scheduled times are separate from RFID
          arrival/departure times. Retiring a schedule preserves its
          confirmations.
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            onClick={() => setAdding(true)}
            disabled={choices.length === 0}
          >
            <Plus aria-hidden />
            Add subject schedule
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {choices.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground text-pretty">
            No schedulable assignments yet. Add an active teacher assignment with
            an explicit section and campus first.
          </p>
        ) : null}

        <div role="search" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Label htmlFor="subject-schedule-search" className="sr-only">
              Search subject schedules
            </Label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="subject-schedule-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teacher, subject, section"
              className="h-9 pl-8"
            />
          </div>

          <Select value={day} onValueChange={setDay}>
            <SelectTrigger aria-label="Filter by weekday" className="w-full">
              <SelectValue>
                {day === "all" ? "All days" : weekdayLabel(Number(day))}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All days</SelectItem>
              {weekdays.map((label, index) => (
                <SelectItem key={label} value={String(index)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={campus} onValueChange={setCampus}>
            <SelectTrigger aria-label="Filter by campus" className="w-full">
              <SelectValue>
                {campus === "all" ? "All campuses" : campus}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All campuses</SelectItem>
              {campuses.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Filter by status" className="w-full">
                <SelectValue>
                  {status === "all"
                    ? "All status"
                    : accountStatusLabels[
                        status as (typeof accountStatuses)[number]
                      ]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {accountStatuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {accountStatusLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isFiltered ? (
              <Button
                variant="outline"
                size="icon"
                aria-label="Clear filters"
                onClick={resetFilters}
              >
                <RotateCcw aria-hidden />
              </Button>
            ) : null}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={schedules.length > 0 ? Search : CalendarOff}
            title={
              schedules.length > 0
                ? "No matching subject schedules"
                : "No subject schedules yet"
            }
            description={
              schedules.length > 0
                ? "Adjust the search text, weekday, campus, or status to widen the results."
                : "Add a subject schedule to give a teaching assignment its weekly session time."
            }
          />
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border">
            <Table aria-label="Subject Session Schedules">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="teacher"
                    label="Name"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="course"
                    label="Subject Code"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="section"
                    label="Section"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 sm:table-cell"
                  />
                  <SortableHeader
                    column="campus"
                    label="Campus"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="day"
                    label="Day"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="time"
                    label="Time"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="status"
                    label="Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-3">
                      <p className="font-medium">
                        {row.teacher?.full_name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {row.section} · {row.campus}
                      </p>
                    </TableCell>
                    <TableCell className="px-3">
                      <p className="font-medium">
                        {row.course?.course_code ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.course?.course_name ?? ""}
                      </p>
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums sm:table-cell">
                      {row.section}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {row.campus}
                    </TableCell>
                    <TableCell className="px-3">
                      {weekdayLabel(row.day_of_week)}
                    </TableCell>
                    <TableCell className="px-3 tabular-nums">
                      {formatClockTime(row.time_start)} –{" "}
                      {formatClockTime(row.time_end)}
                      <span className="ml-1 text-xs text-muted-foreground">
                        PHT
                      </span>
                    </TableCell>
                    <TableCell className="px-3">
                      <AccountStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      {row.status === "active" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={pendingId === row.id}
                              aria-label={`Actions for ${row.course?.course_code ?? "subject"} on ${weekdayLabel(row.day_of_week)}`}
                            >
                              <MoreHorizontal aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {row.course?.course_code ?? "Subject"} ·{" "}
                              {row.section}
                            </DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => setEditing(row)}>
                              <Pencil aria-hidden />
                              Edit schedule time
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => {
                                void retire(row)
                              }}
                            >
                              <PowerOff aria-hidden />
                              Retire schedule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
            {formatNumber(sorted.length)} schedules
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <SubjectScheduleFormDialog
        open={adding}
        onOpenChange={setAdding}
        assignments={assignments}
        onCreated={() => router.refresh()}
      />

      <SubjectScheduleTimeDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        schedule={editing}
        onSaved={() => router.refresh()}
      />
    </Card>
  )
}
