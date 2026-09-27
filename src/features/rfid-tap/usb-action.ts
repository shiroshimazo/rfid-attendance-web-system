"use server"

import { requireRole } from "@/features/auth/server"
import { rfidTapSchema } from "@/features/rfid-tap/schema"
import { recordValidatedTap, tapFailure } from "@/services/rfid/tap"
import { auditRoute } from "@/services/audit/log"

export async function recordUsbTapAction(input: unknown) {
  // Browser authentication is mandatory; no device/service key reaches the browser.
  await requireRole("admin")
  const response = await auditRoute("rfid_usb_tap", "rfid_cards", async () => {
    const parsed = rfidTapSchema.safeParse(input)
    const result = parsed.success
      ? await recordValidatedTap({ requestId: parsed.data.requestId, uid: parsed.data.uid! })
      : tapFailure(400, "INVALID_REQUEST", "Send a UUID requestId and a valid reader UID.")
    return Response.json(result.body, { status: result.status })
  })
  return { status: response.status, body: await response.json() }
}
