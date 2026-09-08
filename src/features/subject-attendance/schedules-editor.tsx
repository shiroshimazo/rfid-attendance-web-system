"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubjectAssignment } from "@/services/attendance/subject-attendance"
import type { SubjectSchedule } from "@/features/subject-attendance/model"
import { createSubjectScheduleAction, editSubjectScheduleAction, retireSubjectScheduleAction } from "@/features/subject-attendance/actions"

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export function SubjectSchedulesEditor({ assignments, schedules }: { assignments: SubjectAssignment[]; schedules: SubjectSchedule[] }) {
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState<SubjectSchedule | null>(null)
  const router = useRouter()
  const choices = assignments.filter(row => row.teacher?.status === "active" && row.year_level && row.section && row.campus)
  const selectClass = "h-9 w-full rounded-md border bg-background px-3 text-sm"
  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    startTransition(async () => {
      try {
        const result = await action()
        if (result.ok) { toast.success(result.message); router.refresh() }
        else toast.error(result.message)
      } catch { toast.error("Could not save the subject schedule. Refresh and try again.") }
    })
  }
  return <Card className="min-w-0">
    <CardHeader><CardTitle>Subject Session Schedules</CardTitle><CardDescription>Configure each subject&apos;s weekday and time from an existing teaching assignment. These scheduled times are separate from RFID arrival/departure times. Retiring a schedule preserves its confirmations.</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      <form className="grid items-end gap-3 md:grid-cols-2" onSubmit={event => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        run(() => createSubjectScheduleAction({ assignmentId: Number(values.get("assignment")), day: Number(values.get("day")), start: values.get("start"), end: values.get("end") }))
      }}>
        <div className="space-y-2 md:col-span-2"><Label htmlFor="subject-assignment">Teaching assignment</Label><select className={selectClass} id="subject-assignment" name="assignment" required disabled={pending} defaultValue="">
          <option value="" disabled>Select teacher, subject and class</option>
          {choices.map(row => <option key={row.id} value={row.id}>{row.teacher?.full_name} · {row.course?.course_code} · {row.section} · {row.campus}</option>)}
        </select></div>
        <div className="space-y-2"><Label htmlFor="subject-weekday">Weekday</Label><select className={selectClass} id="subject-weekday" name="day" disabled={pending} defaultValue="1">{days.map((day, i) => <option key={day} value={i}>{day}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="subject-start">Start (PHT)</Label><Input id="subject-start" name="start" type="time" required disabled={pending} /></div><div className="space-y-2"><Label htmlFor="subject-end">End (PHT)</Label><Input id="subject-end" name="end" type="time" required disabled={pending} /></div></div>
        <Button type="submit" disabled={pending || !choices.length}>{pending ? "Saving…" : "Add subject schedule"}</Button>
      </form>
      {!choices.length && <p className="text-sm text-muted-foreground">Add an active teacher assignment with an explicit section and campus first.</p>}
      <div className="max-h-96 min-w-0 overflow-auto rounded-md border">
        <Table aria-label="Subject Session Schedules">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Subject Code</TableHead>
              <TableHead scope="col">Section</TableHead>
              <TableHead scope="col">Campus</TableHead>
              <TableHead scope="col">Day</TableHead>
              <TableHead scope="col">Time</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map(row => <TableRow key={row.id}>
              <TableCell>{row.teacher?.full_name ?? "—"}</TableCell>
              <TableCell>{row.course?.course_code ?? "—"}</TableCell>
              <TableCell>{row.section}</TableCell>
              <TableCell>{row.campus}</TableCell>
              <TableCell>{days[row.day_of_week]}</TableCell>
              <TableCell className="tabular-nums">{row.time_start.slice(0, 5)}–{row.time_end.slice(0, 5)} PHT</TableCell>
              <TableCell className="capitalize">{row.status}</TableCell>
              <TableCell>{row.status === "active"
                ? <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => setEditing(row)}>Edit</Button>
                  <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => run(() => retireSubjectScheduleAction(row.id))}>Retire schedule</Button>
                </div>
                : <span className="text-muted-foreground">—</span>}</TableCell>
            </TableRow>)}
            {!schedules.length && <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No subject schedules yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={editing !== null} onOpenChange={open => { if (!open && !pending) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit schedule time</DialogTitle>
            <DialogDescription>{editing?.course?.course_code} · {editing?.section} · {editing?.campus} · {editing ? days[editing.day_of_week] : ""}. Existing attendance confirmations keep their original times.</DialogDescription>
          </DialogHeader>
          {editing && <form key={editing.id} className="space-y-4" onSubmit={event => {
            event.preventDefault()
            const values = new FormData(event.currentTarget)
            run(async () => {
              const result = await editSubjectScheduleAction({ scheduleId: editing.id,
                start: values.get("start"), end: values.get("end"),
                expectedStart: editing.time_start, expectedEnd: editing.time_end })
              if (result.ok) setEditing(null)
              return result
            })
          }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="edit-subject-start">Start (PHT)</Label><Input id="edit-subject-start" name="start" type="time" defaultValue={editing.time_start.slice(0, 5)} required disabled={pending} /></div>
              <div className="space-y-2"><Label htmlFor="edit-subject-end">End (PHT)</Label><Input id="edit-subject-end" name="end" type="time" defaultValue={editing.time_end.slice(0, 5)} required disabled={pending} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" disabled={pending} onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
            </div>
          </form>}
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
}
