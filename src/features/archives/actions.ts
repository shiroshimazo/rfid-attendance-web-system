"use server"

import { auditActivity } from "@/services/audit/log"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireRole } from "@/features/auth/server"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { failure, success, type ActionResult } from "@/features/shared/actions"

const restoreSchema = z.object({
  category: z.enum(["students", "teachers", "subject_schedules", "class_schedules"]),
  id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
})
export async function restoreArchiveAction(input: unknown): Promise<ActionResult> {
  return auditActivity("restore_archive", "archives", async () => {
    await requireRole("admin")
    const parsed = restoreSchema.safeParse(input)
    if (!parsed.success) return failure("Choose a valid archived record.")
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.rpc("restore_archived_record", { p_kind: parsed.data.category, p_id: parsed.data.id })
    if (error) return failure(error.message)
    revalidatePath("/admin", "layout")
    revalidatePath("/teacher", "layout")
    revalidatePath("/student", "layout")
    return success("Record restored to active.")
  })
}
