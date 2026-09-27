"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { confirmSubjectAction } from "@/features/subject-attendance/actions"
import { formatDateValue, formatClockTime } from "@/lib/format"
import { enrolledSubjectStudents, weekdayLabel, type SubjectAttendanceRow, type SubjectEnrollment, type SubjectRfidEvidence, type SubjectSchedule, type SubjectStudent } from "@/features/subject-attendance/model"

export function TeacherSubjectConsole({ schedules, students, records, enrollments, evidence, date, today }: {
  schedules: SubjectSchedule[]; students: SubjectStudent[]; records: SubjectAttendanceRow[]; enrollments: SubjectEnrollment[]; evidence: SubjectRfidEvidence[] | null; date: string; today: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState("")
  const [search, setSearch] = useState("")
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  const available = schedules.filter(row => row.status === "active" && row.day_of_week === day)
  const classDays = [...new Set(schedules.filter(row => row.status === "active").map(row => row.day_of_week))]
    .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  function openDate(value: string) {
    setSelected("")
    setSearch("")
    startTransition(() => router.push(`/teacher/attendance/confirm?date=${value}`))
  }
  function classDate(weekday: number) {
    const target = new Date(`${date}T00:00:00Z`)
    target.setUTCDate(target.getUTCDate() - ((day + 6) % 7) + ((weekday + 6) % 7))
    return target.toISOString().slice(0, 10)
  }
  const schedule = available.find(row => String(row.id) === selected) ?? available[0]
  const roster = schedule ? enrolledSubjectStudents(students, enrollments, schedule.id) : []
  const evidenceByStudent = new Map((evidence ?? []).map(row => [row.student_id, row]))
  const sessionRecords = records.filter(row => row.schedule_id === schedule?.id && row.attendance_date === date)
  const byStudent = new Map(sessionRecords.map(row => [row.student_id, row]))
  const unconfirmed = roster.filter(row => !byStudent.has(row.id)).length
  const filtered = roster.filter(row => `${row.full_name} ${row.student_id}`.toLowerCase().includes(search.toLowerCase()))

  function confirm(studentId: number, status: "Present" | "Late" | "Absent") {
    if (!schedule) return
    startTransition(async () => {
      try {
        const result = await confirmSubjectAction({ scheduleId: schedule.id, studentId, date, status,
          expectedConfirmedAt: byStudent.get(studentId)?.confirmed_at ?? null })
        if (!result.ok) { gooeyToast.error(result.message); router.refresh(); return }
        gooeyToast.success(result.message)
        router.refresh()
      } catch { gooeyToast.error("Could not confirm attendance. Refresh and try again.") }
    })
  }

  return <Card>
    <CardHeader><CardTitle>Confirm Attendance by Subject</CardTitle>
      <CardDescription>A campus tap leaves every subject unconfirmed. Check this class, then confirm Present, Late or Absent. Your confirmation creates no RFID time-in or time-out; students without a card can still be confirmed.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="subject-date">Session date (PHT)</Label>
          <DatePicker id="subject-date" value={date} clearable={false} disabled={pending} onChange={value => {
            if (value) openDate(value)
          }} /></div>
        <div className="space-y-2"><Label htmlFor="subject-schedule">Scheduled subject</Label>
          <select id="subject-schedule" className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={schedule ? String(schedule.id) : ""} disabled={pending} onChange={e => { setSelected(e.target.value) }}>
            {!available.length && <option value="">No scheduled subject for this date</option>}
            {available.map(row => <option key={row.id} value={row.id}>{row.course?.course_code} · {row.section} · {row.campus} · {row.time_start}–{row.time_end}</option>)}
          </select></div>
      </div>
      <nav aria-label="Browse scheduled class days" className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[-7, 7].map(offset => <Button key={offset} variant="outline" disabled={pending} onClick={() => {
            const target = new Date(`${date}T00:00:00Z`)
            target.setUTCDate(target.getUTCDate() + offset)
            openDate(target.toISOString().slice(0, 10))
          }}>{offset < 0 ? "Previous week" : "Next week"}</Button>)}
          <Button variant="outline" disabled={pending} onClick={() => openDate(today)}>Today</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {classDays.map(weekday => <Button key={weekday} variant={weekday === day ? "default" : "outline"} disabled={pending}
            aria-current={weekday === day ? "date" : undefined} onClick={() => openDate(classDate(weekday))}>
            {weekdayLabel(weekday)} · {formatDateValue(classDate(weekday))}
          </Button>)}
        </div>
      </nav>
      {date > today && <p role="status" className="text-sm text-muted-foreground">Upcoming attendance sheet. Confirmations become available on the session date.</p>}
      <p className="text-sm text-muted-foreground">Your assigned subject is selected automatically. On days without classes, opening this panel shows your latest scheduled date. Check the sheet date before confirming.</p>
      {!available.length && <p className="text-sm text-muted-foreground">No active subject schedule for this date. Ask the administrator to configure it in Schedules.</p>}
      {schedule && <>
        <div className="space-y-1">
          <h2 className="font-semibold">Attendance sheet ? {formatDateValue(date)}</h2>
          <p className="text-sm text-muted-foreground">{schedule.course?.course_code} ? {schedule.section} ? {schedule.campus}</p>
          <p className="text-sm text-muted-foreground">Each scheduled date has its own sheet. Students start unconfirmed; previous dates keep their saved results.</p>
        </div>
        <p className="text-sm">{roster.length} students · {unconfirmed} unconfirmed. Unconfirmed is not Absent.</p>
        <Input aria-label="Search subject students" placeholder="Search student name or ID" value={search} onChange={e => { setSearch(e.target.value) }} />
        <Table><TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Student</TableHead><TableHead>RFID taps (campus)</TableHead><TableHead>Current confirmation</TableHead><TableHead>Confirm after checking</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.map((student, index) => <TableRow key={student.id}>
            <TableCell className="tabular-nums">{index + 1}</TableCell>
            <TableCell>{student.full_name}<br />{student.student_id}</TableCell>
            <TableCell>{evidence === null ? "RFID evidence unavailable" : evidenceByStudent.get(student.id)?.time_in
              ? <><span>Tapped in</span><br /><span className="text-xs tabular-nums">In: {formatClockTime(evidenceByStudent.get(student.id)?.time_in ?? null)} · Out: {formatClockTime(evidenceByStudent.get(student.id)?.time_out ?? null)}</span></>
              : "No tap recorded"}</TableCell>
            <TableCell>{byStudent.get(student.id)?.attendance_status ?? "Not confirmed yet"}</TableCell>
            <TableCell><div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Present"} onClick={() => confirm(student.id, "Present")}>Present</Button>
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Late"} onClick={() => confirm(student.id, "Late")}>Late</Button>
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Absent"} onClick={() => confirm(student.id, "Absent")}>Absent</Button>
            </div></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {!filtered.length && <p className="text-sm text-muted-foreground">{roster.length ? "No matching students in this subject." : "No active students enrolled. Ask the administrator to assign students in Schedules > Student Subject Enrollment."}</p>}
        <p role="status" className="text-sm text-muted-foreground">{pending ? "Saving confirmation…" : "A correction replaces only this student's result for this subject session."}</p>
      </>}
    </CardContent>
  </Card>
}
