"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { subjectTotals, subjectAttendancePolicy, type SubjectAttendanceRow } from "@/features/subject-attendance/model"

export function SubjectRecords({ rows, summaryOnly = false, title = "Subject Attendance", filterSubjects = false }: { rows: SubjectAttendanceRow[]; summaryOnly?: boolean; title?: string; filterSubjects?: boolean }) {
  const [subject, setSubject] = useState("all")
  const subjects = [...new Map(rows.map(row => [JSON.stringify([row.course_code, row.course_name]), `${row.course_code} — ${row.course_name}`])).entries()].sort((a, b) => a[1].localeCompare(b[1]))
  const selectedSubject = subjects.some(([key]) => key === subject) ? subject : "all"
  const filtered = filterSubjects && selectedSubject !== "all" ? rows.filter(row => JSON.stringify([row.course_code, row.course_name]) === selectedSubject) : rows
  const totals = subjectTotals(filtered)
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  return <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{subjectAttendancePolicy}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {filterSubjects && <Select value={selectedSubject} onValueChange={value => { setSubject(value); setPage(1) }}>
        <SelectTrigger aria-label="Filter by subject" className="w-full sm:w-80"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All subjects</SelectItem>
          {subjects.map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
        </SelectContent>
      </Select>}
      <p className="font-medium tabular-nums" aria-live="polite">
        Present: {totals.present} · Late: {totals.late} · Absent: {totals.absent} · Confirmed student-sessions: {totals.confirmed} · Rate: {totals.rate === null ? "No confirmations" : `${totals.rate.toFixed(1)}%`}
      </p>
      {!rows.length && <p className="text-sm text-muted-foreground">No teacher confirmations in this scope. This does not mean students are absent.</p>}
      {!summaryOnly && (filterSubjects || rows.length > 0) && <>
        <Table>
          <TableHeader><TableRow><TableHead>Date / scheduled session</TableHead><TableHead>Subject / teacher</TableHead><TableHead>Student</TableHead><TableHead>Section / campus</TableHead><TableHead>Confirmed result</TableHead><TableHead>RFID times</TableHead></TableRow></TableHeader>
          <TableBody>{!visible.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No teacher confirmations for this subject in this range.</TableCell></TableRow>}{visible.map(row => <TableRow key={row.id}>
            <TableCell>{row.attendance_date}<br />{row.time_start}–{row.time_end} PHT</TableCell>
            <TableCell>{row.course_code} — {row.course_name}<br /><span className="text-muted-foreground">{row.teacher_name}</span></TableCell>
            <TableCell>{row.student_name}<br />{row.student_number}</TableCell>
            <TableCell>{row.program_code} {row.year_level}<br />{row.section} · {row.campus}</TableCell>
            <TableCell>{row.attendance_status}<br /><span className="text-xs text-muted-foreground">Teacher confirmed</span></TableCell>
            <TableCell>— / —<br /><span className="text-xs text-muted-foreground">No RFID tap created</span></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        <p className="text-sm text-muted-foreground">{filtered.length} confirmed student-sessions. Placement and subject details reflect confirmation time.</p>
        {filtered.length > 0 && <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />}
      </>}
    </CardContent>
  </Card>
}
