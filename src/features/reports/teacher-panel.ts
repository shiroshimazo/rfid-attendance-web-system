import { fetchSubjectAttendance } from "@/services/attendance/subject-attendance"
import { requireRole } from "@/features/auth/server"
import { fetchCalendarAttendanceState } from "@/services/calendar/attendance-state"
import {
  buildReportsData, formatRangeLabel, parseReportsRange,
  type ReportsData, type ReportsRange, type ReportsSearchParams,
  type ReportsBuildOptions, type SectionBreakdown, type SummaryPoint, type StatusSlice,
} from "@/features/reports/panel"
import {
  fetchTeacherReportsSnapshot, type AttendanceStatus, type TeacherReportsSnapshot,
} from "@/services/reports/teacher-snapshot"

export { formatRangeLabel, parseReportsRange }
export type { AttendanceStatus, ReportsRange, ReportsSearchParams }
export type TeacherReportsBuildOptions = ReportsBuildOptions
export type TeacherSectionBreakdown = SectionBreakdown
export type TeacherSummaryPoint = SummaryPoint
export type TeacherStatusSlice = StatusSlice
export interface TeacherReportsKpis {
  totalAssigned: number
  totalPresent: number
  totalAbsent: number
  attendanceRate: number | null
  rfidScans: number
  noClasses: number
  onlineManual: number
}
// No SMS model leaves this teacher boundary.
export type TeacherReportsData = Omit<ReportsData, "kpis" | "smsLogs"> & { kpis: TeacherReportsKpis }

export function buildTeacherReportsData(snapshot: TeacherReportsSnapshot, options: ReportsBuildOptions): TeacherReportsData {
  const report = buildReportsData({ ...snapshot, sms: [] }, options)
  const { smsLogs: _sms, kpis, ...data } = report
  void _sms
  return { ...data, kpis: {
    totalAssigned: kpis.totalStudents,
    totalPresent: kpis.totalPresent,
    totalAbsent: kpis.totalAbsent,
    rfidScans: kpis.rfidScans,
    noClasses: kpis.noClasses, onlineManual: kpis.onlineManual,
    attendanceRate: kpis.attendanceRate,
  } }
}

export async function getTeacherReportsData({ from, to }: ReportsRange): Promise<TeacherReportsData> {
  const account = await requireRole("teacher")
  const now = new Date()
  const [snapshot, calendar] = await Promise.all([
    fetchTeacherReportsSnapshot({ authUserId: account.id, fromDate: from, toDate: to }), fetchCalendarAttendanceState(from, to, now),
  ])
  const report = buildTeacherReportsData(snapshot, { fromDate: from, toDate: to, generatedAt: now, calendar })
  return { ...report, subjectAttendance: await fetchSubjectAttendance({ from, to }) }
}
