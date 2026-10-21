import { createAnonymousAuthClient } from "@/services/supabase/anon"

export interface PasswordCheck {
  ok: boolean
  /** Present when the check fails. Safe to show in the form. */
  message?: string
}

const wrongPassword = "That is not your current password."

/**
 * Proves that the signed-in account owns the supplied password.
 *
 * A separate publishable-key client signs in, so the cookies of the current
 * session are never replaced. The temporary session is closed before this
 * returns, leaving only the original session alive.
 */
export async function verifyAccountPassword(
  userId: string,
  email: string,
  password: string
): Promise<PasswordCheck> {
  if (!password) return { ok: false, message: "Enter your current password." }
  if (!email) return { ok: false, message: "Your account has no sign-in address." }

  const auth = createAnonymousAuthClient()

  try {
    const { data, error } = await auth.auth.signInWithPassword({ email, password })

    if (error?.code === "mfa_required") {
      return {
        ok: false,
        message: "Confirm your second factor before changing these details.",
      }
    }

    if (error || !data.user) return { ok: false, message: wrongPassword }

    // The password must belong to this account, not to another one.
    if (data.user.id !== userId) return { ok: false, message: wrongPassword }

    return { ok: true }
  } catch {
    return {
      ok: false,
      message: "Your password could not be checked right now. Try again.",
    }
  } finally {
    // The proof session must never outlive the check.
    await auth.auth.signOut({ scope: "local" }).catch(() => {})
  }
}
