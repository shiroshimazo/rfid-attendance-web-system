"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { calendarDate, calendarDateKey, calendarLabels } from "@/features/calendar/admin-view"
import { calendarDateSchema, calendarEntrySchema, calendarTags, calendarAudiences, calendarAttendanceImpacts, suggestCalendarImpact, type CalendarEntryValues } from "@/features/calendar/schema"
import { calendarFormValues, calendarScopeLocked, calendarTagChange } from "@/features/calendar/form"
import { saveCalendarEntryAction } from "@/features/calendar/actions"
import { PILOT_CAMPUSES } from "@/features/academic/pilot"
import type { CalendarEntryRow } from "@/services/calendar/query"

type Props = { date: string; today: string; campuses: string[]; entry?: CalendarEntryRow }

export function EntryFormDialog(props: Props) {
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  return <Dialog open={open} onOpenChange={value => { if (!saving) setOpen(value) }}>
    <DialogTrigger asChild><Button variant={props.entry ? "outline" : "default"} size={props.entry ? "sm" : "default"} aria-label={props.entry ? `Edit ${props.entry.title}` : "New announcement"}>{props.entry ? "Edit" : "New announcement"}</Button></DialogTrigger>
    <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl" showCloseButton={!saving} onEscapeKeyDown={event => { if (saving) event.preventDefault() }} onInteractOutside={event => event.preventDefault()}>
      <DialogHeader><DialogTitle>{props.entry ? "Edit announcement" : "New announcement"}</DialogTitle><DialogDescription>{props.entry ? "Update the announcement. Its publication status stays unchanged." : "Save a draft, then publish it after reviewing the recipient count."}</DialogDescription></DialogHeader>
      {open && <EntryForm {...props} saving={saving} onSaving={setSaving} onClose={() => setOpen(false)} />}
    </DialogContent>
  </Dialog>
}

