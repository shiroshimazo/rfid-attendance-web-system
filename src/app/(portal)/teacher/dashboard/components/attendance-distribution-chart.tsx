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
import type { StatusSlice } from "@/features/attendance/teacher-dashboard"

const chartConfig = {
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
  attendanceRate: number
}) {
  const total = distribution.reduce((sum, slice) => sum + slice.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Attendance Status Distribution</CardTitle>
        <CardDescription>
          Recorded statuses and assigned students with no tap yet today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total > 0 ? (
          <RadialStatusChart
            slices={distribution}
            config={chartConfig}
            headline={
              <SlidingNumber value={attendanceRate} decimalPlaces={1} suffix="%" />
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
            title="No assigned students to chart"
            description="Students in your class assignments appear here once enrolled."
          />
        )}
      </CardContent>
    </Card>
  )
}
