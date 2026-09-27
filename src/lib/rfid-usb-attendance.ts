import { rfidTapSchema } from "@/features/rfid-tap/schema"
import type { RfidSerialPort } from "@/lib/rfid-serial"

export interface UsbAttendancePort extends RfidSerialPort {
  writable: WritableStream<Uint8Array> | null
}
type Reply = { status: number; body: unknown }
export function parseUsbFrame(line: string) {
  if (line.length > 4096) return null
  try {
    const value = JSON.parse(line)
    if (value?.type === "ready" && value.protocol === 1 && value.mode === "attendance") {
      return { type: "ready" as const }
    }
    if (value?.type !== "tap") return null
    const parsed = rfidTapSchema.safeParse({ requestId: value.requestId, uid: value.uid })
    return parsed.success
      ? { type: "tap" as const, requestId: parsed.data.requestId, uid: parsed.data.uid! }
      : null
  } catch { return null }
}

async function boundedSubmit(submit: () => Promise<Reply>, signal: AbortSignal): Promise<Reply> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let abort: (() => void) | undefined
  try {
    return await Promise.race([
      submit(),
      new Promise<Reply>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Server timeout")), 30000)
        abort = () => reject(new DOMException("Stopped", "AbortError"))
        signal.addEventListener("abort", abort, { once: true })
        if (signal.aborted) abort()
      }),
    ])
  } finally {
    clearTimeout(timer)
    if (abort) signal.removeEventListener("abort", abort)
  }
}

export async function runUsbAttendance(
  port: UsbAttendancePort,
  signal: AbortSignal,
  submit: (tap: { requestId: string; uid: string }) => Promise<Reply>,
  notify: (message: string) => void,
) {
  signal.throwIfAborted()
  await port.open({ baudRate: 115200 })
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  let writer: WritableStreamDefaultWriter<Uint8Array> | undefined
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let handshakeTimer: ReturnType<typeof setTimeout> | undefined
  let writeFailure: unknown
  let writes: Promise<void> = Promise.resolve()
  const cancel = () => { void reader?.cancel().catch(() => {}) }
  const send = (frame: unknown) => {
    const bytes = new TextEncoder().encode(JSON.stringify(frame) + "\n")
    writes = writes.then(async () => {
      signal.throwIfAborted()
      await writer!.write(bytes)
    })
    // A failed heartbeat must also terminate a blocked read.
    void writes.catch(error => { writeFailure = error; cancel() })
    return writes
  }
  try {
    signal.throwIfAborted()
    if (!port.readable || !port.writable) throw new Error("USB reader needs both input and output streams.")
    reader = port.readable.getReader()
    writer = port.writable.getWriter()
    signal.addEventListener("abort", cancel, { once: true })
    const hello = () => { void send({ type: "hello", protocol: 1, mode: "attendance" }).catch(() => {}) }
    hello()
    heartbeat = setInterval(hello, 3000)
    let ready = false
    handshakeTimer = setTimeout(() => {
      if (!signal.aborted && !ready) notify("No USB attendance handshake. Upload the updated sketch in attendance mode.")
    }, 8000)
    notify("Port opened. Waiting for ESP32 USB attendance firmware…")
    const decoder = new TextDecoder()
    let line = "", overflow = false
    let last: { requestId: string; uid: string; reply: Reply } | undefined
    while (true) {
      const { done, value } = await reader.read()
      signal.throwIfAborted()
      if (writeFailure) throw writeFailure
      if (done) throw new Error("USB disconnected. Reconnect to resume the pending tap.")
      for (const character of decoder.decode(value, { stream: true })) {
        if (character !== "\n") {
          if (line.length < 4096) line += character
          else overflow = true
          continue
        }
        const frame = overflow ? null : parseUsbFrame(line)
        line = ""; overflow = false
        if (!frame) continue
        if (frame.type === "ready") {
          if (!ready) notify("Reader connected. Remove any card, then tap to record attendance.")
          ready = true
          continue
        }
        if (!ready) continue
        let reply: Reply
        if (last?.requestId === frame.requestId && last.uid === frame.uid) {
          reply = last.reply
        } else {
          notify(`Processing card ${frame.uid}. Wait for confirmation.`)
          try {
            reply = await boundedSubmit(() => submit({ requestId: frame.requestId, uid: frame.uid }), signal)
          } catch {
            signal.throwIfAborted()
            reply = { status: 503, body: { ok: false, code: "BRIDGE_UNAVAILABLE", message: "Outcome unknown. Retrying the same tap." } }
          }
          if ([200, 409, 422].includes(reply.status)) last = { ...frame, reply }
        }
        signal.throwIfAborted()
        await send({ type: "result", requestId: frame.requestId, status: reply.status, body: reply.body })
        const body = reply.body as { message?: unknown }
        notify(typeof body?.message === "string" ? body.message : "Response returned to reader. Check its display.")
      }
    }
  } finally {
    clearInterval(heartbeat)
    clearTimeout(handshakeTimer)
    signal.removeEventListener("abort", cancel)
    if (reader) { await reader.cancel().catch(() => {}); reader.releaseLock() }
    if (writer) { await writer.abort().catch(() => {}); writer.releaseLock() }
    await port.close().catch(() => {})
  }
}
