import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { requireRole } from "@/features/auth/server"
import { getStudentProfile } from "@/features/profiles/student-profile"

import { PasswordForm } from "./components/password-form"
import { ProfileInfoCard } from "./components/profile-info-card"
import { ProfileSkeleton } from "./components/profile-skeleton"
import { SessionCard } from "./components/session-card"

export const metadata: Metadata = {
  title: "Student Profile",
}

// The page reads the very account it belongs to, so nothing is cached.
export const dynamic = "force-dynamic"

async function ProfileContent() {
  const account = await requireRole("student")

  let profile

  try {
    profile = await getStudentProfile()
  } catch (error) {
    return (
      <DataErrorCard
        title="Your profile could not be loaded"
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
      <div className="lg:col-span-2">
        <ProfileInfoCard profile={profile} />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <PasswordForm />
        <SessionCard account={account} lastSignInAt={profile.lastSignInAt} />
      </div>
    </div>
  )
}

export default function StudentProfilePage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Student Profile
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Review personal and academic information and maintain account
          security.
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}
