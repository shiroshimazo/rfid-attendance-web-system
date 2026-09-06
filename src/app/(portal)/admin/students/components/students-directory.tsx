"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  ScanLine,
  Search,
  UserRoundX,
} from "lucide-react"

import {
  AccountStatusBadge,
  accountStatusLabels,
} from "@/components/account-status-badge"
import { RfidStatusBadge } from "@/components/attendance-status-badge"
import { EmptyState } from "@/components/empty-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import type { StudentDirectory, StudentView } from "@/features/students/directory"
import { formatNumber, initialsOf } from "@/lib/format"
import { normalizeRfidUid } from "@/lib/rfid-uid"

import { RfidAssignDialog } from "./rfid-assign-dialog"
import { StudentArchiveDialog } from "./student-archive-dialog"
import { StudentFormDialog } from "./student-form-dialog"
import { StudentViewDialog } from "./student-view-dialog"

type SortColumn =
  | "name"
  | "studentId"
  | "program"
  | "yearLevel"
  | "section"
  | "status"
type SortDirection = "asc" | "desc"

const PAGE_SIZE = 10

const statusOrder: Record<StudentView["status"], number> = {
  active: 0,
  inactive: 1,
  archived: 2,
}

const collator = new Intl.Collator(undefined, { numeric: true })

function matchesQuery(student: StudentView, needle: string) {
  if (!needle) return true
  const uid = normalizeRfidUid(needle)
  if (uid && student.cards.some(card => normalizeRfidUid(card.rfidNumber) === uid)) return true

  return [
    student.fullName,
    student.studentId,
    student.email,
    student.programCode,
    student.programName,
    student.yearLevel,
    student.section,
    student.campus,
    student.parentName,
    ...student.cards.map((card) => card.rfidNumber),
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle)
}

function compareStudents(
  a: StudentView,
  b: StudentView,
  column: SortColumn,
  direction: SortDirection
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "studentId":
      return collator.compare(a.studentId, b.studentId) * factor
    case "program":
      return collator.compare(a.programCode, b.programCode) * factor
    case "yearLevel":
      return collator.compare(a.yearLevel, b.yearLevel) * factor
    case "section":
      return collator.compare(a.section, b.section) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    default:
      return collator.compare(a.fullName, b.fullName) * factor
  }
}

/** Page numbers around the current page, with gaps marked by `null`. */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? [null, page] : [page]
  )
}

