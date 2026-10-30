import Link from "next/link"
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
  href: string
  label: string
  value: ReactNode
  icon: LucideIcon
  headline: string
  detail: string
}

function KpiCard({ href, label, value, icon: Icon, headline, detail }: KpiCardProps) {
  return (
    <Link href={href} aria-label={`View ${label.toLowerCase()}`} className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="@container/card h-full gap-4 transition-colors hover:border-primary/50 hover:bg-muted/30 group-focus-visible:border-primary/50">
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
          <span className="mt-1 text-xs font-medium text-primary group-hover:underline">View details<span aria-hidden> &rarr;</span></span>
        </CardFooter>
      </Card>
    </Link>
  )
}

export function KpiCards({ kpis }: { kpis: StudentDashboardKpis }) {
  return (
    <section
      aria-label="Personal attendance totals"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4"
    >
      <KpiCard
        href="/student/my-attendance?status=Attended"
        label="Days Present"
        value={<SlidingNumber value={kpis.totalPresent} />}
        icon={UserRoundCheck}
        headline="Days tapped in"
        detail="Includes late arrivals. Excludes days with no classes or online/manual attendance."
      />
      <KpiCard
        href="/student/my-attendance?status=Late"
        label="Days Late"
        value={<SlidingNumber value={kpis.totalLate} />}
        icon={Clock4}
        headline="Days tapped in after the cutoff"
        detail="Late arrivals also count toward Days Present."
      />
      <KpiCard
        href="/student/my-attendance?status=Absent"
        label="Days Absent"
        value={<SlidingNumber value={kpis.totalAbsent} />}
        icon={UserRoundX}
        headline="Recorded absences"
        detail="Days without an attendance record are not counted as absent."
      />
      <KpiCard
        href="/student/my-attendance"
        label="RFID Taps"
        value={<SlidingNumber value={kpis.totalRfidTaps} />}
        icon={ScanLine}
        headline="Campus card taps"
        detail="Time-in and time-out taps combined."
      />
    </section>
  )
}
