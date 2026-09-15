import { getCurrentAccount } from "@/features/auth/server"
import { createAdminSupabaseClient } from "@/services/supabase/admin"

type Outcome = "success" | "failed" | "denied"

/** Server-only append. Never accept request bodies, credentials, or raw error messages. */
export async function recordActivity(event: string, entity: string, outcome: Outcome, httpStatus?: number) {
  try {
    const account = await getCurrentAccount().catch(() => null)
    const { error } = await createAdminSupabaseClient().from("system_logs").insert({
      actor_id: account?.id ?? null,
      actor_name: account?.name ?? "Unauthenticated / service",
      actor_role: account?.role ?? "system",
      source: "application", event, entity, outcome,
      details: httpStatus === undefined ? {} : { http_status: httpStatus },
    })
    if (error) console.error("System audit append failed; check database migration and connectivity.")
  } catch {
    // Auth, device responses and already-committed writes must remain truthful during outages.
    console.error("System audit append unavailable; check database migration and connectivity.")
  }
}

export async function auditActivity<T>(event: string, entity: string, operation: () => Promise<T>): Promise<T> {
  try {
    const result = await operation()
    const failed = typeof result === "object" && result !== null &&
      (("ok" in result && result.ok === false) || ("error" in result && Boolean(result.error)))
    await recordActivity(event, entity, failed ? "failed" : "success")
    return result
  } catch (error) {
    const redirect = typeof error === "object" && error !== null && "digest" in error &&
      typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")
    await recordActivity(event, entity, redirect ? "denied" : "failed")
    throw error
  }
}

export async function auditRoute(event: string, entity: string, operation: () => Promise<Response>): Promise<Response> {
  try {
    const response = await operation()
    const outcome = [401,403].includes(response.status) ? "denied" : response.status >= 400 ? "failed" : "success"
    await recordActivity(event, entity, outcome, response.status)
    return response
  } catch (error) {
    await recordActivity(event, entity, "failed", 500)
    throw error
  }
}
