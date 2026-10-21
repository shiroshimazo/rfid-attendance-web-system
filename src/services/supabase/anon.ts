import { createClient } from "@supabase/supabase-js"

import { supabasePublishableKey, supabaseUrl } from "@/services/supabase/config"

/**
 * Publishable-key client that keeps no session. It proves a password without
 * replacing the cookies of the session that is already signed in, so the
 * caller must close the temporary session it creates.
 */
export function createAnonymousAuthClient() {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
