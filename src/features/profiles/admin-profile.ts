import { cache } from "react"

import { createServerSupabaseClient } from "@/services/supabase/server"

export interface AdminProfile {
  fullName: string
  phoneNumber: string
  avatarUrl: string
  /** Set while a requested email change is still waiting on confirmation. */
  pendingEmail: string | null
  lastSignInAt: string | null
}

const emptyProfile: AdminProfile = {
  fullName: "",
  phoneNumber: "",
  avatarUrl: "",
  pendingEmail: null,
  lastSignInAt: null,
}

/** Metadata is untyped JSON, so only usable strings reach the form. */
function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

/**
 * Reads the signed-in administrator's editable details from Supabase Auth.
 * The role, status, and email shown beside them come from `getCurrentAccount`.
 */
export const getAdminProfile = cache(async (): Promise<AdminProfile> => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return emptyProfile

  const metadata = user.user_metadata ?? {}

  return {
    fullName: readText(metadata.full_name),
    phoneNumber: readText(metadata.phone),
    avatarUrl: readText(metadata.avatar_url),
    pendingEmail: user.new_email ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
  }
})
