import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { requireRole } from "@/features/auth/server"
import { fetchSystemLogs } from "@/services/audit/directory"
import { logEntities, logOutcomes, logLabel, logPageUrl, parseLogQuery, type LogParams } from "@/features/system-logs/query"
import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatTimestamp } from "@/lib/format"

export const metadata: Metadata = { title: "System Logs" }
export const dynamic = "force-dynamic"
const selectClass = "h-10 w-full rounded-md border bg-background px-3 text-sm"

export default async function SystemLogsPage({ searchParams }: { searchParams: Promise<LogParams> }) {
  await requireRole("admin")
  const query = parseLogQuery(await searchParams)
  let result
  let loadError = ""
  try { result = await fetchSystemLogs(query) }
  catch (error) { loadError = error instanceof Error ? error.message : "System logs could not be loaded." }
  if (result && query.page > result.pageCount) redirect(logPageUrl(query, result.pageCount))
  return <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <LiveRefresh channel="live-admin-system-logs" tables={["system_logs"]} />
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">System Logs</h1>
      <p className="text-sm text-muted-foreground">Record changes and action results across the system. Times are shown in Philippines time. Logs start when logging is enabled.</p>
    </div>
    <Card><CardContent className="pt-6">
      <form key={JSON.stringify(query)} action="/admin/system-logs" method="get" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="log-search">Search</Label><Input id="log-search" name="search" defaultValue={query.search} placeholder="Actor, activity or record ID" className="h-10" /></div>
        <div className="space-y-2"><Label htmlFor="log-entity">Category</Label><select id="log-entity" name="entity" defaultValue={query.entity} className={selectClass}><option value="all">All categories</option>{logEntities.map(entity => <option key={entity} value={entity}>{logLabel(entity)}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="log-outcome">Result</Label><select id="log-outcome" name="outcome" defaultValue={query.outcome} className={selectClass}><option value="all">All results</option>{logOutcomes.map(outcome => <option key={outcome} value={outcome}>{logLabel(outcome)}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="log-from">From</Label><Input id="log-from" name="from" type="date" defaultValue={query.from} required className="h-10" /></div>
        <div className="space-y-2"><Label htmlFor="log-to">To</Label><Input id="log-to" name="to" type="date" defaultValue={query.to} required className="h-10" /></div>
        <div className="flex gap-2 sm:col-span-2"><Button type="submit" className="min-h-10">Apply filters</Button><Button asChild variant="outline" className="min-h-10"><Link href="/admin/system-logs">Reset</Link></Button></div>
      </form>
    </CardContent></Card>
    {loadError ? <DataErrorCard title="System logs could not be loaded" message={loadError} /> : result && <Card><CardContent className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground tabular-nums">{result.count.toLocaleString()} matching events</p>
      {result.rows.length ? <div className="overflow-x-auto rounded-lg border"><Table aria-label="System activity logs">
        <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Actor</TableHead><TableHead>Activity</TableHead><TableHead>Record</TableHead><TableHead>Result</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
        <TableBody>{result.rows.map(log => <TableRow key={log.id}>
          <TableCell className="whitespace-nowrap text-xs tabular-nums">{formatTimestamp(log.created_at)}</TableCell>
          <TableCell className="max-w-64 whitespace-normal break-words"><p className="font-medium">{log.actor_name}</p><p className="text-xs text-muted-foreground">{logLabel(log.actor_role)}</p></TableCell>
          <TableCell className="whitespace-normal"><p>{logLabel(log.event)}</p><p className="text-xs text-muted-foreground">{logLabel(log.source)}</p></TableCell>
          <TableCell className="max-w-56 whitespace-normal break-words"><p>{logLabel(log.entity)}</p><p className="text-xs text-muted-foreground">{log.record_id ?? "?"}</p></TableCell>
          <TableCell><Badge variant={log.outcome === "success" ? "secondary" : "destructive"}>{logLabel(log.outcome)}</Badge></TableCell>
          <TableCell><details><summary className="cursor-pointer rounded px-2 py-3 text-sm focus-visible:outline-2">View details</summary><pre className="mt-2 max-h-64 w-72 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs">{JSON.stringify(log.details, null, 2)}</pre></details></TableCell>
        </TableRow>)}</TableBody>
      </Table></div> : <div className="rounded-lg border border-dashed py-12 text-center"><h2 className="font-medium">No matching activity</h2><p className="mt-1 text-sm text-muted-foreground">Try another date range or clear the filters.</p></div>}
      <nav aria-label="Log pages" className="flex items-center justify-end gap-3">
        {query.page > 1 && <Button asChild variant="outline"><Link href={logPageUrl(query, query.page - 1)}>Previous</Link></Button>}
        <span className="text-sm tabular-nums">Page {query.page} of {result.pageCount}</span>
        {query.page < result.pageCount && <Button asChild variant="outline"><Link href={logPageUrl(query, query.page + 1)}>Next</Link></Button>}
      </nav>
    </CardContent></Card>}
  </div>
}
