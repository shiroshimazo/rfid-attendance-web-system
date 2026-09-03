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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GroupBreakdown } from "@/features/reports/panel"
import { formatNumber } from "@/lib/format"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-2)" },
  absent: { label: "Absent", color: "var(--destructive)" },
} satisfies ChartConfig

type Grouping = "program" | "yearLevel"

const MAX_GROUPS = 10

export function GroupBreakdownChart({
  byProgram,
  byYearLevel,
}: {
  byProgram: GroupBreakdown[]
  byYearLevel: GroupBreakdown[]
}) {
  const [grouping, setGrouping] = React.useState<Grouping>("program")
  const source = grouping === "program" ? byProgram : byYearLevel

  const groups = React.useMemo(
    () => [...source].sort((a, b) => b.rate - a.rate).slice(0, MAX_GROUPS),
    [source]
  )

  const groupLabel = grouping === "program" ? "program" : "year level"
  const truncated = source.length > groups.length

  return (
    <Card data-print="block">
      <CardHeader>
        <CardTitle>
          Attendance by {grouping === "program" ? "Program" : "Year Level"}
        </CardTitle>
        <CardDescription>
          {truncated
            ? `Top ${MAX_GROUPS} of ${formatNumber(source.length)} groups by attendance rate`
            : `Present against absent students per ${groupLabel}, highest rate first`}
        </CardDescription>
        <CardAction>
          <Tabs
            value={grouping}
            onValueChange={(value) => setGrouping(value as Grouping)}
          >
            <TabsList aria-label="Group attendance by">
              <TabsTrigger value="program">Program</TabsTrigger>
              <TabsTrigger value="yearLevel">Year Level</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        {groups.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            role="img"
            aria-label={`Present and absent students per ${groupLabel}`}
            className="aspect-auto h-64 w-full"
          >
            <BarChart
              accessibilityLayer
              data={groups}
              margin={{ left: 4, right: 12 }}
            >
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
            title="No groups to chart"
            description="Assign programs and year levels to students to see this breakdown."
          />
        )}
      </CardContent>
    </Card>
  )
}
