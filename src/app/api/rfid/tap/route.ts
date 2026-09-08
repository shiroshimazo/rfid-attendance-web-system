import { createHash, timingSafeEqual } from "node:crypto"
import { rfidTapSchema } from "@/features/rfid-tap/schema"
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/services/supabase/admin"

export const runtime = "nodejs"

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}
function failure(status: number, code: string, message: string) {
  return reply({ ok: false, code, message, feedback: { led: "red", buzzer: "warning" } }, status)
}

export async function POST(request: Request) {
  const key = process.env.RFID_DEVICE_API_KEY ?? ""
  if (key.length < 32 || !isSupabaseAdminConfigured()) {
    return failure(503, "NOT_CONFIGURED", "RFID attendance is not configured on the server.")
  }
  const supplied = request.headers.get("authorization") ?? ""
  const hash = (value: string) => createHash("sha256").update(value).digest()
  if (!timingSafeEqual(hash(supplied), hash(`Bearer ${key}`))) {
    return failure(401, "UNAUTHORIZED", "Device authentication required.")
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return failure(415, "INVALID_CONTENT_TYPE", "Send an application/json request.")
  }
  // Bound the body even when Content-Length is absent or incorrect.
  const reader = request.body?.getReader()
  if (!reader) return failure(400, "INVALID_REQUEST", "Send a request ID and reader UID.")
  let body = ""
  let bytes = 0
  const decoder = new TextDecoder()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 1024) {
        await reader.cancel()
        return failure(413, "REQUEST_TOO_LARGE", "The tap request is too large.")
      }
      body += decoder.decode(value, { stream: true })
    }
    body += decoder.decode()
  } catch {
    return failure(400, "INVALID_REQUEST", "Could not read the tap request.")
  } finally { reader.releaseLock() }
  let input: unknown
  try { input = JSON.parse(body) }
  catch { return failure(400, "INVALID_REQUEST", "Send valid JSON with a request ID and reader UID.") }
  const parsed = rfidTapSchema.safeParse(input)
  if (!parsed.success) return failure(400, "INVALID_REQUEST", "Send a UUID requestId and a valid 4, 7 or 10-byte hexadecimal uid.")
  try {
    const { data, error } = await createAdminSupabaseClient().rpc("record_rfid_tap", {
      p_request_id: parsed.data.requestId, p_uid: parsed.data.uid,
    })
    if (error) return failure(503, "SAVE_UNAVAILABLE", "Could not record attendance. Retry with the same request ID.")
    if (!data || typeof data.ok !== "boolean") return failure(503, "SAVE_UNAVAILABLE", "Could not confirm attendance. Retry with the same request ID.")
    return reply(data, data.ok ? 200 : data.code === "INVALID_CARD" ? 422 : 409)
  } catch {
    return failure(503, "SAVE_UNAVAILABLE", "Could not record attendance. Retry with the same request ID.")
  }
}
