import { redirect } from "next/navigation"
import type { AttendanceSearchParams } from "@/features/attendance/teacher-attendance"

export default async function TeacherAttendancePage({ searchParams }: { searchParams: Promise<AttendanceSearchParams> }) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) value.forEach(item => params.append(key, item))
    else if (value !== undefined) params.set(key, value)
  }
  redirect(`/teacher/attendance/daily${params.size ? `?${params}` : ""}`)
}
