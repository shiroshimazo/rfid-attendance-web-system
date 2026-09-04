import type { ReactNode } from "react"

import { AccountStatusBadge } from "@/components/account-status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CurrentAccount } from "@/features/auth/server"
import { formatTimestamp } from "@/lib/format"

const roleLabels: Record<CurrentAccount["role"], string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 max-w-full text-right text-sm font-medium break-words text-pretty">
        {children}
      </dd>
    </div>
  )
}

/** Read-only view of the signed-in session. Nothing here can be edited. */
export function SessionCard({
  account,
  lastSignInAt,
}: {
  account: CurrentAccount
  lastSignInAt: string | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Session details</CardTitle>
        <CardDescription className="text-pretty">
          The account this browser is signed in with. Role and status are
          managed by the system, not from this page.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <dl className="divide-y">
          <DetailRow label="Signed in as">{account.email}</DetailRow>
          <DetailRow label="Role">
            <Badge variant="secondary">{roleLabels[account.role]}</Badge>
          </DetailRow>
          <DetailRow label="Account status">
            <AccountStatusBadge status={account.status} />
          </DetailRow>
          <DetailRow label="Last sign-in">
            <span className="tabular-nums">
              {formatTimestamp(lastSignInAt)}
            </span>
          </DetailRow>
        </dl>

        <Separator className="my-4" />

        <p className="text-sm text-muted-foreground text-pretty">
          Sign out from the account menu in the sidebar when you are finished
          on a shared computer.
        </p>
      </CardContent>
    </Card>
  )
}
