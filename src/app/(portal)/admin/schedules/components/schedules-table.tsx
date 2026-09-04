"use client"

import * as React from "react"
import {
  CalendarOff,
  MoreHorizontal,
  Pencil,
  Power,
  PowerOff,
  Search,
  TriangleAlert,
} from "lucide-react"
import { toast } from "sonner"

import { AccountStatusBadge } from "@/components/account-status-badge"
import {
  SortableHeader,
  TablePagination,
  nextSortState,
  type SortState,
} from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { setScheduleStatusAction } from "@/features/schedules/actions"
import {
  dayShortLabel,
  type ScheduleDirectory,
  type ScheduleView,
} from "@/features/schedules/schema"
import { formatClockTime, formatNumber } from "@/lib/format"

import { ScheduleFormDialog } from "./schedule-form-dialog"

type SortColumn =
  | "section"
  | "session"
  | "timeStart"
  | "graceMinutes"
  | "lateCutoff"
  | "status"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

function compareRows(
  a: ScheduleView,
  b: ScheduleView,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "session":
      return collator.compare(a.session, b.session) * factor
    case "timeStart":
      return collator.compare(a.timeStart, b.timeStart) * factor
    case "graceMinutes":
      return (a.graceMinutes - b.graceMinutes) * factor
    case "lateCutoff":
      return collator.compare(a.lateCutoff, b.lateCutoff) * factor
    case "status":
      return collator.compare(a.status, b.status) * factor
    default:
      return collator.compare(a.section, b.section) * factor
  }
}

function ClassDays({ days }: { days: number[] }) {
  if (days.length === 0) {
    return <span className="text-sm text-muted-foreground">No class days</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => (
        <Badge key={day} variant="outline" className="px-1.5 font-normal">
          {dayShortLabel(day)}
        </Badge>
      ))}
    </div>
  )
}

export function SchedulesTable({ directory }: { directory: ScheduleDirectory }) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "section",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [editing, setEditing] = React.useState<ScheduleView | null>(null)
  const [pendingKey, setPendingKey] = React.useState<string | null>(null)

  const rows = directory.schedules

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

  async function toggleStatus(view: ScheduleView) {
    setPendingKey(view.key)

    const result = await setScheduleStatusAction({
      programId: view.programId,
      yearLevel: view.yearLevel,
      section: view.section,
      campus: view.campus,
      status: view.status === "active" ? "inactive" : "active",
    })

    setPendingKey(null)

    if (result.ok) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class schedules</CardTitle>
        <CardDescription>
          Late cutoff is the class start plus the grace window, in Philippines
          Time. Schedules are never deleted, so a missing row always means the
          section is deliberately outside the late rule.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {directory.unscheduledSections.length > 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground text-pretty">
            No schedule row yet for {directory.unscheduledSections.join(", ")}.
            Taps in those sections are recorded as Present.
          </p>
        ) : null}

        {visible.length === 0 ? (
          <EmptyState
            icon={directory.totalSections > 0 ? Search : CalendarOff}
            title={
              directory.totalSections > 0
                ? "No matching schedules"
                : "No schedules yet"
            }
            description={
              directory.totalSections > 0
                ? "Adjust the search text, session, or class day to widen the results."
                : "Run the pilot schedules migration before sections can be flagged Late."
            }
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="section"
                    label="Section"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="session"
                    label="Session"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 sm:table-cell"
                  />
                  <TableHead className="hidden px-3 lg:table-cell">
                    Class Days
                  </TableHead>
                  <SortableHeader
                    column="timeStart"
                    label="Time Start"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <TableHead className="hidden px-3 xl:table-cell">
                    Time End
                  </TableHead>
                  <SortableHeader
                    column="graceMinutes"
                    label="Grace"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="lateCutoff"
                    label="Late Cutoff"
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
                {visible.map((view) => (
                  <TableRow key={view.key}>
                    <TableCell className="px-3">
                      <p className="font-medium tabular-nums">{view.section}</p>
                      <p className="text-xs text-muted-foreground">
                        {view.programCode} · {view.yearLevel}
                        {view.campus ? ` · ${view.campus}` : ""}
                      </p>
                    </TableCell>
                    <TableCell className="hidden px-3 capitalize sm:table-cell">
                      {view.session}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      <ClassDays days={view.days} />
                    </TableCell>
                    <TableCell className="px-3 tabular-nums">
                      <span className="flex items-center gap-1.5">
                        {formatClockTime(view.timeStart)}
                        {view.hasVariance ? (
                          <TriangleAlert
                            aria-label="Class days disagree on start time or grace"
                            className="size-3.5 text-amber-600 dark:text-amber-400"
                          />
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums text-muted-foreground xl:table-cell">
                      {formatClockTime(view.timeEnd)}
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums md:table-cell">
                      {formatNumber(view.graceMinutes)} min
                    </TableCell>
                    <TableCell className="px-3 font-medium tabular-nums">
                      {formatClockTime(view.lateCutoff)}
                    </TableCell>
                    <TableCell className="px-3">
                      <AccountStatusBadge status={view.status} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={pendingKey === view.key}
                            aria-label={`Actions for section ${view.section}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Section {view.section}
                          </DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setEditing(view)}>
                            <Pencil aria-hidden />
                            Edit schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => {
                              void toggleStatus(view)
                            }}
                          >
                            {view.status === "active" ? (
                              <PowerOff aria-hidden />
                            ) : (
                              <Power aria-hidden />
                            )}
                            {view.status === "active"
                              ? "Deactivate schedule"
                              : "Activate schedule"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            {formatNumber(sorted.length)} sections
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <ScheduleFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        schedule={editing}
      />
    </Card>
  )
}
