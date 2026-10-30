import { ScanLine, UserRoundCheck, UserRoundX, UsersRound } from "lucide-react"

import { SlidingNumber } from "@/components/motion-primitives/sliding-number"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentView } from "@/features/students/directory"

export function KpiCards({ students }: { students: StudentView[] }) {
  const cards = [
    {
      label: "Total Students",
      value: students.length,
      icon: UsersRound,
      detail: "Students in this directory. Archived accounts are excluded.",
    },
    {
      label: "Active Students",
      value: students.filter(student => student.status === "active").length,
      icon: UserRoundCheck,
      detail: "Student accounts with active status.",
    },
    {
      label: "Inactive Students",
      value: students.filter(student => student.status === "inactive").length,
      icon: UserRoundX,
      detail: "Student accounts with inactive status.",
    },
    {
      label: "With Active RFID",
      value: students.filter(student => student.activeCard !== null).length,
      icon: ScanLine,
      detail: "Students assigned an active RFID card.",
    },
  ]

  return (
    <section
      aria-label="Student summary"
      className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
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
