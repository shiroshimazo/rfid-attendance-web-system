import { Suspense } from "react"
import type { Metadata } from "next"
import { UsbAttendanceReader } from "@/components/usb-attendance-reader"
import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { requireRole } from "@/features/auth/server"
import { buildLiveMonitoringRows, parseMonitoringRange, type MonitoringParams } from "@/features/attendance/live-monitoring"
import { fetchLiveMonitoringRecords } from "@/services/attendance/live-monitoring"
import { formatDateValue } from "@/lib/format"
import { MonitoringTable } from "./components/monitoring-table"
import { MonitoringDateFilter } from "./components/monitoring-date-filter"
import { MonitoringPanelSkeleton } from "./components/monitoring-panel-skeleton"
import { MonitoringUpdateProvider } from "./components/monitoring-update-provider"

export const metadata: Metadata = { title: "Live Monitoring" }
export const dynamic = "force-dynamic"

/**
 * Reads the records for the selected range. It sits inside a Suspense
 * boundary, so a new range only swaps the table while the rest of the panel
 * stays on screen.
 */
async function MonitoringPanel({ from, to }: { from: string; to: string }) {
  let rows: ReturnType<typeof buildLiveMonitoringRows> = []
  let errorMessage: string | null = null
  try {
    const records = await fetchLiveMonitoringRecords(from, to)
    rows = buildLiveMonitoringRows(records)
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Attendance records could not be read. Try again."
  }

  return errorMessage !== null
    ? <DataErrorCard title="Live monitoring could not be loaded" message={errorMessage} />
    : <MonitoringTable rows={rows} />
}

export default async function LiveMonitoringPage({ searchParams }: { searchParams: Promise<MonitoringParams> }) {
  await requireRole("admin")
  const { from, to } = parseMonitoringRange(await searchParams)

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-monitoring" tables={["attendance_records", "students", "programs", "rfid_cards"]} debounceMs={300} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Live Monitoring</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Student taps for {formatDateValue(from)}{from !== to ? ` – ${formatDateValue(to)}` : ""}. Updates automatically, with the latest tap first. Times shown in Philippine time.
        </p>
      </div>
      <UsbAttendanceReader />
      <MonitoringUpdateProvider>
        <MonitoringDateFilter key={`${from}:${to}`} from={from} to={to} />
        {/* No key on this boundary: a keyed sibling plus a keyed Suspense boundary
            replaced in the same commit leaves the old filter in the DOM, so the
            panel would render two date filters. The boundary still shows the
            table skeleton while the new range loads. */}
        <Suspense fallback={<MonitoringPanelSkeleton />}>
          <MonitoringPanel from={from} to={to} />
        </Suspense>
      </MonitoringUpdateProvider>
    </div>
  )
}
