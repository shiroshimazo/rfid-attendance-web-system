import { fetchSubjectAttendance } from "@/services/attendance/subject-attendance"
import { requireRole } from "@/features/auth/server"
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
  attendanceRate: number
  rfidScans: number
}
// No SMS model leaves this teacher boundary.
export type TeacherReportsData = Omit<ReportsData, "kpis" | "smsLogs"> & { kpis: TeacherReportsKpis }

export function buildTeacherReportsData(snapshot: TeacherReportsSnapshot, options: ReportsBuildOptions): TeacherReportsData {
  const report = buildReportsData({ ...snapshot, sms: [] }, options)
  const { smsLogs: _sms, kpis, ...data } = report
  void _sms
  const denominator = kpis.totalPresent + kpis.totalAbsent
  return { ...data, kpis: {
    totalAssigned: kpis.totalStudents,
    totalPresent: kpis.totalPresent,
    totalAbsent: kpis.totalAbsent,
    rfidScans: kpis.rfidScans,
    attendanceRate: denominator ? kpis.totalPresent / denominator * 100 : 0,
  } }
}

export async function getTeacherReportsData({ from, to }: ReportsRange): Promise<TeacherReportsData> {
  const account = await requireRole("teacher")
  const snapshot = await fetchTeacherReportsSnapshot({ authUserId: account.id, fromDate: from, toDate: to })
  const report = buildTeacherReportsData(snapshot, { fromDate: from, toDate: to, generatedAt: new Date() })
  return { ...report, subjectAttendance: await fetchSubjectAttendance({ from, to }) }
}
