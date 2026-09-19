import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { parseRfidSerialLine, scanRfidUid } = createSourceLoader()("src/lib/rfid-serial.ts")

test("accepts explicit UID lines, preserving zeros, and rejects boot output", () => {
  assert.equal(parseRfidSerialLine("Card detected! UID: EE:20:01:07\r"), "EE200107")
  assert.equal(parseRfidSerialLine("UID: 00-20-01-07"), "00200107")
  assert.equal(parseRfidSerialLine("UID: 00 01 02 03 04 05 06"), "00010203040506")
  for (const line of ["entry 0x400805b4", "RC522 version register: 0x82", "EE200107", "UID: 123", "UID: ZZ:20:01:07"]) {
    assert.equal(parseRfidSerialLine(line), null)
  }
})

function device(chunks = []) {
  let closed = false
  let cancelled = false
  let opened = false
  const readable = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk))
    },
    cancel() { cancelled = true },
  })
  const port = {
    readable,
    async open(options) { assert.equal(options.baudRate, 115200); opened = true },
    async close() { assert.equal(readable.locked, false); closed = true },
  }
  return { serial: { async requestPort() { return port } },
    state: () => ({ opened, closed, cancelled }) }
}

test("reads fragmented lines, ignores noise, closes after first UID", async () => {
  const mock = device(["boot\r\nCard detected! UI", "D: 00:20:", "01:07\r\nUID: EE:20:01:07\n"])
  assert.equal(await scanRfidUid(mock.serial, new AbortController().signal, () => {}), "00200107")
  assert.deepEqual(mock.state(), { opened: true, closed: true, cancelled: true })
})

test("cancellation releases a blocked reader and closes port", async () => {
  const mock = device()
  const controller = new AbortController()
  await assert.rejects(scanRfidUid(mock.serial, controller.signal, () => controller.abort()), { name: "AbortError" })
  assert.deepEqual(mock.state(), { opened: true, closed: true, cancelled: true })
})

test("cancelled port selection never opens device", async () => {
  const mock = device()
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(scanRfidUid(mock.serial, controller.signal, () => {}), { name: "AbortError" })
  assert.equal(mock.state().opened, false)
})

test("oversized lines cannot inject a trailing UID", async () => {
  const mock = device(["x".repeat(1000) + "UID: EE:20:01:07\nUID: 00:20:01:07\n"])
  assert.equal(await scanRfidUid(mock.serial, new AbortController().signal, () => {}), "00200107")
})

test("timeout releases port and preserves manual fallback", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] })
  const mock = device()
  await assert.rejects(scanRfidUid(mock.serial, new AbortController().signal,
    () => t.mock.timers.tick(30000)), /No card detected/)
  assert.equal(mock.state().closed, true)
})

test("disconnection releases stream lock and closes port", async () => {
  let closed = false
  const readable = new ReadableStream({ start(controller) { controller.close() } })
  const serial = { async requestPort() { return {
    readable, async open() {}, async close() { closed = true },
  } } }
  await assert.rejects(scanRfidUid(serial, new AbortController().signal, () => {}), /Reader disconnected/)
  assert.equal(readable.locked, false)
  assert.equal(closed, true)
})
