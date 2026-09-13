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
import { saveSubjectEnrollmentAction } from "@/features/subject-attendance/actions"
import { enrolledSubjectStudents, weekdayLabel, type SubjectEnrollment, type SubjectSchedule, type SubjectStudent } from "@/features/subject-attendance/model"

export function SubjectEnrollmentEditor({ schedules, students, enrollments }: {
  schedules: SubjectSchedule[]; students: SubjectStudent[]; enrollments: SubjectEnrollment[]
}) {
  const [selected, setSelected] = useState("")
  const schedule = schedules.find(row => String(row.id) === selected && row.status === "active")
  return <Card>
    <CardHeader>
      <CardTitle>Student Subject Enrollment</CardTitle>
      <CardDescription>Assign each student to the subject sessions they attend. Enrolled students appear on the teacher’s sheet even without RFID taps. New schedules start with an empty roster.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Label htmlFor="enrollment-schedule">Subject session</Label>
      <select id="enrollment-schedule" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">Select a subject session</option>
        {schedules.filter(row => row.status === "active").map(row => <option key={row.id} value={row.id}>
          {row.course?.course_code} · {row.teacher?.full_name} · {row.section} · {row.campus} · {weekdayLabel(row.day_of_week)} · {row.time_start}
        </option>)}
      </select>
      {schedule ? <EnrollmentForm key={`${schedule.id}:${schedule.roster_version}`} schedule={schedule} students={students} enrollments={enrollments} />
        : <p className="text-sm text-muted-foreground">Select an active subject session to manage its students.</p>}
    </CardContent>
  </Card>
}

function EnrollmentForm({ schedule, students, enrollments }: {
  schedule: SubjectSchedule; students: SubjectStudent[]; enrollments: SubjectEnrollment[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState(() => new Set(enrolledSubjectStudents(students, enrollments, schedule.id).map(row => row.id)))
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pending, startTransition] = useTransition()
  const filtered = students.filter(row => `${row.full_name} ${row.student_id} ${row.year_level} ${row.section} ${row.campus}`.toLowerCase().includes(search.trim().toLowerCase()))
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pageCount)

  function save() {
    startTransition(async () => {
      try {
        const result = await saveSubjectEnrollmentAction({ scheduleId: schedule.id, studentIds: [...selected], expectedVersion: schedule.roster_version })
        if (result.ok) toast.success(result.message)
        else toast.error(result.message)
        router.refresh()
      } catch { toast.error("Could not save enrollment. Refresh and try again.") }
    })
  }

  return <div className="space-y-4">
    <p className="text-sm tabular-nums" aria-live="polite">{selected.size} students selected. Removing enrollment preserves saved attendance history.</p>
    <Input aria-label="Search students for enrollment" placeholder="Search name, ID, section or campus" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
    <div className="overflow-x-auto rounded-lg border">
      <Table aria-label="Student subject enrollment">
        <TableHeader><TableRow><TableHead>Enrolled</TableHead><TableHead>Student</TableHead><TableHead>Current class</TableHead></TableRow></TableHeader>
        <TableBody>{filtered.slice((currentPage - 1) * 10, currentPage * 10).map(student => <TableRow key={student.id}>
          <TableCell><label className="flex min-h-10 min-w-10 items-center justify-center">
            <input type="checkbox" className="size-4 accent-primary" aria-label={`Enroll ${student.full_name} (${student.student_id})`} checked={selected.has(student.id)} disabled={pending} onChange={e => {
              const checked = e.target.checked
              setSelected(old => { const next = new Set(old); if (checked) next.add(student.id); else next.delete(student.id); return next })
            }} />
          </label></TableCell>
          <TableCell>{student.full_name}<br /><span className="text-xs text-muted-foreground">{student.student_id}</span></TableCell>
          <TableCell>{student.year_level} · {student.section}<br />{student.campus}</TableCell>
        </TableRow>)}
        {!filtered.length && <TableRow><TableCell colSpan={3}>No matching active students.</TableCell></TableRow>}</TableBody>
      </Table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button disabled={pending} onClick={save}>{pending ? "Saving enrollment…" : "Save enrollment"}</Button>
      <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
    </div>
  </div>
}
