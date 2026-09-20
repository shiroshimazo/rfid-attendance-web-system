import { requireRole } from "@/features/auth/server"
import { fetchSubjectSchedules } from "@/services/attendance/subject-attendance"

export async function getTeacherSchedule() {
  await requireRole("teacher")
  // The session client and subject_schedules RLS restrict rows to this teacher.
  const schedules = await fetchSubjectSchedules()
  return schedules.filter(row => row.status === "active").sort((a, b) =>
    ((a.day_of_week + 6) % 7) - ((b.day_of_week + 6) % 7) ||
    a.time_start.localeCompare(b.time_start) || a.id - b.id
  )
}
