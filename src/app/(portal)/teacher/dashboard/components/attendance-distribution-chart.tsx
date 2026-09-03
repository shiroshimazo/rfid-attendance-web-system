"use client"

import * as React from "react"
import { PieChartIcon } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { StatusSlice } from "@/features/attendance/teacher-dashboard"
import { formatNumber, formatPercent } from "@/lib/format"

const chartConfig = {
  count: { label: "Students" },
  present: { label: "Present", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  excused: { label: "Excused", color: "var(--chart-3)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

export function AttendanceDistributionChart({
  distribution,
  attendanceRate,
}: {
  distribution: StatusSlice[]
  attendanceRate: number
}) {
  const slices = React.useMemo(
    () =>
      distribution.map((slice) => {
        const key = slice.status.toLowerCase()

        return {
          key,
          status: slice.status,
          count: slice.count,
          fill: `var(--color-${key})`,
        }
      }),
    [distribution]
  )

  const total = slices.reduce((sum, slice) => sum + slice.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Attendance Status Distribution</CardTitle>
        <CardDescription>
          Present against absent assigned students today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total > 0 ? (
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label="Attendance status distribution for today"
            className="mx-auto aspect-square h-64"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="key" hideLabel />}
              />
              <Pie
                data={slices}
                dataKey="count"
                nameKey="key"
                innerRadius={62}
                strokeWidth={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (
                      !viewBox ||
                      !("cx" in viewBox) ||
                      viewBox.cx == null ||
                      viewBox.cy == null
                    )
                      return null
                    const cx = viewBox.cx
                    const cy = viewBox.cy

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy - 22}
                          className="fill-foreground text-2xl font-semibold tabular-nums"
                        >
                          {formatPercent(attendanceRate)}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 2}
                          className="fill-muted-foreground text-xs"
                        >
                          {formatNumber(total)} students
                        </tspan>
                      </text>
                    )
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={PieChartIcon}
            title="No assigned students to chart"
            description="Students in your class assignments appear here once enrolled."
          />
        )}
      </CardContent>
    </Card>
  )
}
