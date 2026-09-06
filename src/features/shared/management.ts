import type { SupabaseClient } from "@supabase/supabase-js"
import { failure, type ActionResult } from "@/features/shared/actions"

/** Only called after the profile RPC commits. Auth's email trigger updates all
 * email fields in the Auth transaction, including on older application clients. */
export async function changeManagedLoginEmail(admin: SupabaseClient, userId: string, email: string): Promise<ActionResult | null> {
  try {
    const { data, error } = await admin.auth.admin.updateUserById(userId, { email, email_confirm: true })
    if (!error && data.user?.email?.toLowerCase() === email) return null
    const message = error
      ? `Profile details were saved, but the login email could not be changed: ${error.message}`
      : "Profile details were saved, but the email change is not confirmed. Reload to check the current email before retrying."
    return failure(message, { email: message })
  } catch {
    // A network failure does not establish whether the Auth transaction committed.
    return failure("Profile details were saved, but the email change could not be confirmed. Reload to check the current email before retrying.")
  }
}

/** Delete an unused new account only after a definite database rejection and an
 * unrestricted profile read. Timeouts may leave a transaction still in flight. */
export async function cleanupFailedProfileCreation(
  admin: SupabaseClient, table: "students" | "teachers", userId: string, code?: string
): Promise<string> {
  const retained = " The account was retained because the save outcome could not be safely rolled back. Reload the directory and check Supabase Authentication before retrying."
  if (!code || !(/^(22|23|40)[0-9A-Z]{3}$/.test(code) || ["42501", "P0001"].includes(code))) return retained
  try {
    const { data, error } = await admin.from(table).select("id").eq("user_id", userId).maybeSingle()
    if (error || data) return retained
    const removed = await admin.auth.admin.deleteUser(userId)
    if (removed.error) return " The unused login account could not be removed. Resolve that account in Supabase Authentication before retrying."
    return ""
  } catch {
    return " The unused login account cleanup could not be confirmed. Check Supabase Authentication before retrying."
  }
}
