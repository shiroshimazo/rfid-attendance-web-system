"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/data-table"
import { confirmSubjectAction } from "@/features/subject-attendance/actions"
import { belongsToSubject, type SubjectAttendanceRow, type SubjectSchedule, type SubjectStudent } from "@/features/subject-attendance/model"

export function TeacherSubjectConsole({ schedules, students, records, date, today }: {
  schedules: SubjectSchedule[]; students: SubjectStudent[]; records: SubjectAttendanceRow[]; date: string; today: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  const available = schedules.filter(row => row.status === "active" && row.day_of_week === day)
  const schedule = available.find(row => String(row.id) === selected)
  const roster = schedule ? students.filter(student => belongsToSubject(student, schedule)) : []
  const sessionRecords = records.filter(row => row.schedule_id === schedule?.id && row.attendance_date === date)
  const byStudent = new Map(sessionRecords.map(row => [row.student_id, row]))
  const unconfirmed = roster.filter(row => !byStudent.has(row.id)).length
  const filtered = roster.filter(row => `${row.full_name} ${row.student_id}`.toLowerCase().includes(search.toLowerCase()))
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pageCount)

  function confirm(studentId: number, status: "Present" | "Late" | "Absent") {
    if (!schedule) return
    startTransition(async () => {
      try {
        const result = await confirmSubjectAction({ scheduleId: schedule.id, studentId, date, status,
          expectedConfirmedAt: byStudent.get(studentId)?.confirmed_at ?? null })
        if (!result.ok) { toast.error(result.message); router.refresh(); return }
        toast.success(result.message)
        router.refresh()
      } catch { toast.error("Could not confirm attendance. Refresh and try again.") }
    })
  }

  return <Card>
    <CardHeader><CardTitle>Confirm Attendance by Subject</CardTitle>
      <CardDescription>A campus tap leaves every subject unconfirmed. Check this class, then confirm Present, Late or Absent. Your confirmation creates no RFID time-in or time-out; students without a card can still be confirmed.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="subject-date">Session date (PHT)</Label>
          <Input id="subject-date" type="date" value={date} max={today} disabled={pending} onChange={e => {
            if (e.target.value) { setSelected(""); setPage(1); router.push(`/teacher/attendance?date=${e.target.value}`) }
          }} /></div>
        <div className="space-y-2"><Label htmlFor="subject-schedule">Scheduled subject</Label>
          <select id="subject-schedule" className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={selected} disabled={pending} onChange={e => { setSelected(e.target.value); setPage(1) }}>
            <option value="">Select a subject session</option>
            {available.map(row => <option key={row.id} value={row.id}>{row.course?.course_code} · {row.section} · {row.campus} · {row.time_start}–{row.time_end}</option>)}
          </select></div>
      </div>
      {!available.length && <p className="text-sm text-muted-foreground">No active subject schedule for this date. Ask the administrator to configure it in Schedules.</p>}
      {schedule && <>
        <p className="text-sm">{roster.length} students · {unconfirmed} unconfirmed. Unconfirmed is not Absent.</p>
        <Input aria-label="Search subject students" placeholder="Search student name or ID" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Current confirmation</TableHead><TableHead>Confirm after checking</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.slice((currentPage - 1) * 10, currentPage * 10).map(student => <TableRow key={student.id}>
            <TableCell>{student.full_name}<br />{student.student_id}</TableCell>
            <TableCell>{byStudent.get(student.id)?.attendance_status ?? "Not confirmed yet"}</TableCell>
            <TableCell><div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Present"} onClick={() => confirm(student.id, "Present")}>Present</Button>
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Late"} onClick={() => confirm(student.id, "Late")}>Late</Button>
              <Button size="sm" variant="outline" disabled={pending || date > today || byStudent.get(student.id)?.attendance_status === "Absent"} onClick={() => confirm(student.id, "Absent")}>Absent</Button>
            </div></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {!filtered.length && <p className="text-sm text-muted-foreground">No matching students in this subject.</p>}
        <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        <p role="status" className="text-sm text-muted-foreground">{pending ? "Saving confirmation…" : "A correction replaces only this student's result for this subject session."}</p>
      </>}
    </CardContent>
  </Card>
}
