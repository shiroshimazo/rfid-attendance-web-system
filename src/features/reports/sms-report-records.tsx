import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatReportTimestamp, type ReportsData } from "@/features/reports/panel"

/** Server-only admin report preview; full records are included in the PDF. */
export function SmsReportRecords({ records, total }: { records: ReportsData["smsLogs"]; total: number }) {
  return <Card>
    <CardHeader>
      <CardTitle>SMS Notification Records</CardTitle>
      <CardDescription>
        Showing {records.length} of {total} notifications linked to attendance in this range.
        Export PDF includes all records. Stored status does not confirm handset delivery.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {records.length ? records.map(sms => <article key={sms.id} className="space-y-1 rounded-lg border p-3 text-sm">
        <p className="font-medium">{sms.studentName} ({sms.studentId}) · {sms.sms_status}</p>
        <p className="text-muted-foreground">Attendance #{sms.attendance_id} · {sms.attendanceDate} · To: {sms.parent_contact_number}</p>
        <p className="text-muted-foreground">Created {formatReportTimestamp(sms.created_at)} · Sent {sms.sent_at ? formatReportTimestamp(sms.sent_at) : "not recorded"}</p>
        <p className="whitespace-pre-wrap break-words">{sms.message}</p>
      </article>) : <p className="text-sm text-muted-foreground">No SMS notification records for this attendance range.</p>}
    </CardContent>
  </Card>
}
