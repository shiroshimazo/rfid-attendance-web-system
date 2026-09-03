import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { RefreshButton } from "@/components/refresh-button"
import { getTeacherDirectory } from "@/features/teachers/directory"

import { TeachersDirectory } from "./components/teachers-directory"
import { TeachersSkeleton } from "./components/teachers-skeleton"

export const metadata: Metadata = {
  title: "Manage Teachers",
}

// Teacher records change from this page itself, so nothing is cached.
export const dynamic = "force-dynamic"

async function TeachersContent() {
  let directory

  try {
    directory = await getTeacherDirectory()
  } catch (error) {
    return (
      <DataErrorCard
        title="Teacher records could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading teacher records."
        }
      />
    )
  }

  return <TeachersDirectory directory={directory} />
}

export default function AdminTeachersPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Manage Teachers
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Create, update, and archive teacher accounts, and keep their program
            and course assignments current.
          </p>
        </div>
        <RefreshButton />
      </div>

      <Suspense fallback={<TeachersSkeleton />}>
        <TeachersContent />
      </Suspense>
    </div>
  )
}
