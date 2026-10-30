"use client"

import { useState } from "react"
import { TablePagination } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { subjectBreakdown } from "@/features/reports/subject-breakdown"
import type { SubjectAttendanceRow } from "@/features/subject-attendance/model"

function subjectKey(row: SubjectAttendanceRow) {
  return JSON.stringify([row.course_code, row.course_name])
}

export function AttendanceBySubjectTable({ rows }: { rows: SubjectAttendanceRow[] }) {
  const [subject, setSubject] = useState("all")
  const [page, setPage] = useState(1)
  const subjects = [...new Map(rows.map(row => [subjectKey(row), `${row.course_code} — ${row.course_name}`])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
  const selectedSubject = subjects.some(([key]) => key === subject) ? subject : "all"
  const filtered = selectedSubject === "all" ? rows : rows.filter(row => subjectKey(row) === selectedSubject)
  const sessions = subjectBreakdown(filtered)
  const pageCount = Math.max(1, Math.ceil(sessions.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visible = sessions.slice((currentPage - 1) * 10, currentPage * 10)

  return <Card data-print="block">
    <CardHeader>
      <CardTitle>Attendance by Subject</CardTitle>
      <CardDescription>Subject attendance is teacher-confirmed as Present, Late or Absent.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Select value={selectedSubject} onValueChange={value => { setSubject(value); setPage(1) }}>
        <SelectTrigger aria-label="Filter by subject" className="w-full sm:w-80"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All subjects</SelectItem>
          {subjects.map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="rounded-lg border">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Date / scheduled session</TableHead>
            <TableHead>Subject / teacher</TableHead>
            <TableHead>Section / campus</TableHead>
            <TableHead>Present</TableHead><TableHead>Late</TableHead><TableHead>Absent</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {!visible.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No teacher confirmations in this range.</TableCell></TableRow>}
            {visible.map(row => <TableRow key={row.key}>
              <TableCell>{row.attendance_date}<br />{row.time_start}–{row.time_end} PHT</TableCell>
              <TableCell>{row.course_code} — {row.course_name}<br /><span className="text-muted-foreground">{row.teacher_name}</span></TableCell>
              <TableCell>{row.program_code} {row.year_level}<br />{row.section} · {row.campus}</TableCell>
              <TableCell className="tabular-nums">{row.present}</TableCell>
              <TableCell className="tabular-nums">{row.late}</TableCell>
              <TableCell className="tabular-nums">{row.absent}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
      {sessions.length > 0 && <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />}
    </CardContent>
  </Card>
}
