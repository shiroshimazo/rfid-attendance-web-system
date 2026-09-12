import { Archive, ClipboardCheck, ClipboardList, UserRoundCheck, UserRoundX, UsersRound } from "lucide-react"

import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TeacherView } from "@/features/teachers/directory"

export function KpiCards({ teachers }: { teachers: TeacherView[] }) {
  const counts = { active: 0, inactive: 0, archived: 0 }
  for (const teacher of teachers) counts[teacher.status] += 1
  const assigned = teachers.filter(
    (teacher) =>
      teacher.status === "active" &&
      teacher.assignments.some((assignment) => assignment.status === "active")
  ).length

  const cards = [
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: UsersRound,
      detail: "All teacher accounts, including archived accounts.",
    },
    {
      label: "Active Teachers",
      value: counts.active,
      icon: UserRoundCheck,
      detail: "Teacher accounts with active status.",
    },
    {
      label: "Inactive Teachers",
      value: counts.inactive,
      icon: UserRoundX,
      detail: "Teacher accounts with inactive status.",
    },
    {
      label: "Archived Teachers",
      value: counts.archived,
      icon: Archive,
      detail: "Archived teacher accounts retained in the directory.",
    },
    {
      label: "Assigned Teachers",
      value: assigned,
      icon: ClipboardCheck,
      detail: "Active teachers with at least one active assignment.",
    },
    {
      label: "Unassigned Teachers",
      value: counts.active - assigned,
      icon: ClipboardList,
      detail: "Active teachers with no active assignments.",
    },
  ]

  return (
    <section
      aria-label="Teacher summary"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-6"
    >
      {cards.map(({ label, value, icon: Icon, detail }) => (
        <Card key={label} className="@container/card gap-4">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Icon aria-hidden className="size-4" />
              {label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[16rem]/card:text-3xl">
              <SlidingNumber value={value} />
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground text-pretty">
            {detail}
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
