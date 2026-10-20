"use client"

import * as React from "react"
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatNumber, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface RadialStatusSlice {
  /** Status key that maps to a chart config entry, e.g. `present`. */
  status: string
  count: number
}

export interface RadialStatusChartProps {
  slices: RadialStatusSlice[]
  config: ChartConfig
  /** Readout shown in the middle of the rings. */
  headline: React.ReactNode
  /** Small caption under the headline. */
  caption: React.ReactNode
  ariaLabel: string
  className?: string
}

interface RadialRow {
  Status: string
  Share: number
  count: number
  label: string
  fill: string
}

/**
 * Concentric radial bars: one ring per status, each ring sweeping the share of
 * records that status holds. Every ring starts at the same angle, so a longer
 * sweep reads as a bigger share and the rings stay comparable to each other.
 */
export function RadialStatusChart({
  slices,
  config,
  headline,
  caption,
  ariaLabel,
  className,
}: RadialStatusChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0)

  const rows = React.useMemo<RadialRow[]>(
    () =>
      slices.map((slice) => {
          const key = slice.status.toLowerCase()
          const entry = config[key]

          return {
            Status: key,
            Share: total > 0 ? (slice.count / total) * 100 : 0,
            count: slice.count,
            label: String(entry?.label ?? slice.status),
            fill: `var(--color-${key}, var(--chart-1))`,
          }
        }),
    [slices, config, total]
  )

  return (
    <div className={cn("flex flex-col gap-4", className)}>
    <ChartContainer
      config={config}
      role="img"
      aria-label={ariaLabel}
      className="mx-auto aspect-square w-full max-w-[300px]"
    >
      <RadialBarChart
        data={rows}
        startAngle={90}
        endAngle={-270}
        innerRadius="52%"
        outerRadius="95%"
        barCategoryGap="15%"
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              nameKey="Status"
              hideLabel
              formatter={(value, _name, _item, _index, payload) => {
                const row = payload as unknown as RadialRow
                const share = typeof value === "number" ? value : Number(value)

                return `${row.label}: ${formatNumber(row.count)} (${formatPercent(share)})`
              }}
            />
          }
        />
        <RadialBar dataKey="Share" background cornerRadius={8} isAnimationActive={false} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                return null
              if (viewBox.cx == null || viewBox.cy == null) return null
              const cx = viewBox.cx
              const cy = viewBox.cy

              return (
                <foreignObject
                  x={cx - 70}
                  y={cy - 34}
                  width={140}
                  height={68}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
                    <span className="text-2xl font-semibold text-foreground tabular-nums">
                      {headline}
                    </span>
                    <span className="text-xs text-muted-foreground">{caption}</span>
                  </div>
                </foreignObject>
              )
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
    <ul aria-label="Attendance status breakdown" className="mx-auto grid w-full max-w-sm gap-2.5 text-sm">
      {rows.map((row) => (
        <li key={row.Status} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: config[row.Status]?.color ?? "var(--chart-1)" }}
          />
          <span className="flex-1 text-muted-foreground">{config[row.Status]?.label ?? row.label}</span>
          <span className="font-medium tabular-nums">{formatNumber(row.count)}</span>
          <span className="w-14 text-right text-xs text-muted-foreground tabular-nums">{formatPercent(row.Share)}</span>
        </li>
      ))}
    </ul>
    </div>
  )
}
