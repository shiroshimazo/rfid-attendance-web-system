import type { Metadata } from "next"
import { unstable_rethrow } from "next/navigation"
import { LiveRefresh } from "@/components/live-refresh"
import { DataErrorCard } from "@/components/data-error-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCurrentEnrollment } from "@/features/subject-attendance/current-enrollment"
import { weekdayLabel } from "@/features/subject-attendance/model"
import { formatClockTime } from "@/lib/format"
import { roomForSection } from "@/features/academic/pilot"

export const metadata: Metadata = { title: "Current Enrollment" }
export const dynamic = "force-dynamic"

export default async function CurrentEnrollmentPage() {
  let data
  try { data = await getCurrentEnrollment() }
  catch (error) {
    unstable_rethrow(error)
    return <div className="p-4 md:p-6"><DataErrorCard title="Enrollment could not be loaded" message="Please try again or contact an administrator." /></div>
  }
  const { student, schedules } = data
  const information = [
    ["Category", "College"],
    ["Branch / Campus", student.campus],
    ["Program / Strand", student.program?.program_name],
    ["Year Level", student.year_level],
    ["Current Section", [student.program?.program_code, student.section].filter(Boolean).join(" ")],
    ["Academic Year", "Not recorded"],
  ]
  return <div className="@container/main flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
    <LiveRefresh channel="live-student-enrollment" tables={["subject_enrollments", "subject_schedules", "students", "teachers", "courses", "programs"]} />
    <h1 className="text-2xl font-semibold tracking-tight">Current Enrollment</h1>
    {data.teacherNamesUnavailable && <p role="status" className="text-sm text-muted-foreground">Teacher names are temporarily unavailable. Your enrollment details are shown below.</p>}
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <CardHeader className="border-b px-6 py-6"><CardTitle className="text-base font-medium">Enrollment Information</CardTitle></CardHeader>
      <CardContent className="p-6 md:px-10 md:py-8"><dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
        {information.map(([label, value]) => <div key={label} className="min-w-0 space-y-1"><dt className="text-sm font-semibold">{label}</dt><dd className="text-sm text-muted-foreground break-words">{value || "Not recorded"}</dd></div>)}
      </dl></CardContent>
    </Card>
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <CardHeader className="border-b px-6 py-6"><CardTitle className="text-base font-medium">Subject Information</CardTitle></CardHeader>
      <CardContent className="min-w-0 p-4">
        {schedules.length ? <Table aria-label="Current enrolled subjects" className="min-w-[1100px]">
          <TableHeader><TableRow>{["Section", "Subject Code", "Subject", "Days", "Time", "Frequency", "Room", "Category", "Subject Teacher", "Status"].map(label => <TableHead key={label} className="px-4 py-4 text-xs">{label}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{schedules.map(schedule => <TableRow key={schedule.id}>
            <TableCell className="px-4">{schedule.section}</TableCell>
            <TableCell className="px-4">{schedule.course?.course_code ?? "Not recorded"}</TableCell>
            <TableCell className="min-w-56 max-w-80 whitespace-normal px-4">{schedule.course?.course_name ?? "Not recorded"}</TableCell>
            <TableCell className="px-4">{weekdayLabel(schedule.day_of_week)}</TableCell>
            <TableCell className="px-4 tabular-nums">{formatClockTime(schedule.time_start)} – {formatClockTime(schedule.time_end)}</TableCell>
            <TableCell className="px-4">Weekly</TableCell>
            <TableCell className="px-4">{roomForSection(schedule.section) ?? "Not assigned"}</TableCell>
            <TableCell className="px-4">Face To Face</TableCell>
            <TableCell className="px-4">{schedule.teacher?.full_name ?? "Unavailable"}</TableCell>
            <TableCell className="px-4"><Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Active</Badge></TableCell>
          </TableRow>)}</TableBody>
        </Table> : <div className="py-12 text-center"><h2 className="font-medium">No active subject enrollments</h2><p className="mt-2 text-sm text-muted-foreground">Your enrolled subjects will appear here after an administrator assigns them.</p></div>}
      </CardContent>
    </Card>
  </div>
}