function SortableHeader({
  column,
  label,
  sort,
  onSort,
  className,
}: {
  column: SortColumn
  label: string
  sort: { column: SortColumn; direction: SortDirection }
  onSort: (column: SortColumn) => void
  className?: string
}) {
  const isActive = sort.column === column
  const Icon = !isActive
    ? ArrowUpDown
    : sort.direction === "asc"
      ? ArrowUp
      : ArrowDown

  return (
    <TableHead
      className={className}
      aria-sort={
        isActive
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 px-2"
        onClick={() => onSort(column)}
      >
        {label}
        <Icon aria-hidden className="text-muted-foreground" />
        <span className="sr-only">
          {isActive && sort.direction === "asc"
            ? `Sorted by ${label} ascending. Activate to sort descending.`
            : `Sort by ${label}`}
        </span>
      </Button>
    </TableHead>
  )
}

export function StudentsDirectory({
  directory,
}: {
  directory: StudentDirectory
}) {
  const { students, programs, yearLevels, sections } = directory

  const [query, setQuery] = React.useState("")
  const [program, setProgram] = React.useState("all")
  const [yearLevel, setYearLevel] = React.useState("all")
  const [section, setSection] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [sort, setSort] = React.useState<{
    column: SortColumn
    direction: SortDirection
  }>({ column: "name", direction: "asc" })
  const [page, setPage] = React.useState(1)

  const [isAddOpen, setAddOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<StudentView | null>(null)
  const [viewing, setViewing] = React.useState<StudentView | null>(null)
  const [archiving, setArchiving] = React.useState<StudentView | null>(null)
  const [assigning, setAssigning] = React.useState<StudentView | null>(null)

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()

    return students
      .filter((student) => {
        if (program !== "all" && String(student.programId) !== program) {
          return false
        }
        if (yearLevel !== "all" && student.yearLevel !== yearLevel) return false
        if (section !== "all" && student.section !== section) return false
        if (status !== "all" && student.status !== status) return false

        return matchesQuery(student, needle)
      })
      .sort((a, b) => compareStudents(a, b, sort.column, sort.direction))
  }, [students, query, program, yearLevel, section, status, sort])

  // Any change to the result set restarts paging so the view never lands on a
  // page that no longer exists.
  React.useEffect(() => {
    setPage(1)
  }, [query, program, yearLevel, section, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((current) =>
      current.column === column
        ? { column, direction: current.direction === "asc" ? "desc" : "asc" }
        : { column, direction: "asc" }
    )
  }

  function goToPage(next: number) {
    setPage(Math.min(Math.max(next, 1), pageCount))
  }

  const filtersActive =
    query.trim() !== "" ||
    program !== "all" ||
    yearLevel !== "all" ||
    section !== "all" ||
    status !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student records</CardTitle>
        <CardDescription>
          {formatNumber(students.length)} student
          {students.length === 1 ? "" : "s"} with their program, section, and
          RFID card assignment.
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus aria-hidden />
            Add Student
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="relative">
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
              placeholder="Search name, ID, or RFID"
              className="h-9 pl-8"
            />
          </div>

          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger aria-label="Filter by program" className="w-full">
              <SelectValue>
                {program === "all"
                  ? "All programs"
                  : (programs.find((option) => String(option.id) === program)
                      ?.code ?? "All programs")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {programs.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearLevel} onValueChange={setYearLevel}>
            <SelectTrigger aria-label="Filter by year level" className="w-full">
              <SelectValue>
                {yearLevel === "all" ? "All year levels" : yearLevel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All year levels</SelectItem>
              {yearLevels.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={section} onValueChange={setSection}>
            <SelectTrigger aria-label="Filter by section" className="w-full">
              <SelectValue>
                {section === "all" ? "All sections" : section}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {sections.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by status" className="w-full">
              <SelectValue>
                {status === "all"
                  ? "All statuses"
                  : accountStatusLabels[status as StudentView["status"]]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {accountStatuses.map((option) => (
                <SelectItem key={option} value={option}>
                  {accountStatusLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {students.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No students yet"
            description="Add the first student to create their login account and academic record."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching students"
            description="Adjust the search text or filters to widen the results."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 px-3 text-right">No.</TableHead>
                  <SortableHeader
                    column="name"
                    label="Student"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="studentId"
                    label="Student ID"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="program"
                    label="Program"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
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
                    className="hidden px-3 xl:table-cell"
                  />
                  <TableHead className="hidden px-3 lg:table-cell">
                    RFID Number
                  </TableHead>
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
                {rows.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="px-3 text-right text-muted-foreground tabular-nums">
                      {formatNumber(start + index + 1)}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          {student.profilePicture ? (
                            <AvatarImage src={student.profilePicture} alt="" />
                          ) : null}
                          <AvatarFallback className="text-xs">
                            {initialsOf(student.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {student.studentId} · {student.programCode} ·{" "}
                            {student.section}
                          </p>
                          <p className="hidden text-xs text-muted-foreground md:block">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums md:table-cell">
                      {student.studentId}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      <Badge
                        variant="outline"
                        className="border-primary/25 bg-primary/5"
                        title={student.programName}
                      >
                        {student.programCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {student.yearLevel}
                    </TableCell>
                    <TableCell className="hidden px-3 xl:table-cell">
                      {student.section}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {student.activeCard ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs tabular-nums">
                            {student.activeCard.rfidNumber}
                          </span>
                          <RfidStatusBadge
                            status={student.activeCard.cardStatus}
                          />
                        </div>
                      ) : (
                        <RfidStatusBadge status="Unassigned" />
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <AccountStatusBadge status={student.status} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${student.fullName}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setViewing(student)}>
                            <Eye aria-hidden />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setEditing(student)}>
                            <Pencil aria-hidden />
                            Edit student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setAssigning(student)}
                          >
                            <ScanLine aria-hidden />
                            {student.activeCard
                              ? "Re-issue RFID card"
                              : "Assign RFID card"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant={
                              student.status === "archived"
                                ? "default"
                                : "destructive"
                            }
                            onSelect={() => setArchiving(student)}
                          >
                            {student.status === "archived" ? (
                              <>
                                <RotateCcw aria-hidden />
                                Restore student
                              </>
                            ) : (
                              <>
                                <UserRoundX aria-hidden />
                                Archive student
                              </>
                            )}
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

      {rows.length > 0 ? (
        <CardFooter className="flex-wrap justify-between gap-3">
          <p
            aria-live="polite"
            className="text-sm text-muted-foreground tabular-nums"
          >
            Showing {formatNumber(start + 1)}–{formatNumber(start + rows.length)}{" "}
            of {formatNumber(filtered.length)}
            {filtersActive ? " matching" : ""} students
          </p>

          {pageCount > 1 ? (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage <= 1}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault()
                      goToPage(currentPage - 1)
                    }}
                  />
                </PaginationItem>

                {pageWindow(currentPage, pageCount).map((entry, index) => (
                  <PaginationItem key={entry ?? `gap-${index}`}>
                    {entry === null ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={entry === currentPage}
                        aria-label={`Go to page ${entry}`}
                        className="tabular-nums"
                        onClick={(event) => {
                          event.preventDefault()
                          goToPage(entry)
                        }}
                      >
                        {entry}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={currentPage >= pageCount}
                    className={
                      currentPage >= pageCount
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault()
                      goToPage(currentPage + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </CardFooter>
      ) : null}

      <StudentFormDialog
        open={isAddOpen}
        onOpenChange={setAddOpen}
        programs={programs}
      />
      <StudentFormDialog
        key={editing?.id ?? "edit"}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        student={editing}
        programs={programs}
      />
      <StudentViewDialog
        student={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      />
      <RfidAssignDialog
        student={assigning}
        onOpenChange={(open) => {
          if (!open) setAssigning(null)
        }}
      />
      <StudentArchiveDialog
        student={archiving}
        onOpenChange={(open) => {
          if (!open) setArchiving(null)
        }}
      />
    </Card>
  )
}
