import type { ReactNode } from "react"

import {
  BookOpen,
  GraduationCap,
  Layers,
  Library,
  type LucideIcon,
} from "lucide-react"

import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PILOT_PROGRAM_CODE, PILOT_YEAR_LEVEL } from "@/features/academic/pilot"
import type { AcademicKpis } from "@/features/academic/schema"
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

export function KpiCards({ kpis }: { kpis: AcademicKpis }) {
  return (
    <section
      aria-label="Academic catalog summary"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      <KpiCard
        label="Active Programs"
        value={<SlidingNumber value={kpis.activePrograms} />}
        icon={GraduationCap}
        detail={`${formatNumber(kpis.archivedPrograms)} archived. Only ${PILOT_PROGRAM_CODE} can be assigned during the pilot.`}
      />
      <KpiCard
        label="Active Subjects"
        value={<SlidingNumber value={kpis.activeCourses} />}
        icon={BookOpen}
        detail={`${formatNumber(kpis.pilotCourses)} under ${PILOT_PROGRAM_CODE}, offered to teacher assignments and schedules.`}
      />
      <KpiCard
        label="Class Groupings"
        value={<SlidingNumber value={kpis.activeSections} />}
        icon={Layers}
        detail={`${formatNumber(kpis.assignableSections)} can be assigned in the ${PILOT_PROGRAM_CODE} ${PILOT_YEAR_LEVEL} pilot.`}
      />
      <KpiCard
        label="Catalog Only"
        value={<SlidingNumber value={kpis.catalogOnly} />}
        icon={Library}
        detail="Active programs, subjects, and groupings stored for future use. They cannot be assigned until the pilot is retired."
      />
    </section>
  )
}
