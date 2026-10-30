"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { gooeyToast } from "@/components/ui/goey-toaster"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchTagInput } from "@/components/search-tag-input"
import { confirmSubjectAction } from "@/features/subject-attendance/actions"
import { formatDateValue, formatClockTime } from "@/lib/format"
import { matchesAnySearchTag } from "@/lib/search-tags"
import { enrolledSubjectStudents, weekdayLabel, type SubjectAttendanceRow, type SubjectEnrollment, type SubjectRfidEvidence, type SubjectSchedule, type SubjectStudent } from "@/features/subject-attendance/model"

export function TeacherSubjectConsole({ schedules, students, records, enrollments, evidence, date, today }: {
  schedules: SubjectSchedule[]; students: SubjectStudent[]; records: SubjectAttendanceRow[]; enrollments: SubjectEnrollment[]; evidence: SubjectRfidEvidence[] | null; date: string; today: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState("")
  const [search, setSearch] = useState<string[]>([])
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  const available = schedules.filter(row => row.status === "active" && row.day_of_week === day)
  const classDays = [...new Set(schedules.filter(row => row.status === "active").map(row => row.day_of_week))]
    .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  function openDate(value: string) {
    setSelected("")
    setSearch([])
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
  const filtered = roster.filter(row => matchesAnySearchTag(`${row.full_name} ${row.student_id}`, search))

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
      <CardDescription>Check each student&apos;s attendance for this class, then mark Present, Late or Absent. Campus taps do not confirm subject attendance. You can mark students without an RFID card; this does not add campus time-in or time-out records.</CardDescription>
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
      {date > today && <p role="status" className="text-sm text-muted-foreground">You can confirm attendance on or after the session date.</p>}
      <p className="text-sm text-muted-foreground">The first scheduled subject is selected for you. If you open this page on a day without classes, it shows your latest class date. Check the date and subject before confirming.</p>
      {!available.length && <p className="text-sm text-muted-foreground">No subject is scheduled for this date. Choose another date or ask an administrator to update your schedule.</p>}
      {schedule && <>
        <div className="space-y-1">
          <h2 className="font-semibold">Attendance sheet: {formatDateValue(date)}</h2>
          <p className="text-sm text-muted-foreground">{schedule.course?.course_code} · {schedule.section} · {schedule.campus}</p>
          <p className="text-sm text-muted-foreground">Each class date has a separate sheet. Changing the date keeps your saved confirmations.</p>
        </div>
        <p className="text-sm">{roster.length} students · {unconfirmed} unconfirmed. Students without a confirmation are not marked absent.</p>
        <SearchTagInput label="Search students in this subject" value={search} onValueChange={setSearch} placeholder="Search student name or ID" />
        <Table><TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Student</TableHead><TableHead>Campus RFID taps</TableHead><TableHead>Subject attendance</TableHead><TableHead>Mark attendance</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.map((student, index) => <TableRow key={student.id}>
            <TableCell className="tabular-nums">{index + 1}</TableCell>
            <TableCell>{student.full_name}<br />{student.student_id}</TableCell>
            <TableCell>{evidence === null ? "Campus RFID records unavailable" : evidenceByStudent.get(student.id)?.time_in
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
        <p role="status" className="text-sm text-muted-foreground">{pending ? "Saving confirmation…" : "Changing a result updates only that student's attendance for this subject and date."}</p>
      </>}
    </CardContent>
  </Card>
}
