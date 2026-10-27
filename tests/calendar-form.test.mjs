import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"
const { calendarFormValues, calendarTagChange, calendarScopeLocked, calendarLifecycleOptions, validateCalendarForm } = createSourceLoader()("src/features/calendar/form.ts")

test("wizard validation retains normalized payloads, explicit campus intent, and cross-field errors", () => {
  const values = { ...calendarFormValues("2026-11-05"), title: "  School notice  " }
  const valid = validateCalendarForm(values, true)
  assert.deepEqual(valid.errors, {}); assert.equal(valid.parsed.data.title, "School notice")
  assert.match(validateCalendarForm(values, false).errors.campuses, /Choose at least one campus/)
  const online = validateCalendarForm(calendarTagChange(values, ["online_class"]), true)
  assert.match(online.errors.reason, /reason is required/)
  const schedule = validateCalendarForm({ ...values, startsOn: "2026-11-06", endsOn: "2026-11-05", startTime: "09:00", endTime: null }, true)
  assert.match(schedule.errors.endsOn, /End date|single day/)
  assert.match(schedule.errors.endTime, /both times/)
})

test("new forms default to selected date, all campuses and draft-compatible values", () => {
  const values = calendarFormValues("2026-11-05")
  assert.equal(values.startsOn, "2026-11-05"); assert.equal(values.endsOn, values.startsOn)
  assert.deepEqual(values.campuses, []); assert.deepEqual(values.tags, ["event"])
  const edited = calendarFormValues("2026-11-05", { title: "Meeting", tags: ["meeting"], start_time: "09:30:00", end_time: "10:00:00", starts_on: "2026-11-06", ends_on: "2026-11-06" })
  assert.equal(edited.startTime, "09:30"); assert.equal(edited.title, "Meeting"); assert.equal(edited.startsOn, "2026-11-06")
})

test("tag changes select impact, enforce everyone and clear incompatible times", () => {
  const values = { ...calendarFormValues("2026-11-05"), startTime: "09:00", endTime: "10:00", audience: "students" }
  const changed = calendarTagChange(values, ["no_classes", "online_class"])
  assert.equal(changed.attendanceImpact, "online_manual"); assert.equal(changed.audience, "everyone")
  assert.equal(changed.startTime, null); assert.equal(changed.endTime, null)
  assert.equal(calendarTagChange(values, ["no_classes"]).attendanceImpact, "no_classes")
  assert.equal(calendarTagChange(values, ["event"]).startTime, "09:00")
})

test("historical exception scope stays locked and only never-published drafts offer deletion", () => {
  const entry = { status: "published", starts_on: "2026-10-25", attendance_impact: "no_classes", published_at: "2026-10-24T00:00:00Z" }
  assert.equal(calendarScopeLocked(entry, "2026-10-26"), true)
  assert.equal(calendarScopeLocked({ ...entry, starts_on: "2026-10-26" }, "2026-10-26"), false)
  assert.equal(calendarScopeLocked({ ...entry, status: "draft" }, "2026-10-26"), false)
  assert.deepEqual(calendarLifecycleOptions(entry), ["cancel"])
  assert.deepEqual(calendarLifecycleOptions({ ...entry, status: "cancelled" }), ["republish"])
  assert.deepEqual(calendarLifecycleOptions({ ...entry, status: "draft", published_at: null }), ["publish", "delete"])
  assert.deepEqual(calendarLifecycleOptions({ ...entry, status: "draft" }), ["publish"])
})

test("server actions preserve conflict details, validate previews and deny non-admin previews", async () => {
  let denied = false, counts = 0
  const load = createSourceLoader({
    "next/cache": { revalidatePath() {} },
    "@/features/auth/server": { requireRole: async () => { if (denied) throw new Error("Forbidden") } },
    "@/features/calendar/notifications": { queueCalendarNotification: async () => "" },
    "@/services/audit/log": { auditActivity: async (_, __, operation) => operation() },
    "@/services/calendar/query": { fetchCalendarEntryRecipientCount: async () => { counts++; return { total: 3, teacher_count: 1, student_count: 2 } } },
    "@/services/supabase/server": { createServerSupabaseClient: () => ({ rpc: async () => ({ error: null, data: { ok: false, code: "CALENDAR_CONFLICT", message: "Attendance is already set by another announcement." } }) }) },
  })
  const actions = load("src/features/calendar/actions.ts")
  const result = await actions.saveCalendarEntryAction({ ...calendarFormValues("2026-11-05"), title: "Event", id: 1 })
  assert.equal(result.ok, false); assert.match(result.fieldErrors.startsOn, /already set/)
  assert.equal((await actions.previewCalendarRecipientsAction(0)).ok, false)
  assert.equal(counts, 0)
  assert.equal((await actions.previewCalendarRecipientsAction(1)).recipients.total, 3)
  denied = true
  await assert.rejects(() => actions.previewCalendarRecipientsAction(1), /Forbidden/)
  assert.equal(counts, 1)
})
