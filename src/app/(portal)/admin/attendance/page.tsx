import { Suspense } from "react"
import type { Metadata } from "next"
import { format, parseISO } from "date-fns"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import {
  getAttendancePanelData,
  parseAttendancePanelQuery,
  type AttendancePanelQuery,
  type AttendanceSearchParams,
} from "@/features/attendance/panel"

import { AttendanceTable } from "./components/attendance-table"
import { FiltersBar } from "./components/filters-bar"
import { KpiCards } from "./components/kpi-cards"
import { PanelSkeleton } from "./components/panel-skeleton"

export const metadata: Metadata = {
  title: "Attendance",
}

export const dynamic = "force-dynamic"

function readableDateOf(date: string) {
  return format(parseISO(date), "EEEE, d MMMM yyyy")
}

async function AttendanceContent({ query }: { query: AttendancePanelQuery }) {
  let data

  try {
    data = await getAttendancePanelData(query)
  } catch (error) {
    return (
      <DataErrorCard
        title="Attendance records could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading attendance records."
        }
      />
    )
  }

  const readableDate = readableDateOf(data.date)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards kpis={data.kpis} readableDate={readableDate} />
      <FiltersBar query={data.query} options={data.options} />
      <AttendanceTable
        rows={data.rows}
        readableDate={readableDate}
        hasStudents={data.hasStudents}
      />
    </div>
  )
}

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<AttendanceSearchParams>
}) {
  const query = parseAttendancePanelQuery(await searchParams)
  const suspenseKey = [
    query.date,
    query.status,
    query.programId ?? "",
    query.yearLevel ?? "",
    query.section ?? "",
    query.search,
  ].join("|")

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-attendance" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Attendance
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Campus-wide RFID attendance transactions for{" "}
            {readableDateOf(query.date)}.
          </p>
        </div>
      </div>

      <Suspense key={suspenseKey} fallback={<PanelSkeleton />}>
        <AttendanceContent query={query} />
      </Suspense>
    </div>
  )
}
