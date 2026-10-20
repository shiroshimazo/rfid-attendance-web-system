"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RotateCcw } from "lucide-react"

import { ProgramCombobox } from "@/components/program-combobox"
import { SearchTagInput } from "@/components/search-tag-input"
import { Button } from "@/components/ui/button"
import { DatePicker, toDateKey } from "@/components/ui/date-picker"
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
  attendanceRowStatuses,
  attendanceStatusLabel,
  isAttendancePanelFiltered,
  type AttendancePanelQuery,
} from "@/features/attendance/schema"
import { searchTagsEqual } from "@/lib/search-tags"

const SEARCH_DEBOUNCE_MS = 350

type ParamPatch = Record<string, string | string[] | null>

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
  const [search, setSearch] = React.useState<string[]>(query.search)

  const applyParams = React.useCallback(
    (patch: ParamPatch) => {
      const next = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(patch)) {
        next.delete(key)

        if (value === null) continue

        const values = Array.isArray(value) ? value : [value]

        for (const entry of values) {
          if (entry === "") continue
          next.append(key, entry)
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
    setSearch((current) =>
      searchTagsEqual(current, query.search) ? current : query.search
    )
  }, [query.search])

  React.useEffect(() => {
    if (searchTagsEqual(search, query.search)) return

    const timer = setTimeout(() => applyParams({ search }), SEARCH_DEBOUNCE_MS)

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
        <SearchTagInput
          id="attendance-search"
          label="Search students"
          value={search}
          onValueChange={setSearch}
          placeholder="Search name or student ID"
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
            {query.status === "all"
              ? "All statuses"
              : attendanceStatusLabel(query.status)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="Attended">Present and late</SelectItem>
          {attendanceRowStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {attendanceStatusLabel(status)}
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
