import { createClient } from "@supabase/supabase-js"

import { supabaseUrl } from "@/services/supabase/config"

/**
 * Deliberately not prefixed with NEXT_PUBLIC_, so the key never reaches the
 * browser bundle. Only server actions and route handlers may read it.
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

export const missingServiceRoleMessage =
  "Supabase administration is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env on the server."

export function isSupabaseAdminConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey)
}

/**
 * Service-role client used only for Supabase Auth administration, such as
 * creating the login account behind a teacher profile. It bypasses Row Level
 * Security, so every caller must authorize the request first.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client cannot run in the browser.")
  }

  if (!isSupabaseAdminConfigured()) {
    throw new Error(missingServiceRoleMessage)
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
