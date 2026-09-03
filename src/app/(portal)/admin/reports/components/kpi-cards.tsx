import {
  ScanLine,
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
import type { ReportsKpis } from "@/features/reports/panel"
import { formatNumber } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: string
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

export function KpiCards({
  kpis,
  sessionDays,
}: {
  kpis: ReportsKpis
  sessionDays: number
}) {
  const dayLabel = `${formatNumber(sessionDays)} session day${sessionDays === 1 ? "" : "s"}`

  return (
    <section
      aria-label="Report key performance indicators"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      <KpiCard
        label="Total Students"
        value={formatNumber(kpis.totalStudents)}
        icon={UsersRound}
        detail="Active students counted in this report."
      />
      <KpiCard
        label="Total Present"
        value={formatNumber(kpis.totalPresent)}
        icon={UserRoundCheck}
        detail={`Time-ins recorded across ${dayLabel}, late arrivals included.`}
      />
      <KpiCard
        label="Total Absent"
        value={formatNumber(kpis.totalAbsent)}
        icon={UserRoundX}
        detail={`Missed sessions across ${dayLabel}, excluding excused students.`}
      />
      <KpiCard
        label="RFID Scans"
        value={formatNumber(kpis.rfidScans)}
        icon={ScanLine}
        detail="Attendance records created by reader taps in this range."
      />
    </section>
  )
}
