import { z } from "zod"
import { normalizeRfidUid } from "@/lib/rfid-uid"

export const rfidTapSchema = z.object({
  requestId: z.uuid(),
  uid: z.string().max(64).transform(normalizeRfidUid).refine(value => value !== null, "Invalid reader UID"),
}).strict()
