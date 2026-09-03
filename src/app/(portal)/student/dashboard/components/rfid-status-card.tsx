import { Nfc } from "lucide-react"

import { RfidStatusBadge } from "@/components/attendance-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StudentRfidInfo } from "@/features/attendance/student-dashboard"
import { formatDateValue } from "@/lib/format"

const rfidDisplayDescriptions: Record<StudentRfidInfo["display"], string> = {
  Active: "Card assigned and ready to tap.",
  Registered: "Card on record but not active.",
  "Not registered": "No card has been assigned yet.",
}

export function RfidStatusCard({ rfid }: { rfid: StudentRfidInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Nfc aria-hidden className="size-4" />
          RFID Status
        </CardDescription>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span>{rfid.display}</span>
          <RfidStatusBadge status={rfid.cardStatus} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-pretty">
          {rfidDisplayDescriptions[rfid.display]}
        </p>
        {rfid.rfidNumber ? (
          <dl className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-sm text-muted-foreground">Card number</dt>
              <dd className="font-mono text-sm tabular-nums">
                {rfid.rfidNumber}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-sm text-muted-foreground">Assigned</dt>
              <dd className="text-sm font-medium">
                {formatDateValue(rfid.assignedDate)}
              </dd>
            </div>
          </dl>
        ) : null}
      </CardContent>
    </Card>
  )
}
