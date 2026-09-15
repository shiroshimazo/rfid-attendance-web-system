import type { Metadata } from "next"
import { Suspense } from "react"
import { LiveRefresh } from "@/components/live-refresh"
import { AdminSubjectEnrollmentPanel } from "@/features/subject-attendance/server-panels"
import { PanelSkeleton } from "../components/panel-skeleton"

export const metadata: Metadata = { title: "Student Subject Enrollment" }
export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-student-subject-enrollment" />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Student Subject Enrollment</h1>
        <p className="text-sm text-muted-foreground">Assign students to their subject sessions.</p>
      </div>
      <Suspense fallback={<PanelSkeleton />}>
        <AdminSubjectEnrollmentPanel />
      </Suspense>
    </div>
  )
}
