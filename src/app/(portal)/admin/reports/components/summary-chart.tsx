"use client"

import { LineChartIcon } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AttendanceLineChart } from "@/features/attendance/attendance-line-chart"
import type { SummaryPoint } from "@/features/reports/panel"

export function SummaryChart({
  summary,
  rangeLabel,
}: {
  summary: SummaryPoint[]
  rangeLabel: string
}) {
  return (
    <Card className="@container/chart" data-print="block">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>
          Present against absent students per session day, {rangeLabel}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary.length > 0 ? (
          <AttendanceLineChart
            points={summary}
            label={`Daily attendance summary for ${rangeLabel}`}
            className="h-64 w-full"
          />
        ) : (
          <EmptyState
            icon={LineChartIcon}
            title="No attendance in this range"
            description="Pick a wider date range, or wait for RFID taps to create records."
          />
        )}
      </CardContent>
    </Card>
  )
}
