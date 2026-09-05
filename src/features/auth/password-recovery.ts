import type { SupabaseClient } from "@supabase/supabase-js"

import { changePasswordSchema } from "@/features/profiles/schema"
import { emailField } from "@/features/shared/schema"

type RecoveryAuth = Pick<
  SupabaseClient["auth"],
  "resetPasswordForEmail" | "verifyOtp" | "updateUser" | "signOut"
>

export type RecoveryStep = "email" | "code" | "password" | "complete"
export type RecoveryState = {
  step: RecoveryStep
  email: string
  resendAt: number
}

export const recoveryRequestMessage =
  "If this email belongs to an account, a recovery code has been sent. Check your inbox and spam folder."

export function recoveryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "RecoveryError") return error.message
  return "Unable to connect. Please try again."
}

function fail(message: string): never {
  const error = new Error(message)
  error.name = "RecoveryError"
  throw error
}

function authError(error: { code?: string; status?: number }, fallback: string): never {
  if (error.status === 429 || error.code?.startsWith("over_")) {
    fail("Too many attempts. Please wait before trying again.")
  }
  if (error.code === "same_password") fail("Choose a password different from your current password.")
  if (error.code === "weak_password") fail("Use a stronger password that meets the school's password requirements.")
  if (["session_not_found", "session_expired", "refresh_token_not_found"].includes(error.code ?? "")) {
    fail("Your recovery session has expired. Start over to request a new code.")
  }
  fail(fallback)
}

// The backend authorizes the update through a recovery session; this controller
// also prevents skipped steps and retains a completed save if sign-out must retry.
export class PasswordRecovery {
  private state: RecoveryState = { step: "email", email: "", resendAt: 0 }
  private busy = false
  private disposed = false

  constructor(private readonly auth: RecoveryAuth) {}

  get snapshot(): RecoveryState {
    return { ...this.state }
  }

  private async run(action: () => Promise<void>) {
    if (this.disposed) fail("Start over to request a new code.")
    if (this.busy) fail("Please wait for the current request to finish.")
    this.busy = true
    try {
      await action()
    } finally {
      this.busy = false
      if (this.disposed) await this.auth.signOut({ scope: "local" }).catch(() => {})
    }
  }

  async request(email: string) {
    return this.run(async () => {
      if (!["email", "code"].includes(this.state.step)) fail("Start over before requesting another code.")
      const parsed = emailField.safeParse(email)
      if (!parsed.success) fail(parsed.error.issues[0].message)
      if (Date.now() < this.state.resendAt) fail("Please wait before requesting another code.")

      const { error } = await this.auth.resetPasswordForEmail(parsed.data)
      if (error && !["user_not_found", "user_banned", "email_not_confirmed"].includes(error.code ?? "")) {
        if (error.status === 429 || error.code?.startsWith("over_")) {
          this.state.resendAt = Date.now() + 60_000
        }
        authError(error, "Unable to send a recovery code right now. Please try again later.")
      }
      this.state = { step: "code", email: parsed.data, resendAt: Date.now() + 60_000 }
    })
  }

  async verify(code: string) {
    return this.run(async () => {
      if (this.state.step !== "code") fail("Request a recovery code first.")
      const token = code.trim()
      if (!/^\d{6}$/.test(token)) fail("Enter the six-digit code from your email.")
      const { data, error } = await this.auth.verifyOtp({
        email: this.state.email,
        token,
        type: "recovery",
      })
      if (error) authError(error, "This code is invalid or has expired. Try again or request a new code.")
      if (!data.session || !data.user) fail("This code could not be verified. Request a new code.")
      this.state.step = "password"
    })
  }

  async save(password: string, confirmPassword: string) {
    return this.run(async () => {
      if (this.state.step !== "password") fail("Verify your recovery code before changing your password.")
      const parsed = changePasswordSchema.safeParse({ password, confirmPassword })
      if (!parsed.success) fail(parsed.error.issues[0].message)
      const { error } = await this.auth.updateUser({ password: parsed.data.password })
      if (error) authError(error, "Unable to update your password. Please try again.")
      this.state.step = "complete"
      await this.closeSession()
    })
  }

  private async closeSession() {
    const { error } = await this.auth.signOut({ scope: "local" })
    if (error) fail("Your password was saved, but sign-out failed. Select Back to sign in to retry.")
  }

  async finish() {
    return this.run(async () => {
      if (this.state.step !== "complete") fail("Complete the password reset first.")
      await this.closeSession()
    })
  }

  async restart() {
    return this.run(async () => {
      const { error } = await this.auth.signOut({ scope: "local" })
      if (error) fail("Unable to close the recovery session. Please try again.")
      this.state = { step: "email", email: "", resendAt: this.state.resendAt }
    })
  }

  dispose() {
    this.disposed = true
    // An in-flight verification is cleaned up by run() when it finishes.
    if (!this.busy) void this.auth.signOut({ scope: "local" }).catch(() => {})
  }
}
