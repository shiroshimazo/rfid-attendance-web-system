import { deliverArrivalSms, deliverDepartureSms } from "@/services/sms/philsms"
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/services/supabase/admin"

export function tapFailure(status: number, code: string, message: string) {
  return { status, body: { ok: false, code, message, feedback: { led: "red", buzzer: "warning" } } }
}

/** Call only after transport authentication and request validation. */
export async function recordValidatedTap(input: { requestId: string; uid: string }) {
  if (!isSupabaseAdminConfigured()) {
    return tapFailure(503, "NOT_CONFIGURED", "RFID attendance is not configured on the server.")
  }
  try {
    const { data, error } = await createAdminSupabaseClient().rpc("record_rfid_tap", {
      p_request_id: input.requestId, p_uid: input.uid,
    })
    if (error || !data || typeof data.ok !== "boolean") {
      return tapFailure(503, "SAVE_UNAVAILABLE", "Could not confirm attendance. Retry with the same request ID.")
    }
    if (data.ok && data.action === "time_in") await deliverArrivalSms(data.attendanceId)
    if (data.ok && data.action === "time_out") await deliverDepartureSms(data.attendanceId)
    return { status: data.ok ? 200 : data.code === "INVALID_CARD" ? 422 : 409, body: data }
  } catch {
    return tapFailure(503, "SAVE_UNAVAILABLE", "Could not record attendance. Retry with the same request ID.")
  }
}
