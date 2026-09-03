"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TableHead } from "@/components/ui/table"

export type SortDirection = "asc" | "desc"

export interface SortState<TColumn extends string> {
  column: TColumn
  direction: SortDirection
}

/** Flips the direction when the same column is clicked twice. */
export function nextSortState<TColumn extends string>(
  current: SortState<TColumn>,
  column: TColumn
): SortState<TColumn> {
  return current.column === column
    ? { column, direction: current.direction === "asc" ? "desc" : "asc" }
    : { column, direction: "asc" }
}

/** Page numbers around the current page, with gaps marked by `null`. */
export function pageWindow(current: number, total: number): (number | null)[] {
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

/** Column header that reports its sort state to assistive technology. */
export function SortableHeader<TColumn extends string>({
  column,
  label,
  sort,
  onSort,
  className,
}: {
  column: TColumn
  label: string
  sort: SortState<TColumn>
  onSort: (column: TColumn) => void
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

/** Numbered pager for client-side paging over an already loaded list. */
export function TablePagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}) {
  if (pageCount <= 1) return null

  function goTo(next: number) {
    onPageChange(Math.min(Math.max(next, 1), pageCount))
  }

  return (
    <Pagination className="mx-0 w-auto justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault()
              goTo(page - 1)
            }}
          />
        </PaginationItem>

        {pageWindow(page, pageCount).map((entry, index) => (
          <PaginationItem key={entry ?? `gap-${index}`}>
            {entry === null ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={entry === page}
                aria-label={`Go to page ${entry}`}
                className="tabular-nums"
                onClick={(event) => {
                  event.preventDefault()
                  goTo(entry)
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
            aria-disabled={page >= pageCount}
            className={
              page >= pageCount ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(event) => {
              event.preventDefault()
              goTo(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
