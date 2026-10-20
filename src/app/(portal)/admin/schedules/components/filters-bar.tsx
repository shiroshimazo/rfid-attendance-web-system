"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RotateCcw } from "lucide-react"

import { SearchTagInput } from "@/components/search-tag-input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  isSchedulePanelFiltered,
  scheduleDays,
  scheduleSessions,
  type SchedulePanelQuery,
} from "@/features/schedules/schema"
import { searchTagsEqual } from "@/lib/search-tags"

const SEARCH_DEBOUNCE_MS = 350

const sessionLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
}

type ParamPatch = Record<string, string | string[] | null>

export function FiltersBar({ query }: { query: SchedulePanelQuery }) {
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

  return (
    <div
      role="search"
      aria-busy={isPending}
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="relative">
        <SearchTagInput
          id="schedule-search"
          label="Search sections"
          value={search}
          onValueChange={setSearch}
          placeholder="Search section, e.g. 21003"
        />
      </div>

      <Select
        value={query.session}
        onValueChange={(value) =>
          applyParams({ session: value === "all" ? null : value })
        }
      >
        <SelectTrigger aria-label="Filter by session" className="w-full">
          <SelectValue>
            {query.session === "all"
              ? "All sessions"
              : sessionLabels[query.session]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sessions</SelectItem>
          {scheduleSessions.map((session) => (
            <SelectItem key={session} value={session}>
              {sessionLabels[session]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 sm:col-span-2 lg:col-span-2">
        <Select
          value={query.day === "all" ? "all" : String(query.day)}
          onValueChange={(value) =>
            applyParams({ day: value === "all" ? null : value })
          }
        >
          <SelectTrigger aria-label="Filter by class day" className="w-full">
            <SelectValue>
              {query.day === "all"
                ? "All class days"
                : (scheduleDays.find((day) => day.value === query.day)?.label ??
                  "All class days")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All class days</SelectItem>
            {scheduleDays.map((day) => (
              <SelectItem key={day.value} value={String(day.value)}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isSchedulePanelFiltered(query) ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Clear filters"
            onClick={() =>
              applyParams({ search: null, session: null, day: null })
            }
          >
            <RotateCcw aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
