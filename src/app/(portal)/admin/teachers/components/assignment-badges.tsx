import { BookOpen, GraduationCap, Layers, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { AssignmentView } from "@/features/teachers/directory"
import { cn } from "@/lib/utils"

/**
 * One row per assignment keeps a teacher on a single table row, however many
 * classes they handle.
 */
function AssignmentRow({ assignment }: { assignment: AssignmentView }) {
  return (
    <li className="flex flex-wrap items-center gap-1">
      <Badge
        variant="outline"
        className="border-primary/25 bg-primary/5 font-medium"
        title={`Program: ${assignment.programName}`}
      >
        <GraduationCap aria-hidden />
        {assignment.programCode}
      </Badge>
      <Badge
        variant="secondary"
        title={`Course/Subject: ${assignment.courseName}`}
      >
        <BookOpen aria-hidden />
        {assignment.courseCode}
      </Badge>
      {assignment.yearLevel ? (
        <Badge variant="outline" title="Year level">
          <Layers aria-hidden />
          {assignment.yearLevel}
        </Badge>
      ) : null}
      {assignment.section ? (
        <Badge variant="outline" title="Section">
          <Users aria-hidden />
          {assignment.section}
        </Badge>
      ) : null}
    </li>
  )
}

export function AssignmentBadges({
  assignments,
  limit,
  className,
}: {
  assignments: AssignmentView[]
  /** Extra assignments collapse into a counter instead of growing the row. */
  limit?: number
  className?: string
}) {
  if (assignments.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No assignments yet</span>
    )
  }

  const shown = limit ? assignments.slice(0, limit) : assignments
  const hidden = assignments.length - shown.length

  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {shown.map((assignment) => (
        <AssignmentRow key={assignment.id} assignment={assignment} />
      ))}
      {hidden > 0 ? (
        <li>
          <Badge variant="outline" className="text-muted-foreground tabular-nums">
            +{hidden} more
          </Badge>
        </li>
      ) : null}
    </ul>
  )
}
