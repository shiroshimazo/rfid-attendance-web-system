import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import {
  isSupabaseConfigured,
  missingSupabaseConfigurationMessage,
  supabasePublishableKey,
  supabaseUrl,
} from "@/services/supabase/config"

export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(missingSupabaseConfigurationMessage)
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot always write cookies. The proxy refreshes
          // the same session and persists any updated cookies on the response.
        }
      },
    },
  })
}
