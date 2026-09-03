"use client"

import { LineChartIcon } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
import type { SummaryPoint } from "@/features/reports/panel"
import { formatNumber } from "@/lib/format"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-2)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

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
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label={`Daily attendance summary for ${rangeLabel}`}
            className="aspect-auto h-64 w-full"
          >
            <LineChart
              accessibilityLayer
              data={summary}
              margin={{ left: 4, right: 12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                allowDecimals={false}
                tickFormatter={(value: number) => formatNumber(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="present"
                type="monotone"
                stroke="var(--color-present)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="absent"
                type="monotone"
                stroke="var(--color-absent)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
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
