import assert from "node:assert/strict"
import { test, beforeEach, afterEach } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader()
const { renderCalendarEmail } = load("src/features/calendar/email.ts")
const { sendResendBatch, isResendConfigured } = load("src/services/email/resend.ts")
const entry = {
  title: "Meeting", description: "Details", reason: "Reason", tags: ["event"],
  attendance_impact: "normal", audience: "everyone", campuses: [],
  starts_on: "2026-11-01", ends_on: "2026-11-01", start_time: "09:00", end_time: "11:00", location: "Hall",
}
const message = { to: "student@example.com", subject: "Meeting", html: "<p>Meeting</p>", text: "Meeting" }
let env, originalFetch
beforeEach(() => {
  env = { ...process.env }
  originalFetch = globalThis.fetch
  Object.assign(process.env, { RESEND_API_KEY: "re_test", CALENDAR_EMAIL_FROM: "School <calendar@example.com>", NEXT_PUBLIC_APP_URL: "https://school.example" })
  delete process.env.CALENDAR_EMAIL_REPLY_TO
  globalThis.fetch = () => { throw new Error("Unexpected network call") }
})
afterEach(() => { process.env = env; globalThis.fetch = originalFetch })

test("templates cover publication, updates, cancellation, impact, campus, dates and role links", () => {
  for (const role of ["teacher", "student"]) {
    const result = renderCalendarEmail(entry, "published", role)
    assert.match(result.subject, /^\[Event\] Meeting/)
    assert.ok(result.text.includes(`https://school.example/${role}/calendar?date=2026-11-01`))
    assert.match(result.text, /All campuses/)
    assert.match(result.text, /09:00\u201311:00/)
  }
  for (const [impact, prefix, body] of [
    ["no_classes", "[No classes]", "RFID taps are not expected"],
    ["online_manual", "[Online class]", "Attendance is confirmed by the teacher in Subject Attendance"],
  ]) {
    const value = { ...entry, attendance_impact: impact, campuses: ["Main", "West"], ends_on: "2026-11-03" }
    const result = renderCalendarEmail(value, "published", "teacher")
    assert.ok(result.subject.startsWith(prefix))
    assert.ok(result.text.includes(body))
    assert.match(result.text, /Main, West/)
    assert.match(result.text, /2026-11-01 to 2026-11-03/)
    const cancelled = renderCalendarEmail(value, "cancelled", "student")
    assert.equal(cancelled.subject, "Cancelled: Meeting")
    assert.match(cancelled.text, /has been cancelled/)
    assert.ok(!cancelled.text.includes(body))
  }
  assert.equal(renderCalendarEmail(entry, "updated", "student").subject, "Updated: Meeting")
  assert.throws(() => renderCalendarEmail(entry, "published", "admin"), /recipient role/)
})

test("HTML escapes every dynamic field; text and subject remain readable", () => {
  const attack = `<script> & " '`
  const result = renderCalendarEmail({ ...entry, title: attack, tags: [attack], campuses: [attack], location: attack, reason: attack, description: attack }, "updated", "teacher")
  assert.ok(!result.html.includes("<script>"))
  assert.equal(result.html.split("&lt;script&gt; &amp; &quot; &#039;").length - 1, 6)
  assert.ok(result.text.includes(attack))
  assert.equal(result.subject, `Updated: ${attack}`)
  assert.ok(!renderCalendarEmail({ ...entry, title: "Hello\r\nBcc: x" }, "updated", "teacher").subject.includes("\n"))
})

test("configuration rejects missing settings, unsafe mailboxes and unsafe URLs", () => {
  assert.equal(isResendConfigured(), true)
  for (const [key, values] of Object.entries({
    RESEND_API_KEY: ["", "bad\nkey"], CALENDAR_EMAIL_FROM: ["", "bad", "School\nBcc: x <a@example.com>"],
    CALENDAR_EMAIL_REPLY_TO: ["bad", "a@example.com\nb@example.com"],
    NEXT_PUBLIC_APP_URL: ["", "javascript:alert(1)", "http://school.example", "https://x:y@school.example", "https://school.example/path", "https://school.example/?a=b"],
  })) {
    const old = process.env[key]
    for (const value of values) { process.env[key] = value; assert.equal(isResendConfigured(), false, `${key}: ${value}`) }
    if (old === undefined) delete process.env[key]; else process.env[key] = old
  }
  delete process.env.NEXT_PUBLIC_APP_URL
  assert.ok(!renderCalendarEmail(entry, "published", "student").html.includes("href="))
})

test("batch sends one private message per recipient and maps ordered IDs", async () => {
  process.env.CALENDAR_EMAIL_REPLY_TO = "office@example.com"
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails/batch")
    assert.equal(options.headers["Idempotency-Key"], "batch/1")
    assert.equal(options.headers.Authorization, "Bearer re_test")
    assert.equal(options.redirect, "error")
    assert.ok(options.signal instanceof AbortSignal)
    const body = JSON.parse(options.body)
    assert.equal(body.length, 100)
    assert.deepEqual(body[0].to, [message.to])
    assert.equal(body[0].reply_to, "office@example.com")
    assert.equal(body[0].from, "School <calendar@example.com>")
    assert.equal(body[0].text, message.text)
    return Response.json({ data: body.map((_, index) => ({ id: `id-${index}` })) })
  }
  const result = await sendResendBatch(Array(100).fill(message), "batch/1")
  assert.equal(result.status, "accepted")
  assert.equal(result.providerIds[99], "id-99")
})

test("invalid batches and missing configuration never call provider", async () => {
  for (const messages of [[], Array(101).fill(message), [{ ...message, to: "a@example.com,b@example.com" }], [{ ...message, subject: "x\nBcc: y" }]]) {
    assert.equal((await sendResendBatch(messages, "batch/1")).status, "rejected")
  }
  assert.equal((await sendResendBatch([message], "bad\nkey")).status, "rejected")
  delete process.env.RESEND_API_KEY
  assert.match((await sendResendBatch([message], "batch/1")).errorMessage, /not configured/)
})

test("HTTP errors never expose provider secrets or recipient details", async () => {
  for (const status of [400, 401, 403, 409, 422, 429, 500, 503, 408]) {
    globalThis.fetch = async () => new Response("secret recipient@example.com", { status })
    const result = await sendResendBatch([message], "batch/1")
    assert.equal(result.status, status >= 500 || status === 408 ? "unknown" : "rejected")
    assert.equal(result.errorMessage, `Email provider returned HTTP ${status}.`)
  }
})

test("malformed responses and network failures preserve uncertain acceptance", async () => {
  for (const body of ["not JSON", JSON.stringify({ data: [] }), JSON.stringify({ data: [null] }), JSON.stringify({ data: [{ id: "" }] })]) {
    globalThis.fetch = async () => new Response(body)
    assert.equal((await sendResendBatch([message], "batch/1")).status, "unknown")
  }
  globalThis.fetch = async () => { throw new Error("secret token") }
  const result = await sendResendBatch([message], "batch/1")
  assert.equal(result.status, "unknown")
  assert.ok(!result.errorMessage.includes("secret"))
})
