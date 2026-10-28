"use client"

import * as React from "react"
import { LineChartIcon } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { AttendanceLineChart } from "@/features/attendance/attendance-line-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TrendRange, TrendSeries } from "@/features/attendance/dashboard"

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

  return (
    <Card className="@container/chart h-full">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>{activeRange.caption}. Calendar exceptions excluded; — means no finalized RFID rate.</CardDescription>
        <CardAction>
          <Tabs
            value={range}
            onValueChange={(value) => setRange(value as TrendRange)}
            className="hidden @sm/chart:block"
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
              className="w-32 @sm/chart:hidden"
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
      <CardContent className="relative mx-6 min-h-64 flex-1 px-0">
        {hasHistory && points.some(point => point.rate !== null) ? (
          <AttendanceLineChart
            points={points}
            label={`Attendance trend, ${activeRange.caption.toLowerCase()}`}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <EmptyState
            icon={LineChartIcon}
            title={hasHistory ? "No finalized RFID attendance" : "No attendance history yet"}
            description={hasHistory ? "Calendar exceptions and provisional missing taps have no daily RFID rate (—)." : "Trends appear once RFID taps start creating attendance records."}
          />
        )}
      </CardContent>
    </Card>
  )
}
