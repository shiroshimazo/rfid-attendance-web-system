import {
  Clock4,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TeacherDashboardData } from "@/features/attendance/teacher-dashboard"
import { formatNumber, formatPercent } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  headline: string
  detail: string
  trend?: { direction: "up" | "down" | "flat"; label: string }
}

function KpiCard({
  label,
  value,
  icon: Icon,
  headline,
  detail,
  trend,
}: KpiCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp

  return (
    <Card className="@container/card gap-4">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon aria-hidden className="size-4" />
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[16rem]/card:text-3xl">
          {value}
        </CardTitle>
        {trend ? (
          <CardAction>
            <Badge variant="outline" className="tabular-nums">
              {trend.direction === "flat" ? null : (
                <TrendIcon aria-hidden className="size-3" />
              )}
              {trend.label}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <p className="line-clamp-1 font-medium">{headline}</p>
        <p className="text-muted-foreground text-pretty">{detail}</p>
      </CardFooter>
    </Card>
  )
}

function rateTrend(data: TeacherDashboardData) {
  const daily = data.trend.daily
  if (daily.length < 2) return undefined

  const current = daily[daily.length - 1].rate
  const previous = daily[daily.length - 2].rate
  const delta = current - previous
  const direction = delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat"
  const sign = delta > 0 ? "+" : ""

  return {
    direction,
    label: `${sign}${delta.toFixed(1)} pts`,
  } as const
}

export function KpiCards({ data }: { data: TeacherDashboardData }) {
  const { kpis } = data
  const trend = rateTrend(data)

  return (
    <section
      aria-label="Attendance key performance indicators"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-5"
    >
      <KpiCard
        label="Total Assigned"
        value={formatNumber(kpis.totalAssigned)}
        icon={UsersRound}
        headline="Assigned students"
        detail="Active students in your class assignments."
      />
      <KpiCard
        label="Present Today"
        value={formatNumber(kpis.presentToday)}
        icon={UserRoundCheck}
        headline="Tapped in today"
        detail="Assigned students with a time-in recorded today."
      />
      <KpiCard
        label="Late Today"
        value={formatNumber(kpis.lateToday)}
        icon={Clock4}
        headline="Tapped in after the cutoff"
        detail="Assigned students only. Late still counts as present."
      />
      <KpiCard
        label="Absent Today"
        value={formatNumber(kpis.absentToday)}
        icon={UserRoundX}
        headline="No time-in recorded"
        detail="Assigned students missing a tap today."
      />
      <KpiCard
        label="Attendance Rate"
        value={formatPercent(kpis.attendanceRate)}
        icon={TrendingUp}
        headline="Share of assigned present"
        detail="Compared with the previous session day."
        trend={trend}
      />
    </section>
  )
}
