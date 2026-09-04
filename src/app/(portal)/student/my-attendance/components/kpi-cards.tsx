import {
  Clock4,
  Percent,
  UserRoundCheck,
  UserRoundX,
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
import type { StudentAttendanceKpis } from "@/features/attendance/student-attendance"
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

export function KpiCards({ kpis }: { kpis: StudentAttendanceKpis }) {
  const denominator = kpis.totalPresent + kpis.totalAbsent

  return (
    <section
      aria-label="Personal attendance summary"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4"
    >
      <KpiCard
        label="Total Present"
        value={formatNumber(kpis.totalPresent)}
        icon={UserRoundCheck}
        share={
          denominator > 0
            ? formatPercent((kpis.totalPresent / denominator) * 100)
            : undefined
        }
        detail="Days tapped in, late arrivals included."
      />
      <KpiCard
        label="Total Late"
        value={formatNumber(kpis.totalLate)}
        icon={Clock4}
        share={
          kpis.totalPresent > 0
            ? formatPercent((kpis.totalLate / kpis.totalPresent) * 100)
            : undefined
        }
        detail="Days tapped in after the cutoff, already inside Total Present."
      />
      <KpiCard
        label="Total Absent"
        value={formatNumber(kpis.totalAbsent)}
        icon={UserRoundX}
        share={
          denominator > 0
            ? formatPercent((kpis.totalAbsent / denominator) * 100)
            : undefined
        }
        detail="Weekdays with no tap; excused days excluded."
      />
      <KpiCard
        label="Attendance Rate"
        value={formatPercent(kpis.attendanceRate)}
        icon={Percent}
        detail="Present days over present plus absent days."
      />
    </section>
  )
}
