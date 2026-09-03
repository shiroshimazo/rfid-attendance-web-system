"use client"

import { Eye, History } from "lucide-react"
import Link from "next/link"

import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { TeacherStudentRow } from "@/features/students/teacher-directory"
import { formatClockTime, initialsOf } from "@/lib/format"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-pretty tabular-nums">{value}</dd>
    </div>
  )
}

/** Read-only record view. No edit, archive, or RFID actions are offered. */
export function StudentViewDialog({
  student,
  onOpenChange,
}: {
  /** Null closes the dialog; a student opens it for that record. */
  student: TeacherStudentRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {student ? (
          <>
            <DialogHeader>
              <DialogTitle>Student details</DialogTitle>
              <DialogDescription>
                Identity, academic placement, and today&apos;s attendance.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                {student.profilePicture ? (
                  <AvatarImage src={student.profilePicture} alt="" />
                ) : null}
                <AvatarFallback>{initialsOf(student.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{student.fullName}</p>
                <p className="truncate text-sm text-muted-foreground tabular-nums">
                  {student.studentId}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Academic placement</h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="outline"
                  className="border-primary/25 bg-primary/5"
                >
                  {student.programCode}
                </Badge>
                <Badge variant="secondary">{student.yearLevel}</Badge>
                <Badge variant="outline">{student.section}</Badge>
                <Badge variant="outline">{student.campus}</Badge>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Student ID" value={student.studentId} />
                <DetailRow label="Program" value={student.programName} />
              </dl>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Today&apos;s attendance</h3>
              <AttendanceStatusBadge status={student.status} />
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Time in"
                  value={formatClockTime(student.timeIn)}
                />
                <DetailRow
                  label="Time out"
                  value={formatClockTime(student.timeOut)}
                />
              </dl>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/teacher/attendance?search=${encodeURIComponent(student.studentId)}`}
                >
                  <History aria-hidden />
                  View attendance history
                </Link>
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

/** Row-level read-only trigger kept beside the dialog for reuse. */
export function StudentViewButton({ onView }: { onView: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="View student details"
      onClick={onView}
    >
      <Eye aria-hidden />
    </Button>
  )
}
