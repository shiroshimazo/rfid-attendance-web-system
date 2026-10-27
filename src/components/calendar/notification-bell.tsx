"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { markCalendarEntryReadAction, markAllCalendarEntriesReadAction } from "@/features/calendar/actions"
import { isCalendarUnread, latestUnreadCalendarEntry, claimCalendarSessionToast, calendarToastContent } from "@/features/calendar/notification-view"
import { calendarLabels } from "@/features/calendar/admin-view"
import { formatDateValue } from "@/lib/format"
import type { CalendarBellRow } from "@/services/calendar/query"

export function NotificationBell({ entries, userId, role }: { entries: CalendarBellRow[]; userId: string; role: "teacher" | "student" }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [failed, setFailed] = React.useState(false)
  const unread = entries.filter(entry => isCalendarUnread(entry.updated_at, entry.read_at)).length
  const latest = latestUnreadCalendarEntry(entries)
  const calendarUrl = `/${role}/calendar`

  React.useEffect(() => {
    if (!latest) return
    try {
      if (!claimCalendarSessionToast(userId, window.sessionStorage)) return
      const { title, description } = calendarToastContent(latest)
      gooeyToast.info(title, { description, action: { label: "View calendar", onClick: () => router.push(`${calendarUrl}?date=${latest.starts_on}`) } })
    } catch { /* The bell remains usable when browser storage or the toast is unavailable. */ }
  }, [latest, userId, calendarUrl, router])

  async function markRead(entry?: CalendarBellRow) {
    if (pending) return
    setPending(true); setMessage(""); setFailed(false)
    try {
      const result = entry ? await markCalendarEntryReadAction(entry.id) : await markAllCalendarEntriesReadAction()
      if (!result.ok) { setFailed(true); setMessage(result.message); return }
      if (entry) { setOpen(false); router.push(`${calendarUrl}?date=${entry.starts_on}`) }
      else { setMessage(result.message); router.refresh() }
    } catch { setFailed(true); setMessage("Read status could not be saved. Try again.") }
    finally { setPending(false) }
  }

  return <Popover open={open} onOpenChange={value => { if (!pending) { setOpen(value); setMessage("") } }}>
    <PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative size-10" aria-label={`Announcements, ${unread} unread`}><Bell className="size-5" />{unread > 0 && <span aria-hidden className="absolute -top-1 -right-1 rounded-full bg-primary px-1.5 text-xs leading-5 text-primary-foreground tabular-nums">{unread}</span>}</Button></PopoverTrigger>
    <PopoverContent align="end" aria-label="Announcements" className="max-h-[min(80svh,36rem)] w-[min(24rem,calc(100vw-2rem))] space-y-3 overflow-y-auto" onEscapeKeyDown={event => { if (pending) event.preventDefault() }}>
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">Announcements</h2><Button size="sm" variant="outline" disabled={pending || entries.length === 0} onClick={() => void markRead()}>Mark all read</Button></div>
      <p className="text-xs text-muted-foreground">Latest 20 matching announcements. Mark all read includes every unread announcement in this window.</p>
      {message && <p role={failed ? "alert" : "status"} className={failed ? "text-sm text-destructive" : "text-sm"}>{message}</p>}
      {entries.length ? <ul className="space-y-2" aria-busy={pending}>{entries.map(entry => <li key={entry.id}><button type="button" disabled={pending} onClick={() => void markRead(entry)} className="w-full space-y-1 rounded-md border p-3 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50">
        <span className="flex flex-wrap items-center gap-2"><span className="min-w-0 break-words font-medium">{entry.title}</span>{isCalendarUnread(entry.updated_at, entry.read_at) && <Badge variant="secondary">Unread</Badge>}</span>
        <span className="block break-words text-xs text-muted-foreground">{entry.tags.map(tag => calendarLabels[tag] ?? tag).join(", ")} · {calendarLabels[entry.attendance_impact]}</span>
        <span className="block text-xs tabular-nums">{formatDateValue(entry.starts_on)}{entry.ends_on !== entry.starts_on && ` – ${formatDateValue(entry.ends_on)}`}</span>
        <span className="block break-words text-xs">Campus: {entry.campuses.join(", ") || "All campuses"}</span>
      </button></li>)}</ul> : <p className="py-3 text-sm text-muted-foreground">No announcements.</p>}
      <Button variant="link" className="px-0" disabled={pending} onClick={() => { setOpen(false); router.push(calendarUrl) }}>View calendar</Button>
    </PopoverContent>
  </Popover>
}
