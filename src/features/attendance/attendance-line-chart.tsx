"use client"

import { useMemo } from "react"
import useMeasure from "react-use-measure"

import {
  LineChart,
  LineChartLegend,
  LineChartPlot,
  LineChartTooltip,
} from "@/components/charts/line-chart"
import { XYTooltipContent } from "@/components/charts/xy/tooltip-content"
import { useContentReady } from "@/hooks/use-content-ready"
import { formatNumber, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

type AttendancePoint = {
  label: string
  date?: string
  present: number
  absent: number
  rate: number | null
}

export function AttendanceLineChart({
  points,
  label,
  className,
}: {
  points: readonly AttendancePoint[]
  label: string
  className?: string
}) {
  const ready = useContentReady()
  const [plotRef, plotBounds] = useMeasure()
  const categories = useMemo(
    // Report ranges can span years; BeUI requires unique category labels.
    () => points.map((point) => point.date ? `${point.label}, ${point.date.slice(0, 4)}` : point.label),
    [points]
  )
  const series = useMemo(() => [
    { id: "present", name: "Present", color: "var(--chart-2)", values: points.map((point) => point.rate === null ? null : point.present) },
    { id: "absent", name: "Absent", color: "var(--destructive)", values: points.map((point) => point.rate === null ? null : point.absent) },
  ], [points])

  if (!ready) return <div className={cn("min-h-64", className)} />

  return (
    <LineChart
      series={series}
      categories={categories}
      label={label}
      formatValue={formatNumber}
      formatTick={(value) => Number.isInteger(value) ? formatNumber(value) : ""}
      className={cn("flex min-h-64 flex-col justify-between gap-3 space-y-0 tabular-nums", className)}
    >
      <div ref={plotRef} className="min-h-0 flex-1">
        <LineChartPlot height={Math.max(180, plotBounds.height - 28)} fadeEdges={false} />
      </div>
      <LineChartTooltip>
        {({ category, index, rows }) => (
          <XYTooltipContent
            title={`${category} · ${points[index].rate === null ? "—" : formatPercent(points[index].rate)} rate`}
            rows={rows}
            formatValue={formatNumber}
          />
        )}
      </LineChartTooltip>
      <LineChartLegend className="justify-center" />
    </LineChart>
  )
}
