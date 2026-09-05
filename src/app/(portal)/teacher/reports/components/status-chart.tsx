"use client"

import * as React from "react"
import { PieChartIcon } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
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
import type { TeacherStatusSlice } from "@/features/reports/teacher-panel"
import { formatNumber, formatPercent } from "@/lib/format"

const chartConfig = {
  count: { label: "Records" },
  present: { label: "Present", color: "var(--chart-2)" },
  late: { label: "Late", color: "var(--chart-4)" },
  excused: { label: "Excused", color: "var(--chart-3)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

export function StatusChart({
  distribution,
}: {
  distribution: TeacherStatusSlice[]
}) {
  const total = distribution.reduce((sum, slice) => sum + slice.count, 0)

  const slices = React.useMemo(
    () =>
      distribution
        .filter((slice) => slice.count > 0)
        .map((slice) => {
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

  return (
    <Card className="flex flex-col" data-print="block">
      <CardHeader>
        <CardTitle>Attendance Status</CardTitle>
        <CardDescription>
          Share of present, late, excused, and absent sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total > 0 ? (
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label="Attendance status distribution for the selected range"
            className="mx-auto aspect-square h-64"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="key"
                    hideLabel
                    formatter={(value, name) => {
                      const count = Number(value)

                      return `${chartConfig[name as keyof typeof chartConfig]?.label ?? name}: ${formatNumber(count)} (${formatPercent((count / total) * 100)})`
                    }}
                  />
                }
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
                      <foreignObject
                        x={cx - 70}
                        y={cy - 50}
                        width={140}
                        height={68}
                      >
                        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
                          <SlidingNumber
                            value={total}
                            className="text-2xl font-semibold text-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            sessions
                          </span>
                        </div>
                      </foreignObject>
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
            title="Nothing to chart yet"
            description="Attendance status appears once records exist in the selected range."
          />
        )}
      </CardContent>
    </Card>
  )
}
