"use client"

import {
  AttendanceStatusBadge,
  RfidStatusBadge,
} from "@/components/attendance-status-badge"
import { SmsStatusBadge } from "@/components/sms-status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { StudentAttendanceRow } from "@/features/attendance/student-attendance"
import {
  formatClockTime,
  formatDateValue,
  formatTimestamp,
} from "@/lib/format"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-pretty">{value}</dd>
    </div>
  )
}

export function AttendanceDetailDialog({
  record,
  onOpenChange,
}: {
  /** Null closes the dialog; a record opens it for that date. */
  record: StudentAttendanceRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(record)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {record ? (
          <>
            <DialogHeader>
              <DialogTitle>Attendance details</DialogTitle>
              <DialogDescription>
                Tap record for {formatDateValue(record.date)}.
              </DialogDescription>
            </DialogHeader>

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Date" value={formatDateValue(record.date)} />
              <DetailRow label="Campus" value={record.campus} />
              <DetailRow
                label="Time in"
                value={formatClockTime(record.timeIn)}
              />
              <DetailRow
                label="Time out"
                value={formatClockTime(record.timeOut)}
              />
            </dl>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Statuses</h3>
              <div className="flex flex-wrap gap-1.5">
                <AttendanceStatusBadge status={record.status} />
                <RfidStatusBadge status={record.rfidStatus} />
                {record.smsStatus ? (
                  <SmsStatusBadge status={record.smsStatus} />
                ) : (
                  <Badge variant="outline">No SMS</Badge>
                )}
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Card number"
                  value={record.rfidNumber ?? "—"}
                />
                <DetailRow
                  label="SMS sent time"
                  value={formatTimestamp(record.smsSentAt)}
                />
              </dl>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
