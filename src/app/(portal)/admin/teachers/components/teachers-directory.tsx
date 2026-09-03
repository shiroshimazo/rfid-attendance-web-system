"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  UserRoundX,
  UsersRound,
} from "lucide-react"

import {
  AccountStatusBadge,
  accountStatusLabels,
} from "@/components/account-status-badge"
import { EmptyState } from "@/components/empty-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import type { TeacherDirectory, TeacherView } from "@/features/teachers/directory"
import { accountStatuses } from "@/features/teachers/schema"
import { formatNumber, initialsOf } from "@/lib/format"

import { AssignmentBadges } from "./assignment-badges"
import { TeacherFormDialog } from "./teacher-form-dialog"
import { TeacherStatusDialog } from "./teacher-status-dialog"
import { TeacherViewDialog } from "./teacher-view-dialog"

type SortColumn = "name" | "teacherId" | "department" | "status"
type SortDirection = "asc" | "desc"

const pageSizes = [10, 25, 50] as const

const statusOrder: Record<TeacherView["status"], number> = {
  active: 0,
  inactive: 1,
  archived: 2,
}

function matchesQuery(teacher: TeacherView, needle: string) {
  if (!needle) return true

  const haystack = [
    teacher.fullName,
    teacher.teacherId,
    teacher.email,
    teacher.department,
    ...teacher.assignments.flatMap((assignment) => [
      assignment.programCode,
      assignment.programName,
      assignment.courseCode,
      assignment.courseName,
      assignment.yearLevel ?? "",
      assignment.section ?? "",
      assignment.campus ?? "",
    ]),
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(needle)
}

function compareTeachers(
  a: TeacherView,
  b: TeacherView,
  column: SortColumn,
  direction: SortDirection
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "teacherId":
      return a.teacherId.localeCompare(b.teacherId, undefined, {
        numeric: true,
      }) * factor
    case "department":
      return a.department.localeCompare(b.department) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    default:
      return a.fullName.localeCompare(b.fullName) * factor
  }
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
  const Icon = !isActive ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown

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

export function TeachersDirectory({ directory }: { directory: TeacherDirectory }) {
  const { teachers, programs, courses, departments } = directory

  const [query, setQuery] = React.useState("")
  const [department, setDepartment] = React.useState("all")
  const [program, setProgram] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [sort, setSort] = React.useState<{
    column: SortColumn
    direction: SortDirection
  }>({ column: "name", direction: "asc" })
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<number>(pageSizes[0])

  const [isAddOpen, setAddOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TeacherView | null>(null)
  const [viewing, setViewing] = React.useState<TeacherView | null>(null)
  const [statusTarget, setStatusTarget] = React.useState<TeacherView | null>(null)

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()

    return teachers
      .filter((teacher) => {
        if (department !== "all" && teacher.department !== department) return false
        if (status !== "all" && teacher.status !== status) return false
        if (
          program !== "all" &&
          !teacher.assignments.some(
            (assignment) => String(assignment.programId) === program
          )
        ) {
          return false
        }

        return matchesQuery(teacher, needle)
      })
      .sort((a, b) => compareTeachers(a, b, sort.column, sort.direction))
  }, [teachers, query, department, status, program, sort])

  // Any change to the result set restarts paging so the view never lands on a
  // page that no longer exists.
  React.useEffect(() => {
    setPage(1)
  }, [query, department, program, status, pageSize])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  function toggleSort(column: SortColumn) {
    setSort((current) =>
      current.column === column
        ? {
            column,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : { column, direction: "asc" }
    )
  }

  const filtersActive =
    query.trim() !== "" ||
    department !== "all" ||
    program !== "all" ||
    status !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher records</CardTitle>
        <CardDescription>
          {formatNumber(teachers.length)} teacher
          {teachers.length === 1 ? "" : "s"} with their programs, courses, and
          class assignments.
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus aria-hidden />
            Add Teacher
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Label htmlFor="teacher-search" className="sr-only">
              Search teachers
            </Label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="teacher-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, ID, email, or class"
              className="h-9 pl-8"
            />
          </div>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger aria-label="Filter by department" className="w-full">
              <SelectValue>
                {department === "all" ? "All departments" : department}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by status" className="w-full">
              <SelectValue>
                {status === "all"
                  ? "All statuses"
                  : accountStatusLabels[status as TeacherView["status"]]}
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

        {teachers.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="No teachers yet"
            description="Add the first teacher to create their login account and class assignments."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching teachers"
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
                    label="Teacher Name"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="teacherId"
                    label="Teacher ID"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="department"
                    label="Department"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <TableHead className="hidden px-3 lg:table-cell">
                    Teaching Assignments
                  </TableHead>
                  <TableHead className="hidden px-3 xl:table-cell">
                    Email
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
                {rows.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="px-3 text-right text-muted-foreground tabular-nums">
                      {formatNumber(start + index + 1)}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          {teacher.profilePicture ? (
                            <AvatarImage src={teacher.profilePicture} alt="" />
                          ) : null}
                          <AvatarFallback className="text-xs">
                            {initialsOf(teacher.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium">{teacher.fullName}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {teacher.teacherId} · {teacher.department}
                          </p>
                          <p className="hidden text-xs text-muted-foreground xl:hidden md:block">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums md:table-cell">
                      {teacher.teacherId}
                    </TableCell>
                    <TableCell className="hidden max-w-56 px-3 whitespace-normal lg:table-cell">
                      {teacher.department}
                    </TableCell>
                    <TableCell className="hidden px-3 whitespace-normal lg:table-cell">
                      <AssignmentBadges assignments={teacher.assignments} limit={2} />
                    </TableCell>
                    <TableCell className="hidden px-3 xl:table-cell">
                      {teacher.email}
                    </TableCell>
                    <TableCell className="px-3">
                      <AccountStatusBadge status={teacher.status} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label={`Actions for ${teacher.fullName}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setViewing(teacher)}>
                            <Eye aria-hidden />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setEditing(teacher)}>
                            <Pencil aria-hidden />
                            Edit teacher
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant={
                              teacher.status === "archived"
                                ? "default"
                                : "destructive"
                            }
                            onSelect={() => setStatusTarget(teacher)}
                          >
                            {teacher.status === "archived" ? (
                              <>
                                <RotateCcw aria-hidden />
                                Restore teacher
                              </>
                            ) : (
                              <>
                                <UserRoundX aria-hidden />
                                Archive teacher
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
          <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
            Showing {formatNumber(start + 1)}–{formatNumber(start + rows.length)}{" "}
            of {formatNumber(filtered.length)}
            {filtersActive ? " matching" : ""} teachers
          </p>

          <div className="flex items-center gap-2">
            <Label htmlFor="teacher-page-size" className="sr-only">
              Rows per page
            </Label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger id="teacher-page-size" size="sm" className="w-24">
                <SelectValue>{pageSize} rows</SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground tabular-nums">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Next page"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </CardFooter>
      ) : null}

      <TeacherFormDialog
        open={isAddOpen}
        onOpenChange={setAddOpen}
        programs={programs}
        courses={courses}
        departments={departments}
      />
      <TeacherFormDialog
        key={editing?.id ?? "edit"}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        teacher={editing}
        programs={programs}
        courses={courses}
        departments={departments}
      />
      <TeacherViewDialog
        teacher={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      />
      <TeacherStatusDialog
        teacher={statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
      />
    </Card>
  )
}
