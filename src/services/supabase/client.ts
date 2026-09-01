import { createBrowserClient } from "@supabase/ssr"

import {
  isSupabaseConfigured,
  missingSupabaseConfigurationMessage,
  supabasePublishableKey,
  supabaseUrl,
} from "@/services/supabase/config"

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(missingSupabaseConfigurationMessage)
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}
