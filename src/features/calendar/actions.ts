"use server"

import { queueCalendarNotification, queueCalendarEmailRetry, type CalendarNotification } from "@/features/calendar/notifications"
import { auditActivity } from "@/services/audit/log"
import { revalidatePath } from "next/cache"
import { requireCurrentAccount, requireRole } from "@/features/auth/server"
import { isCalendarUnread } from "@/features/calendar/query"
import {
  calendarEntrySchema,
  type CalendarEntryValues,
} from "@/features/calendar/schema"
import {
  describeError as describeDatabaseError,
  failure,
  flattenIssues,
  success,
  validationFailureMessage,
  type ActionResult,
} from "@/features/shared/actions"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { fetchVisibleCalendarEntries } from "@/services/calendar/query"

const CALENDAR_ADMIN_PATH = "/admin/schedules/calendar"

function refreshCalendarViews() {
  for (const path of [
    CALENDAR_ADMIN_PATH,
    "/admin/dashboard",
    "/teacher/dashboard",
    "/student/dashboard",
    "/teacher/attendance",
    "/student/my-attendance",
  ]) {
    revalidatePath(path)
  }
}

async function adminOnlyClient() {
  return createServerSupabaseClient()
}

/**
 * Save a calendar entry (create or update draft; update published with reconciliation).
 * The RPC enforces verified-admin, payload validation, overlap checks, and mark reconciliation.
 */
