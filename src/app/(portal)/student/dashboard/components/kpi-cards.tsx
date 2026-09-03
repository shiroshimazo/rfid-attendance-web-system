import {
  ScanLine,
  UserRoundCheck,
  UserRoundX,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StudentDashboardKpis } from "@/features/attendance/student-dashboard"
import { formatNumber } from "@/lib/format"

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  headline: string
  detail: string
}

function KpiCard({ label, value, icon: Icon, headline, detail }: KpiCardProps) {
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
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <p className="line-clamp-1 font-medium">{headline}</p>
        <p className="text-muted-foreground text-pretty">{detail}</p>
      </CardFooter>
    </Card>
  )
}

export function KpiCards({ kpis }: { kpis: StudentDashboardKpis }) {
  return (
    <section
      aria-label="Personal attendance totals"
      className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
    >
      <KpiCard
        label="Total Present"
        value={formatNumber(kpis.totalPresent)}
        icon={UserRoundCheck}
        headline="Days tapped in"
        detail="Present and late arrivals combined."
      />
      <KpiCard
        label="Total Absent"
        value={formatNumber(kpis.totalAbsent)}
        icon={UserRoundX}
        headline="School days missed"
        detail="Weekdays with no tap; excused days excluded."
      />
      <KpiCard
        label="Total RFID Taps"
        value={formatNumber(kpis.totalRfidTaps)}
        icon={ScanLine}
        headline="Reader activity"
        detail="Time-in and time-out taps combined."
      />
    </section>
  )
}
