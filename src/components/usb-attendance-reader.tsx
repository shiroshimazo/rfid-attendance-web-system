"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { recordUsbTapAction } from "@/features/rfid-tap/usb-action"
import { runUsbAttendance, type UsbAttendancePort } from "@/lib/rfid-usb-attendance"

export function UsbAttendanceReader() {
  const session = React.useRef<AbortController | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState("Connect the reader to this PC with USB. No ESP32 Wi-Fi is needed.")
  React.useEffect(() => () => {
    session.current?.abort()
    session.current = null
  }, [])

  async function connect() {
    if (session.current) return
    const serial = (navigator as Navigator & {
      serial?: { requestPort(): Promise<UsbAttendancePort> }
    }).serial
    if (!serial || !window.isSecureContext) {
      setMessage("Use desktop Chrome or Edge on localhost or HTTPS for USB attendance.")
      return
    }
    const controller = new AbortController()
    session.current = controller
    setBusy(true)
    setMessage("Select the ESP32 port. Close Arduino Serial Monitor first.")
    try {
      const port = await serial.requestPort()
      controller.signal.throwIfAborted()
      await runUsbAttendance(port, controller.signal, recordUsbTapAction, setMessage)
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessage(error instanceof DOMException && error.name === "NotFoundError"
          ? "No port selected. Connect when ready."
          : `${error instanceof Error ? error.message : "USB attendance stopped."} Close other apps using this port and reconnect.`)
      }
    } finally {
      if (session.current === controller) {
        session.current = null
        setBusy(false)
      }
    }
  }

  return <section className="space-y-3 rounded-xl border p-4" aria-label="USB attendance reader">
    <h2 className="font-semibold">USB attendance reader</h2>
    <p className="text-sm text-muted-foreground">USB stays connected while you browse admin pages. Keep this tab open and the PC online. Reloading, closing the tab, or signing out disconnects the reader. Taps record real attendance and may send guardian SMS.</p>
    <Button type="button" variant={busy ? "outline" : "default"} onClick={busy ? () => {
      session.current?.abort()
      setMessage("Stopping. Pending taps remain on the ESP32; reconnect to recover their result. Dismiss any open port picker.")
    } : connect}>{busy ? "Disconnect reader" : "Connect USB reader"}</Button>
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{message}</p>
  </section>
}
