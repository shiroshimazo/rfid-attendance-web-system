import { Suspense } from "react"
import { unstable_rethrow } from "next/navigation"
import { requireRole } from "@/features/auth/server"
import { DataErrorCard } from "@/components/data-error-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getReaderCalendarPanel } from "@/features/calendar/reader"
import type { CalendarSearchParams } from "@/features/calendar/admin-view"
import { ReaderCalendar } from "./reader-calendar"

export function ReaderCalendarLoading() {
  return <div role="status" aria-label="Loading calendar" className="space-y-4"><span className="sr-only">Loading calendar…</span><Skeleton className="h-10 w-48" /><div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-96 w-full" /><Skeleton className="h-96 w-full" /></div></div>
}

async function Content({ role, params }: { role: "teacher" | "student"; params: CalendarSearchParams }) {
  let panel
  try { panel = await getReaderCalendarPanel(role, params) }
  catch (error) {
    unstable_rethrow(error)
    return <DataErrorCard title="Calendar could not be loaded" message="Try again. If the problem persists, contact your administrator." />
  }
  return <ReaderCalendar panel={panel} />
}

export async function ReaderCalendarPage({ role, searchParams }: { role: "teacher" | "student"; searchParams: Promise<CalendarSearchParams> }) {
  await requireRole(role)
  const params = await searchParams
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <header className="space-y-1"><h1 className="text-2xl font-semibold tracking-tight">Calendar</h1><p className="text-sm text-muted-foreground">{role === "student" ? "Your school events, no-class days, and online-class announcements." : "School events and attendance announcements for your teaching campuses."}</p></header>
    <Suspense key={JSON.stringify(params)} fallback={<ReaderCalendarLoading />}><Content role={role} params={params} /></Suspense>
  </div>
}
