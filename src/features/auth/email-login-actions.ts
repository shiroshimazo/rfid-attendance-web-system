"use server"

import { createHash, randomBytes } from "node:crypto"
import { createClient, type Session } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { z } from "zod"
import { createAdminSupabaseClient } from "@/services/supabase/admin"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { supabaseUrl, supabasePublishableKey } from "@/services/supabase/config"
import { dashboardPathByRole, isUserRole } from "./roles"

const cookieName = "login-email-challenge"
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: 600 }
const trustCookieName = "login-email-trust"
const trustSeconds = 3 * 24 * 60 * 60
const credentials = z.object({ email: z.string().email().max(254), password: z.string().min(6).max(1024) })
const hash = (value: string) => createHash("sha256").update(value).digest("hex")
const authClient = () => createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
const unavailable = { error: "Unable to complete verification. Please try again or contact your administrator." }

async function activateVerifiedSession(session: Session, userId: string) {
  // Sessions come directly from Auth after a password or OTP verification.
  const payload = JSON.parse(Buffer.from(session.access_token.split(".")[1], "base64url").toString())
  if (!z.string().uuid().safeParse(payload.session_id).success) return false
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("email_verified_sessions").insert({ session_id: payload.session_id, user_id: userId })
  if (error) return false
  const server = await createServerSupabaseClient()
  const { error: cookieError } = await server.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token })
  if (cookieError) {
    await admin.from("email_verified_sessions").delete().eq("session_id", payload.session_id)
    return false
  }
  return true
}

export async function beginEmailLogin(input: { email: string; password: string }) {
  const parsed = credentials.safeParse(input)
  if (!parsed.success) return { error: "Enter a valid email and password." }
  let auth: ReturnType<typeof authClient> | undefined
  let keepSession = false
  try {
    auth = authClient()
    const { data, error } = await auth.auth.signInWithPassword(parsed.data)
    if (error || !data.user || !data.session) return { error: "Invalid email or password." }
    const admin = createAdminSupabaseClient()
    const { data: account, error: accountError } = await admin.from("users").select("role,status").eq("id", data.user.id).maybeSingle()
    if (accountError) return { error: "Account verification is unavailable. Ask your administrator to check database permissions." }
    if (!account || account.status !== "active" || !isUserRole(account.role) || !data.user.email) {
      return { error: "This account is inactive or does not have a valid system role." }
    }
    const jar = await cookies()
    const remembered = jar.get(trustCookieName)?.value
    if (remembered && /^[a-f0-9]{64}$/.test(remembered)) {
      const { data: trust, error: trustError } = await admin.from("login_email_trust").select("user_id")
        .eq("token_hash", hash(remembered)).eq("user_id", data.user.id).eq("email", data.user.email)
        .gt("expires_at", new Date().toISOString()).maybeSingle()
      if (!trustError && trust) {
        if (!await activateVerifiedSession(data.session, data.user.id)) return unavailable
        keepSession = true
        await cancelEmailLogin()
        // Do not renew the remembered deadline on password-only logins.
        return { path: dashboardPathByRole[account.role] }
      }
    }
    // Unverified password sessions are never given to the browser.
    await auth.auth.signOut({ scope: "local" })
    const token = randomBytes(32).toString("hex")
    const tokenHash = hash(token)
    const { error: saveError } = await admin.from("login_email_challenges").insert({
      token_hash: tokenHash, user_id: data.user.id, email: data.user.email,
      expires_at: new Date(Date.now() + 600_000).toISOString(),
    })
    if (saveError) return unavailable
    const { error: sendError } = await auth.auth.signInWithOtp({ email: data.user.email, options: { shouldCreateUser: false } })
    if (sendError) {
      await admin.from("login_email_challenges").delete().eq("token_hash", tokenHash)
      return { error: "Unable to send a code. Wait 60 seconds and try again. Contact your administrator if delivery keeps failing." }
    }
    const previous = jar.get(cookieName)?.value
    if (previous) await admin.from("login_email_challenges").delete().eq("token_hash", hash(previous))
    jar.set(cookieName, token, cookieOptions)
    return { email: data.user.email }
  } catch { return unavailable }
  finally { if (auth && !keepSession) await auth.auth.signOut({ scope: "local" }).catch(() => {}) }
}

