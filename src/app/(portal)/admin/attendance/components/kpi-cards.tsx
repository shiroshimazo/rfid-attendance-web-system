import {
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
import type { AttendancePanelKpis } from "@/features/attendance/panel"
import { formatNumber, formatPercent } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  detail: string
  share?: string
}

function KpiCard({ label, value, icon: Icon, detail, share }: KpiCardProps) {
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
        {share ? (
          <CardAction>
            <Badge variant="outline" className="tabular-nums">
              {share}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground text-pretty">
        {detail}
      </CardFooter>
    </Card>
  )
}

function shareOf(value: number, total: number) {
  return total > 0 ? formatPercent((value / total) * 100) : undefined
}

export function KpiCards({
  kpis,
  readableDate,
}: {
  kpis: AttendancePanelKpis
  readableDate: string
}) {
  return (
    <section
      aria-label="Attendance summary"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3"
    >
      <KpiCard
        label="Total Students"
        value={formatNumber(kpis.totalStudents)}
        icon={UsersRound}
        detail="Active students matching the current filters."
      />
      <KpiCard
        label="Present"
        value={formatNumber(kpis.present)}
        icon={UserRoundCheck}
        share={shareOf(kpis.present, kpis.totalStudents)}
        detail={`Students who tapped in on ${readableDate}, late arrivals included.`}
      />
      <KpiCard
        label="Absent"
        value={formatNumber(kpis.absent)}
        icon={UserRoundX}
        share={shareOf(kpis.absent, kpis.totalStudents)}
        detail="No time-in recorded. Excused students are counted separately."
      />
    </section>
  )
}
