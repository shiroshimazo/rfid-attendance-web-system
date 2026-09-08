"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubjectAssignment } from "@/services/attendance/subject-attendance"
import type { SubjectSchedule } from "@/features/subject-attendance/model"
import { createSubjectScheduleAction, retireSubjectScheduleAction } from "@/features/subject-attendance/actions"

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export function SubjectSchedulesEditor({ assignments, schedules }: { assignments: SubjectAssignment[]; schedules: SubjectSchedule[] }) {
  const [pending, startTransition] = useTransition()
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
  return <Card>
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
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {schedules.map(row => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm">
          <p>{row.course?.course_code} · {row.teacher?.full_name} · {row.section} · {row.campus}<br />{days[row.day_of_week]} {row.time_start}–{row.time_end} PHT · {row.status}</p>
          {row.status === "active" && <Button variant="outline" size="sm" disabled={pending} onClick={() => run(() => retireSubjectScheduleAction(row.id))}>Retire schedule</Button>}
        </div>)}
      </div>
    </CardContent>
  </Card>
}
