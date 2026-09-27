import type { Metadata } from "next"
import { Suspense } from "react"
import { CreditsCard } from "./components/credits-card"
import Link from "next/link"
import { redirect, unstable_rethrow } from "next/navigation"
import { requireRole } from "@/features/auth/server"
import { deliveryResultLabel, parseSmsLogQuery, smsLogPageUrl, smsStatuses, smsStatusLabel, smsTypeLabel, type SmsLogParams } from "@/features/sms-logs/query"
import { fetchSmsLogs } from "@/services/sms/logs"
import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateValue, formatTimestamp } from "@/lib/format"

export const metadata: Metadata = { title: "SMS Logs" }
export const dynamic = "force-dynamic"

export default async function SmsLogsPage({ searchParams }: { searchParams: Promise<SmsLogParams> }) {
  await requireRole("admin")
  const query = parseSmsLogQuery(await searchParams)
  let result
  try { result = await fetchSmsLogs(query) }
  catch (error) { unstable_rethrow(error) }
  if (result && query.page > result.pageCount) redirect(smsLogPageUrl(query, result.pageCount))

  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <LiveRefresh channel="live-admin-sms-logs" tables={["sms_notifications", "students", "attendance_records", "rfid_cards"]} />
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">SMS Logs</h1>
      <p className="text-sm text-muted-foreground text-pretty">Guardian arrival (Time In) and departure (Time Out) notifications and sending results. Times are shown in Philippine time (PHT).</p>
    </div>
    <Suspense fallback={<Card><CardContent className="pt-6 text-sm text-muted-foreground" role="status">Loading SMS credits…</CardContent></Card>}>
      <CreditsCard />
    </Suspense>
    <Card><CardContent className="pt-6">
      <form key={JSON.stringify(query)} action="/admin/sms-logs" method="get" className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2"><Label htmlFor="sms-status">SMS status</Label><select id="sms-status" name="status" defaultValue={query.status} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="all">All statuses</option>{smsStatuses.map(status => <option key={status} value={status}>{smsStatusLabel(status)}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="sms-from">Created from</Label><Input id="sms-from" name="from" type="date" defaultValue={query.from} required className="h-10" /></div>
        <div className="space-y-2"><Label htmlFor="sms-to">Created to</Label><Input id="sms-to" name="to" type="date" defaultValue={query.to} required className="h-10" /></div>
        <div className="flex gap-2"><Button type="submit" className="min-h-10">Apply filters</Button><Button asChild variant="outline" className="min-h-10"><Link href="/admin/sms-logs">Reset</Link></Button></div>
      </form>
    </CardContent></Card>
    {!result ? <DataErrorCard title="SMS logs could not be loaded" message="Please try again. If the problem continues, contact your system administrator." /> : <Card className="min-w-0"><CardContent className="space-y-4 pt-6">
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="tabular-nums">{result.count.toLocaleString()} matching notifications</p>
        <p>Sent means accepted by the SMS provider, not confirmed phone delivery. Pending may include an unknown sending outcome.</p>
      </div>
      {result.rows.length ? <div className="overflow-hidden rounded-lg border"><Table aria-label="SMS notification logs" className="min-w-[1200px]">
        <TableHeader><TableRow className="bg-muted/50">{["Name / Student ID", "RFID No.", "Recipient Number", "Type", "SMS Status", "Created", "Sent", "Details"].map(label => <TableHead scope="col" key={label}>{label}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{result.rows.map(row => <TableRow key={row.id}>
          <TableCell className="max-w-64 whitespace-normal"><p className="font-medium">{row.student?.full_name ?? "Student unavailable"}</p><p className="text-xs text-muted-foreground">{row.student?.student_id ?? "—"}</p></TableCell>
          <TableCell className="font-mono text-xs">{row.attendance?.card?.rfid_number ?? "—"}</TableCell>
          <TableCell className="tabular-nums">{row.parent_contact_number}</TableCell>
          <TableCell className="text-sm">{smsTypeLabel(row.notification_type)}</TableCell>
          <TableCell><Badge variant={row.sms_status === "Failed" ? "destructive" : row.sms_status === "Sent" ? "secondary" : "outline"}>{smsStatusLabel(row.sms_status)}</Badge></TableCell>
          <TableCell className="text-xs tabular-nums">{formatTimestamp(row.created_at)}</TableCell>
          <TableCell className="text-xs tabular-nums">{formatTimestamp(row.sent_at)}</TableCell>
          <TableCell><details><summary className="cursor-pointer rounded px-2 py-3 text-sm focus-visible:outline-2">View details</summary>
            <div className="mt-2 w-72 space-y-2 whitespace-normal break-words rounded bg-muted p-3 text-xs">
              <p className="whitespace-pre-wrap">{row.message}</p>
              <p><strong>Delivery result:</strong> {deliveryResultLabel(row.delivery_result, row.delivery_enabled)}</p>
              <p><strong>Attempt started:</strong> {formatTimestamp(row.delivery_started_at)}</p>
              <p><strong>Provider message ID:</strong> {row.provider_message_id ?? "—"}</p>
              <p><strong>Attendance date:</strong> {formatDateValue(row.attendance?.attendance_date)}</p>
              <p><strong>Campus:</strong> {row.attendance?.campus ?? "—"}</p>
              <p>SMS #{row.id} · Attendance #{row.attendance_id}</p>
            </div>
          </details></TableCell>
        </TableRow>)}</TableBody>
      </Table></div> : <div className="rounded-lg border border-dashed py-12 text-center"><h2 className="font-medium">No matching SMS logs</h2><p className="mt-1 text-sm text-muted-foreground">Try another date range or status. Only recorded notifications appear here.</p></div>}
      <nav aria-label="SMS log pages" className="flex items-center justify-end gap-3">
        {query.page > 1 && <Button asChild variant="outline"><Link href={smsLogPageUrl(query, query.page - 1)}>Previous</Link></Button>}
        <span className="text-sm tabular-nums">Page {query.page} of {result.pageCount}</span>
        {query.page < result.pageCount && <Button asChild variant="outline"><Link href={smsLogPageUrl(query, query.page + 1)}>Next</Link></Button>}
      </nav>
    </CardContent></Card>}
  </div>
}
