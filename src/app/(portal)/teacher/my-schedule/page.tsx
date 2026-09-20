import type { Metadata } from "next"
import { Suspense } from "react"
import { unstable_rethrow } from "next/navigation"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { getTeacherSchedule } from "@/features/schedules/teacher-schedule"

import { ScheduleSkeleton } from "./components/schedule-skeleton"
import { ScheduleTable } from "./components/schedule-table"

export const metadata: Metadata = { title: "My Schedule" }
export const dynamic = "force-dynamic"

async function ScheduleContent() {
  let schedules
  try {
    schedules = await getTeacherSchedule()
  } catch (error) {
    unstable_rethrow(error)
    return (
      <DataErrorCard
        title="Your schedule could not be loaded"
        message="Please try again. If the problem continues, contact an administrator."
      />
    )
  }
  return <ScheduleTable schedules={schedules} />
}

export default function TeacherSchedulePage() {
  return (
    <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-teacher-schedule" tables={["subject_schedules", "teacher_assignments", "courses"]} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">My Schedule</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Your weekly subjects, sections, campuses, and class times in one place.
        </p>
      </div>
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleContent />
      </Suspense>
    </div>
  )
}
