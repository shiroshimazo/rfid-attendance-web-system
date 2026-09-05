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
  attendanceRowStatuses,
  attendanceStatusLabel,
} from "@/features/attendance/schema"
import type { TeacherStudentsOptions } from "@/features/students/teacher-directory"

export interface StudentsFilters {
  search: string
  program: string
  yearLevel: string
  section: string
  /** Today's attendance status, including Late. */
  status: string
}

export const emptyStudentsFilters: StudentsFilters = {
  search: "",
  program: "all",
  yearLevel: "all",
  section: "all",
  status: "all",
}

export function isStudentsFiltered(filters: StudentsFilters) {
  return (
    filters.search.trim() !== "" ||
    filters.program !== "all" ||
    filters.yearLevel !== "all" ||
    filters.section !== "all" ||
    filters.status !== "all"
  )
}

/** Client-side filters; every option comes from the teacher's assignments. */
export function FiltersBar({
  filters,
  onChange,
  options,
}: {
  filters: StudentsFilters
  onChange: (filters: StudentsFilters) => void
  options: TeacherStudentsOptions
}) {
  const selectedProgram =
    filters.program === "all"
      ? "All programs"
      : (options.programs.find(
          (option) => String(option.id) === filters.program
        )?.code ?? "All programs")

  return (
    <div role="search" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      <div className="relative">
        <Label htmlFor="students-search" className="sr-only">
          Search students
        </Label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="students-search"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search name or student ID"
          className="h-9 pl-8"
        />
      </div>

      <Select
        value={filters.program}
        onValueChange={(value) => onChange({ ...filters, program: value })}
      >
        <SelectTrigger aria-label="Filter by program" className="w-full">
          <SelectValue>{selectedProgram}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All programs</SelectItem>
          {options.programs.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.yearLevel}
        onValueChange={(value) => onChange({ ...filters, yearLevel: value })}
      >
        <SelectTrigger aria-label="Filter by year level" className="w-full">
          <SelectValue>
            {filters.yearLevel === "all" ? "All year levels" : filters.yearLevel}
          </SelectValue>
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

      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value })}
      >
        <SelectTrigger aria-label="Filter by attendance status" className="w-full">
          <SelectValue>
            {filters.status === "all"
              ? "All statuses"
              : attendanceStatusLabel(filters.status)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {attendanceRowStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {attendanceStatusLabel(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select
          value={filters.section}
          onValueChange={(value) => onChange({ ...filters, section: value })}
        >
          <SelectTrigger aria-label="Filter by section" className="w-full">
            <SelectValue>
              {filters.section === "all" ? "All sections" : filters.section}
            </SelectValue>
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

        {isStudentsFiltered(filters) ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Clear filters"
            onClick={() => onChange(emptyStudentsFilters)}
          >
            <RotateCcw aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
