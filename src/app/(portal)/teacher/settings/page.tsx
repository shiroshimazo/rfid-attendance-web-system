import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { requireRole } from "@/features/auth/server"
import { getTeacherProfile } from "@/features/profiles/teacher-profile"

import { SessionCard } from "@/app/(portal)/admin/settings/components/session-card"
import { AssignmentsCard } from "./components/assignments-card"
import { PasswordForm } from "./components/password-form"
import { SettingsSkeleton } from "./components/settings-skeleton"
import { TeacherInfoCard } from "./components/teacher-info-card"

export const metadata: Metadata = {
  title: "Teacher Settings",
}

// The page reads the very account it belongs to, so nothing is cached.
export const dynamic = "force-dynamic"

async function SettingsContent() {
  const account = await requireRole("teacher")

  let profile

  try {
    profile = await getTeacherProfile()
  } catch (error) {
    return (
      <DataErrorCard
        title="Your settings could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading your account."
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
      <div className="flex flex-col gap-4 lg:col-span-2 md:gap-6">
        <TeacherInfoCard profile={profile} />
        <AssignmentsCard profile={profile} />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <PasswordForm />
        <SessionCard account={account} lastSignInAt={profile.lastSignInAt} />
      </div>
    </div>
  )
}

export default function TeacherSettingsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Review employment and assignment information and maintain account
          security.
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
