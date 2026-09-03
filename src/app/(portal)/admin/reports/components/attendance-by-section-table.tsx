"use client"

import * as React from "react"
import { LayoutGrid } from "lucide-react"

import {
  SortableHeader,
  TablePagination,
  nextSortState,
  type SortState,
} from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
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
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SectionBreakdown } from "@/features/reports/panel"
import { formatNumber, formatPercent } from "@/lib/format"

type SortColumn =
  | "program"
  | "yearLevel"
  | "section"
  | "total"
  | "present"
  | "absent"
  | "rate"

const PAGE_SIZE = 10

const collator = new Intl.Collator(undefined, { numeric: true })

function compareRows(
  a: SectionBreakdown,
  b: SectionBreakdown,
  column: SortColumn,
  direction: "asc" | "desc"
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "yearLevel":
      return collator.compare(a.yearLevel, b.yearLevel) * factor
    case "section":
      return collator.compare(a.section, b.section) * factor
    case "total":
      return (a.total - b.total) * factor
    case "present":
      return (a.present - b.present) * factor
    case "absent":
      return (a.absent - b.absent) * factor
    case "rate":
      return (a.rate - b.rate) * factor
    default:
      return collator.compare(a.program, b.program) * factor
  }
}

export function AttendanceBySectionTable({
  rows,
  rangeLabel,
}: {
  rows: SectionBreakdown[]
  rangeLabel: string
}) {
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "program",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)

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

  return (
    <Card data-print="block">
      <CardHeader>
        <CardTitle>Attendance by Section</CardTitle>
        <CardDescription>
          Section totals and attendance rate for {rangeLabel}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {visible.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No sections to report"
            description="Assign programs, year levels, and sections to students first."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader
                    column="program"
                    label="Program"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="yearLevel"
                    label="Year Level"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="section"
                    label="Section"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                  <SortableHeader
                    column="total"
                    label="Total Students"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="present"
                    label="Present"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="absent"
                    label="Absent"
                    sort={sort}
                    onSort={toggleSort}
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="rate"
                    label="Attendance Rate"
                    sort={sort}
                    onSort={toggleSort}
                    className="px-3"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="px-3">
                      <Badge
                        variant="outline"
                        className="border-primary/25 bg-primary/5"
                      >
                        {row.program}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3">{row.yearLevel}</TableCell>
                    <TableCell className="px-3">{row.section}</TableCell>
                    <TableCell className="hidden px-3 tabular-nums md:table-cell">
                      {formatNumber(row.total)}
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                      {formatNumber(row.present)}
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums lg:table-cell">
                      {formatNumber(row.absent)}
                    </TableCell>
                    <TableCell className="px-3 tabular-nums">
                      {formatPercent(row.rate)}
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
    </Card>
  )
}
