import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { RefreshButton } from "@/components/refresh-button"
import { getTeacherStudentsData } from "@/features/students/teacher-directory"

import { PanelSkeleton } from "./components/panel-skeleton"
import { StudentsTable } from "./components/students-table"

export const metadata: Metadata = {
  title: "Students",
}

// Attendance changes with every RFID tap, so the page is never cached.
export const dynamic = "force-dynamic"

async function StudentsContent() {
  let data

  try {
    data = await getTeacherStudentsData()
  } catch (error) {
    return (
      <DataErrorCard
        title="Student records could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading student records."
        }
      />
    )
  }

  return (
    <StudentsTable
      students={data.students}
      options={data.options}
      hasStudents={data.hasStudents}
    />
  )
}

export default function TeacherStudentsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Students
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Read-only list of students in your assigned classes, with
            today&apos;s attendance status.
          </p>
        </div>
        <RefreshButton />
      </div>

      <Suspense fallback={<PanelSkeleton />}>
        <StudentsContent />
      </Suspense>
    </div>
  )
}
