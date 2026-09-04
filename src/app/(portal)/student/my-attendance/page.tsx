import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { getStudentAttendanceData } from "@/features/attendance/student-attendance"

import { AttendanceHistoryTable } from "./components/attendance-history-table"
import { KpiCards } from "./components/kpi-cards"
import { PanelSkeleton } from "./components/panel-skeleton"

export const metadata: Metadata = {
  title: "My Attendance",
}

// Attendance changes with every RFID tap, so the page is never cached.
export const dynamic = "force-dynamic"

async function AttendanceContent() {
  let data

  try {
    data = await getStudentAttendanceData()
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

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards kpis={data.kpis} />
      <AttendanceHistoryTable rows={data.rows} />
    </div>
  )
}

export default function StudentAttendancePage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-student-attendance" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            My Attendance
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Personal attendance history visible only to the signed-in student.
          </p>
        </div>
      </div>

      <Suspense fallback={<PanelSkeleton />}>
        <AttendanceContent />
      </Suspense>
    </div>
  )
}
