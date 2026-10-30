"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Mail, Mails } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { retryCalendarEmailAction, syncAttendanceMarksAction, previewCalendarRecipientsAction } from "@/features/calendar/actions"

export function DeliveryControl({ target, today, open: controlledOpen, onOpenChange }: { target?: { id: number } | { batchId: string }; today: string; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const [pending, setPending] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [ok, setOk] = React.useState(false)
  const router = useRouter()
  const id = React.useId()
  const label = target ? "id" in target ? "Retry email" : "Retry batch" : "Sync attendance marks"
  function changeOpen(value: boolean) {
    if (pending) return
    if (controlledOpen === undefined) setInternalOpen(value)
    onOpenChange?.(value)
    setMessage(""); setOk(false)
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    setPending(true); setMessage(""); setOk(false)
    try {
      const result = target ? await retryCalendarEmailAction(target) : await syncAttendanceMarksAction(String(data.get("from")), String(data.get("to")))
      setMessage(result.message); setOk(result.ok)
      if (result.ok) router.refresh()
    } catch { setMessage("The result could not be confirmed. Refresh and check the records before trying again.") }
    finally { setPending(false) }
  }
  return <Dialog open={open} onOpenChange={changeOpen}>
    {controlledOpen === undefined && <DialogTrigger asChild><Button size="sm" variant="outline">{label}</Button></DialogTrigger>}
    <DialogContent showCloseButton={!pending} onEscapeKeyDown={event => { if (pending) event.preventDefault() }} onInteractOutside={event => event.preventDefault()}>
      <DialogHeader><DialogTitle>{label}</DialogTitle><DialogDescription>{target ? "This sends stored emails again to eligible failed recipients. Sent, pending, and uncertain attempts are excluded. A batch retry includes all eligible failures in that batch, even outside these filters." : "Reconcile calendar exceptions for active students across all campuses. Dates before today in Manila are preserved. Existing RFID and SMS records remain unchanged."}</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
        {!target && <fieldset disabled={pending || ok} className="grid gap-3 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor={`${id}-from`}>From date</Label><Input id={`${id}-from`} name="from" type="date" defaultValue={today} required /></div><div className="space-y-2"><Label htmlFor={`${id}-to`}>To date</Label><Input id={`${id}-to`} name="to" type="date" defaultValue={today} required /></div><p className="text-sm text-muted-foreground sm:col-span-2">Choose up to 366 days. Past dates are not recalculated.</p></fieldset>}
        {target && <p className="break-all text-sm">{"id" in target ? `Delivery #${target.id}` : `Batch ${target.batchId}`}</p>}
        {message && <p role={ok ? "status" : "alert"} className={ok ? "text-sm" : "text-sm text-destructive"}>{message}</p>}
        <DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={() => changeOpen(false)}>Close</Button><Button type="submit" disabled={pending || ok}>{pending ? "Working…" : label}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
}

export function DeliveryRetryMenu({ id, batchId, today }: { id: number; batchId: string; today: string }) {
  const [target, setTarget] = React.useState<{ id: number } | { batchId: string } | null>(null)
  return <>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Retry<ChevronDown aria-hidden /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Retry delivery</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setTarget({ id })}><Mail aria-hidden />This email only</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTarget({ batchId })}><Mails aria-hidden />All failed in batch</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {target && <DeliveryControl today={today} target={target} open onOpenChange={value => { if (!value) setTarget(null) }} />}
  </>
}

export function RecipientPreview({ entryId }: { entryId: number }) {
  const [message, setMessage] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  async function preview() {
    setPending(true); setMessage(""); setFailed(false)
    try {
      const result = await previewCalendarRecipientsAction(entryId)
      setFailed(!result.ok)
      setMessage(result.recipients ? `${result.recipients.total} recipients: ${result.recipients.teacher_count} teachers, ${result.recipients.student_count} students. Admins excluded. Counts may change before publication.` : result.message)
    } catch { setFailed(true); setMessage("Recipients could not be loaded. Try again.") }
    finally { setPending(false) }
  }
  return <div className="space-y-2"><Button size="sm" variant="outline" disabled={pending} onClick={preview}>{pending ? "Loading recipients…" : "Preview recipients"}</Button>{message && <p role={failed ? "alert" : "status"} className="max-w-sm text-sm">{message}</p>}</div>
}
