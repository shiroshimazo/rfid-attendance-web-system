import type { ReactNode } from "react"

import {
  Clock4,
  ScanLine,
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
import type { AdminDashboardData } from "@/features/attendance/dashboard"
import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import { formatNumber } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: ReactNode
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

function rateTrend(data: AdminDashboardData) {
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

export function KpiCards({ data }: { data: AdminDashboardData }) {
  const { kpis } = data
  const trend = rateTrend(data)

  return (
    <section
      aria-label="Attendance key performance indicators"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-6"
    >
      <KpiCard
        label="Total Students"
        value={<SlidingNumber value={kpis.totalStudents} />}
        icon={UsersRound}
        headline="Active enrollment"
        detail="Students with an active account record."
      />
      <KpiCard
        label="Present Today"
        value={<SlidingNumber value={kpis.presentToday} />}
        icon={UserRoundCheck}
        headline={`${formatNumber(kpis.lateToday)} arrived late`}
        detail="Students who tapped in at least once today."
      />
      <KpiCard
        label="Late Today"
        value={<SlidingNumber value={kpis.lateToday} />}
        icon={Clock4}
        headline="Tapped in after the cutoff"
        detail="Counted as attended, so the rate is unaffected."
      />
      <KpiCard
        label="Absent Today"
        value={<SlidingNumber value={kpis.absentToday} />}
        icon={UserRoundX}
        headline="Recorded absences"
        detail="Recorded absences only; missing taps remain provisional."
      />
      <KpiCard
        label="Attendance Rate"
        value={<SlidingNumber value={kpis.attendanceRate} decimalPlaces={1} suffix="%" />}
        icon={TrendingUp}
        headline="Present over present plus absent"
        detail="Compared with the previous session day."
        trend={trend}
      />
      <KpiCard
        label="RFID Taps Today"
        value={<SlidingNumber value={kpis.rfidTapsToday} />}
        icon={ScanLine}
        headline="Reader activity"
        detail="Time-in and time-out taps combined."
      />
    </section>
  )
}
