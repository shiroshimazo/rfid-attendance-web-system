import { Suspense } from "react"
import type { Metadata } from "next"
import { format, parseISO } from "date-fns"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { getTeacherDashboardData } from "@/features/attendance/teacher-dashboard"

import { AssignedAttendanceTable } from "./components/assigned-attendance-table"
import { AttendanceDistributionChart } from "./components/attendance-distribution-chart"
import { AttendanceTrendChart } from "./components/attendance-trend-chart"
import { DashboardSkeleton } from "./components/dashboard-skeleton"
import { KpiCards } from "./components/kpi-cards"

export const metadata: Metadata = {
  title: "Teacher Dashboard",
}

// Attendance changes with every RFID tap, so the page is never cached.
export const dynamic = "force-dynamic"

async function DashboardContent() {
  let data

  try {
    data = await getTeacherDashboardData()
  } catch (error) {
    return (
      <DataErrorCard
        title="Dashboard data could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading attendance data."
        }
      />
    )
  }

  const readableDate = format(parseISO(data.today), "EEEE, d MMMM yyyy")

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Assigned-student RFID attendance for {readableDate}.
          </p>
        </div>
      </div>

      <KpiCards data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="lg:col-span-2">
          <AttendanceTrendChart
            trend={data.trend}
            hasHistory={data.hasAttendanceHistory}
          />
        </div>
        <AttendanceDistributionChart
          distribution={data.distribution}
          attendanceRate={data.kpis.attendanceRate}
        />
      </div>

      <AssignedAttendanceTable students={data.students} today={readableDate} />
    </div>
  )
}

export default function TeacherDashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-teacher-dashboard" />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
