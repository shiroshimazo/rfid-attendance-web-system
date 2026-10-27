import type { Metadata } from "next"
import { ReaderCalendarPage } from "@/components/calendar/reader-page"
import type { CalendarSearchParams } from "@/features/calendar/admin-view"

export const metadata: Metadata = { title: "Calendar" }
export const dynamic = "force-dynamic"

export default function TeacherCalendarPage({ searchParams }: { searchParams: Promise<CalendarSearchParams> }) {
  return <ReaderCalendarPage role="teacher" searchParams={searchParams} />
}
