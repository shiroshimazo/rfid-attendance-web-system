import { CalendarDays } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { weekdayLabel, type SubjectSchedule } from "@/features/subject-attendance/model"
import { formatClockTime } from "@/lib/format"

export function ScheduleTable({ schedules }: { schedules: SubjectSchedule[] }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Weekly classes</CardTitle>
          <Badge variant="secondary" className="tabular-nums">
            {schedules.length} {schedules.length === 1 ? "session" : "sessions"} per week
          </Badge>
        </div>
        <CardDescription className="text-pretty">
          Your active classes, Monday through Sunday. All times are Philippine time (PHT).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No scheduled classes"
            description="Your weekly classes will appear here once an administrator adds your subject schedules."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table aria-label="Your weekly class schedule" className="min-w-[680px]">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead scope="col" className="px-4">Day</TableHead>
                  <TableHead scope="col" className="px-4">Subject</TableHead>
                  <TableHead scope="col" className="px-4">Section</TableHead>
                  <TableHead scope="col" className="px-4">Campus</TableHead>
                  <TableHead scope="col" className="px-4">Class Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map(schedule => (
                  <TableRow key={schedule.id}>
                    <TableCell className="px-4 py-4 font-medium">{weekdayLabel(schedule.day_of_week)}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="font-medium">{schedule.course?.course_code ?? "—"}</span>
                      <span className="block max-w-sm whitespace-normal text-sm text-muted-foreground">
                        {schedule.course?.course_name ?? "Subject unavailable"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="font-medium">{schedule.section}</span>
                      <span className="block text-xs text-muted-foreground">{schedule.year_level}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4">{schedule.campus}</TableCell>
                    <TableCell className="px-4 py-4 tabular-nums">
                      {formatClockTime(schedule.time_start)} – {formatClockTime(schedule.time_end)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
