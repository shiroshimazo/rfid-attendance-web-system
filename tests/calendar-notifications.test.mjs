import assert from "node:assert/strict"
import { test, beforeEach, afterEach } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

let rows, callbacks, calls, outcome, persistError, updateError, env, load
const batchId = "10000000-0000-4000-8000-000000000001"
const notification = {
  batch_id: batchId, type: "published",
  entry: { id: 1, title: "Original title", description: null, reason: null, tags: ["event"],
    attendance_impact: "normal", audience: "everyone", campuses: [], starts_on: "2026-11-01",
    ends_on: "2026-11-01", start_time: null, end_time: null, location: null },
  recipients: [
    { user_id: "student", email: "student@resend.dev", role: "student" },
    { user_id: "teacher", email: "teacher@resend.dev", role: "teacher" },
  ],
}
// Evaluate filters at update time, matching Postgres compare-and-set semantics.
function client() {
  return { from(table) {
    assert.equal(table, "calendar_email_deliveries")
    let patch, bounds, single = false
    const predicates = []
    const query = {
      select() { return query }, order() { return query },
      eq(key, value) { predicates.push(row => row[key] === value); return query },
      range(from, to) { bounds = [from, to]; return query },
      update(value) { patch = value; return query },
      maybeSingle() { single = true; return query },
      async upsert(values, options) {
        assert.equal(options.ignoreDuplicates, true)
        if (persistError) return { error: { message: "private DB error" } }
        for (const value of values) {
          if (!rows.some(row => row.batch_id === value.batch_id && row.recipient_user_id === value.recipient_user_id)) {
            rows.push({ ...structuredClone(value), id: rows.length + 1, status: "Pending", attempt_count: 0, retry_allowed: true })
          }
        }
        return { error: null }
      },
      then(resolve, reject) {
        return Promise.resolve().then(() => {
          if (updateError && patch?.status === "Sent") return { data: null, error: { message: "private update error" } }
          let selected = rows.filter(row => predicates.every(predicate => predicate(row)))
          if (bounds) selected = selected.slice(bounds[0], bounds[1] + 1)
          if (patch) selected.forEach(row => Object.assign(row, patch))
          return { data: structuredClone(single ? selected[0] ?? null : selected), error: null }
        }).then(resolve, reject)
      },
    }
    return query
  } }
}
beforeEach(() => {
  env = { ...process.env }; process.env.NEXT_PUBLIC_APP_URL = "https://school.example"
  rows = []; callbacks = []; calls = []; outcome = null; persistError = false; updateError = false
  load = createSourceLoader({
    "next/server": { after: callback => callbacks.push(callback) },
    "next/cache": { revalidatePath() {} },
    "@/services/supabase/admin": { createAdminSupabaseClient: client },
    "@/services/email/smtp": {
      calendarEmailAppUrl: () => process.env.NEXT_PUBLIC_APP_URL ?? null,
      sendSmtpBatch: async (messages, key) => {
        calls.push({ messages, key })
        const result = typeof outcome === "function" ? outcome(messages) : outcome ?? { status: "accepted", providerIds: messages.map((_, i) => `provider-${calls.length}-${i}`) }
        if (Array.isArray(result)) return result
        return messages.map((_, i) => result.status === "accepted" ? { status: "accepted", providerId: result.providerIds[i] } : result)
      },
    },
  })
})
afterEach(() => { process.env = env })
const notifications = () => load("src/features/calendar/notifications.ts")
const service = () => load("src/services/calendar/email.ts")

test("stores payloads before after(), excludes admins and deduplicates recipients", async () => {
  await notifications().queueCalendarNotification({ ...notification, recipients: [...notification.recipients, notification.recipients[0], { user_id: "admin", role: "admin", email: "admin@resend.dev" }] })
  assert.equal(rows.length, 2); assert.equal(calls.length, 0); assert.equal(callbacks.length, 1)
  assert.match(rows[0].html_body, /student\/calendar/)
  assert.match(rows[1].html_body, /teacher\/calendar/)
  await callbacks[0]()
  assert.equal(calls.length, 1)
  assert.ok(rows.every(row => row.status === "Sent" && row.attempt_count === 1 && row.last_attempt_at && row.sent_at))
})

test("duplicate callbacks and concurrent send attempts claim each recipient once", async () => {
  await notifications().queueCalendarNotification(notification)
  await notifications().queueCalendarNotification(notification)
  assert.equal(rows.length, 2)
  await Promise.all(callbacks.map(callback => callback()))
  assert.equal(calls.flatMap(call => call.messages).length, 2)
  assert.ok(rows.every(row => row.attempt_count === 1))
  await service().sendCalendarDeliveries(batchId)
  assert.equal(calls.flatMap(call => call.messages).length, 2)
})

