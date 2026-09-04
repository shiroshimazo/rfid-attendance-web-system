import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import {
  PILOT_PROGRAM_CODE,
  PILOT_YEAR_LEVEL,
} from "@/features/academic/pilot"
import {
  getScheduleDirectory,
  parseSchedulePanelQuery,
  type ScheduleSearchParams,
  type SchedulePanelQuery,
} from "@/features/schedules/directory"

import { FiltersBar } from "./components/filters-bar"
import { KpiCards } from "./components/kpi-cards"
import { PanelSkeleton } from "./components/panel-skeleton"
import { SchedulesTable } from "./components/schedules-table"

export const metadata: Metadata = {
  title: "Schedules",
}

// Schedules change from this page itself, so nothing is cached.
export const dynamic = "force-dynamic"

async function SchedulesContent({ query }: { query: SchedulePanelQuery }) {
  let directory

  try {
    directory = await getScheduleDirectory(query)
  } catch (error) {
    return (
      <DataErrorCard
        title="Class schedules could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading class schedules."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards kpis={directory.kpis} />
      <FiltersBar query={directory.query} />
      <SchedulesTable directory={directory} />
    </div>
  )
}

export default async function AdminSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<ScheduleSearchParams>
}) {
  const query = parseSchedulePanelQuery(await searchParams)
  const suspenseKey = [query.search, query.session, query.day].join("|")

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-schedules" tables={["class_schedules"]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Schedules
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Class start times and grace windows that decide when a tap counts
            as Late. Locked to {PILOT_PROGRAM_CODE} {PILOT_YEAR_LEVEL} while
            the pilot runs.
          </p>
        </div>
      </div>

      <Suspense key={suspenseKey} fallback={<PanelSkeleton />}>
        <SchedulesContent query={query} />
      </Suspense>
    </div>
  )
}
