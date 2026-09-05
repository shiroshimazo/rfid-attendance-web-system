"use client"

import * as React from "react"
import { GraduationCap, Search } from "lucide-react"

import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
import {
  SortableHeader,
  TablePagination,
  nextSortState,
  type SortState,
} from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  TeacherStudentRow,
  TeacherStudentsOptions,
} from "@/features/students/teacher-directory"
import { formatNumber, initialsOf } from "@/lib/format"

import {
  emptyStudentsFilters,
  FiltersBar,
  isStudentsFiltered,
} from "./filters-bar"
import { StudentViewButton, StudentViewDialog } from "./student-view-dialog"

type SortColumn =
  | "name"
  | "studentId"
  | "program"
  | "yearLevel"
  | "section"
  | "status"

const PAGE_SIZE = 10

const statusOrder: Record<TeacherStudentRow["status"], number> = {
  Present: 0,
  Late: 1,
  LegacyRecord: 4,
  Absent: 3,
  NoRecord: 4,
}

const collator = new Intl.Collator(undefined, { numeric: true })

function matchesQuery(student: TeacherStudentRow, needle: string) {
  if (!needle) return true

  return [student.fullName, student.studentId]
    .join(" ")
    .toLowerCase()
    .includes(needle)
}

function compareStudents(
  a: TeacherStudentRow,
  b: TeacherStudentRow,
  column: SortColumn,
  direction: "asc" | "desc"
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

export function StudentsTable({
  students,
  options,
  hasStudents,
}: {
  students: TeacherStudentRow[]
  options: TeacherStudentsOptions
  hasStudents: boolean
}) {
  const [filters, setFilters] = React.useState(emptyStudentsFilters)
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "name",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [viewing, setViewing] = React.useState<TeacherStudentRow | null>(null)

  const filtered = React.useMemo(() => {
    const needle = filters.search.trim().toLowerCase()

    return students
      .filter((student) => {
        if (
          filters.program !== "all" &&
          String(student.programId) !== filters.program
        ) {
          return false
        }
        if (filters.yearLevel !== "all" && student.yearLevel !== filters.yearLevel) {
          return false
        }
        if (filters.section !== "all" && student.section !== filters.section) {
          return false
        }
        if (filters.status !== "all" && student.status !== filters.status) {
          return false
        }

        return matchesQuery(student, needle)
      })
      .sort((a, b) => compareStudents(a, b, sort.column, sort.direction))
  }, [students, filters, sort])

  // Any change to the result set restarts paging so the view never lands on a
  // page that no longer exists.
  React.useEffect(() => {
    setPage(1)
  }, [filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  const filtersActive = isStudentsFiltered(filters)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned students</CardTitle>
        <CardDescription>
          {formatNumber(students.length)} assigned student
          {students.length === 1 ? "" : "s"} with today&apos;s attendance
          status.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FiltersBar
          filters={filters}
          onChange={setFilters}
          options={options}
        />

        {!hasStudents ? (
          <EmptyState
            icon={GraduationCap}
            title="No assigned students"
            description="Students in your class assignments appear here once enrolled."
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
                  <SortableHeader
                    column="name"
                    label="Student Name"
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
                  <SortableHeader
                    column="status"
                    label="Attendance Status"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((student) => (
                  <TableRow key={student.id}>
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
                    <TableCell className="px-3">
                      <AttendanceStatusBadge status={student.status} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <StudentViewButton
                        onView={() => setViewing(student)}
                      />
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
            Showing {formatNumber(start + 1)}–
            {formatNumber(start + rows.length)} of{" "}
            {formatNumber(filtered.length)}
            {filtersActive ? " matching" : ""} students
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <StudentViewDialog
        student={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      />
    </Card>
  )
}
