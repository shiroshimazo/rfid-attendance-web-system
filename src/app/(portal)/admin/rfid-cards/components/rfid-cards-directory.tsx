"use client"

import * as React from "react"
import {
  Eye,
  MoreHorizontal,
  Plus,
  ScanLine,
  Search,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react"

import { RfidStatusBadge } from "@/components/attendance-status-badge"
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
import type { RfidCardDirectory, RfidCardView } from "@/features/rfid/cards"
import { rfidCardStatuses } from "@/features/rfid/schema"
import { formatDateValue, formatNumber } from "@/lib/format"

import { RfidCardAssignDialog } from "./rfid-card-assign-dialog"
import { RfidCardRegisterDialog } from "./rfid-card-register-dialog"
import { RfidCardStatusDialog } from "./rfid-card-status-dialog"
import { RfidCardViewDialog } from "./rfid-card-view-dialog"

type SortColumn =
  | "rfidNumber"
  | "student"
  | "studentId"
  | "assignedDate"
  | "cardStatus"

const PAGE_SIZE = 10

const statusOrder: Record<RfidCardView["cardStatus"], number> = {
  Active: 0,
  Inactive: 1,
  Lost: 2,
  Deactivated: 3,
}

const collator = new Intl.Collator(undefined, { numeric: true })

function matchesQuery(card: RfidCardView, needle: string) {
  if (!needle) return true

  return [
    card.rfidNumber,
    card.cardStatus,
    card.student?.fullName,
    card.student?.studentId,
    card.student?.email,
    card.student?.programCode,
    card.student?.programName,
    card.student?.yearLevel,
    card.student?.section,
    card.student?.campus,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(needle)
}

function compareCards(
  a: RfidCardView,
  b: RfidCardView,
  { column, direction }: SortState<SortColumn>
) {
  const factor = direction === "asc" ? 1 : -1

  switch (column) {
    case "student":
      return (
        collator.compare(a.student?.fullName ?? "", b.student?.fullName ?? "") *
        factor
      )
    case "studentId":
      return (
        collator.compare(
          a.student?.studentId ?? "",
          b.student?.studentId ?? ""
        ) * factor
      )
    case "assignedDate":
      return collator.compare(a.assignedDate, b.assignedDate) * factor
    case "cardStatus":
      return (statusOrder[a.cardStatus] - statusOrder[b.cardStatus]) * factor
    default:
      return collator.compare(a.rfidNumber, b.rfidNumber) * factor
  }
}

export function RfidCardsDirectory({
  directory,
}: {
  directory: RfidCardDirectory
}) {
  const { cards, students, programs, stats } = directory

  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [program, setProgram] = React.useState("all")
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: "assignedDate",
    direction: "desc",
  })
  const [page, setPage] = React.useState(1)

  const [isRegisterOpen, setRegisterOpen] = React.useState(false)
  const [viewing, setViewing] = React.useState<RfidCardView | null>(null)
  const [assigning, setAssigning] = React.useState<RfidCardView | null>(null)
  const [changingStatus, setChangingStatus] =
    React.useState<RfidCardView | null>(null)

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()

    return cards
      .filter((card) => {
        if (status !== "all" && card.cardStatus !== status) return false
        if (
          program !== "all" &&
          String(card.student?.programId ?? "") !== program
        ) {
          return false
        }

        return matchesQuery(card, needle)
      })
      .sort((a, b) => compareCards(a, b, sort))
  }, [cards, query, status, program, sort])

  // Any change to the result set restarts paging so the view never lands on a
  // page that no longer exists.
  React.useEffect(() => {
    setPage(1)
  }, [query, status, program])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  const filtersActive =
    query.trim() !== "" || status !== "all" || program !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered RFID cards</CardTitle>
        <CardDescription>
          {formatNumber(stats.total)} card{stats.total === 1 ? "" : "s"}{" "}
          registered, {formatNumber(stats.active)} active
          {stats.lost > 0 ? `, ${formatNumber(stats.lost)} reported lost` : ""}.
          {stats.withoutActiveCard > 0
            ? ` ${formatNumber(stats.withoutActiveCard)} active student${
                stats.withoutActiveCard === 1 ? "" : "s"
              } cannot tap in yet.`
            : ""}
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={() => setRegisterOpen(true)}>
            <Plus aria-hidden />
            Register Card
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Label htmlFor="rfid-card-search" className="sr-only">
              Search RFID cards
            </Label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="rfid-card-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search RFID, student, or ID"
              className="h-9 pl-8"
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by card status" className="w-full">
              <SelectValue>
                {status === "all" ? "All card statuses" : status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All card statuses</SelectItem>
              {rfidCardStatuses.map((option) => (
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
        </div>

        {cards.length === 0 ? (
          <EmptyState
            icon={ScanLine}
            title="No RFID cards yet"
            description="Register the first card to let a student tap in at the reader."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching cards"
            description="Adjust the search text or filters to widen the results."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 px-3 text-right">No.</TableHead>
                  <SortableHeader
                    column="rfidNumber"
                    label="RFID Card Number"
                    sort={sort}
                    onSort={(column) =>
                      setSort((current) => nextSortState(current, column))
                    }
                    className="px-3"
                  />
                  <SortableHeader
                    column="student"
                    label="Student Name"
                    sort={sort}
                    onSort={(column) =>
                      setSort((current) => nextSortState(current, column))
                    }
                    className="px-3"
                  />
                  <SortableHeader
                    column="studentId"
                    label="Student ID"
                    sort={sort}
                    onSort={(column) =>
                      setSort((current) => nextSortState(current, column))
                    }
                    className="hidden px-3 md:table-cell"
                  />
                  <SortableHeader
                    column="assignedDate"
                    label="Assigned On"
                    sort={sort}
                    onSort={(column) =>
                      setSort((current) => nextSortState(current, column))
                    }
                    className="hidden px-3 lg:table-cell"
                  />
                  <SortableHeader
                    column="cardStatus"
                    label="Card Status"
                    sort={sort}
                    onSort={(column) =>
                      setSort((current) => nextSortState(current, column))
                    }
                    className="px-3"
                  />
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((card, index) => (
                  <TableRow key={card.id}>
                    <TableCell className="px-3 text-right text-muted-foreground tabular-nums">
                      {formatNumber(start + index + 1)}
                    </TableCell>
                    <TableCell className="px-3 font-mono text-sm tabular-nums">
                      {card.rfidNumber}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {card.student?.fullName ?? "Unknown student"}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {card.student?.studentId ?? "—"} ·{" "}
                          {formatDateValue(card.assignedDate)}
                        </p>
                        {card.student ? (
                          <p className="hidden text-xs text-muted-foreground md:block">
                            <Badge
                              variant="outline"
                              className="mr-1.5 border-primary/25 bg-primary/5"
                              title={card.student.programName}
                            >
                              {card.student.programCode}
                            </Badge>
                            {card.student.yearLevel} · {card.student.section}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-3 tabular-nums md:table-cell">
                      {card.student?.studentId ?? "—"}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {formatDateValue(card.assignedDate)}
                    </TableCell>
                    <TableCell className="px-3">
                      <RfidStatusBadge status={card.cardStatus} />
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for card ${card.rfidNumber}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setViewing(card)}>
                            <Eye aria-hidden />
                            View card details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setAssigning(card)}>
                            <UserRoundCheck aria-hidden />
                            Assign or reassign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => setChangingStatus(card)}
                          >
                            <ShieldCheck aria-hidden />
                            Update card status
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
            {filtersActive ? " matching" : ""} cards
          </p>

          <TablePagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </CardFooter>
      ) : null}

      <RfidCardRegisterDialog
        open={isRegisterOpen}
        onOpenChange={setRegisterOpen}
        students={students}
      />
      <RfidCardViewDialog
        card={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      />
      <RfidCardAssignDialog
        card={assigning}
        students={students}
        onOpenChange={(open) => {
          if (!open) setAssigning(null)
        }}
      />
      <RfidCardStatusDialog
        card={changingStatus}
        onOpenChange={(open) => {
          if (!open) setChangingStatus(null)
        }}
      />
    </Card>
  )
}
