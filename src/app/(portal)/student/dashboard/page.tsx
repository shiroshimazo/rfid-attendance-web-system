import { Suspense } from "react"
import type { Metadata } from "next"
import { format, parseISO } from "date-fns"

import { DataErrorCard } from "@/components/data-error-card"
import { RefreshButton } from "@/components/refresh-button"
import { getStudentDashboardData } from "@/features/attendance/student-dashboard"

import { DashboardSkeleton } from "./components/dashboard-skeleton"
import { KpiCards } from "./components/kpi-cards"
import { RfidStatusCard } from "./components/rfid-status-card"
import { SmsStatusCard } from "./components/sms-status-card"
import { StudentIdentityCard } from "./components/student-identity-card"
import { TodayAttendanceCard } from "./components/today-attendance-card"

export const metadata: Metadata = {
  title: "Student Dashboard",
}

// Attendance changes with every RFID tap, so the page is never cached.
export const dynamic = "force-dynamic"

async function DashboardContent() {
  let data

  try {
    data = await getStudentDashboardData()
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
            Student Dashboard
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Personal RFID attendance summary for {readableDate}.
          </p>
        </div>
        <RefreshButton />
      </div>

      <KpiCards kpis={data.kpis} />

      <StudentIdentityCard student={data.student} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <TodayAttendanceCard attendance={data.attendance} />
        <RfidStatusCard rfid={data.rfid} />
        <SmsStatusCard sms={data.sms} />
      </div>
    </div>
  )
}

export default function StudentDashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
