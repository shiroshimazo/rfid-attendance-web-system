import assert from "node:assert/strict"
import { test, beforeEach, afterEach } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

let sendMail, transportOptions, closed
const load = createSourceLoader({ nodemailer: { createTransport(options) {
  transportOptions = options
  return { sendMail: message => sendMail(message), close() { closed = true } }
} } })
const { renderCalendarEmail } = load("src/features/calendar/email.ts")
const { sendSmtpBatch, isSmtpConfigured } = load("src/services/email/smtp.ts")
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
  Object.assign(process.env, { GMAIL_SMTP_USER: "sender@gmail.com", GMAIL_SMTP_APP_PASSWORD: "app password", NEXT_PUBLIC_APP_URL: "https://school.example" })
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
  assert.equal(isSmtpConfigured(), true)
  for (const [key, values] of Object.entries({
    GMAIL_SMTP_APP_PASSWORD: [""], GMAIL_SMTP_USER: ["", "bad", "a@gmail.com\nBcc: x"],
    CALENDAR_EMAIL_REPLY_TO: ["bad", "a@example.com\nb@example.com"],
    NEXT_PUBLIC_APP_URL: ["", "javascript:alert(1)", "http://school.example", "https://x:y@school.example", "https://school.example/path", "https://school.example/?a=b"],
  })) {
    const old = process.env[key]
    for (const value of values) { process.env[key] = value; assert.equal(isSmtpConfigured(), false, `${key}: ${value}`) }
    if (old === undefined) delete process.env[key]; else process.env[key] = old
  }
  delete process.env.NEXT_PUBLIC_APP_URL
  assert.ok(!renderCalendarEmail(entry, "published", "student").html.includes("href="))
})

test("SMTP sends private messages with authenticated sender and TLS", async () => {
  const sent = []
  process.env.CALENDAR_EMAIL_REPLY_TO = "office@gmail.com"
  sendMail = async message => { sent.push(message); return { accepted: [message.to], messageId: `id-${sent.length}` } }
  const results = await sendSmtpBatch([message, { ...message, to: "other@gmail.com" }])
  assert.equal(transportOptions.host, "smtp.gmail.com")
  assert.equal(transportOptions.port, 465)
  assert.equal(transportOptions.secure, true)
  assert.equal(transportOptions.auth.pass, "apppassword")
  assert.deepEqual(sent.map(value => value.to), [message.to, "other@gmail.com"])
  assert.equal(sent[0].from.address, "sender@gmail.com")
  assert.equal(sent[0].replyTo, "office@gmail.com")
  assert.deepEqual(results.map(value => value.providerId), ["id-1", "id-2"])
  assert.equal(closed, true)
})

test("SMTP partial failure preserves successful recipients and safe errors", async () => {
  let attempts = 0
  sendMail = async () => {
    attempts++
    if (attempts === 2) throw Object.assign(new Error("secret recipient and password"), { responseCode: 550 })
    return { accepted: [message.to], messageId: `id-${attempts}` }
  }
  const results = await sendSmtpBatch([message, message, message])
  assert.deepEqual(results.map(value => value.status), ["accepted", "rejected", "accepted"])
  assert.equal(results[1].errorMessage, "Gmail rejected the email (SMTP 550).")
})

test("SMTP unknown outcomes stay locked and authentication errors are actionable", async () => {
  for (const [error, status] of [[{ code: "EAUTH" }, "rejected"], [{ code: "ETIMEDOUT" }, "unknown"], [{ responseCode: 421 }, "rejected"]]) {
    sendMail = async () => { throw error }
    assert.equal((await sendSmtpBatch([message]))[0].status, status)
  }
  sendMail = async () => ({ accepted: [], messageId: "id" })
  assert.equal((await sendSmtpBatch([message]))[0].status, "unknown")
})

test("missing configuration and invalid messages never send", async () => {
  sendMail = () => assert.fail("unexpected send")
  assert.equal((await sendSmtpBatch([{ ...message, to: "bad" }]))[0].status, "rejected")
  delete process.env.GMAIL_SMTP_APP_PASSWORD
  assert.match((await sendSmtpBatch([message]))[0].errorMessage, /not configured/)
})
