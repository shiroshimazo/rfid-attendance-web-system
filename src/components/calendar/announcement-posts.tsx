"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calendarLabels } from "@/features/calendar/admin-view"
import { formatDateValue } from "@/lib/format"
import type { DashboardPostRow } from "@/services/calendar/query"

export function AnnouncementPosts({ entries, role }: { entries: DashboardPostRow[]; role: "teacher" | "student" }) {
  const [expiredBefore, setExpiredBefore] = React.useState(0)
  const router = useRouter()
  const headingId = React.useId()
  React.useEffect(() => {
    const deadlines = entries.map(entry => Date.parse(entry.published_at) + 7 * 86400000).filter(deadline => deadline > expiredBefore)
    if (!deadlines.length) return
    const next = Math.min(...deadlines)
    function expire() {
      const now = Date.now()
      if (now < next) return
      setExpiredBefore(now)
      router.refresh()
    }
    const timer = window.setTimeout(expire, Math.max(0, next - Date.now()))
    document.addEventListener("visibilitychange", expire)
    return () => { window.clearTimeout(timer); document.removeEventListener("visibilitychange", expire) }
  }, [entries, expiredBefore, router])

  const visible = entries.filter(entry => Date.parse(entry.published_at) + 7 * 86400000 > expiredBefore)
  if (!visible.length) return null
  return <section aria-labelledby={headingId} className="min-w-0 space-y-3">
    <h2 id={headingId} className="text-lg font-semibold">Announcements</h2>
    <div className="grid min-w-0 gap-3 lg:grid-cols-3">{visible.map(entry => {
      const excerpt = entry.reason || entry.description
      return <Card key={entry.id} className="min-w-0"><CardContent className="flex h-full min-w-0 flex-col gap-3">
        <div className="flex flex-wrap gap-1">{entry.is_pinned && <Badge variant="outline">Pinned</Badge>}{entry.tags.map(tag => <Badge key={tag} variant="secondary">{calendarLabels[tag] ?? tag}</Badge>)}</div>
        <h3 className="break-words font-semibold">{entry.title}</h3>
        <p className="text-sm">Attendance: {calendarLabels[entry.attendance_impact]}</p>
        <p className="break-words text-sm">Campus: {entry.campuses.join(", ") || "All campuses"}</p>
        <p className="text-sm tabular-nums">{formatDateValue(entry.starts_on)}{entry.ends_on !== entry.starts_on && ` – ${formatDateValue(entry.ends_on)}`}</p>
        {excerpt && <p className="line-clamp-3 break-words text-sm text-muted-foreground">{excerpt.slice(0, 240)}{excerpt.length > 240 ? "…" : ""}</p>}
        <Button asChild size="sm" variant="outline" className="mt-auto self-start"><Link href={`/${role}/calendar?date=${entry.starts_on}`}>View calendar<span className="sr-only">: {entry.title}</span></Link></Button>
      </CardContent></Card>
    })}</div>
  </section>
}
