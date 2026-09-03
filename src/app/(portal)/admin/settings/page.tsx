import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { requireRole } from "@/features/auth/server"
import { getAdminProfile } from "@/features/profiles/admin-profile"

import { PasswordForm } from "./components/password-form"
import { ProfileForm } from "./components/profile-form"
import { SessionCard } from "./components/session-card"
import { SettingsSkeleton } from "./components/settings-skeleton"

export const metadata: Metadata = {
  title: "Settings",
}

// The page edits the very account it reads, so nothing is cached.
export const dynamic = "force-dynamic"

async function SettingsContent() {
  const account = await requireRole("admin")

  let profile

  try {
    profile = await getAdminProfile()
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
        <ProfileForm
          profile={{
            fullName: profile.fullName,
            email: account.email,
            phoneNumber: profile.phoneNumber,
            avatarUrl: profile.avatarUrl,
          }}
          pendingEmail={profile.pendingEmail}
        />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <PasswordForm />
        <SessionCard account={account} lastSignInAt={profile.lastSignInAt} />
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Maintain your administrator profile, change your password, and review
          the session you are signed in with.
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
