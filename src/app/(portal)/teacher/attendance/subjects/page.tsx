import type { Metadata } from "next"
import { Suspense } from "react"
import { requireRole } from "@/features/auth/server"
import { LiveRefresh } from "@/components/live-refresh"
import { SubjectHistoryPanel } from "@/features/subject-attendance/server-panels"
import { PanelSkeleton } from "../components/panel-skeleton"

export const metadata: Metadata = { title: "Subject Attendance" }
export const dynamic = "force-dynamic"

export default async function SubjectAttendancePage() {
  await requireRole("teacher")
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <LiveRefresh channel="live-teacher-subject-history" />
    <div className="space-y-1"><h1 className="text-2xl font-semibold tracking-tight">Subject Attendance</h1>
      <p className="text-sm text-muted-foreground">Review confirmed subject attendance. Filter by date range, subject, or result.</p></div>
    <Suspense fallback={<PanelSkeleton />}><SubjectHistoryPanel /></Suspense>
  </div>
}
