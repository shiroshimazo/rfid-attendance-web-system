"use client"

import { AccountStatusBadge } from "@/components/account-status-badge"
import { RfidStatusBadge } from "@/components/attendance-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { StudentView } from "@/features/students/directory"
import { formatDateValue, initialsOf } from "@/lib/format"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-pretty">{value}</dd>
    </div>
  )
}

export function StudentViewDialog({
  student,
  onOpenChange,
}: {
  /** Null closes the dialog; a student opens it for that record. */
  student: StudentView | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        {student ? (
          <>
            <DialogHeader>
              <DialogTitle>Student details</DialogTitle>
              <DialogDescription>
                Personal record, parent contact, academic placement, and RFID
                cards.
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
                <p className="truncate text-sm text-muted-foreground">
                  {student.email}
                </p>
              </div>
              <AccountStatusBadge status={student.status} className="ml-auto" />
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Academic placement</h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-primary/25 bg-primary/5">
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

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Gender" value={student.gender ?? "—"} />
              <DetailRow
                label="Date of birth"
                value={formatDateValue(student.dateOfBirth)}
              />
              <DetailRow
                label="Place of birth"
                value={student.placeOfBirth ?? "—"}
              />
              <DetailRow
                label="Contact number"
                value={student.contactNumber ?? "—"}
              />
              <DetailRow label="Address" value={student.address ?? "—"} />
              <DetailRow label="Email address" value={student.email} />
              <DetailRow
                label="Parent or guardian"
                value={student.parentName}
              />
              <DetailRow
                label="Parent contact number"
                value={student.parentContactNumber}
              />
            </dl>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">RFID cards</h3>
              {student.cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No card has been assigned yet.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {student.cards.map((card) => (
                    <li
                      key={card.id}
                      className="flex flex-wrap items-center justify-between gap-2 text-sm"
                    >
                      <span className="font-mono tabular-nums">
                        {card.rfidNumber}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {formatDateValue(card.assignedDate)}
                        </span>
                        <RfidStatusBadge status={card.cardStatus} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
