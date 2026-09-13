import { DataErrorCard } from "@/components/data-error-card"
import { requireCurrentAccount, requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
import { fetchSubjectAttendance, fetchSubjectAssignments, fetchSubjectEnrollments, fetchSubjectRfidEvidence, fetchSubjectSchedules, fetchSubjectStudents } from "@/services/attendance/subject-attendance"
import { SubjectRecords } from "@/features/subject-attendance/records"
import { StudentSubjectHistory } from "@/features/subject-attendance/student-history"
import { TeacherSubjectConsole } from "@/features/subject-attendance/teacher-console"
import { SubjectSchedulesEditor } from "@/features/subject-attendance/schedules-editor"
import { SubjectEnrollmentEditor } from "@/features/subject-attendance/enrollment-editor"

function errorPanel(error: unknown) {
  return <DataErrorCard title="Subject attendance could not be loaded" message={error instanceof Error ? error.message : "Apply the P05 subject-attendance migration, then refresh."} />
}

export async function SubjectHistoryPanel({ from, to, summaryOnly = false }: { from?: string; to?: string; summaryOnly?: boolean }) {
  const account = await requireCurrentAccount()
  let rows
  try { rows = await fetchSubjectAttendance({ from, to }) }
  catch (error) { return errorPanel(error) }
  if (account.role === "student" && !summaryOnly) return <StudentSubjectHistory rows={rows} />
  return <SubjectRecords rows={rows} summaryOnly={summaryOnly} />
}

export async function TeacherSubjectPanel({ date }: { date: string }) {
  await requireRole("teacher")
  let data
  try {
    data = await Promise.all([fetchSubjectSchedules(), fetchSubjectStudents(), fetchSubjectAttendance({ from: date, to: date }), fetchSubjectEnrollments()])
  } catch (error) { return errorPanel(error) }
  const [schedules, students, records, enrollments] = data
  // RFID failure must not prevent a teacher from marking the class roster.
  let evidence
  try { evidence = await fetchSubjectRfidEvidence(date) } catch { evidence = null }
  return <TeacherSubjectConsole schedules={schedules} students={students} records={records} enrollments={enrollments} evidence={evidence} date={date} today={schoolDateKey(new Date())} />
}

export async function AdminSubjectSchedulesPanel() {
  await requireRole("admin")
  let data
  try {
    data = await Promise.all([fetchSubjectAssignments(), fetchSubjectSchedules(), fetchSubjectStudents(), fetchSubjectEnrollments()])
  } catch (error) { return errorPanel(error) }
  const [assignments, schedules, students, enrollments] = data
  return <><SubjectSchedulesEditor assignments={assignments} schedules={schedules} />
    <SubjectEnrollmentEditor schedules={schedules} students={students} enrollments={enrollments} /></>
}
