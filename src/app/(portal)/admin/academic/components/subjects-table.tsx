"use client"

import * as React from "react"
import {
  Archive,
  ArchiveRestore,
  BookOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
} from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PILOT_PROGRAM_CODE } from "@/features/academic/pilot"
import {
  matchesStatusFilter,
  usageSentence,
  type CatalogStatusFilter,
  type CourseView,
  type ProgramView,
} from "@/features/academic/schema"
import { formatNumber } from "@/lib/format"

import { ArchiveDialog, type ArchiveTarget } from "./archive-dialog"
import { ScopeBadge } from "./catalog-parts"
import { FiltersBar } from "./filters-bar"
import { SubjectFormDialog } from "./subject-form-dialog"

type SortColumn = "code" | "program" | "assignments" | "schedules" | "status"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

const statusOrder: Record<CourseView["status"], number> = {
  active: 0,
  inactive: 1,
  archived: 2,
}

function compareRows(
  a: CourseView,
  b: CourseView,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "program":
      return (
        (collator.compare(a.programCode, b.programCode) ||
          collator.compare(a.code, b.code)) * factor
      )
    case "assignments":
      return (a.assignments - b.assignments) * factor
    case "schedules":
      return (a.schedules - b.schedules) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    default:
      return collator.compare(a.code, b.code) * factor
  }
}

function archiveTarget(course: CourseView): ArchiveTarget {
  const archived = course.status === "archived"
  const inUse = usageSentence(
    [
      [course.assignments, "active teaching assignment", "active teaching assignments"],
      [course.schedules, "active subject schedule", "active subject schedules"],
    ],
    "this subject"
  )

  return {
    kind: "course",
    id: course.id,
    name: course.code,
    archived,
    blocked:
      archived && course.programStatus === "archived"
        ? `Restore ${course.programCode} first. Its subjects cannot return while the program is archived.`
        : null,
    impact:
      !archived && inUse
        ? `${inUse} They keep working; the subject is just no longer offered for new ones.`
        : null,
  }
}

export function SubjectsTable({
  courses,
  programs,
}: {
  courses: CourseView[]
  programs: ProgramView[]
}) {
  const [search, setSearch] = React.useState("")
  const [program, setProgram] = React.useState("all")
  const [status, setStatus] = React.useState<CatalogStatusFilter>("current")
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "program",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [adding, setAdding] = React.useState(false)
  const [editing, setEditing] = React.useState<CourseView | null>(null)
  const [archiving, setArchiving] = React.useState<ArchiveTarget | null>(null)

  // New subjects can only join programs that are still in the catalog.
  const openPrograms = React.useMemo(
    () => programs.filter((row) => row.status !== "archived"),
    [programs]
  )
  const programOptions = React.useMemo(
    () =>
      programs.map((row) => ({
        value: String(row.id),
        label: row.status === "archived" ? `${row.code} (archived)` : row.code,
      })),
    [programs]
  )

  const sorted = React.useMemo(() => {
    const needle = search.trim().toLowerCase()

    return courses
      .filter(
        (course) =>
          (program === "all" || String(course.programId) === program) &&
          matchesStatusFilter(course.status, status) &&
          (!needle ||
            [course.code, course.name, course.programCode]
              .join(" ")
              .toLowerCase()
              .includes(needle))
      )
      .sort((a, b) => compareRows(a, b, sort.column, sort.direction))
  }, [courses, search, program, status, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)

  // New subjects start under the program being browsed, else the pilot program.
  const defaultProgramId = openPrograms.some((row) => String(row.id) === program)
    ? program
    : String(openPrograms.find((row) => row.isPilot)?.id ?? "")

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
        <CardDescription className="text-pretty">
          Subjects offered under each program. Active {PILOT_PROGRAM_CODE}{" "}
          subjects appear in teacher assignment pickers right away; archived
          subjects leave every picker.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            onClick={() => setAdding(true)}
            disabled={openPrograms.length === 0}
          >
            <Plus aria-hidden />
            Add Subject
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <FiltersBar
          idPrefix="subject"
          searchLabel="Search subjects"
          searchPlaceholder="Search code or name"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          programs={programOptions}
          program={program}
          onProgramChange={(value) => {
            setProgram(value)
            setPage(1)
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
          onClear={() => {
            setSearch("")
            setProgram("all")
            setStatus("current")
            setPage(1)
          }}
        />

        {visible.length === 0 ? (
          <EmptyState
            icon={courses.length > 0 ? Search : BookOpen}
            title={courses.length > 0 ? "No matching subjects" : "No subjects yet"}
            description={
              courses.length > 0
                ? "Adjust the search text, program, or status. Archived subjects appear under the Archived status."
                : "Add a subject to a program so teachers can be assigned to it."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table aria-label="Subjects">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="code"
                    label="Subject"
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
                    column="assignments"
                    label="Assignments"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="schedules"
                    label="Schedules"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 xl:table-cell"
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
                {visible.map((course) => {
                  const archived = course.status === "archived"

                  return (
                    <TableRow key={course.id}>
                      <TableCell className="px-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{course.code}</span>
                          <ScopeBadge assignable={course.isPilot} />
                        </div>
                        <p className="max-w-80 text-xs whitespace-normal text-muted-foreground">
                          {course.name}
                          <span className="md:hidden"> · {course.programCode}</span>
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-3 md:table-cell">
                        <Badge
                          variant="outline"
                          className="border-primary/25 bg-primary/5"
                          title={course.programName}
                        >
                          {course.programCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                        {formatNumber(course.assignments)}
                      </TableCell>
                      <TableCell className="hidden px-3 tabular-nums xl:table-cell">
                        {formatNumber(course.schedules)}
                      </TableCell>
                      <TableCell className="px-3">
                        <AccountStatusBadge status={course.status} />
                      </TableCell>
                      <TableCell className="px-3 text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${course.code}`}
                            >
                              <MoreHorizontal aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{course.code}</DropdownMenuLabel>
                            {!archived ? (
                              <>
                                <DropdownMenuItem onSelect={() => setEditing(course)}>
                                  <Pencil aria-hidden />
                                  Edit subject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            ) : null}
                            <DropdownMenuItem
                              variant={archived ? "default" : "destructive"}
                              onSelect={() => setArchiving(archiveTarget(course))}
                            >
                              {archived ? (
                                <>
                                  <ArchiveRestore aria-hidden />
                                  Restore subject
                                </>
                              ) : (
                                <>
                                  <Archive aria-hidden />
                                  Archive subject
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
            {formatNumber(sorted.length)} subjects
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <SubjectFormDialog
        open={adding}
        onOpenChange={setAdding}
        programs={openPrograms}
        defaultProgramId={defaultProgramId}
      />
      <SubjectFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        course={editing}
        programs={openPrograms}
      />
      <ArchiveDialog
        target={archiving}
        onOpenChange={(open) => {
          if (!open) setArchiving(null)
        }}
      />
    </Card>
  )
}
