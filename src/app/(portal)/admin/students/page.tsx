import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { RefreshButton } from "@/components/refresh-button"
import { getStudentDirectory } from "@/features/students/directory"

import { StudentsDirectory } from "./components/students-directory"
import { StudentsSkeleton } from "./components/students-skeleton"

export const metadata: Metadata = {
  title: "Manage Students",
}

// Student records change from this page itself, so nothing is cached.
export const dynamic = "force-dynamic"

async function StudentsContent() {
  let directory

  try {
    directory = await getStudentDirectory()
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

  return <StudentsDirectory directory={directory} />
}

export default function AdminStudentsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Manage Students
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Create, update, and archive student accounts, and keep their
            academic placement and RFID cards current.
          </p>
        </div>
        <RefreshButton />
      </div>

      <Suspense fallback={<StudentsSkeleton />}>
        <StudentsContent />
      </Suspense>
    </div>
  )
}