function EntryForm({ entry, date, today, campuses, saving, onSaving, onClose }: Props & { saving: boolean; onSaving: (value: boolean) => void; onClose: () => void }) {
  const [values, setValues] = React.useState(() => calendarFormValues(date, entry))
  const [notifyRecipients, setNotifyRecipients] = React.useState(false)
  const [allCampuses, setAllCampuses] = React.useState(!entry?.campuses.length)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [message, setMessage] = React.useState("")
  const form = React.useRef<HTMLFormElement>(null)
  const summary = React.useRef<HTMLParagraphElement>(null)
  const id = React.useId()
  const router = useRouter()
  const locked = calendarScopeLocked(entry, today)
  const options = [...new Set([...PILOT_CAMPUSES, ...campuses, ...(entry?.campuses ?? [])])].sort()
  const patch = (value: Partial<CalendarEntryValues>) => setValues(current => ({ ...current, ...value }))
  const error = (name: string) => errors[name] ? <p id={`${id}-${name}-error`} className="text-sm text-destructive">{errors[name]}</p> : null
  const a11y = (name: string) => ({ id: `${id}-${name}`, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined })

  function showErrors(next: Record<string, string>, text: string) {
    setErrors(next); setMessage(text)
    requestAnimationFrame(() => {
      const control = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]:not(:disabled)')
      if (control && control.tabIndex >= 0) control.focus()
      else summary.current?.focus()
    })
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const parsed = calendarEntrySchema.safeParse(values)
    if (!parsed.success) {
      showErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])), "Check the highlighted fields.")
      return
    }
    if (!allCampuses && !values.campuses.length) {
      showErrors({ campuses: "Choose at least one campus or select All campuses." }, "Choose the campus scope.")
      return
    }
    onSaving(true); setMessage(""); setErrors({})
    try {
      const result = await saveCalendarEntryAction({ ...parsed.data, ...(entry ? { id: entry.id } : {}), notifyRecipients: entry?.status === "published" && notifyRecipients })
      if (!result.ok) { showErrors(result.fieldErrors ?? {}, result.message); return }
      gooeyToast.success(result.message)
      onClose(); router.refresh()
    } catch { showErrors({}, "The save could not be confirmed. Check the announcement list before trying again.") }
    finally { onSaving(false) }
  }

  return <form ref={form} onSubmit={submit} noValidate className="space-y-5" aria-busy={saving}>
    {message && <p ref={summary} tabIndex={-1} role="alert" className="rounded-md border border-destructive/30 p-3 text-sm text-destructive">{message}</p>}
    {locked && <p className="rounded-md bg-muted p-3 text-sm">Past attendance scope is locked. To change the remaining schedule, cancel this announcement and create a new one. Title, reason, description, location, and pin remain editable.</p>}
    <fieldset disabled={saving} className="min-w-0 space-y-5">
      <div className="space-y-1.5"><Label htmlFor={`${id}-title`}>Title</Label><Input {...a11y("title")} autoFocus value={values.title} maxLength={160} required onChange={event => patch({ title: event.target.value })} />{error("title")}</div>
      <fieldset disabled={locked} className="space-y-2"><legend className="mb-2 text-sm font-medium">Tags</legend><div className="flex flex-wrap gap-x-4 gap-y-3">
        {calendarTags.map((tag) => <div key={tag} className="flex items-center gap-2"><Checkbox id={`${id}-tag-${tag}`} aria-invalid={Boolean(errors.tags)} aria-describedby={errors.tags ? `${id}-tags-error` : undefined} checked={values.tags.includes(tag)} onCheckedChange={checked => setValues(current => calendarTagChange(current, checked ? [...current.tags, tag] : current.tags.filter(value => value !== tag)))} /><Label htmlFor={`${id}-tag-${tag}`}>{calendarLabels[tag]}</Label></div>)}
      </div>{error("tags")}</fieldset>
      <fieldset disabled={locked} className="space-y-2"><legend className="mb-2 text-sm font-medium">Attendance impact</legend><RadioGroup value={values.attendanceImpact} onValueChange={value => patch({ attendanceImpact: value as CalendarEntryValues["attendanceImpact"] })} aria-label="Attendance impact" className="gap-3 sm:grid-cols-3">
        {calendarAttendanceImpacts.map(impact => <div key={impact} className="flex items-center gap-2"><RadioGroupItem id={`${id}-${impact}`} value={impact} disabled={locked || impact !== suggestCalendarImpact(values.tags)} /><Label htmlFor={`${id}-${impact}`}>{calendarLabels[impact]}</Label></div>)}
      </RadioGroup><p className="text-xs text-muted-foreground">Impact follows the selected tags. Online class takes precedence over No classes.</p>{error("attendanceImpact")}</fieldset>
      <div className="space-y-1.5"><Label htmlFor={`${id}-reason`}>Reason{values.attendanceImpact !== "normal" ? " (required)" : " (optional)"}</Label><Textarea {...a11y("reason")} value={values.reason ?? ""} maxLength={500} placeholder="For example: Storm, Earthquake, Emergency, Semestral break" onChange={event => patch({ reason: event.target.value })} />{error("reason")}</div>
      <div className="space-y-1.5"><Label htmlFor={`${id}-audience`}>Audience</Label><Select value={values.audience} disabled={locked || values.attendanceImpact !== "normal"} onValueChange={value => patch({ audience: value as CalendarEntryValues["audience"] })}><SelectTrigger {...a11y("audience")} className="w-full"><SelectValue /></SelectTrigger><SelectContent>{calendarAudiences.map(audience => <SelectItem value={audience} key={audience}>{calendarLabels[audience]}</SelectItem>)}</SelectContent></Select>{values.attendanceImpact !== "normal" && <p className="text-xs text-muted-foreground">No-class and online days apply to both teachers and students.</p>}{error("audience")}</div>
      <fieldset disabled={locked} className="space-y-3"><legend className="mb-2 text-sm font-medium">Campuses</legend>
        <div className="flex items-center gap-2"><Checkbox id={`${id}-all-campuses`} checked={allCampuses} onCheckedChange={checked => { setAllCampuses(checked === true); patch({ campuses: [] }) }} /><Label htmlFor={`${id}-all-campuses`}>All campuses</Label></div>
        {!allCampuses && <div className="flex flex-wrap gap-4">{options.map(campus => <div className="flex items-center gap-2" key={campus}><Checkbox id={`${id}-campus-${campus}`} aria-invalid={Boolean(errors.campuses)} aria-describedby={errors.campuses ? `${id}-campuses-error` : undefined} checked={values.campuses.includes(campus)} onCheckedChange={checked => patch({ campuses: checked ? [...values.campuses, campus] : values.campuses.filter(value => value !== campus) })} /><Label htmlFor={`${id}-campus-${campus}`}>{campus}</Label></div>)}</div>}{error("campuses")}
      </fieldset>
      <fieldset disabled={locked} className="space-y-3"><legend className="mb-2 text-sm font-medium">Dates</legend>
        {!locked && <DateRangePicker allowFuture numberOfMonths={1} value={calendarDateSchema.safeParse(values.startsOn).success && calendarDateSchema.safeParse(values.endsOn).success ? { from: calendarDate(values.startsOn), to: calendarDate(values.endsOn) } : undefined} onApply={range => { if (range?.from && range.to) patch({ startsOn: calendarDateKey(range.from), endsOn: calendarDateKey(range.to) }) }} />}
        <div className="grid gap-3 sm:grid-cols-2">{(["startsOn", "endsOn"] as const).map(name => <div className="space-y-1.5" key={name}><Label htmlFor={`${id}-${name}`}>{name === "startsOn" ? "Start date" : "End date"}</Label><Input {...a11y(name)} type="date" value={values[name]} onChange={event => patch({ [name]: event.target.value })} />{error(name)}</div>)}</div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">{(["startTime", "endTime"] as const).map(name => <div className="space-y-1.5" key={name}><Label htmlFor={`${id}-${name}`}>{name === "startTime" ? "Start time (PHT)" : "End time (PHT)"}</Label><Input {...a11y(name)} type="time" disabled={values.attendanceImpact !== "normal"} value={values[name] ?? ""} onChange={event => patch({ [name]: event.target.value || null })} />{error(name)}</div>)}</div>
      <p className="text-xs text-muted-foreground">Leave both times empty for an all-day entry. Timed events must start and end on the same date.</p>
      <div className="space-y-1.5"><Label htmlFor={`${id}-location`}>Location (optional)</Label><Input {...a11y("location")} value={values.location ?? ""} maxLength={200} onChange={event => patch({ location: event.target.value })} />{error("location")}</div>
      <div className="space-y-1.5"><Label htmlFor={`${id}-description`}>Description (optional)</Label><Textarea {...a11y("description")} value={values.description ?? ""} maxLength={5000} rows={4} onChange={event => patch({ description: event.target.value })} />{error("description")}</div>
      <div className="flex items-center gap-2"><Checkbox id={`${id}-pin`} checked={values.isPinned} onCheckedChange={checked => patch({ isPinned: checked === true })} /><Label htmlFor={`${id}-pin`}>Pin to top</Label></div>
      {entry?.status === "published" && <div className="space-y-1.5"><div className="flex items-center gap-2"><Checkbox id={`${id}-notify`} checked={notifyRecipients} onCheckedChange={checked => setNotifyRecipients(checked === true)} /><Label htmlFor={`${id}-notify`}>Notify recipients</Label></div><p className="text-xs text-muted-foreground">Send an update only when important fields change. Pin-only changes do not send email.</p></div>}
    </fieldset>
    <DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={onClose}>Close</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : entry ? "Save changes" : "Save draft"}</Button></DialogFooter>
  </form>
}
