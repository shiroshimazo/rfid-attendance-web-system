"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { scanRfidUid, type RfidSerial } from "@/lib/rfid-serial"

export function RfidUidScanner({ onScan, onBusyChange }: {
  onScan: (uid: string) => void
  onBusyChange: (busy: boolean) => void
}) {
  const active = React.useRef<AbortController | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState("")

  React.useEffect(() => () => {
    active.current?.abort()
    active.current = null
  }, [])

  async function scan() {
    if (active.current) return
    const serial = (navigator as Navigator & { serial?: RfidSerial }).serial
    if (!serial || !window.isSecureContext) {
      setMessage("USB scanning requires desktop Chrome or Edge on HTTPS or localhost. You can still type the UID.")
      return
    }
    const controller = new AbortController()
    active.current = controller
    setBusy(true)
    onBusyChange(true)
    setMessage("Select your ESP32 USB port.")
    try {
      const uid = await scanRfidUid(serial, controller.signal, () => {
        setMessage("Reader connected. Tap one card within 30 seconds.")
      })
      if (!controller.signal.aborted) {
        onScan(uid)
        setMessage("UID captured. Check the student, then register the card.")
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessage(error instanceof DOMException && error.name === "NotFoundError"
          ? "No reader selected. You can scan again or type the UID."
          : `${error instanceof Error ? error.message : "Could not read the card."} Close Arduino Serial Monitor and check the USB connection.`)
      }
    } finally {
      if (active.current === controller) {
        active.current = null
        setBusy(false)
        onBusyChange(false)
      }
    }
  }

  return <div className="space-y-2">
    <Button type="button" variant="outline" onClick={scan} disabled={busy}>
      {busy ? "Waiting for card…" : "Scan card via USB"}
    </Button>
    {busy && <Button type="button" variant="ghost" onClick={() => {
      active.current?.abort()
      setMessage("Scan cancelled. Dismiss the port picker if it is still open.")
    }}>Stop scan</Button>}
    <p className="text-sm text-muted-foreground">Close Arduino Serial Monitor before scanning. Manual UID entry is also available.</p>
    <p role="status" className="text-sm text-muted-foreground">{message}</p>
  </div>
}
