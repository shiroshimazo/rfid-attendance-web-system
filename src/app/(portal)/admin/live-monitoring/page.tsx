import type { Metadata } from "next"
import Link from "next/link"
import { UsbAttendanceReader } from "@/components/usb-attendance-reader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { requireRole } from "@/features/auth/server"
import { buildLiveMonitoringRows, parseMonitoringRange, type MonitoringParams } from "@/features/attendance/live-monitoring"
import { fetchLiveMonitoringRecords } from "@/services/attendance/live-monitoring"
import { formatDateValue } from "@/lib/format"
import { MonitoringTable } from "./components/monitoring-table"

export const metadata: Metadata = { title: "Live Monitoring" }
export const dynamic = "force-dynamic"

export default async function LiveMonitoringPage({ searchParams }: { searchParams: Promise<MonitoringParams> }) {
  await requireRole("admin")
  const { from, to } = parseMonitoringRange(await searchParams)
  let rows: ReturnType<typeof buildLiveMonitoringRows> = []
  let errorMessage: string | null = null
  try {
    const records = await fetchLiveMonitoringRecords(from, to)
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
          Student taps for {formatDateValue(from)}{from !== to ? ` – ${formatDateValue(to)}` : ""}. Updates automatically, with the latest tap first. Times shown in Philippine time.
        </p>
      </div>
      <UsbAttendanceReader />
      <form key={`${from}:${to}`} action="/admin/live-monitoring" method="get" className="flex flex-wrap items-end gap-3 rounded-xl border p-4">
        <div className="space-y-2"><Label htmlFor="monitoring-from">From date</Label><Input id="monitoring-from" name="from" type="date" defaultValue={from} required className="h-10" /></div>
        <div className="space-y-2"><Label htmlFor="monitoring-to">To date</Label><Input id="monitoring-to" name="to" type="date" defaultValue={to} required className="h-10" /></div>
        <Button type="submit" className="min-h-10">Apply dates</Button>
        <Button asChild variant="outline" className="min-h-10"><Link href="/admin/live-monitoring">Today</Link></Button>
      </form>
      {errorMessage !== null
        ? <DataErrorCard title="Live monitoring could not be loaded" message={errorMessage} />
        : <MonitoringTable rows={rows} />}
    </div>
  )
}
