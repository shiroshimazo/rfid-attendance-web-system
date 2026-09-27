import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { parseUsbFrame, runUsbAttendance } = createSourceLoader()("src/lib/rfid-usb-attendance.ts")
const requestId = "10000000-0000-4000-8000-000000000001"
const tap = { type: "tap", requestId, uid: "00:20:01:07" }
const ready = { type: "ready", protocol: 1, mode: "attendance" }
const line = value => JSON.stringify(value) + "\n"

function device(chunks = [], onWrite = () => {}) {
  const frames = []
  let closed = false
  let input
  const readable = new ReadableStream({ start(controller) {
    input = controller
    for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk))
  } })
  const writable = new WritableStream({ write(bytes) {
    const frame = JSON.parse(new TextDecoder().decode(bytes))
    frames.push(frame)
    onWrite(frame)
  } })
  return { frames, input: () => input, closed: () => closed, port: {
    readable, writable,
    async open(options) { assert.equal(options.baudRate, 115200) },
    async close() {
      assert.equal(readable.locked, false)
      assert.equal(writable.locked, false)
      closed = true
    },
  } }
}

test("USB frames require explicit protocol/mode and valid UUID/UID", () => {
  assert.deepEqual(parseUsbFrame(line(tap)), { type: "tap", requestId, uid: "00200107" })
  for (const value of ["boot", "Card detected! UID: EE:20:01:07", "x".repeat(4097),
    line({ ...tap, requestId: "bad" }), line({ ...tap, uid: "123" }),
    line({ ...ready, mode: "registration" }), line({ ...ready, protocol: 2 })]) {
    assert.equal(parseUsbFrame(value), null)
  }
})

test("handshake gates writes; split frames and duplicate tap return same result", async () => {
  const stop = new AbortController()
  let responses = 0
  const mock = device([line(tap) + "boot\n" + line(ready) + line(tap).slice(0, 25),
    line(tap).slice(25) + line(tap)], frame => {
    if (frame.type === "result" && ++responses === 2) stop.abort()
  })
  const calls = []
  const body = { ok: true, message: "Time in recorded", feedback: { led: "green", buzzer: "success" } }
  await assert.rejects(runUsbAttendance(mock.port, stop.signal, async input => {
    calls.push(input); return { status: 200, body }
  }, () => {}), { name: "AbortError" })
  assert.deepEqual(calls, [{ requestId, uid: "00200107" }])
  assert.deepEqual(mock.frames[0], { type: "hello", protocol: 1, mode: "attendance" })
  assert.deepEqual(mock.frames.filter(f => f.type === "result"), Array(2).fill({ type: "result", requestId, status: 200, body }))
  assert.equal(mock.closed(), true)
})

test("server outage forwards uncertainty and retry uses the same ID", async () => {
  const stop = new AbortController()
  let responses = 0, calls = 0
  const mock = device([line(ready) + line(tap) + line(tap)], frame => {
    if (frame.type === "result" && ++responses === 2) stop.abort()
  })
  await assert.rejects(runUsbAttendance(mock.port, stop.signal, async input => {
    assert.equal(input.requestId, requestId)
    if (++calls === 1) throw new Error("offline")
    return { status: 422, body: { ok: false, message: "Unknown card", feedback: { led: "red", buzzer: "warning" } } }
  }, () => {}), { name: "AbortError" })
  assert.equal(calls, 2)
  const results = mock.frames.filter(f => f.type === "result")
  assert.equal(results[0].status, 503)
  assert.equal(results[0].body.ok, false)
  assert.equal(results[1].status, 422)
  assert.equal(mock.closed(), true)
})

test("abort releases port even while server response is pending", async () => {
  const stop = new AbortController()
  const mock = device([line(ready) + line(tap)])
  await assert.rejects(runUsbAttendance(mock.port, stop.signal, () => {
    stop.abort(); return new Promise(() => {})
  }, () => {}), { name: "AbortError" })
  assert.equal(mock.closed(), true)
  assert.equal(mock.frames.some(f => f.type === "result"), false)
})

test("disconnect releases both streams; oversized frame never submits", async () => {
  const mock = device([line(ready) + "x".repeat(4097) + line(tap)])
  mock.input().close()
  await assert.rejects(runUsbAttendance(mock.port, new AbortController().signal,
    async () => { assert.fail("must not submit") }, () => {}), /USB disconnected/)
  assert.equal(mock.closed(), true)
})

test("USB action authenticates admin before validation or attendance mutation", async () => {
  let writes = 0
  const { recordUsbTapAction } = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); throw new Error("unauthorized") } },
    "@/services/rfid/tap": { recordValidatedTap: async () => { writes++ } },
    "@/services/audit/log": { auditRoute: async (_, __, operation) => operation() },
  })("src/features/rfid-tap/usb-action.ts")
  await assert.rejects(recordUsbTapAction(tap), /unauthorized/)
  assert.equal(writes, 0)
})

test("USB action shares normalized attendance writer and arrival SMS, without device key", async () => {
  const calls = [], sms = []
  const { recordUsbTapAction } = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => assert.equal(role, "admin") },
    "@/services/audit/log": { auditRoute: async (_, __, operation) => operation() },
    "@/services/sms/philsms": { deliverArrivalSms: async id => sms.push(id) },
    "@/services/supabase/admin": {
      isSupabaseAdminConfigured: () => true,
      createAdminSupabaseClient: () => ({ rpc: async (...args) => {
        calls.push(args); return { data: { ok: true, action: "time_in", attendanceId: 42 }, error: null }
      } }),
    },
  })("src/features/rfid-tap/usb-action.ts")
  for (const invalid of [{}, { requestId, uid: "123" }, { requestId, uid: tap.uid, studentId: 1 }]) {
    assert.equal((await recordUsbTapAction(invalid)).status, 400)
  }
  assert.equal(calls.length, 0)
  assert.equal((await recordUsbTapAction({ requestId, uid: tap.uid })).status, 200)
  assert.deepEqual(calls, [["record_rfid_tap", { p_request_id: requestId, p_uid: "00200107" }]])
  assert.deepEqual(sms, [42])
})
