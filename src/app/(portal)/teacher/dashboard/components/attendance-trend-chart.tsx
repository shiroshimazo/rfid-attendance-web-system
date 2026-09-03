"use client"

import * as React from "react"
import { LineChartIcon } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  TrendRange,
  TrendSeries,
} from "@/features/attendance/teacher-dashboard"
import { formatNumber, formatPercent } from "@/lib/format"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-2)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

const ranges: Array<{ value: TrendRange; label: string; caption: string }> = [
  {
    value: "daily",
    label: "Daily",
    caption: "Last 14 session days",
  },
  {
    value: "weekly",
    label: "Weekly",
    caption: "Last 12 weeks",
  },
  {
    value: "monthly",
    label: "Monthly",
    caption: "Last 6 months",
  },
]

export function AttendanceTrendChart({
  trend,
  hasHistory,
}: {
  trend: TrendSeries
  hasHistory: boolean
}) {
  const [range, setRange] = React.useState<TrendRange>("daily")
  const points = trend[range]
  const activeRange = ranges.find((item) => item.value === range) ?? ranges[0]
  const rateByKey = React.useMemo(
    () => new Map(points.map((point) => [point.key, point.rate])),
    [points]
  )

  return (
    <Card className="@container/chart">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          {activeRange.caption} · assigned students
        </CardDescription>
        <CardAction>
          <Tabs
            value={range}
            onValueChange={(value) => setRange(value as TrendRange)}
            className="hidden sm:block"
          >
            <TabsList aria-label="Attendance trend range">
              {ranges.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Select
            value={range}
            onValueChange={(value) => setRange(value as TrendRange)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Attendance trend range"
              className="w-32 sm:hidden"
            >
              <SelectValue>{activeRange.label}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {ranges.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        {hasHistory && points.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label={`Attendance trend, ${activeRange.caption.toLowerCase()}`}
            className="aspect-auto h-64 w-full"
          >
            <LineChart accessibilityLayer data={points} margin={{ left: 4, right: 12 }}>
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
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      const key = payload?.[0]?.payload?.key as
                        | string
                        | undefined
                      const rate = key ? rateByKey.get(key) : undefined

                      return rate === undefined
                        ? String(value)
                        : `${value} · ${formatPercent(rate)} rate`
                    }}
                  />
                }
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
            title="No attendance history yet"
            description="Trends appear once RFID taps start creating records for your assigned students."
          />
        )}
      </CardContent>
    </Card>
  )
}
