"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { MailX } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
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
import { SearchTagInput } from "@/components/search-tag-input"
import { LiveRefresh } from "@/components/live-refresh"
import type { CalendarDeliveryPanel } from "@/features/calendar/delivery"
import { calendarEmailTypes, calendarEmailStatuses } from "@/features/calendar/schema"
import { DeliveryControl, DeliveryRetryMenu } from "./delivery-controls"
import { PortalLink } from "@/components/portal-link"

const timestamp = (value: string | null) => value ? new Date(value).toLocaleString("en-PH", { timeZone: "Asia/Manila" }) : "—"

export function DeliveryTable({ panel, today }: { panel: CalendarDeliveryPanel; today: string }) {
  const router = useRouter(), pathname = usePathname(), params = useSearchParams()
  const [search, setSearch] = React.useState(panel.filters.search ?? [])
  const searchKey = JSON.stringify(panel.filters.search ?? [])
  const [previousSearchKey, setPreviousSearchKey] = React.useState(searchKey)
  if (previousSearchKey !== searchKey) {
    setPreviousSearchKey(searchKey)
    setSearch(panel.filters.search ?? [])
  }
  const current = {
    type: panel.filters.type ?? "",
    status: panel.filters.status ?? "",
    from: panel.filters.from ?? "",
    to: panel.filters.to ?? "",
  }
  function navigate(patch: Record<string, string | string[]>) {
    const next = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(patch)) {
      next.delete(key)
      if (Array.isArray(value)) value.forEach(item => { if (item) next.append(key, item) })
      else if (value) next.set(key, value)
    }
    router.replace(`${pathname}?${next}`, { scroll: false })
  }
  function applyFilters(patch: Partial<typeof current> = {}) {
    const value = (key: keyof typeof current) => (patch[key] ?? current[key]).trim()
    navigate({ search, entry: "", type: value("type"), status: value("status"), from: value("from"), to: value("to"), page: "1" })
  }
  function applySearch(next: string[]) {
    setSearch(next)
    navigate({ search: next, entry: "", ...current, page: "1" })
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
        <div role="search" aria-label="Filter email deliveries">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
            <div className="space-y-2"><span className="block text-sm leading-none font-medium select-none">Search</span><SearchTagInput id="delivery-search" label="Search email deliveries" value={search} onValueChange={applySearch} placeholder="ID, title, recipient, or role" leading={<HugeiconsIcon icon={Search01Icon} size={16} />} /></div>
            {([['type', 'Type', calendarEmailTypes], ['status', 'Status', calendarEmailStatuses]] as const).map(([name, label, options]) => <div className="space-y-2" key={name}><Label htmlFor={`delivery-${name}`}>{label}</Label><Select name={name} defaultValue={current[name] || "all"} onValueChange={value => applyFilters(name === "type" ? { type: value === "all" ? "" : value } : { status: value === "all" ? "" : value })}><SelectTrigger id={`delivery-${name}`} className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{options.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>)}
            {([['from', 'Created from'], ['to', 'Created through']] as const).map(([name, label]) => <div className="space-y-2" key={name}><Label htmlFor={`delivery-${name}`}>{label}</Label><Input id={`delivery-${name}`} type="date" name={name} defaultValue={current[name]} onChange={event => applyFilters(name === "from" ? { from: event.currentTarget.value } : { to: event.currentTarget.value })} /></div>)}
            <div className="space-y-2"><span aria-hidden className="block text-sm leading-none font-medium select-none">&nbsp;</span><Button type="button" variant="outline" onClick={() => router.replace(`${pathname}?tab=deliveries`)}>Reset</Button></div>
          </div>
        </div>
        {panel.deliveries.length === 0 ? <EmptyState icon={MailX} title="No email deliveries" description="No deliveries match these filters. Reset or widen the date range." /> : <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow className="bg-muted/50">{["Entry", "Type", "Recipient", "Role", "Status", "Attempts", "Last attempt", "Sent time", "Retry"].map(label => <TableHead key={label} className="px-3">{label}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {panel.deliveries.map(row => <TableRow key={row.id}>
                <TableCell className="px-3"><span className="block min-w-32 max-w-56 whitespace-normal break-words">{row.calendar_entries?.title ?? "Announcement"}</span><span className="text-xs text-muted-foreground tabular-nums">#{row.calendar_entry_id}</span></TableCell>
                <TableCell className="px-3">{row.notification_type}</TableCell><TableCell className="px-3">{row.recipient_email}</TableCell><TableCell className="px-3">{row.recipient_role}</TableCell>
                <TableCell className="px-3"><Badge variant={row.status === "Failed" ? "destructive" : "secondary"} title={row.error_message ?? undefined}>{row.status}</Badge></TableCell><TableCell className="px-3 tabular-nums">{row.attempt_count}</TableCell><TableCell className="px-3">{timestamp(row.last_attempt_at)}</TableCell><TableCell className="px-3">{timestamp(row.sent_at)}</TableCell>
                <TableCell className="px-3">{row.status === "Failed" && row.retry_allowed ? <DeliveryRetryMenu id={row.id} batchId={row.batch_id} today={today} /> : "—"}</TableCell>
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
