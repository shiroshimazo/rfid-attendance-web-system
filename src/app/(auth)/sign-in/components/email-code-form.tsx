"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cancelEmailLogin, resendEmailLogin, verifyEmailLogin } from "@/features/auth/email-login-actions"

export function EmailCodeForm({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Check your email</CardTitle>
        <CardDescription>Enter the six-digit code sent to {email}. Verification expires after 10 minutes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault()
          if (busy) return
          setBusy(true)
          setMessage("")
          try {
            const result = await verifyEmailLogin(code)
            if ("error" in result) setMessage(result.error)
            else { router.replace(result.path); router.refresh() }
          } catch { setMessage("Unable to connect. Please try again.") }
          finally { setBusy(false) }
        }}>
          <Label htmlFor="login-code">Verification code</Label>
          <Input id="login-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="text-center text-2xl tracking-[0.4em] tabular-nums" />
          <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>{busy ? "Please wait..." : "Verify and sign in"}</Button>
        </form>
        {message && <p role="status" className="text-sm">{message}</p>}
        <p className="text-sm text-muted-foreground">Check your spam folder. You can resend after 60 seconds.</p>
        <div className="flex justify-between gap-2">
          <Button variant="outline" disabled={busy} onClick={async () => {
            setBusy(true)
            try { const result = await resendEmailLogin(); setMessage("error" in result ? result.error : "A new code was sent. Use the latest email.") }
            catch { setMessage("Unable to connect. Please try again.") }
            finally { setBusy(false) }
          }}>Resend code</Button>
          <Button variant="ghost" disabled={busy} onClick={async () => {
            setBusy(true)
            try { await cancelEmailLogin(); onBack() }
            catch { setMessage("Unable to connect. Please try again.") }
            finally { setBusy(false) }
          }}>Back to sign in</Button>
        </div>
      </CardContent>
    </Card>
  )
}
