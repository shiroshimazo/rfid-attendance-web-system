import { ReportBox } from "@/features/reports/report-box"
import { KpiCardSkeleton, TableCardSkeleton, ChartCardSkeleton, CalendarExceptionsSkeleton, SmsRecordsSkeleton } from "@/features/reports/panel-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarExceptions } from "@/features/reports/calendar-exceptions"
import type { Metadata } from "next"

import { LiveRefresh } from "@/components/live-refresh"
import {
  formatRangeLabel,
  getAdminReportsData,
  parseReportsRange,
  type ReportsRange,
  type ReportsSearchParams,
} from "@/features/reports/panel"

import { AttendanceBySectionTable } from "./components/attendance-by-section-table"
import { AttendanceBySubjectTable } from "./components/attendance-by-subject-table"
import { DateRangePicker } from "./components/date-range-picker"
import { ExportPdfButton } from "./components/export-pdf-button"
import { GroupBreakdownChart } from "./components/group-breakdown-chart"
import { ReportKpiCard } from "./components/kpi-cards"
import { SmsReportRecords } from "@/features/reports/sms-report-records"
import { RecentLogsTable } from "./components/recent-logs-table"
import { StatusChart } from "./components/status-chart"
import { SummaryChart } from "./components/summary-chart"

export const metadata: Metadata = {
  title: "Reports",
}

export const dynamic = "force-dynamic"

function ReportsHeader({ range }: { range: ReportsRange }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Institution-wide RFID attendance for{" "}
          {formatRangeLabel(range.from, range.to)}.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2" data-print="hide">
        <DateRangePicker from={range.from} to={range.to} />
        <ExportPdfButton range={range} />
      </div>
    </div>
  )
}

function ReportsContent({ data }: { data: ReturnType<typeof getAdminReportsData> }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <ReportBox data={data} fallback={<div aria-label="Loading report details" className="space-y-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>}>
        {data => <p className="text-sm text-muted-foreground tabular-nums">
          Generated {data.generatedAtLabel}. Rates exclude no-class and online/manual student-days.
          Program, year and section reflect current profiles. Tap campus comes from the recorded evidence; past exception campuses use stored snapshots.
        </p>}
      </ReportBox>
      <h2 className="text-lg font-semibold">Attendance overview</h2>
      <section aria-label="Report key performance indicators" className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[0, 1, 2, 3].map(index => <ReportBox key={index} data={data} fallback={<KpiCardSkeleton />}>
          {data => <ReportKpiCard index={index} kpis={data.kpis} sessionDays={data.sessionDays} />}
        </ReportBox>)}
      </section>
      <ReportBox data={data} fallback={<CalendarExceptionsSkeleton />}>
        {data => <CalendarExceptions rows={data.calendarExceptions} />}
      </ReportBox>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="lg:col-span-2">
          <ReportBox data={data} fallback={<ChartCardSkeleton />}>
            {data => <SummaryChart summary={data.summary} rangeLabel={data.rangeLabel} />}
          </ReportBox>
        </div>
        <ReportBox data={data} fallback={<ChartCardSkeleton status />}>
          {data => <StatusChart distribution={data.distribution} />}
        </ReportBox>
      </div>
      <ReportBox data={data} fallback={<ChartCardSkeleton breakdown />}>
        {data => <GroupBreakdownChart byProgram={data.byProgram} byYearLevel={data.byYearLevel} />}
      </ReportBox>
      <ReportBox data={data} fallback={<TableCardSkeleton title="Attendance by Section" columns={["px-3", "px-3", "px-3", "px-3", "hidden px-3 md:table-cell", "hidden px-3 lg:table-cell", "hidden px-3 lg:table-cell", "hidden px-3 lg:table-cell", "px-3"]} />}>
        {data => <AttendanceBySectionTable rows={data.bySection} rangeLabel={data.rangeLabel} />}
      </ReportBox>
      <ReportBox data={data} fallback={<TableCardSkeleton title="Attendance by Subject" columns={Array<string>(6).fill("")} multiline />}>
        {data => <AttendanceBySubjectTable rows={data.subjectAttendance} />}
      </ReportBox>

      <ReportBox data={data} fallback={<TableCardSkeleton title="Recent Attendance Logs" columns={["px-3", "px-3", "hidden px-3 md:table-cell", "hidden px-3 lg:table-cell", "hidden px-3 lg:table-cell", "px-3", "hidden px-3 sm:table-cell"]} multiline />}>
        {data => <RecentLogsTable logs={data.recentLogs} total={data.attendanceLogs.length} />}
      </ReportBox>
      <ReportBox data={data} fallback={<SmsRecordsSkeleton />}>
        {data => <SmsReportRecords records={data.smsLogs.slice(0, 50)} total={data.smsLogs.length} />}
      </ReportBox>
    </div>
  )
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<ReportsSearchParams>
}) {
  const range = parseReportsRange(await searchParams)
  const data = getAdminReportsData(range)

  return (
    <div
      data-print="region"
      className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6"
    >
      <LiveRefresh channel="live-admin-reports" />
      <ReportsHeader range={range} />
      <ReportsContent key={`${range.from}|${range.to}`} data={data} />
    </div>
  )
}
