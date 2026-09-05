"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PasswordRecovery,
  recoveryErrorMessage,
  recoveryRequestMessage,
  type RecoveryState,
} from "@/features/auth/password-recovery"
import { createRecoverySupabaseClient } from "@/services/supabase/recovery"

export function ForgotPasswordForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const recovery = React.useRef<PasswordRecovery | null>(null)
  const [state, setState] = React.useState<RecoveryState>({ step: "email", email: "", resendAt: 0 })
  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [error, setError] = React.useState("")
  const [remaining, setRemaining] = React.useState(0)
  const firstInput = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => () => {
    recovery.current?.dispose()
    recovery.current = null
  }, [])

  React.useEffect(() => {
    firstInput.current?.focus()
  }, [state.step])

  React.useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.ceil((state.resendAt - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [state.resendAt])

  function goToLogin() {
    router.replace("/sign-in")
    router.refresh()
  }

  async function perform(action: (flow: PasswordRecovery) => Promise<void>) {
    if (busy) return
    setBusy(true)
    setError("")
    setMessage("")
    try {
      recovery.current ??= new PasswordRecovery(createRecoverySupabaseClient().auth)
      await action(recovery.current)
    } catch (cause) {
      setError(recoveryErrorMessage(cause))
    } finally {
      if (recovery.current) {
        const next = recovery.current.snapshot
        setState(next)
        if (next.step === "complete") {
          setPassword("")
          setConfirmPassword("")
        }
      }
      setBusy(false)
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await perform(async (flow) => {
      if (state.step === "email") {
        await flow.request(email)
        setMessage(recoveryRequestMessage)
      } else if (state.step === "code") {
        await flow.verify(code)
        setCode("")
      } else if (state.step === "password") {
        await flow.save(password, confirmPassword)
        goToLogin()
      } else {
        await flow.finish()
        goToLogin()
      }
    })
  }

  const stepNumber = state.step === "email" ? 1 : state.step === "code" ? 2 : 3
  const description = state.step === "email"
    ? "Enter your account email to receive a six-digit recovery code."
    : state.step === "code"
      ? `Enter the six-digit code sent to ${state.email}.`
      : state.step === "password"
        ? "Choose a new password for your account."
        : "Your password has been updated. Return to sign in with your new password."

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{state.step === "complete" ? "Password updated" : "Forgot your password?"}</CardTitle>
          <p className="text-sm text-muted-foreground">Step {stepNumber} of 3</p>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4" aria-busy={busy}>
            <fieldset disabled={busy} className="grid min-w-0 gap-4">
              <legend className="sr-only">{description}</legend>
              {state.step === "email" && (
                <div className="grid gap-3">
                  <Label htmlFor="recovery-email">Email</Label>
                  <Input ref={firstInput} id="recovery-email" type="email" autoComplete="email"
                    placeholder="name@school.edu" required value={email}
                    onChange={(event) => setEmail(event.target.value)} />
                </div>
              )}
              {state.step === "code" && (
                <div className="grid gap-3">
                  <Label htmlFor="recovery-code">Six-digit code</Label>
                  <Input ref={firstInput} id="recovery-code" type="text" inputMode="numeric"
                    autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} minLength={6}
                    required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    className="text-center text-lg tracking-[0.3em]" />
                </div>
              )}
              {state.step === "password" && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="recovery-password">New password</Label>
                    <Input ref={firstInput} id="recovery-password" type="password" autoComplete="new-password"
                      required minLength={8} maxLength={72} value={password} aria-describedby="password-help"
                      onChange={(event) => setPassword(event.target.value)} />
                    <p id="password-help" className="text-sm text-muted-foreground">Use 8–72 characters.</p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="recovery-confirm-password">Confirm new password</Label>
                    <Input id="recovery-confirm-password" type="password" autoComplete="new-password"
                      required minLength={8} maxLength={72} value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)} />
                  </div>
                </>
              )}
              {error && <p role="alert" className="text-sm text-destructive text-pretty">{error}</p>}
              {message && <p role="status" className="text-sm text-muted-foreground text-pretty">{message}</p>}
              <Button type="submit" className="w-full cursor-pointer" disabled={state.step === "email" && remaining > 0}>
                {busy ? "Please wait..." : state.step === "email"
                  ? remaining > 0 ? `Send code in ${remaining}s` : "Send recovery code"
                  : state.step === "code" ? "Verify code"
                    : state.step === "password" ? "Save new password" : "Back to sign in"}
              </Button>
              {state.step === "code" && (
                <Button type="button" variant="outline" disabled={remaining > 0}
                  onClick={() => void perform(async (flow) => {
                    await flow.request(state.email)
                    setCode("")
                    setMessage(recoveryRequestMessage)
                  })}>
                  {remaining > 0 ? `Resend code in ${remaining}s` : "Resend code"}
                </Button>
              )}
              {(state.step === "code" || state.step === "password") && (
                <Button type="button" variant="ghost" onClick={() => void perform(async (flow) => {
                  await flow.restart()
                  setCode("")
                  setPassword("")
                  setConfirmPassword("")
                })}>
                  {state.step === "code" ? "Use a different email" : "Start over"}
                </Button>
              )}
            </fieldset>
            {state.step !== "complete" && (
              <Button type="button" variant="link" disabled={busy} onClick={() => {
                if (!recovery.current) goToLogin()
                else void perform(async (flow) => { await flow.restart(); goToLogin() })
              }}>Back to sign in</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