export async function verifyEmailLogin(code: string) {
  if (!/^\d{6}$/.test(code)) return { error: "Enter the six-digit code from your email." }
  let auth: ReturnType<typeof authClient> | undefined
  let keepSession = false
  try {
    const jar = await cookies()
    const token = jar.get(cookieName)?.value
    if (!token) return { error: "Verification expired. Start again with your email and password." }
    const admin = createAdminSupabaseClient()
    // Atomic attempt reservation prevents concurrent requests bypassing the limit.
    const { data: attempts, error: attemptError } = await admin.rpc("claim_email_attempt", { challenge_hash: hash(token) })
    const challenge = attempts?.[0]
    if (attemptError || !challenge) return { error: "Code expired or attempt limit reached. Start again with your email and password." }
    auth = authClient()
    const { data, error } = await auth.auth.verifyOtp({ email: challenge.email, token: code, type: "email" })
    if (error || !data.session || !data.user || data.user.id !== challenge.user_id) return { error: "Invalid or expired code. Check your email and try again." }
    const { data: account, error: accountError } = await admin.from("users").select("role,status").eq("id", data.user.id).maybeSingle()
    if (accountError) return { error: "Account verification is unavailable. Ask your administrator to check database permissions." }
    if (!account || account.status !== "active" || !isUserRole(account.role)) return { error: "This account is no longer active." }
    // Consume password proof once, even if two requests verified concurrently.
    const { data: consumed, error: consumeError } = await admin.from("login_email_challenges").delete().eq("token_hash", hash(token)).gt("expires_at", new Date().toISOString()).select("user_id")
    if (consumeError || consumed?.length !== 1) return { error: "Verification expired. Please sign in again." }
    const remembered = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + trustSeconds * 1000)
    const { error: trustError } = await admin.from("login_email_trust").insert({
      token_hash: hash(remembered), user_id: data.user.id, email: challenge.email,
      expires_at: expiresAt.toISOString(),
    })
    if (trustError) return unavailable
    if (!await activateVerifiedSession(data.session, data.user.id)) {
      await admin.from("login_email_trust").delete().eq("token_hash", hash(remembered))
      return unavailable
    }
    keepSession = true
    jar.set(trustCookieName, remembered, { ...cookieOptions, maxAge: trustSeconds, expires: expiresAt })
    jar.delete(cookieName)
    return { path: dashboardPathByRole[account.role] }
  } catch { return unavailable }
  finally { if (auth && !keepSession) await auth.auth.signOut({ scope: "local" }).catch(() => {}) }
}

export async function cancelEmailLogin() {
  const jar = await cookies()
  const token = jar.get(cookieName)?.value
  jar.delete(cookieName)
  if (token) {
    try { await createAdminSupabaseClient().from("login_email_challenges").delete().eq("token_hash", hash(token)) } catch { /* Expiry also invalidates abandoned challenges. */ }
  }
}

export async function resendEmailLogin() {
  try {
    const token = (await cookies()).get(cookieName)?.value
    if (!token) return { error: "Verification expired. Please start again." }
    const now = Date.now()
    const { data, error } = await createAdminSupabaseClient().from("login_email_challenges")
      .update({ sent_at: new Date(now).toISOString() }).eq("token_hash", hash(token))
      .gt("expires_at", new Date(now).toISOString()).lt("attempts", 5)
      .lt("sent_at", new Date(now - 60_000).toISOString()).select("email").maybeSingle()
    if (error || !data) return { error: "Wait 60 seconds before resending. If verification expired, start again." }
    const { error: sendError } = await authClient().auth.signInWithOtp({ email: data.email, options: { shouldCreateUser: false } })
    if (sendError) return { error: "Unable to resend the code. Please wait and try again." }
    return { sent: true }
  } catch { return unavailable }
}
