import { MessageSquareText } from "lucide-react"

import { SmsStatusBadge } from "@/components/sms-status-badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import type { ParentSmsInfo } from "@/features/attendance/student-dashboard"
import { formatTimestamp } from "@/lib/format"

export function SmsStatusCard({ sms }: { sms: ParentSmsInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <MessageSquareText aria-hidden className="size-4" />
          Parent SMS Status
        </CardDescription>
        {sms.status ? (
          <SmsStatusBadge status={sms.status} />
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            No notification yet
          </span>
        )}
      </CardHeader>
      <CardContent>
        {sms.status ? (
          <dl className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="text-sm font-medium">{sms.status}</dd>
            </div>
            {sms.sentAt ? (
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-sm text-muted-foreground">Sent at</dt>
                <dd className="text-sm font-medium tabular-nums">
                  {formatTimestamp(sms.sentAt)}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground text-pretty">
            A notification is sent to the parent contact after the first tap of
            the day.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
