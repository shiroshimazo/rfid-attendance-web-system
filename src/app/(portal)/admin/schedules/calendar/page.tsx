import { Suspense } from "react"
import type { Metadata } from "next"
import { requireRole } from "@/features/auth/server"
import { DataErrorCard } from "@/components/data-error-card"
import { getAdminCalendarPanel } from "@/features/calendar/admin"
import { parseAdminCalendarQuery, type CalendarSearchParams, type AdminCalendarQuery } from "@/features/calendar/admin-view"
import { CalendarPanel } from "./components/calendar-panel"
import CalendarLoading from "./loading"
import { getCalendarDeliveryPanel } from "@/features/calendar/delivery"
import { DeliveryTable } from "./components/delivery-table"

async function Deliveries({ params, today }: { params: CalendarSearchParams; today: string }) {
  let panel
  try { panel = await getCalendarDeliveryPanel(params) }
  catch { return <DataErrorCard title="Email deliveries could not be loaded" message="Try again. Ask your administrator to check the calendar email setup if this persists." /> }
  return <DeliveryTable key={JSON.stringify(params)} panel={panel} today={today} />
}

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
  const params = await searchParams
  const query = parseAdminCalendarQuery(params)
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Calendar &amp; Announcements</h1>
      <p className="text-sm text-muted-foreground">School events, no-class days, and online-class announcements.</p>
    </header>
    <Suspense key={JSON.stringify(params)} fallback={<CalendarLoading />}>{params.tab === "deliveries" ? <Deliveries params={params} today={query.today} /> : <Content query={query} />}</Suspense>
  </div>
}
