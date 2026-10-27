"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { publishCalendarEntryAction, republishCalendarEntryAction, cancelCalendarEntryAction, deleteCalendarDraftAction, previewCalendarRecipientsAction } from "@/features/calendar/actions"
import { calendarLifecycleOptions } from "@/features/calendar/form"
import { calendarLabels } from "@/features/calendar/admin-view"
import type { CalendarEntryRow, RecipientCountRow } from "@/services/calendar/query"
import { EntryFormDialog } from "./entry-form-dialog"

const operations = {
  publish: { label: "Publish", action: publishCalendarEntryAction },
  republish: { label: "Republish", action: republishCalendarEntryAction },
  cancel: { label: "Cancel announcement", action: cancelCalendarEntryAction },
  delete: { label: "Delete draft", action: deleteCalendarDraftAction },
}

export function EntryActions({ entry, today, campuses }: { entry: CalendarEntryRow; today: string; campuses: string[] }) {
  return <div className="flex flex-wrap gap-2" aria-label={`Actions for ${entry.title}`}>
    <EntryFormDialog entry={entry} date={entry.starts_on} today={today} campuses={campuses} />
    {calendarLifecycleOptions(entry).map(operation => <LifecycleDialog key={operation} operation={operation} entry={entry} today={today} />)}
  </div>
}

function LifecycleDialog({ operation, entry, today }: { operation: keyof typeof operations; entry: CalendarEntryRow; today: string }) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [preview, setPreview] = React.useState<RecipientCountRow | null>(null)
  const [error, setError] = React.useState("")
  const previewRequest = React.useRef(0)
  const router = useRouter()
  const publishing = operation === "publish" || operation === "republish"
  const blockedByDate = publishing && entry.attendance_impact !== "normal" && entry.starts_on < today
  const { label, action } = operations[operation]

  async function loadPreview() {
    const request = ++previewRequest.current
    setPreview(null); setError("")
    try {
      const result = await previewCalendarRecipientsAction(entry.id)
      if (request !== previewRequest.current) return
      if (!result.ok || !result.recipients) setError(result.message)
      else setPreview(result.recipients)
    } catch { if (request === previewRequest.current) setError("Recipients could not be loaded. Try again.") }
  }

  function changeOpen(value: boolean) {
    if (pending) return
    setOpen(value); setError(""); setPreview(null)
    if (value && publishing && !blockedByDate) void loadPreview()
    else previewRequest.current++
  }

  async function confirm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (pending || blockedByDate || (publishing && !preview)) return
    setPending(true); setError("")
    try {
      const result = await action(entry.id)
      if (!result.ok) { setError(result.message); return }
      gooeyToast.success(result.message)
      setOpen(false); router.refresh()
    } catch { setError("The action could not be confirmed. Check the announcement before trying again.") }
    finally { setPending(false) }
  }

  return <AlertDialog open={open} onOpenChange={changeOpen}>
    <AlertDialogTrigger asChild><Button size="sm" variant="outline" aria-label={`${label}: ${entry.title}`}>{label}</Button></AlertDialogTrigger>
    <AlertDialogContent className="max-h-[90svh] overflow-y-auto" onEscapeKeyDown={event => { if (pending) event.preventDefault() }}>
      <AlertDialogHeader><AlertDialogTitle>{label}?</AlertDialogTitle><AlertDialogDescription>
        {operation === "delete" ? "This permanently deletes this never-published draft. This cannot be undone." : operation === "cancel" ? "This removes today and future calendar attendance exceptions and sends a cancellation notification. Existing RFID and SMS records remain unchanged." : "This makes the announcement visible and sends email to eligible teachers and students. Admins are excluded."}
      </AlertDialogDescription></AlertDialogHeader>
      <div className="space-y-2 break-words text-sm">
        <p className="font-medium">{entry.title}</p>
        <p>Campuses: {entry.campuses.join(", ") || "All campuses"}</p>
        <p>Dates: {entry.starts_on} – {entry.ends_on}</p>
        <p>Attendance: {calendarLabels[entry.attendance_impact]}</p>
        {operation === "cancel" && entry.starts_on < today && <p className="rounded-md bg-muted p-3">Historical calendar exceptions will not be changed. Today&apos;s exception will be removed.</p>}
        {publishing && <div role="status" aria-live="polite">{blockedByDate ? <p className="text-destructive">Attendance-impacting entries cannot be published before today. Edit the dates first; locked historical scope requires a new entry.</p> : preview ? <><p className="tabular-nums">Recipients: {preview.total} ({preview.teacher_count} teachers, {preview.student_count} students)</p><p className="text-xs text-muted-foreground">{preview.total ? "Recipients are resolved again when publication completes." : "No recipients matched. Publication can still proceed."}</p></> : !error ? "Loading recipients…" : null}</div>}
        {error && <p role="alert" className="text-destructive">{error}</p>}
        {publishing && error && !preview && <Button variant="outline" type="button" onClick={() => void loadPreview()}>Retry recipient preview</Button>}
      </div>
      <AlertDialogFooter><AlertDialogCancel disabled={pending}>Go back</AlertDialogCancel><AlertDialogAction variant={operation === "delete" || operation === "cancel" ? "destructive" : "default"} disabled={pending || blockedByDate || (publishing && !preview)} onClick={confirm}>{pending ? "Working…" : label}</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}
