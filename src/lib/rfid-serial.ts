import { normalizeRfidUid } from "@/lib/rfid-uid"

export interface RfidSerialPort {
  open(options: { baudRate: number }): Promise<void>
  close(): Promise<void>
  readable: ReadableStream<Uint8Array> | null
}

export interface RfidSerial {
  requestPort(): Promise<RfidSerialPort>
}

// Accept only explicit UID records, never boot messages or arbitrary hex text.
export function parseRfidSerialLine(line: string): string | null {
  const match = /^(?:Card detected! UID:|UID:)\s*(.*?)\s*$/.exec(line.trim())
  return match ? normalizeRfidUid(match[1]) : null
}

export async function scanRfidUid(
  serial: RfidSerial,
  signal: AbortSignal,
  onReady: () => void,
): Promise<string> {
  const port = await serial.requestPort()
  signal.throwIfAborted()
  await port.open({ baudRate: 115200 })
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let timedOut = false
  const cancel = () => { void reader?.cancel().catch(() => {}) }
  try {
    signal.throwIfAborted()
    if (!port.readable) throw new Error("The reader has no readable connection.")
    reader = port.readable.getReader()
    signal.addEventListener("abort", cancel, { once: true })
    timer = setTimeout(() => { timedOut = true; cancel() }, 30000)
    onReady()
    const decoder = new TextDecoder()
    let line = ""
    let overflow = false
    while (true) {
      const { value, done } = await reader.read()
      signal.throwIfAborted()
      if (timedOut) throw new Error("No card detected. Try scanning again or enter the UID manually.")
      if (done) throw new Error("Reader disconnected. Reconnect it and try again.")
      for (const character of decoder.decode(value, { stream: true })) {
        if (character === "\n") {
          const uid = overflow ? null : parseRfidSerialLine(line)
          line = ""
          overflow = false
          if (uid) return uid
        } else if (line.length < 256) {
          line += character
        } else {
          overflow = true
        }
      }
    }
  } finally {
    clearTimeout(timer)
    signal.removeEventListener("abort", cancel)
    if (reader) {
      await reader.cancel().catch(() => {})
      reader.releaseLock()
    }
    await port.close().catch(() => {})
  }
}
