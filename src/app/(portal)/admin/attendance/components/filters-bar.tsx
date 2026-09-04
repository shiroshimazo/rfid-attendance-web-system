"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RotateCcw, Search } from "lucide-react"

import { ProgramCombobox } from "@/components/program-combobox"
import { Button } from "@/components/ui/button"
import { DatePicker, toDateKey } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AttendancePanelOptions } from "@/features/attendance/panel"
import {
  attendanceStatuses,
  isAttendancePanelFiltered,
  type AttendancePanelQuery,
} from "@/features/attendance/schema"

const SEARCH_DEBOUNCE_MS = 350

type ParamPatch = Record<string, string | null>

export function FiltersBar({
  query,
  options,
}: {
  query: AttendancePanelQuery
  options: AttendancePanelOptions
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [search, setSearch] = React.useState(query.search)

  const applyParams = React.useCallback(
    (patch: ParamPatch) => {
      const next = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }

      const queryString = next.toString()

      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        })
      })
    },
    [pathname, router, searchParams]
  )

  React.useEffect(() => {
    setSearch(query.search)
  }, [query.search])

  React.useEffect(() => {
    if (search.trim() === query.search) return

    const timer = setTimeout(
      () => applyParams({ search: search.trim() }),
      SEARCH_DEBOUNCE_MS
    )

    return () => clearTimeout(timer)
  }, [search, query.search, applyParams])

  const filtersActive = isAttendancePanelFiltered(query)

  return (
    <div
      role="search"
      aria-busy={isPending}
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      <div className="relative">
        <Label htmlFor="attendance-search" className="sr-only">
          Search students
        </Label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="attendance-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or student ID"
          className="h-9 pl-8"
        />
      </div>

      <div>
        <Label htmlFor="attendance-date" className="sr-only">
          Attendance date
        </Label>
        <DatePicker
          id="attendance-date"
          value={query.date}
          className="h-9"
          max={toDateKey(new Date())}
          clearable={false}
          placeholder="Pick a date"
          onChange={(date) => applyParams({ date })}
        />
      </div>

      <Select
        value={query.status}
        onValueChange={(value) =>
          applyParams({ status: value === "all" ? null : value })
        }
      >
        <SelectTrigger aria-label="Filter by attendance status" className="w-full">
          <SelectValue>
            {query.status === "all" ? "All statuses" : query.status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {attendanceStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <Label htmlFor="attendance-program" className="sr-only">
          Filter by program
        </Label>
        <ProgramCombobox
          id="attendance-program"
          programs={options.programs}
          value={query.programId === null ? "" : String(query.programId)}
          onChange={(value) => applyParams({ program: value || null })}
        />
      </div>

      <Select
        value={query.yearLevel ?? "all"}
        onValueChange={(value) =>
          applyParams({ yearLevel: value === "all" ? null : value })
        }
      >
        <SelectTrigger aria-label="Filter by year level" className="w-full">
          <SelectValue>{query.yearLevel ?? "All year levels"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All year levels</SelectItem>
          {options.yearLevels.map((yearLevel) => (
            <SelectItem key={yearLevel} value={yearLevel}>
              {yearLevel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select
          value={query.section ?? "all"}
          onValueChange={(value) =>
            applyParams({ section: value === "all" ? null : value })
          }
        >
          <SelectTrigger aria-label="Filter by section" className="w-full">
            <SelectValue>{query.section ?? "All sections"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {options.sections.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filtersActive ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Clear filters"
            onClick={() =>
              applyParams({
                search: null,
                status: null,
                program: null,
                yearLevel: null,
                section: null,
              })
            }
          >
            <RotateCcw aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
