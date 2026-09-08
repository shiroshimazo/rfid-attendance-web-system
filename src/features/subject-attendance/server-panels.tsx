import { DataErrorCard } from "@/components/data-error-card"
import { requireCurrentAccount, requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
import { fetchSubjectAttendance, fetchSubjectAssignments, fetchSubjectSchedules, fetchSubjectStudents } from "@/services/attendance/subject-attendance"
import { SubjectRecords } from "@/features/subject-attendance/records"
import { TeacherSubjectConsole } from "@/features/subject-attendance/teacher-console"
import { SubjectSchedulesEditor } from "@/features/subject-attendance/schedules-editor"

function errorPanel(error: unknown) {
  return <DataErrorCard title="Subject attendance could not be loaded" message={error instanceof Error ? error.message : "Apply the P05 subject-attendance migration, then refresh."} />
}

export async function SubjectHistoryPanel({ from, to, summaryOnly = false }: { from?: string; to?: string; summaryOnly?: boolean }) {
  await requireCurrentAccount()
  let rows
  try { rows = await fetchSubjectAttendance({ from, to }) }
  catch (error) { return errorPanel(error) }
  return <SubjectRecords rows={rows} summaryOnly={summaryOnly} />
}

export async function TeacherSubjectPanel({ date }: { date: string }) {
  await requireRole("teacher")
  let data
  try {
    data = await Promise.all([fetchSubjectSchedules(), fetchSubjectStudents(), fetchSubjectAttendance({ from: date, to: date })])
  } catch (error) { return errorPanel(error) }
  const [schedules, students, records] = data
  return <TeacherSubjectConsole schedules={schedules} students={students} records={records} date={date} today={schoolDateKey(new Date())} />
}

export async function AdminSubjectSchedulesPanel() {
  await requireRole("admin")
  let data
  try {
    data = await Promise.all([fetchSubjectAssignments(), fetchSubjectSchedules()])
  } catch (error) { return errorPanel(error) }
  const [assignments, schedules] = data
  return <SubjectSchedulesEditor assignments={assignments} schedules={schedules} />
}
