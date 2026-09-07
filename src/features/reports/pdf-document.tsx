import { Document, Page, Text, Fixed } from "@formepdf/react"
import { DataTable } from "@/components/pdf/data-table"
import { formatReportTimestamp, type ReportsData } from "@/features/reports/panel"
import type { TeacherReportsData } from "@/features/reports/teacher-panel"

export type ReportPdfInput =
  | { role: "admin"; data: ReportsData }
  | { role: "teacher"; data: TeacherReportsData }

function Title({ children }: { children: string }) {
  return <Text style={{ fontSize: 18, fontWeight: 700, color: "#15365a", marginBottom: 12 }}>{children}</Text>
}

export function ReportPdfDocument({ role, data }: ReportPdfInput) {
  const attended = data.kpis.totalPresent
  const recorded = attended + data.kpis.totalAbsent
  const pageStyle = { fontFamily: "Helvetica", color: "#172b42", fontSize: 9 }
  const footer = (
    <Fixed position="footer">
      <Text style={{ fontSize: 8, color: "#64748b" }}>
        {`RFID Attendance System | ${role === "admin" ? "Administrator" : "Assigned classes"} | ${data.range.from} to ${data.range.to} | PHT`}
      </Text>
    </Fixed>
  )
  return (
    <Document title="RFID Attendance Report" author="RFID Attendance System">
      <Page size={{ width: 842, height: 595 }} margin={36} style={pageStyle}>
        {footer}
        <Title>RFID Attendance Report</Title>
        <Text style={{ marginBottom: 8 }}>{`${data.rangeLabel} | Generated ${data.generatedAtLabel}`}</Text>
        <Text style={{ marginBottom: 12 }}>{role === "admin" ? "Institution-wide records, including archived students." : "Records visible under your current active teaching assignments."}</Text>
        <DataTable columns={[{ key: "metric", header: "Measure" }, { key: "value", header: "Value" }]} data={[
          { metric: role === "admin" ? "Current active students" : "Current active assigned students", value: "totalStudents" in data.kpis ? data.kpis.totalStudents : data.kpis.totalAssigned },
          { metric: "Students with records in this range", value: new Set(data.attendanceLogs.map(row => row.studentId)).size },
          { metric: "Present (includes Late)", value: attended },
          { metric: "Recorded Absent", value: data.kpis.totalAbsent },
          { metric: "Recorded attendance rate", value: recorded ? `${(attended / recorded * 100).toFixed(1)}%` : "No current attendance records" },
          { metric: "Captured time-in / time-out scans", value: data.kpis.rfidScans },
          { metric: "Attendance records exported (includes historical values)", value: data.attendanceLogs.length },
          ...(role === "admin" ? [{ metric: "SMS records exported", value: data.smsLogs.length }] : []),
        ]} />
        <Text style={{ marginTop: 12, lineHeight: 1.4 }}>
          Rates use Present + Late divided by Present + Late + recorded Absent. Missing records are not absences. Historical status values remain in the detail and are excluded from current totals. Scans count stored time-in and time-out fields, not every physical tap.
        </Text>
        <Text style={{ marginTop: 8, lineHeight: 1.4 }}>
          Campus comes from each attendance record. Program, year, section, names and account status reflect current profiles; historical placement and card-status snapshots are not stored. Section student counts may overlap after a campus transfer. All times are Philippine time (PHT).
        </Text>
      </Page>
      <Page size={{ width: 842, height: 595 }} margin={36} style={pageStyle}>
        {footer}<Title>Attendance by campus and section</Title>
        {data.bySection.length ? <DataTable columns={[
          { key: "program", header: "Program" }, { key: "yearLevel", header: "Year" },
          { key: "section", header: "Section" }, { key: "campus", header: "Campus" },
          { key: "total", header: "Students" }, { key: "present", header: "Present incl. Late" },
          { key: "late", header: "Late" }, { key: "absent", header: "Absent" }, { key: "rate", header: "Recorded rate" },
        ]} data={data.bySection.map(row => ({ ...row, rate: row.present + row.absent ? `${row.rate.toFixed(1)}%` : "No records" }))} /> : <Text>No sections in this scope.</Text>}
      </Page>
      <Page size={{ width: 842, height: 595 }} margin={36} style={pageStyle}>
        {footer}<Title>{`Attendance and RFID records (${data.attendanceLogs.length})`}</Title>
        {data.attendanceLogs.length ? <DataTable columns={[
          { key: "record", header: "Record / date", width: 75 },
          { key: "student", header: "Student / account", width: 160 },
          { key: "placement", header: "Current placement / recorded campus", width: 150 },
          { key: "times", header: "In / out (PHT)", width: 90 },
          { key: "status", header: "Attendance", width: 110 },
          { key: "card", header: "Recorded card / status now", width: 185 },
        ]} data={data.attendanceLogs.map(row => ({
          record: `#${row.id}\n${row.date}`,
          student: `${row.studentName}\n${row.studentId}\n${row.studentStatus}`,
          placement: `${row.program} / ${row.yearLevel}\n${row.section}\n${row.campus}`,
          times: `${row.timeIn || "—"}\n${row.timeOut || "—"}`,
          status: row.status === "LegacyRecord" ? "Historical record" : row.status,
          card: `${row.rfidNumber}\nCard #${row.rfidCardId}\n${row.rfidStatus === "Unassigned" ? "Status unavailable" : `${row.rfidStatus} (now)`}`,
        }))} /> : <Text>No attendance records in the selected range.</Text>}
      </Page>
      {role === "admin" && (
        <Page size={{ width: 842, height: 595 }} margin={36} style={pageStyle}>
          {footer}<Title>{`SMS notification records (${data.smsLogs.length})`}</Title>
          <Text style={{ marginBottom: 12 }}>Notifications linked to attendance dates in this range, including retries created later. Stored status is not proof of handset delivery.</Text>
          {data.smsLogs.length ? data.smsLogs.map(sms => (
            <Text key={sms.id} style={{ marginBottom: 14, lineHeight: 1.4 }}>
              {`SMS #${sms.id} | Attendance #${sms.attendance_id} | ${sms.attendanceDate}\n${sms.studentName} (${sms.studentId}) | To: ${sms.parent_contact_number}\nStatus: ${sms.sms_status} | Created: ${formatReportTimestamp(sms.created_at)} | Sent: ${sms.sent_at ? formatReportTimestamp(sms.sent_at) : "Not recorded"}\n${sms.message}`}
            </Text>
          )) : <Text>No SMS notification records for this attendance range.</Text>}
        </Page>
      )}
    </Document>
  )
}
