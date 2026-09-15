"use client"

import * as React from "react"
import {
  Archive,
  ArchiveRestore,
  Layers,
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
import {
  matchesStatusFilter,
  pilotGroupingScope,
  usageSentence,
  type CatalogStatusFilter,
  type ProgramView,
  type SectionView,
} from "@/features/academic/schema"
import { formatNumber } from "@/lib/format"

import { ArchiveDialog, type ArchiveTarget } from "./archive-dialog"
import { ScopeBadge } from "./catalog-parts"
import { FiltersBar } from "./filters-bar"
import { SectionFormDialog } from "./section-form-dialog"

type SortColumn = "section" | "program" | "yearLevel" | "campus" | "students" | "status"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

const statusOrder: Record<SectionView["status"], number> = {
  active: 0,
  inactive: 1,
  archived: 2,
}

function compareRows(
  a: SectionView,
  b: SectionView,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1
  const bySection =
    collator.compare(a.sectionCode, b.sectionCode) || collator.compare(a.campus, b.campus)

  switch (column) {
    case "program":
      return (collator.compare(a.programCode, b.programCode) || bySection) * factor
    case "yearLevel":
      return (collator.compare(a.yearLevel, b.yearLevel) || bySection) * factor
    case "campus":
      return (collator.compare(a.campus, b.campus) || bySection) * factor
    case "students":
      return (a.students - b.students) * factor
    case "status":
      return (statusOrder[a.status] - statusOrder[b.status]) * factor
    default:
      return bySection * factor
  }
}

function archiveTarget(section: SectionView): ArchiveTarget {
  const archived = section.status === "archived"
  const inUse = usageSentence(
    [
      [section.students, "student", "students"],
      [section.assignments, "active teaching assignment", "active teaching assignments"],
    ],
    "this grouping"
  )

  return {
    kind: "section",
    id: section.id,
    name: `Section ${section.sectionCode} (${section.campus})`,
    archived,
    blocked:
      archived && section.programStatus === "archived"
        ? `Restore ${section.programCode} first. Its class groupings cannot return while the program is archived.`
        : null,
    impact:
      !archived && inUse
        ? `${inUse} They keep their placement; the grouping is just no longer offered for new picks.`
        : null,
  }
}

export function SectionsTable({
  sections,
  programs,
  yearLevels,
  campuses,
}: {
  sections: SectionView[]
  programs: ProgramView[]
  yearLevels: string[]
  campuses: string[]
}) {
  const [search, setSearch] = React.useState("")
  const [program, setProgram] = React.useState("all")
  const [status, setStatus] = React.useState<CatalogStatusFilter>("current")
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "section",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [adding, setAdding] = React.useState(false)
  const [editing, setEditing] = React.useState<SectionView | null>(null)
  const [archiving, setArchiving] = React.useState<ArchiveTarget | null>(null)

  // New groupings can only join programs that are still in the catalog.
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

    return sections
      .filter(
        (section) =>
          (program === "all" || String(section.programId) === program) &&
          matchesStatusFilter(section.status, status) &&
          (!needle ||
            [section.sectionCode, section.yearLevel, section.campus, section.programCode]
              .join(" ")
              .toLowerCase()
              .includes(needle))
      )
      .sort((a, b) => compareRows(a, b, sort.column, sort.direction))
  }, [sections, search, program, status, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)

  // New groupings start under the program being browsed, else the pilot program.
  const defaultProgramId = openPrograms.some((row) => String(row.id) === program)
    ? program
    : String(openPrograms.find((row) => row.isPilot)?.id ?? "")

  function toggleSort(column: SortColumn) {
    setSort((current) => nextSortState(current, column))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Groupings</CardTitle>
        <CardDescription className="text-pretty">
          Year level, section, and campus combinations offered in the student
          and teacher pickers. During the pilot only {pilotGroupingScope} can be
          assigned; other groupings are stored for future use.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            onClick={() => setAdding(true)}
            disabled={openPrograms.length === 0}
          >
            <Plus aria-hidden />
            Add Class Grouping
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <FiltersBar
          idPrefix="section"
          searchLabel="Search class groupings"
          searchPlaceholder="Search section, year level, or campus"
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
            icon={sections.length > 0 ? Search : Layers}
            title={
              sections.length > 0
                ? "No matching class groupings"
                : "No class groupings yet"
            }
            description={
              sections.length > 0
                ? "Adjust the search text, program, or status. Archived groupings appear under the Archived status."
                : "Add a class grouping so it can be offered in the student and teacher pickers."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table aria-label="Class groupings">
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
                    column="program"
                    label="Program"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="yearLevel"
                    label="Year Level"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="campus"
                    label="Campus"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
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
                {visible.map((section) => {
                  const archived = section.status === "archived"

                  return (
                    <TableRow key={section.id}>
                      <TableCell className="px-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium tabular-nums">
                            {section.sectionCode}
                          </span>
                          <ScopeBadge assignable={section.assignable} />
                        </div>
                        <p className="text-xs text-muted-foreground lg:hidden">
                          <span className="md:hidden">{section.programCode} · </span>
                          {section.yearLevel}
                          <span className="md:hidden"> · {section.campus}</span>
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-3 md:table-cell">
                        {section.programCode}
                      </TableCell>
                      <TableCell className="hidden px-3 lg:table-cell">
                        {section.yearLevel}
                      </TableCell>
                      <TableCell className="hidden px-3 md:table-cell">
                        {section.campus}
                      </TableCell>
                      <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                        {formatNumber(section.students)}
                      </TableCell>
                      <TableCell className="px-3">
                        <AccountStatusBadge status={section.status} />
                      </TableCell>
                      <TableCell className="px-3 text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for section ${section.sectionCode}, ${section.campus}`}
                            >
                              <MoreHorizontal aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Section {section.sectionCode} · {section.campus}
                            </DropdownMenuLabel>
                            {!archived ? (
                              <>
                                <DropdownMenuItem onSelect={() => setEditing(section)}>
                                  <Pencil aria-hidden />
                                  Edit status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            ) : null}
                            <DropdownMenuItem
                              variant={archived ? "default" : "destructive"}
                              onSelect={() => setArchiving(archiveTarget(section))}
                            >
                              {archived ? (
                                <>
                                  <ArchiveRestore aria-hidden />
                                  Restore class grouping
                                </>
                              ) : (
                                <>
                                  <Archive aria-hidden />
                                  Archive class grouping
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
            {formatNumber(sorted.length)} class groupings
          </p>
          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <SectionFormDialog
        open={adding}
        onOpenChange={setAdding}
        programs={openPrograms}
        yearLevels={yearLevels}
        campuses={campuses}
        defaultProgramId={defaultProgramId}
      />
      <SectionFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        section={editing}
        programs={openPrograms}
        yearLevels={yearLevels}
        campuses={campuses}
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
