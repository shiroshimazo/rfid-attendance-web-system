import type { ReactNode } from "react"

import {
  TrendingUp,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TeacherReportsKpis } from "@/features/reports/teacher-panel"
import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import { formatNumber } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  detail: string
}

function KpiCard({ label, value, icon: Icon, detail }: KpiCardProps) {
  return (
    <Card className="@container/card gap-4" data-print="block">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon aria-hidden className="size-4" />
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[16rem]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground text-pretty">
        {detail}
      </CardFooter>
    </Card>
  )
}

export function ReportKpiCard({ kpis, sessionDays, index }: {
  kpis: TeacherReportsKpis; sessionDays: number; index: number
}) {
  const dayLabel = `${formatNumber(sessionDays)} recorded day${sessionDays === 1 ? "" : "s"}`
  return [
      <KpiCard
        key="0"
        label="Total Assigned"
        value={<SlidingNumber value={kpis.totalAssigned} />}
        icon={UsersRound}
        detail="Assigned students counted in this report."
      />,
      <KpiCard
        key="1"
        label="Total Present"
        value={<SlidingNumber value={kpis.totalPresent} />}
        icon={UserRoundCheck}
        detail={`Time-ins recorded across ${dayLabel}, late arrivals included.`}
      />,
      <KpiCard
        key="2"
        label="Total Absent"
        value={<SlidingNumber value={kpis.totalAbsent} />}
        icon={UserRoundX}
        detail={`Recorded absences across ${dayLabel}.`}
      />,
      <KpiCard
        key="3"
        label="Recorded Attendance Rate"
        value={kpis.attendanceRate === null ? "—" : <SlidingNumber value={kpis.attendanceRate} decimalPlaces={1} suffix="%" />}
        icon={TrendingUp}
        detail="Present and Late over attended plus recorded absent sessions."
      />
  ][index]
}

export function KpiCards({ kpis, sessionDays }: { kpis: TeacherReportsKpis; sessionDays: number }) {
  return <section aria-label="Report key performance indicators" className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {[0, 1, 2, 3].map(index => <ReportKpiCard key={index} index={index} kpis={kpis} sessionDays={sessionDays} />)}
  </section>
}
