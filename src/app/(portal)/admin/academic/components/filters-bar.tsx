"use client"

import { RotateCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  catalogStatusFilters,
  type CatalogStatusFilter,
} from "@/features/academic/schema"

export interface ProgramFilterOption {
  value: string
  label: string
}

/** Search, program, and status filters shared by the three catalog tables. */
export function FiltersBar({
  idPrefix,
  searchLabel,
  searchPlaceholder,
  search,
  onSearchChange,
  status,
  onStatusChange,
  programs,
  program = "all",
  onProgramChange,
  onClear,
}: {
  idPrefix: string
  searchLabel: string
  searchPlaceholder: string
  search: string
  onSearchChange: (value: string) => void
  status: CatalogStatusFilter
  onStatusChange: (value: CatalogStatusFilter) => void
  /** Omitted on the Programs tab, which lists the programs themselves. */
  programs?: ProgramFilterOption[]
  program?: string
  onProgramChange?: (value: string) => void
  onClear: () => void
}) {
  const isFiltered =
    search.trim() !== "" || status !== "current" || program !== "all"

  return (
    <div role="search" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2">
        <Label htmlFor={`${idPrefix}-search`} className="sr-only">
          {searchLabel}
        </Label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={`${idPrefix}-search`}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 pl-8"
        />
      </div>

      {programs && onProgramChange ? (
        <Select value={program} onValueChange={onProgramChange}>
          <SelectTrigger aria-label="Filter by program" className="w-full">
            <SelectValue>
              {program === "all"
                ? "All programs"
                : (programs.find((option) => option.value === program)?.label ??
                  "All programs")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            {programs.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      <div className="flex gap-2">
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as CatalogStatusFilter)}
        >
          <SelectTrigger aria-label="Filter by status" className="w-full">
            <SelectValue>
              {catalogStatusFilters.find((option) => option.value === status)
                ?.label ?? "Active and inactive"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {catalogStatusFilters.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Clear filters"
            onClick={onClear}
          >
            <RotateCcw aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
