import type { Metadata } from "next"
import { Suspense } from "react"
import { requireRole } from "@/features/auth/server"
import { LiveRefresh } from "@/components/live-refresh"
import { TeacherSubjectPanel } from "@/features/subject-attendance/server-panels"
import { parseAttendancePanelQuery, type AttendanceSearchParams } from "@/features/attendance/teacher-attendance"
import { PanelSkeleton } from "../components/panel-skeleton"

export const metadata: Metadata = { title: "Confirm Attendance by Subject" }
export const dynamic = "force-dynamic"

export default async function ConfirmAttendancePage({ searchParams }: { searchParams: Promise<AttendanceSearchParams> }) {
  await requireRole("teacher")
  const params = await searchParams
  const { date } = parseAttendancePanelQuery(params)
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <LiveRefresh channel="live-teacher-confirm-attendance" />
    <h1 className="text-2xl font-semibold tracking-tight">Confirm Attendance by Subject</h1>
    <Suspense key={`${date}:${Boolean(params.date)}`} fallback={<PanelSkeleton />}><TeacherSubjectPanel date={date} automaticDate={!params.date} /></Suspense>
  </div>
}
