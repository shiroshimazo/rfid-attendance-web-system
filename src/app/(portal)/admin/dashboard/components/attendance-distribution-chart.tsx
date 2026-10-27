"use client"

import { GaugeIcon } from "lucide-react"

import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { RadialStatusChart } from "@/features/attendance/radial-status-chart"
import type { StatusSlice } from "@/features/attendance/dashboard"

const chartConfig = {
  noclasses: { label: "No classes", color: "var(--chart-3)" },
  onlinemanual: { label: "Online / manual", color: "var(--chart-5)" },
  present: { label: "Present", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  absent: { label: "Absent", color: "var(--destructive)" },
  norecord: { label: "No tap recorded yet", color: "var(--muted-foreground)" },
} satisfies ChartConfig

export function AttendanceDistributionChart({
  distribution,
  attendanceRate,
}: {
  distribution: StatusSlice[]
  attendanceRate: number | null
}) {
  const total = distribution.reduce((sum, slice) => sum + slice.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Attendance Status Distribution</CardTitle>
        <CardDescription>Recorded decisions, calendar exceptions, and provisional missing taps</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total > 0 ? (
          <RadialStatusChart
            slices={distribution}
            config={chartConfig}
            headline={
              attendanceRate === null ? "—" : <SlidingNumber value={attendanceRate} decimalPlaces={1} suffix="%" />
            }
            caption={
              <>
                <SlidingNumber value={total} /> students
              </>
            }
            ariaLabel="Attendance status distribution for today"
          />
        ) : (
          <EmptyState
            icon={GaugeIcon}
            title="No students to chart"
            description="Add active students to see today's attendance statuses."
          />
        )}
      </CardContent>
    </Card>
  )
}
