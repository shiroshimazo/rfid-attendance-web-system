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
import type { StatusSlice } from "@/features/reports/panel"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

export function StatusChart({ distribution }: { distribution: StatusSlice[] }) {
  const total = distribution.reduce((sum, slice) => sum + slice.count, 0)

  return (
    <Card className="flex flex-col" data-print="block">
      <CardHeader>
        <CardTitle>Attendance Status</CardTitle>
        <CardDescription>
          Share of present, late, and absent sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total > 0 ? (
          <RadialStatusChart
            slices={distribution}
            config={chartConfig}
            headline={<SlidingNumber value={total} />}
            caption="sessions"
            ariaLabel="Attendance status distribution for the selected range"
          />
        ) : (
          <EmptyState
            icon={GaugeIcon}
            title="Nothing to chart yet"
            description="Attendance status appears once records exist in the selected range."
          />
        )}
      </CardContent>
    </Card>
  )
}
