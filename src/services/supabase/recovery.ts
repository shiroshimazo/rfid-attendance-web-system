import { createClient } from "@supabase/supabase-js"

import {
  isSupabaseConfigured,
  missingSupabaseConfigurationMessage,
  supabasePublishableKey,
  supabaseUrl,
} from "@/services/supabase/config"

export function createRecoverySupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(missingSupabaseConfigurationMessage)
  }

  // Recovery credentials stay in memory, separate from portal cookies/storage.
  // Reloading or leaving the page requires verifying a fresh code.
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      storageKey: "rfid-password-recovery",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "implicit",
    },
  })
}