export async function saveCalendarEntryAction(
  input: CalendarEntryValues & { id?: number; notifyRecipients?: boolean }
): Promise<ActionResult> {
  return auditActivity("save_calendar_entry", "calendar_entries", async () => {
    await requireRole("admin")

    if (!input || typeof input !== "object") return failure(validationFailureMessage)
    const { id, notifyRecipients = false, ...editable } = input
    if ((id !== undefined && (!Number.isSafeInteger(id) || id <= 0)) || typeof notifyRecipients !== "boolean") {
      return failure("Invalid calendar entry or notification option.")
    }
    const isCreate = id === undefined
    const parsed = calendarEntrySchema.safeParse(editable)

    if (!parsed.success) {
      return failure(validationFailureMessage, flattenIssues(parsed.error.issues))
    }

    const values = parsed.data
    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("mutate_calendar_entry", {
      p_operation: "save", p_id: id ?? null, p_notify: notifyRecipients, p_payload: values,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      // If the RPC returned a structured error with field, try to surface it
      if (error.code === "22023" || error.code === "23514") {
        return failure(msg)
      }
      return failure(msg)
    }

    const result = data as { ok: boolean; id: number; notification?: CalendarNotification } | null
    if (!result?.ok) {
      return failure("The entry was not saved.")
    }

    refreshCalendarViews()

    return success((isCreate ? "Calendar entry created." : "Calendar entry updated.") + await queueCalendarNotification(result.notification))
  })
}

/**
 * Publish a draft or cancelled entry.
 * The RPC enforces verified-admin, Manila past-date check, overlap, and atomic mark creation.
 */
export async function publishCalendarEntryAction(entryId: number): Promise<ActionResult> {
  return auditActivity("publish_calendar_entry", "calendar_entries", async () => {
    await requireRole("admin")

    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("mutate_calendar_entry", {
      p_operation: "publish",
      p_id: entryId,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      return failure(msg)
    }

    const result = data as { ok: boolean; notification?: CalendarNotification } | null
    if (!result?.ok) {
      return failure("The entry could not be published.")
    }

    refreshCalendarViews()

    return success("Calendar entry published." + await queueCalendarNotification(result.notification))
  })
}

/**
 * Republish a cancelled entry (same RPC as publish, works from cancelled status).
 */
export async function republishCalendarEntryAction(entryId: number): Promise<ActionResult> {
  return auditActivity("republish_calendar_entry", "calendar_entries", async () => {
    await requireRole("admin")

    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("mutate_calendar_entry", {
      p_operation: "publish",
      p_id: entryId,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      return failure(msg)
    }

    const result = data as { ok: boolean; notification?: CalendarNotification } | null
    if (!result?.ok) {
      return failure("The entry could not be republished.")
    }

    refreshCalendarViews()

    return success("Calendar entry republished." + await queueCalendarNotification(result.notification))
  })
}

/**
 * Cancel a published entry.
 * The RPC removes today/future marks atomically, retains history, clears published_at.
 */
export async function cancelCalendarEntryAction(entryId: number): Promise<ActionResult> {
  return auditActivity("cancel_calendar_entry", "calendar_entries", async () => {
    await requireRole("admin")

    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("mutate_calendar_entry", {
      p_operation: "cancel",
      p_id: entryId,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      return failure(msg)
    }

    const result = data as { ok: boolean; notification?: CalendarNotification } | null
    if (!result?.ok) {
      return failure("The entry could not be cancelled.")
    }

    refreshCalendarViews()

    return success("Calendar entry cancelled. Today and future attendance marks removed; history retained." + await queueCalendarNotification(result.notification))
  })
}

/**
 * Delete a never-published draft.
 * The RPC rejects if the entry was ever published or cancelled.
 */
export async function deleteCalendarDraftAction(entryId: number): Promise<ActionResult> {
  return auditActivity("delete_calendar_draft", "calendar_entries", async () => {
    await requireRole("admin")

    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("delete_calendar_draft", {
      p_id: entryId,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      return failure(msg)
    }

    const result = data as { ok: boolean } | null
    if (!result?.ok) {
      return failure("The draft could not be deleted.")
    }

    refreshCalendarViews()

    return success("Calendar draft deleted.")
  })
}

/**
 * Sync attendance day marks for a date range.
 * Creates/removes NoClasses/OnlineManual marks for active students per campus.
 */
export async function syncAttendanceMarksAction(
  fromDate: string,
  toDate: string
): Promise<ActionResult> {
  return auditActivity("sync_attendance_day_marks", "attendance_day_marks", async () => {
    await requireRole("admin")

    const supabase = await adminOnlyClient()

    const { data, error } = await supabase.rpc("sync_attendance_day_marks", {
      p_from_date: fromDate,
      p_to_date: toDate,
    })

    if (error) {
      const msg = describeDatabaseError(error)
      return failure(msg)
    }

    const result = data as { inserted: number; deleted: number } | null
    if (!result) {
      return failure("The sync completed but returned no counts.")
    }

    refreshCalendarViews()

    return success(
      `Attendance marks synchronized: ${result.inserted} created, ${result.deleted} removed.`
    )
  })
}

const RECEIPT_REVALIDATE_PATHS = ["/teacher", "/student"] as const

function refreshReceiptViews() {
  for (const path of RECEIPT_REVALIDATE_PATHS) {
    revalidatePath(path, "layout")
  }
}

/**
 * Teachers/students only. Admins never receive announcements or receipts.
 * Returns null instead of redirecting so the action can report a useful error.
 */
async function currentCalendarRecipient() {
  const account = await requireCurrentAccount()
  return account.role === "teacher" || account.role === "student" ? account : null
}

function receiptFailure(error: { message: string; code?: string }) {
  if (error.code === "42501") {
    return failure("That announcement is not available to your account.")
  }
  return failure(describeDatabaseError(error))
}

/**
 * Mark one visible published announcement as read for the signed-in
 * teacher/student. RLS rejects cross-user receipts; the visibility check
 * rejects drafts, cancelled entries, other campuses, and other audiences.
 */
export async function markCalendarEntryReadAction(entryId: number): Promise<ActionResult> {
  return auditActivity("mark_calendar_entry_read", "calendar_entry_reads", async () => {
    const account = await currentCalendarRecipient()
    if (!account) return failure("Calendar announcements are for teacher and student accounts.")

    if (!Number.isSafeInteger(entryId) || entryId <= 0) {
      return failure("That announcement was not valid.")
    }

    const supabase = await createServerSupabaseClient()

    const { data: entry, error: readError } = await supabase
      .from("calendar_entries")
      .select("id")
      .eq("id", entryId)
      .eq("status", "published")
      .maybeSingle<{ id: number }>()

    if (readError) return receiptFailure(readError)
    if (!entry) return failure("That announcement is not available to your account.")

    const { error } = await supabase
      .from("calendar_entry_reads")
      .upsert(
        { entry_id: entryId, user_id: account.id },
        { onConflict: "entry_id,user_id" }
      )

    if (error) return receiptFailure(error)

    refreshReceiptViews()
    return success("Announcement marked as read.")
  })
}

/**
 * Mark every currently visible unread announcement as read.
 * Uses the same window as the bell but without the 20-item display cap.
 */
export async function markAllCalendarEntriesReadAction(): Promise<ActionResult> {
  return auditActivity("mark_all_calendar_entries_read", "calendar_entry_reads", async () => {
    const account = await currentCalendarRecipient()
    if (!account) return failure("Calendar announcements are for teacher and student accounts.")

    const supabase = await createServerSupabaseClient()
    const visible = await fetchVisibleCalendarEntries(account.id).catch((error: unknown) =>
      error instanceof Error ? error : new Error("Announcements could not be read.")
    )

    if (visible instanceof Error) return failure(visible.message)

    const unread = visible.filter((entry) =>
      isCalendarUnread(entry.updated_at, entry.read_at)
    )

    if (unread.length === 0) return success("No unread announcements.")

    const rows = unread.map((entry) => ({
      entry_id: entry.id,
      user_id: account.id,
    }))

    for (let index = 0; index < rows.length; index += 500) {
      const { error } = await supabase
        .from("calendar_entry_reads")
        .upsert(rows.slice(index, index + 500), { onConflict: "entry_id,user_id" })

      if (error) return receiptFailure(error)
    }

    refreshReceiptViews()
    return success(
      `${unread.length} announcement${unread.length === 1 ? "" : "s"} marked as read.`
    )
  })
}

/** Retry stored payloads only; uncertain acceptance requires operator review. */
export async function retryCalendarEmailAction(target: { id: number } | { batchId: string }): Promise<ActionResult> {
  return auditActivity("retry_calendar_email", "calendar_email_deliveries", async () => {
    await requireRole("admin")
    if (!target || typeof target !== "object" || ("id" in target
      ? !Number.isSafeInteger(target.id) || target.id <= 0
      : typeof target.batchId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target.batchId))) {
      return failure("Invalid email delivery or batch.")
    }
    try {
      return await queueCalendarEmailRetry(target)
        ? success("Email retry queued.")
        : failure("No retryable failed deliveries. Unknown acceptance or interrupted attempts require operator review.")
    } catch {
      return failure("Email retry could not be scheduled.")
    }
  })
}
