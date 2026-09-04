import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import {
  formatRangeLabel,
  getTeacherReportsData,
  parseReportsRange,
  type ReportsRange,
  type ReportsSearchParams,
} from "@/features/reports/teacher-panel"

import { DateRangePicker } from "./components/date-range-picker"
import { ExportPdfButton } from "./components/export-pdf-button"
import { KpiCards } from "./components/kpi-cards"
import { PanelSkeleton } from "./components/panel-skeleton"
import { SectionAttendanceTable } from "./components/section-attendance-table"
import { StatusChart } from "./components/status-chart"
import { SummaryChart } from "./components/summary-chart"

export const metadata: Metadata = {
  title: "Reports",
}

export const dynamic = "force-dynamic"

async function ReportsContent({ range }: { range: ReportsRange }) {
  let data

  try {
    data = await getTeacherReportsData(range)
  } catch (error) {
    return (
      <DataErrorCard
        title="Reports data could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while building this report."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <p className="text-sm text-muted-foreground tabular-nums">
        Generated {data.generatedAtLabel}
      </p>

      <KpiCards kpis={data.kpis} sessionDays={data.sessionDays} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="lg:col-span-2">
          <SummaryChart summary={data.summary} rangeLabel={data.rangeLabel} />
        </div>
        <StatusChart distribution={data.distribution} />
      </div>

      <SectionAttendanceTable
        rows={data.bySection}
        rangeLabel={data.rangeLabel}
      />
    </div>
  )
}

export default async function TeacherReportsPage({
  searchParams,
}: {
  searchParams: Promise<ReportsSearchParams>
}) {
  const range = parseReportsRange(await searchParams)

  return (
    <div
      data-print="region"
      className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6"
    >
      <LiveRefresh channel="live-teacher-reports" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Assigned-class RFID attendance for{" "}
            {formatRangeLabel(range.from, range.to)}.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2" data-print="hide">
          <DateRangePicker from={range.from} to={range.to} />
          <ExportPdfButton />
        </div>
      </div>

      <Suspense
        key={`${range.from}|${range.to}`}
        fallback={<PanelSkeleton />}
      >
        <ReportsContent range={range} />
      </Suspense>
    </div>
  )
}
