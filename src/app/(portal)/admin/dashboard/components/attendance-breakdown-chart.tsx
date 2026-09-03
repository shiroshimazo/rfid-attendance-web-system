"use client"

import * as React from "react"
import { BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { GroupBreakdown } from "@/features/attendance/dashboard"
import { formatNumber } from "@/lib/format"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-2)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

type Grouping = "yearLevel" | "section"

/** Keeps the axis readable when an institution has many sections. */
const MAX_GROUPS = 10

export function AttendanceBreakdownChart({
  byYearLevel,
  bySection,
}: {
  byYearLevel: GroupBreakdown[]
  bySection: GroupBreakdown[]
}) {
  const [grouping, setGrouping] = React.useState<Grouping>("yearLevel")
  const source = grouping === "yearLevel" ? byYearLevel : bySection

  const groups = React.useMemo(() => {
    if (source.length <= MAX_GROUPS) return source

    return [...source]
      .sort((a, b) => b.total - a.total)
      .slice(0, MAX_GROUPS)
      .sort((a, b) => a.group.localeCompare(b.group))
  }, [source])

  const truncated = source.length > groups.length
  const groupLabel = grouping === "yearLevel" ? "year level" : "section"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance by {grouping === "yearLevel" ? "Year Level" : "Section"}</CardTitle>
        <CardDescription>
          {truncated
            ? `Largest ${MAX_GROUPS} of ${formatNumber(source.length)} groups today`
            : `Present against absent students per ${groupLabel} today`}
        </CardDescription>
        <CardAction>
          <Select
            value={grouping}
            onValueChange={(value) => setGrouping(value as Grouping)}
          >
            <SelectTrigger size="sm" aria-label="Group attendance by" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="yearLevel">Year Level</SelectItem>
              <SelectItem value="section">Section</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        {groups.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label={`Present and absent students per ${groupLabel} today`}
            className="aspect-auto h-64 w-full"
          >
            <BarChart accessibilityLayer data={groups} margin={{ left: 4, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="group"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                minTickGap={4}
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
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="present"
                fill="var(--color-present)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="absent"
                fill="var(--color-absent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No student groups yet"
            description="Assign year levels and sections to students to see this breakdown."
          />
        )}
      </CardContent>
    </Card>
  )
}
