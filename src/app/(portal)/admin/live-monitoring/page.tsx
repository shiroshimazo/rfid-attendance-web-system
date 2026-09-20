import type { Metadata } from "next"
import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { requireRole } from "@/features/auth/server"
import { buildLiveMonitoringRows } from "@/features/attendance/live-monitoring"
import { fetchLiveMonitoringRecords } from "@/services/attendance/live-monitoring"
import { schoolDateKey } from "@/lib/school-time"
import { formatDateValue } from "@/lib/format"
import { MonitoringTable } from "./components/monitoring-table"

export const metadata: Metadata = { title: "Live Monitoring" }
export const dynamic = "force-dynamic"

export default async function LiveMonitoringPage() {
  await requireRole("admin")
  const date = schoolDateKey(new Date())
  let rows: ReturnType<typeof buildLiveMonitoringRows> = []
  let errorMessage: string | null = null
  try {
    const records = await fetchLiveMonitoringRecords(date)
    rows = buildLiveMonitoringRows(records)
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Attendance records could not be read. Try again."
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-monitoring" tables={["attendance_records", "students", "programs", "rfid_cards"]} debounceMs={300} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Live Monitoring</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Student taps for {formatDateValue(date)}. Updates automatically, with the latest tap first. Times shown in Philippine time.
        </p>
      </div>
      {errorMessage !== null
        ? <DataErrorCard title="Live monitoring could not be loaded" message={errorMessage} />
        : <MonitoringTable rows={rows} />}
    </div>
  )
}
