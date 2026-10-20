"use client"

import { GaugeIcon } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { RadialStatusChart } from "@/features/attendance/radial-status-chart"
import type { StudentAttendanceKpis } from "@/features/attendance/student-attendance"
import { formatPercent } from "@/lib/format"

const chartConfig = {
  present: { label: "On time", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

export function StatusChart({ kpis }: { kpis: StudentAttendanceKpis }) {
  const total = kpis.totalPresent + kpis.totalAbsent

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance Status</CardTitle>
        <CardDescription>
          All recorded daily RFID attendance. Late arrivals are shown separately from on-time days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <RadialStatusChart
            slices={[
              { status: "present", count: kpis.totalPresent - kpis.totalLate },
              { status: "late", count: kpis.totalLate },
              { status: "absent", count: kpis.totalAbsent },
            ]}
            config={chartConfig}
            headline={formatPercent(kpis.attendanceRate)}
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
