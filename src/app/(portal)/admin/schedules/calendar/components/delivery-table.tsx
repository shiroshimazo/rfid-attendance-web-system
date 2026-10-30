"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { MailX } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { TablePagination } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { LiveRefresh } from "@/components/live-refresh"
import type { CalendarDeliveryPanel } from "@/features/calendar/delivery"
import { calendarEmailTypes, calendarEmailStatuses } from "@/features/calendar/schema"
import { DeliveryControl } from "./delivery-controls"
import { PortalLink } from "@/components/portal-link"

const timestamp = (value: string | null) => value ? new Date(value).toLocaleString("en-PH", { timeZone: "Asia/Manila" }) : "—"

export function DeliveryTable({ panel, today }: { panel: CalendarDeliveryPanel; today: string }) {
  const router = useRouter(), pathname = usePathname(), params = useSearchParams()
  function navigate(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    router.replace(`${pathname}?${next}`, { scroll: false })
  }
  return <div className="min-w-0 space-y-4">
    <LiveRefresh channel="admin-calendar-deliveries" tables={["calendar_email_deliveries"]} />
    <Tabs value="deliveries" onValueChange={tab => router.replace(`${pathname}?tab=${tab}`, { scroll: false })}><TabsList aria-label="Calendar views" className="h-auto flex-wrap">{[["calendar", "Calendar"], ["list", "All announcements"], ["deliveries", "Email deliveries"]].map(([tab, label]) => <TabsTrigger key={tab} value={tab} asChild><PortalLink href={`${pathname}?tab=${tab}`} onClick={event => event.preventDefault()}>{label}</PortalLink></TabsTrigger>)}</TabsList><TabsContent value="deliveries" className="mt-4">
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Email deliveries</CardTitle>
        <CardDescription>Sent means accepted by the email provider, not confirmed inbox delivery. Times use Asia/Manila.</CardDescription>
        <CardAction><div className="flex flex-wrap justify-end gap-2"><Button size="sm" variant="outline" onClick={() => router.refresh()}>Refresh</Button><DeliveryControl today={today} /></div></CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <form role="search" aria-label="Filter email deliveries" className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); navigate({ entry: String(data.get("entry") ?? ""), type: String(data.get("type") ?? ""), status: String(data.get("status") ?? ""), from: String(data.get("from") ?? ""), to: String(data.get("to") ?? ""), page: "1" }) }}>
          <div className="space-y-2"><Label htmlFor="delivery-entry">Entry ID</Label><Input id="delivery-entry" name="entry" type="number" min="1" step="1" defaultValue={panel.filters.entryId ?? ""} /></div>
          {([['type', 'Type', calendarEmailTypes], ['status', 'Status', calendarEmailStatuses]] as const).map(([name, label, options]) => <div className="space-y-2" key={name}><Label htmlFor={`delivery-${name}`}>{label}</Label><Select name={name} defaultValue={panel.filters[name] ?? "all"}><SelectTrigger id={`delivery-${name}`} className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{options.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>)}
          {([['from', 'Created from'], ['to', 'Created through']] as const).map(([name, label]) => <div className="space-y-2" key={name}><Label htmlFor={`delivery-${name}`}>{label}</Label><Input id={`delivery-${name}`} type="date" name={name} defaultValue={panel.filters[name] ?? ""} /></div>)}
          <div className="flex items-end gap-2"><Button type="submit">Filter</Button><Button type="button" variant="outline" onClick={() => router.replace(`${pathname}?tab=deliveries`)}>Reset</Button></div>
        </form>
        {panel.deliveries.length === 0 ? <EmptyState icon={MailX} title="No email deliveries" description="No deliveries match these filters. Reset or widen the date range." /> : <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow className="bg-muted/50">{["Entry", "Type", "Recipient", "Role", "Status", "Attempts", "Last attempt", "Sent time", "Error / next step", "Retry"].map(label => <TableHead key={label} className="px-3">{label}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {panel.deliveries.map(row => <TableRow key={row.id}>
                <TableCell className="px-3"><span className="block min-w-32 max-w-56 whitespace-normal break-words">{row.calendar_entries?.title ?? "Announcement"}</span><span className="text-xs text-muted-foreground tabular-nums">#{row.calendar_entry_id}</span></TableCell>
                <TableCell className="px-3">{row.notification_type}</TableCell><TableCell className="px-3">{row.recipient_email}</TableCell><TableCell className="px-3">{row.recipient_role}</TableCell>
                <TableCell className="px-3"><Badge variant={row.status === "Failed" ? "destructive" : "secondary"}>{row.status}</Badge></TableCell><TableCell className="px-3 tabular-nums">{row.attempt_count}</TableCell><TableCell className="px-3">{timestamp(row.last_attempt_at)}</TableCell><TableCell className="px-3">{timestamp(row.sent_at)}</TableCell>
                <TableCell className="min-w-60 max-w-80 whitespace-normal break-words px-3">{row.error_message && <p>{row.error_message}</p>}{row.status === "Sent" ? "Accepted by provider." : row.status === "Failed" && row.retry_allowed ? "Retry this email or eligible failures in its batch." : row.attempt_count > 0 || !row.retry_allowed ? "Acceptance is uncertain. Check provider records before manual recovery; retry is blocked." : "Queued. Refresh for progress. If it stays pending, ask an administrator to inspect scheduling before resending."}</TableCell>
                <TableCell className="px-3">{row.status === "Failed" && row.retry_allowed ? <div className="flex gap-2"><DeliveryControl today={today} target={{ id: row.id }} /><DeliveryControl today={today} target={{ batchId: row.batch_id }} /></div> : "—"}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </div>}
      </CardContent>
      {panel.deliveries.length > 0 && <CardFooter className="flex-wrap justify-between gap-3 border-t">
        <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">{panel.total} deliver{panel.total === 1 ? "y" : "ies"} · page {panel.page} of {panel.pageCount}</p>
        <TablePagination page={panel.page} pageCount={panel.pageCount} onPageChange={page => navigate({ page: String(page) })} />
      </CardFooter>}
    </Card>
    </TabsContent></Tabs>
  </div>
}
