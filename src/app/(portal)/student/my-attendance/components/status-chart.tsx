"use client"

import { GaugeIcon } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { RadialStatusChart } from "@/features/attendance/radial-status-chart"
import type { StudentAttendanceKpis } from "@/features/attendance/student-attendance"
import { SlidingNumber } from "@/components/motion-primitives/sliding-number"

const chartConfig = {
  noclasses: { label: "No classes", color: "var(--chart-3)" },
  onlinemanual: { label: "Online / manual", color: "var(--chart-5)" },
  present: { label: "On time", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

export function StatusChart({ kpis }: { kpis: StudentAttendanceKpis }) {
  const total = kpis.totalPresent + kpis.totalAbsent + kpis.noClasses + kpis.onlineManual

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance Status</CardTitle>
        <CardDescription>
          Your campus attendance, including days with no classes or online/manual attendance. Late arrivals appear separately from on-time days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <RadialStatusChart
            slices={[
              { status: "present", count: kpis.totalPresent - kpis.totalLate },
              { status: "late", count: kpis.totalLate },
              { status: "absent", count: kpis.totalAbsent },
              { status: "noclasses", count: kpis.noClasses },
              { status: "onlinemanual", count: kpis.onlineManual },
            ]}
            config={chartConfig}
            headline={kpis.attendanceRate === null ? "—" : <SlidingNumber value={kpis.attendanceRate} decimalPlaces={1} suffix="%" />}
            caption="attendance rate"
            ariaLabel="Personal attendance rate and share of on-time, late, and absent days across all recorded daily RFID history"
          />
        ) : (
          <EmptyState
            icon={GaugeIcon}
            title="Nothing to chart yet"
            description="Your attendance breakdown appears once daily RFID records exist."
          />
        )}
      </CardContent>
    </Card>
  )
}
