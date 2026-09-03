"use client"

import { AccountStatusBadge } from "@/components/account-status-badge"
import { RfidStatusBadge } from "@/components/attendance-status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { RfidCardView } from "@/features/rfid/cards"
import { formatDateValue, formatTimestamp } from "@/lib/format"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-pretty">{value}</dd>
    </div>
  )
}

export function RfidCardViewDialog({
  card,
  onOpenChange,
}: {
  /** Null closes the dialog; a card opens it for that record. */
  card: RfidCardView | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(card)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {card ? (
          <>
            <DialogHeader>
              <DialogTitle>RFID card details</DialogTitle>
              <DialogDescription>
                Card number, status, and the student who taps with it.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-lg tabular-nums">
                {card.rfidNumber}
              </span>
              <RfidStatusBadge status={card.cardStatus} />
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                label="Assigned on"
                value={formatDateValue(card.assignedDate)}
              />
              <DetailRow
                label="Registered"
                value={formatTimestamp(card.createdAt)}
              />
              <DetailRow
                label="Last updated"
                value={formatTimestamp(card.updatedAt)}
              />
            </dl>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Card holder</h3>

              {card.student ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{card.student.fullName}</p>
                    <AccountStatusBadge status={card.student.status} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="border-primary/25 bg-primary/5"
                      title={card.student.programName}
                    >
                      {card.student.programCode}
                    </Badge>
                    <Badge variant="secondary">{card.student.yearLevel}</Badge>
                    <Badge variant="outline">{card.student.section}</Badge>
                    <Badge variant="outline">{card.student.campus}</Badge>
                  </div>

                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailRow
                      label="Student ID"
                      value={card.student.studentId}
                    />
                    <DetailRow
                      label="Email address"
                      value={card.student.email}
                    />
                    <DetailRow label="Program" value={card.student.programName} />
                  </dl>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  The student record behind this card is no longer visible.
                </p>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
