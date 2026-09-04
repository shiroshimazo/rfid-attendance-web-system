import type { ReactNode } from "react"

import {
  CalendarClock,
  Sunrise,
  Sunset,
  Timer,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PILOT_SECTIONS } from "@/features/academic/pilot"
import type { ScheduleKpis } from "@/features/schedules/schema"
import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import { formatNumber } from "@/lib/format"

function KpiCard({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string
  value: ReactNode
  icon: LucideIcon
  detail: string
}) {
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
      <CardFooter className="text-sm text-muted-foreground text-pretty">
        {detail}
      </CardFooter>
    </Card>
  )
}

export function KpiCards({ kpis }: { kpis: ScheduleKpis }) {
  return (
    <section
      aria-label="Schedule summary"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      <KpiCard
        label="Sections Scheduled"
        value={<SlidingNumber value={kpis.sectionsScheduled} />}
        icon={CalendarClock}
        detail={`Of ${formatNumber(PILOT_SECTIONS.length)} pilot sections. A section with no row is never flagged Late.`}
      />
      <KpiCard
        label="Morning Sections"
        value={<SlidingNumber value={kpis.morningSections} />}
        icon={Sunrise}
        detail="Classes starting before 12:00 PM, Philippines Time."
      />
      <KpiCard
        label="Afternoon Sections"
        value={<SlidingNumber value={kpis.afternoonSections} />}
        icon={Sunset}
        detail="Classes starting from 12:00 PM onwards, Philippines Time."
      />
      <KpiCard
        label="Average Grace"
        value={
          <SlidingNumber
            value={kpis.averageGrace}
            decimalPlaces={Number.isInteger(kpis.averageGrace) ? 0 : 1}
            suffix=" min"
          />
        }
        icon={Timer}
        detail="Mean grace window across scheduled sections. The pilot default is 15."
      />
    </section>
  )
}
