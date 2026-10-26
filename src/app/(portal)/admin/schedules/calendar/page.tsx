import { Suspense } from "react"
import type { Metadata } from "next"
import { requireRole } from "@/features/auth/server"
import { DataErrorCard } from "@/components/data-error-card"
import { getAdminCalendarPanel } from "@/features/calendar/admin"
import { parseAdminCalendarQuery, type CalendarSearchParams, type AdminCalendarQuery } from "@/features/calendar/admin-view"
import { CalendarPanel } from "./components/calendar-panel"
import CalendarLoading from "./loading"

export const metadata: Metadata = { title: "Calendar & Announcements" }
export const dynamic = "force-dynamic"

async function Content({ query }: { query: AdminCalendarQuery }) {
  let panel
  try { panel = await getAdminCalendarPanel(query) }
  catch { return <DataErrorCard title="Calendar could not be loaded" message="Try again. If the problem persists, ask your administrator to check the calendar setup." /> }
  return <CalendarPanel key={JSON.stringify(query)} panel={panel} />
}

export default async function AdminCalendarPage({ searchParams }: { searchParams: Promise<CalendarSearchParams> }) {
  await requireRole("admin")
  const query = parseAdminCalendarQuery(await searchParams)
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Calendar &amp; Announcements</h1>
      <p className="text-sm text-muted-foreground">School events, no-class days, and online-class announcements.</p>
    </header>
    <Suspense key={JSON.stringify(query)} fallback={<CalendarLoading />}><Content query={query} /></Suspense>
  </div>
}
