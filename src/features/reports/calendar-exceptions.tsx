import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { AttendanceStatusBadge } from "@/components/attendance-status-badge"
import type { ReportCalendarException } from "@/features/reports/calendar-model"

export function CalendarExceptions({ rows }: { rows: ReportCalendarException[] }) {
  if (!rows.length) return null
  const count = (status: ReportCalendarException["status"]) => rows.filter(row => row.status === status).reduce((total, row) => total + row.students, 0)
  return <Card><CardHeader><CardTitle>Calendar exceptions</CardTitle><CardDescription>No classes: {count("NoClasses")} student-days. Online / manual: {count("OnlineManual")} student-days. These days are excluded from daily RFID rates. Past dates use stored snapshot campuses. Online confirmations remain in Subject Attendance.</CardDescription></CardHeader><CardContent>
    <Table><TableHeader><TableRow>{["Date", "Campus", "Calendar state", "Affected students"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map(row => <TableRow key={JSON.stringify([row.date, row.campus, row.status])}><TableCell className="tabular-nums">{row.date}</TableCell><TableCell>{row.campus}</TableCell><TableCell><AttendanceStatusBadge status={row.status} /></TableCell><TableCell className="tabular-nums">{row.students}</TableCell></TableRow>)}</TableBody></Table>
  </CardContent></Card>
}
