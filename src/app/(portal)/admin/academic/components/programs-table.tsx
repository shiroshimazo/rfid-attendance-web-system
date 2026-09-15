"use client"

import * as React from "react"
import {
  Archive,
  ArchiveRestore,
  GraduationCap,
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
  programArchiveBlocker,
  type CatalogStatusFilter,
  type ProgramView,
} from "@/features/academic/schema"
import { formatNumber } from "@/lib/format"

import { ArchiveDialog, type ArchiveTarget } from "./archive-dialog"
import { ScopeBadge } from "./catalog-parts"
import { FiltersBar } from "./filters-bar"
import { ProgramFormDialog } from "./program-form-dialog"

type SortColumn = "code" | "name" | "courses" | "students" | "status"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

const statusOrder: Record<ProgramView["status"], number> = {
  active: 0,
  inactive: 1,
  archived: 2,
}

function compareRows(
  a: ProgramView,
  b: ProgramView,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "name":
      return collator.compare(a.name, b.name) * factor
    case "courses":
      return (a.usage.courses - b.usage.courses) * factor
    case "students":
      return (a.usage.students - b.usage.students) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    default:
      return collator.compare(a.code, b.code) * factor
  }
}

function archiveTarget(program: ProgramView): ArchiveTarget {
  const archived = program.status === "archived"

  return {
    kind: "program",
    id: program.id,
    name: program.code,
    archived,
    blocked: archived ? null : programArchiveBlocker(program),
    impact: null,
  }
}

export function ProgramsTable({ programs }: { programs: ProgramView[] }) {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<CatalogStatusFilter>("current")
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "code",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [adding, setAdding] = React.useState(false)
  const [editing, setEditing] = React.useState<ProgramView | null>(null)
  const [archiving, setArchiving] = React.useState<ArchiveTarget | null>(null)

  const sorted = React.useMemo(() => {
    const needle = search.trim().toLowerCase()

    return programs
      .filter(
        (program) =>
          matchesStatusFilter(program.status, status) &&
          (!needle ||
            [program.code, program.name, program.department ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(needle))
      )
      .sort((a, b) => compareRows(a, b, sort.column, sort.direction))
  }, [programs, search, status, sort])

  // Background refreshes keep the page; only filter changes return to page one.
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
        <CardTitle>Programs</CardTitle>
        <CardDescription className="text-pretty">
          Degree programs in the catalog. Only {PILOT_PROGRAM_CODE} can be
          assigned to students, teachers, and schedules during the pilot; other
          programs are stored for future use.
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus aria-hidden />
            Add Program
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <FiltersBar
          idPrefix="program"
          searchLabel="Search programs"
          searchPlaceholder="Search code, name, or department"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
          onClear={() => {
            setSearch("")
            setStatus("current")
            setPage(1)
          }}
        />

        {visible.length === 0 ? (
          <EmptyState
            icon={programs.length > 0 ? Search : GraduationCap}
            title={programs.length > 0 ? "No matching programs" : "No programs yet"}
            description={
              programs.length > 0
                ? "Adjust the search text or status. Archived programs appear under the Archived status."
                : "Add the first degree program to start the catalog."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table aria-label="Programs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="code"
                    label="Program"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="name"
                    label="Name"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <TableHead className="hidden px-3 xl:table-cell">
                    Department
                  </TableHead>
                  <SortableHeader
                    column="courses"
                    label="Subjects"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="students"
                    label="Students"
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
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((program) => {
                  const archived = program.status === "archived"

                  return (
                    <TableRow key={program.id}>
                      <TableCell className="px-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{program.code}</span>
                          <ScopeBadge assignable={program.isPilot} />
                        </div>
                        <p className="max-w-64 truncate text-xs text-muted-foreground md:hidden">
                          {program.name}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums lg:hidden">
                          {formatNumber(program.usage.courses)} subjects ·{" "}
                          {formatNumber(program.usage.students)} students
                        </p>
                      </TableCell>
                      <TableCell className="hidden max-w-72 px-3 whitespace-normal md:table-cell">
                        {program.name}
                      </TableCell>
                      <TableCell className="hidden px-3 text-muted-foreground xl:table-cell">
                        {program.department ?? "—"}
                      </TableCell>
                      <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                        {formatNumber(program.usage.courses)}
                      </TableCell>
                      <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                        {formatNumber(program.usage.students)}
                      </TableCell>
                      <TableCell className="px-3">
                        <AccountStatusBadge status={program.status} />
                      </TableCell>
                      <TableCell className="px-3 text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${program.code}`}
                            >
                              <MoreHorizontal aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{program.code}</DropdownMenuLabel>
                            {!archived ? (
                              <>
                                <DropdownMenuItem onSelect={() => setEditing(program)}>
                                  <Pencil aria-hidden />
                                  Edit program
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            ) : null}
                            <DropdownMenuItem
                              variant={archived ? "default" : "destructive"}
                              onSelect={() => setArchiving(archiveTarget(program))}
                            >
                              {archived ? (
                                <>
                                  <ArchiveRestore aria-hidden />
                                  Restore program
                                </>
                              ) : (
                                <>
                                  <Archive aria-hidden />
                                  Archive program
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
            {formatNumber(sorted.length)} programs
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <ProgramFormDialog open={adding} onOpenChange={setAdding} />
      <ProgramFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        program={editing}
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
