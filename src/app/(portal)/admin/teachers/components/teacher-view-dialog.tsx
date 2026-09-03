"use client"

import { AccountStatusBadge } from "@/components/account-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { TeacherView } from "@/features/teachers/directory"
import { formatDateValue, initialsOf } from "@/lib/format"

import { AssignmentBadges } from "./assignment-badges"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-pretty">{value}</dd>
    </div>
  )
}

export function TeacherViewDialog({
  teacher,
  onOpenChange,
}: {
  /** Null closes the dialog; a teacher opens it for that record. */
  teacher: TeacherView | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(teacher)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        {teacher ? (
          <>
            <DialogHeader>
              <DialogTitle>Teacher details</DialogTitle>
              <DialogDescription>
                Full profile, employment record, and teaching assignments.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                {teacher.profilePicture ? (
                  <AvatarImage src={teacher.profilePicture} alt="" />
                ) : null}
                <AvatarFallback>{initialsOf(teacher.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{teacher.fullName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {teacher.email}
                </p>
              </div>
              <AccountStatusBadge status={teacher.status} className="ml-auto" />
            </div>

            <Separator />

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Teacher ID" value={teacher.teacherId} />
              <DetailRow label="Department" value={teacher.department} />
              <DetailRow label="Gender" value={teacher.gender ?? "—"} />
              <DetailRow
                label="Civil status"
                value={teacher.civilStatus ?? "—"}
              />
              <DetailRow
                label="Date of birth"
                value={formatDateValue(teacher.dateOfBirth)}
              />
              <DetailRow
                label="Date hired"
                value={formatDateValue(teacher.dateHired)}
              />
              <DetailRow
                label="Phone number"
                value={teacher.phoneNumber ?? "—"}
              />
              <DetailRow label="Email address" value={teacher.email} />
            </dl>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                Teaching assignments
                <span className="ml-2 font-normal text-muted-foreground tabular-nums">
                  {teacher.assignments.length}
                </span>
              </h3>
              <AssignmentBadges assignments={teacher.assignments} />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
