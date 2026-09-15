"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Archive, Loader2, RotateCcw, Search } from "lucide-react"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { TablePagination } from "@/components/data-table"
import { DataErrorCard } from "@/components/data-error-card"
import { archiveCategories, type ArchiveCategory, type ArchiveDirectory, type ArchiveRecord } from "./model"
import { restoreArchiveAction } from "./actions"
import { formatTimestamp } from "@/lib/format"

const restoreDetails: Record<ArchiveCategory, string> = {
  students: "The student can sign in again. Re-issue an RFID card to resume attendance tapping. Review subject enrollment before taking attendance.",
  teachers: "The teacher can sign in again and their retained assignments become active. Review their subject schedules before taking attendance.",
  subject_schedules: "This session becomes active with its retained enrollment. Its original teacher and assignment must still be active, and its time must be available. Review enrollment after restoring.",
  class_schedules: "This weekday becomes active at its saved start time and grace period. It will be used to determine whether future RFID taps are late.",
}

export function ArchivesPanel({ directory }: { directory: ArchiveDirectory }) {
  const router = useRouter()
  const [category, setCategory] = useState<ArchiveCategory>("students")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ArchiveRecord | null>(null)
  const [pending, startTransition] = useTransition()
  const [restoreError, setRestoreError] = useState("")
  const recordsFor = (key: ArchiveCategory) => directory[key].records
  const rows = recordsFor(category).filter(row => `${row.name} ${row.details} ${row.reason ?? ""}`.toLowerCase().includes(search.trim().toLowerCase()))
  const pageCount = Math.max(1, Math.ceil(rows.length / 10))
  const currentPage = Math.min(page, pageCount)

  function restore(event: React.MouseEvent) {
    event.preventDefault()
    if (!selected || pending) return
    const record = selected
    setRestoreError("")
    startTransition(async () => {
      try {
        const result = await restoreArchiveAction({ category: record.category, id: record.id })
        if (!result.ok) { setRestoreError(result.message); return }
        gooeyToast.success(result.message)
        setSelected(null)
        router.refresh()
      } catch {
        setRestoreError("Could not restore this record. Refresh and try again.")
      }
    })
  }

  return <>
    <Tabs value={category} onValueChange={value => { setCategory(value as ArchiveCategory); setSearch(""); setPage(1) }}>
      <div className="overflow-x-auto pb-1">
        <TabsList className="h-11" aria-label="Archive categories">
          {archiveCategories.map(({ key, label }) => <TabsTrigger key={key} value={key} className="min-h-10 px-3">
            {label}<span className="text-xs tabular-nums text-muted-foreground">{directory[key].error ? "?" : recordsFor(key).length}</span>
          </TabsTrigger>)}
        </TabsList>
      </div>
      {archiveCategories.map(({ key, label }) => <TabsContent key={key} value={key}>
        {directory[key].error ? <DataErrorCard title={`${label} archives could not be loaded`} message={directory[key].error!} /> : <Card>
          <CardHeader>
            <CardTitle>Archived {label.toLowerCase()}</CardTitle>
            <CardDescription>Archive dates and reasons are shown when recorded. Older records may have no archive details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-md">
              <Search aria-hidden className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
              <Input className="h-10 pl-9" aria-label={`Search archived ${label.toLowerCase()}`} placeholder="Search name, ID, section or reason?" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />
            </div>
            <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">{rows.length} {rows.length === 1 ? "record" : "records"}</p>
            {rows.length ? <>
              <div className="overflow-x-auto rounded-lg border">
                <Table aria-label={`Archived ${label.toLowerCase()}`}>
                  <TableHeader><TableRow><TableHead>Record</TableHead><TableHead>Archived on</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                  <TableBody>{rows.slice((currentPage - 1) * 10, currentPage * 10).map(row => <TableRow key={row.id}>
                    <TableCell className="min-w-60 whitespace-normal"><p className="font-medium">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{row.details}</p></TableCell>
                    <TableCell className="text-sm">{row.archivedAt ? formatTimestamp(row.archivedAt) : "Not recorded"}</TableCell>
                    <TableCell className="max-w-64 whitespace-normal text-sm text-muted-foreground">{row.reason || "Not recorded"}</TableCell>
                    <TableCell className="text-right"><Button variant="outline" className="min-h-10" aria-label={`Restore ${row.name}`} onClick={() => { setSelected(row); setRestoreError("") }}><RotateCcw aria-hidden />Restore</Button></TableCell>
                  </TableRow>)}</TableBody>
                </Table>
              </div>
              <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
            </> : <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center">
              <Archive aria-hidden className="size-8 text-muted-foreground" />
              <h2 className="font-medium">{search.trim() ? "No matching records" : `No archived ${label.toLowerCase()}`}</h2>
              <p className="text-sm text-muted-foreground">{search.trim() ? "Try another name, ID or section." : "Records will appear here when they are archived."}</p>
            </div>}
          </CardContent>
        </Card>}
      </TabsContent>)}
    </Tabs>
    <AlertDialog open={Boolean(selected)} onOpenChange={open => { if (!pending && !open) setSelected(null) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore {selected?.name}?</AlertDialogTitle>
          <AlertDialogDescription>{selected ? restoreDetails[selected.category] : ""} Attendance history is preserved.</AlertDialogDescription>
        </AlertDialogHeader>
        {restoreError && <p role="alert" className="text-sm text-destructive">{restoreError}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={restore} disabled={pending}>{pending && <Loader2 aria-hidden className="animate-spin" />}{pending ? "Restoring?" : "Restore record"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}
