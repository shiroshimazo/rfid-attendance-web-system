import { BookOpen } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TeacherProfile } from "@/features/profiles/teacher-profile"

/** Read-only assignment list. Changes are made by an administrator. */
export function AssignmentsCard({ profile }: { profile: TeacherProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching assignments</CardTitle>
        <CardDescription className="text-pretty">
          Active class assignments. A dash means the assignment covers every
          value for that field.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {profile.assignments.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No active assignments"
            description="Contact an administrator to assign programs, subjects, and sections."
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-3">Program</TableHead>
                  <TableHead className="px-3">Course / Subject</TableHead>
                  <TableHead className="hidden px-3 md:table-cell">
                    Year Level
                  </TableHead>
                  <TableHead className="hidden px-3 md:table-cell">
                    Section
                  </TableHead>
                  <TableHead className="hidden px-3 lg:table-cell">
                    Campus
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-3">
                      <Badge
                        variant="outline"
                        className="border-primary/25 bg-primary/5"
                        title={assignment.programName}
                      >
                        {assignment.programCode}
                      </Badge>
                      <span className="block text-xs text-muted-foreground md:hidden">
                        {assignment.yearLevel ?? "All years"} ·{" "}
                        {assignment.section ?? "All sections"}
                      </span>
                    </TableCell>
                    <TableCell className="px-3">
                      <span className="font-medium">
                        {assignment.courseCode}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {assignment.courseName}
                      </span>
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      {assignment.yearLevel ?? "—"}
                    </TableCell>
                    <TableCell className="hidden px-3 md:table-cell">
                      {assignment.section ?? "—"}
                    </TableCell>
                    <TableCell className="hidden px-3 lg:table-cell">
                      {assignment.campus ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
