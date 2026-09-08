"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "@/components/data-table"
import { subjectTotals, subjectAttendancePolicy, type SubjectAttendanceRow } from "@/features/subject-attendance/model"

export function SubjectRecords({ rows, summaryOnly = false }: { rows: SubjectAttendanceRow[]; summaryOnly?: boolean }) {
  const totals = subjectTotals(rows)
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(rows.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visible = rows.slice((currentPage - 1) * 10, currentPage * 10)
  return <Card>
    <CardHeader>
      <CardTitle>Subject Attendance</CardTitle>
      <CardDescription>{subjectAttendancePolicy}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="font-medium tabular-nums" aria-live="polite">
        Present: {totals.present} · Absent: {totals.absent} · Confirmed student-sessions: {totals.confirmed} · Rate: {totals.rate === null ? "No confirmations" : `${totals.rate.toFixed(1)}%`}
      </p>
      {!rows.length && <p className="text-sm text-muted-foreground">No teacher confirmations in this scope. This does not mean students are absent.</p>}
      {!summaryOnly && rows.length > 0 && <>
        <Table>
          <TableHeader><TableRow><TableHead>Date / scheduled session</TableHead><TableHead>Subject / teacher</TableHead><TableHead>Student</TableHead><TableHead>Section / campus</TableHead><TableHead>Confirmed result</TableHead><TableHead>RFID times</TableHead></TableRow></TableHeader>
          <TableBody>{visible.map(row => <TableRow key={row.id}>
            <TableCell>{row.attendance_date}<br />{row.time_start}–{row.time_end} PHT</TableCell>
            <TableCell>{row.course_code} — {row.course_name}<br /><span className="text-muted-foreground">{row.teacher_name}</span></TableCell>
            <TableCell>{row.student_name}<br />{row.student_number}</TableCell>
            <TableCell>{row.program_code} {row.year_level}<br />{row.section} · {row.campus}</TableCell>
            <TableCell>{row.attendance_status}<br /><span className="text-xs text-muted-foreground">Teacher confirmed</span></TableCell>
            <TableCell>— / —<br /><span className="text-xs text-muted-foreground">No RFID tap created</span></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        <p className="text-sm text-muted-foreground">{rows.length} confirmed student-sessions. Placement and subject details reflect confirmation time.</p>
        <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </>}
    </CardContent>
  </Card>
}