test("chunks at 100, retains successful chunks, retries only failed stored payloads", async () => {
  await notifications().queueCalendarNotification({ ...notification, recipients: Array.from({ length: 101 }, (_, i) => ({ user_id: `student-${i}`, email: `s${i}@resend.dev`, role: "student" })) })
  outcome = messages => calls.length === 2 ? { status: "rejected", errorMessage: "Email provider returned HTTP 429." } : { status: "accepted", providerIds: messages.map((_, i) => `provider-${i}`) }
  await callbacks[0]()
  assert.deepEqual(calls.map(call => call.messages.length), [100, 1])
  assert.equal(rows.filter(row => row.status === "Sent").length, 100)
  assert.equal(rows[100].status, "Failed")
  const original = { to: rows[100].recipient_email, subject: rows[100].subject, html: rows[100].html_body, text: rows[100].text_body }
  process.env.NEXT_PUBLIC_APP_URL = "https://changed.example"
  outcome = null
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), true)
  assert.equal(await notifications().queueCalendarEmailRetry({ id: rows[100].id }), true)
  await Promise.all(callbacks.slice(1).map(callback => callback()))
  assert.equal(calls.length, 3)
  assert.deepEqual(calls[2].messages, [original])
  assert.equal(rows[100].attempt_count, 2)
  assert.ok(rows.slice(0, 100).every(row => row.attempt_count === 1))
})

test("unknown acceptance blocks retry while retaining failed delivery details", async () => {
  outcome = { status: "unknown", errorMessage: "Email request failed or timed out; acceptance is unknown." }
  await notifications().queueCalendarNotification(notification); await callbacks[0]()
  assert.ok(rows.every(row => row.status === "Failed" && !row.retry_allowed))
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), false)
  assert.equal(calls.length, 1)
})

test("failure saving provider acceptance leaves claims locked and prevents duplicate sends", async () => {
  await notifications().queueCalendarNotification(notification)
  updateError = true
  await assert.rejects(() => service().sendCalendarDeliveries(batchId), /result could not be saved/)
  assert.ok(rows.every(row => row.status === "Pending" && !row.retry_allowed))
  updateError = false
  await service().sendCalendarDeliveries(batchId)
  assert.equal(calls.length, 1)
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), false)
})

test("no recipients and persistence failures never schedule delivery", async () => {
  assert.equal(await notifications().queueCalendarNotification(), "")
  assert.match(await notifications().queueCalendarNotification({ ...notification, recipients: [] }), /No recipients/)
  persistError = true
  assert.match(await notifications().queueCalendarNotification(notification), /scheduling failed/)
  assert.equal(callbacks.length, 0); assert.equal(calls.length, 0)
})

test("unconfigured provider records failed deliveries and supports retry after setup", async () => {
  delete process.env.NEXT_PUBLIC_APP_URL
  outcome = { status: "rejected", errorMessage: "Calendar email is not configured." }
  await notifications().queueCalendarNotification(notification); await callbacks[0]()
  assert.ok(rows.every(row => row.status === "Failed" && row.retry_allowed && row.text_body.includes("Original title")))
  assert.ok(rows.every(row => !row.html_body.includes("href=")))
  process.env.NEXT_PUBLIC_APP_URL = "https://school.example"
  outcome = null
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), true)
  await callbacks[1]()
  assert.ok(rows.every(row => row.status === "Sent" && row.attempt_count === 2))
})


test("placeholder recipients fail individually without blocking valid recipients", async () => {
  const invalid = ["student@example.com", "student@EXAMPLE.NET", "student@sub.example.org", "student@school.test", "not-an-email"]
  await notifications().queueCalendarNotification({ ...notification, recipients: [
    ...invalid.map((email, i) => ({ user_id: `invalid-${i}`, email, role: "student" })),
    { user_id: "valid", email: "delivered@resend.dev", role: "teacher" },
  ] })
  await callbacks[0]()
  assert.deepEqual(calls[0].messages.map(message => message.to), ["delivered@resend.dev"])
  assert.ok(rows.slice(0, invalid.length).every(row => row.status === "Failed" && !row.retry_allowed && /placeholder domain/.test(row.error_message)))
  assert.equal(rows.at(-1).status, "Sent")
  assert.equal(rows.at(-1).resend_email_id, "provider-1-0")
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), false)
})

test("all-placeholder batches never call the provider, including retries of old failures", async () => {
  await notifications().queueCalendarNotification({ ...notification, recipients: [
    { user_id: "placeholder", email: "student@example.com", role: "student" },
  ] })
  rows[0].status = "Failed"
  rows[0].attempt_count = 1
  assert.equal(await notifications().queueCalendarEmailRetry({ batchId }), true)
  await callbacks[1]()
  assert.equal(calls.length, 0)
  assert.equal(rows[0].status, "Failed")
  assert.equal(rows[0].retry_allowed, false)
  assert.equal(rows[0].attempt_count, 2)
})


test("mixed SMTP results persist independently and retry only definite rejection", async () => {
  await notifications().queueCalendarNotification(notification)
  outcome = [{ status: "accepted", providerId: "smtp-message-id" }, { status: "rejected", errorMessage: "Gmail rejected the email (SMTP 550)." }]
  await callbacks[0]()
  assert.equal(rows[0].status, "Sent")
  assert.equal(rows[0].resend_email_id, "smtp-message-id")
  assert.equal(rows[1].status, "Failed")
  outcome = null
  await notifications().queueCalendarEmailRetry({ batchId })
  await callbacks[1]()
  assert.equal(calls[1].messages.length, 1)
  assert.equal(rows[0].attempt_count, 1)
  assert.equal(rows[1].status, "Sent")
})
