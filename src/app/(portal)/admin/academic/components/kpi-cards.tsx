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
        detail={`${formatNumber(kpis.archivedPrograms)} archived. Active programs are available for assignment.`}
      />
      <KpiCard
        label="Active Subjects"
        value={<SlidingNumber value={kpis.activeCourses} />}
        icon={BookOpen}
        detail={`${formatNumber(kpis.assignableCourses)} under active programs, offered to teacher assignments and schedules.`}
      />
      <KpiCard
        label="Class Groupings"
        value={<SlidingNumber value={kpis.activeSections} />}
        icon={Layers}
        detail={`${formatNumber(kpis.assignableSections)} can be assigned to students and teachers.`}
      />
      <KpiCard
        label="Unavailable Entries"
        value={<SlidingNumber value={kpis.unavailableEntries} />}
        icon={Library}
        detail="Active subjects and groupings whose programs are inactive or archived."
      />
    </section>
  )
}
