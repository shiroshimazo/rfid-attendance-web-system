import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StudentIdentity } from "@/features/attendance/student-dashboard"
import { initialsOf } from "@/lib/format"

export function StudentIdentityCard({ student }: { student: StudentIdentity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>
          Identity on record for the signed-in student.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-14">
            {student.profilePicture ? (
              <AvatarImage src={student.profilePicture} alt="" />
            ) : null}
            <AvatarFallback className="text-base">
              {initialsOf(student.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-balance">
              {student.fullName}
            </p>
            <p className="font-mono text-sm text-muted-foreground tabular-nums">
              {student.studentId}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="secondary">{student.yearLevel}</Badge>
          <Badge variant="outline">{student.section}</Badge>
          <Badge variant="outline">{student.campus}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
