import { cache } from "react"
import { redirect } from "next/navigation"

import {
  dashboardPathByRole,
  isUserRole,
  type UserRole,
} from "@/features/auth/roles"
import { isSupabaseConfigured } from "@/services/supabase/config"
import { createServerSupabaseClient } from "@/services/supabase/server"

export interface CurrentAccount {
  id: string
  email: string
  name: string
  role: UserRole
  status: "active" | "inactive" | "archived"
}

interface AccountRow {
  id: string
  email: string
  role: string
  status: CurrentAccount["status"]
}

export const getCurrentAccount = cache(async (): Promise<CurrentAccount | null> => {
  if (!isSupabaseConfigured()) return null

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("id, email, role, status")
    .eq("id", user.id)
    .maybeSingle()

  const account = data as AccountRow | null

  if (!account || !isUserRole(account.role)) return null

  const metadataName = user.user_metadata?.full_name

  return {
    id: account.id,
    email: account.email,
    name:
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName
        : account.email,
    role: account.role,
    status: account.status,
  }
})

export async function requireCurrentAccount() {
  const account = await getCurrentAccount()

  if (!account) redirect("/sign-in")
  if (account.status !== "active") redirect("/errors/unauthorized")

  return account
}

export async function requireRole(role: UserRole) {
  const account = await requireCurrentAccount()

  if (account.role !== role) {
    redirect(dashboardPathByRole[account.role])
  }

  return account
}
