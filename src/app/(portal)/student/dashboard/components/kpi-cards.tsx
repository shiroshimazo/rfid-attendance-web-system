import type { ReactNode } from "react"

import {
  Clock4,
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
import { SlidingNumber } from "@/components/motion-primitives/sliding-number"

interface KpiCardProps {
  label: string
  value: ReactNode
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
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4"
    >
      <KpiCard
        label="Total Present"
        value={<SlidingNumber value={kpis.totalPresent} />}
        icon={UserRoundCheck}
        headline="Days tapped in"
        detail="Present and late arrivals combined."
      />
      <KpiCard
        label="Total Late"
        value={<SlidingNumber value={kpis.totalLate} />}
        icon={Clock4}
        headline="Days tapped in after the cutoff"
        detail="Already counted inside Total Present."
      />
      <KpiCard
        label="Total Absent"
        value={<SlidingNumber value={kpis.totalAbsent} />}
        icon={UserRoundX}
        headline="School days missed"
        detail="Recorded absences; unrecorded days excluded."
      />
      <KpiCard
        label="Total RFID Taps"
        value={<SlidingNumber value={kpis.totalRfidTaps} />}
        icon={ScanLine}
        headline="Reader activity"
        detail="Time-in and time-out taps combined."
      />
    </section>
  )
}
