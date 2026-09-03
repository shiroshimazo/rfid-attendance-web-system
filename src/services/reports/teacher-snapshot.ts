import type {
  AttendanceStatus,
  RfidCardStatus,
} from "@/services/attendance/dashboard"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus, RfidCardStatus }

export interface TeacherReportsSnapshotRange {
  fromDate: string
  toDate: string
}

export interface TeacherReportAssignmentRow {
  program_id: number
  year_level: string | null
  section: string | null
  campus: string | null
  status: string
}

export interface TeacherReportStudentRow {
  id: number
  student_id: string
  full_name: string
  year_level: string
  section: string
  campus: string
  program_id: number
}

export interface TeacherReportAttendanceRow {
  id: number
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: AttendanceStatus
}

export interface TeacherReportProgramRow {
  id: number
  program_code: string
  program_name: string
}

export interface TeacherReportRfidCardRow {
  student_id: number
  card_status: RfidCardStatus
}

export interface TeacherReportsSnapshot {
  /** Active students matching at least one active assignment. */
  students: TeacherReportStudentRow[]
  /** Records in range, scoped to assigned students only. */
  attendance: TeacherReportAttendanceRow[]
  /** Programs backing the teacher's active assignments. */
  programs: TeacherReportProgramRow[]
  /** Cards scoped to assigned students only. */
  rfidCards: TeacherReportRfidCardRow[]
}

export interface TeacherReportsSnapshotInput
  extends TeacherReportsSnapshotRange {
  /** Auth user id; resolved to `teachers.id` via `teachers.user_id`. */
  authUserId: string
}

/**
 * A null assignment field is a wildcard, mirroring
 * `teacher_can_access_student`: the student matches when every non-null
 * assignment field equals the student's own placement.
 */
function assignmentMatchesStudent(
  assignment: TeacherReportAssignmentRow,
  student: TeacherReportStudentRow
) {
  return (
    assignment.program_id === student.program_id &&
    (assignment.year_level === null ||
      assignment.year_level === student.year_level) &&
    (assignment.section === null || assignment.section === student.section) &&
    (assignment.campus === null || assignment.campus === student.campus)
  )
}

/**
 * Reads only the signed-in teacher's assigned students and their attendance
 * for a date range. Row Level Security already restricts every table below
 * to rows the teacher may see, so no service-role key is involved. Students
 * and records are additionally filtered in memory against the teacher's
 * active assignments, so rows outside the assignment set can never leak
 * into the report.
 */
export async function fetchTeacherReportsSnapshot({
  authUserId,
  fromDate,
  toDate,
}: TeacherReportsSnapshotInput): Promise<TeacherReportsSnapshot> {
  const supabase = await createServerSupabaseClient()

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", authUserId)
    .maybeSingle<{ id: number }>()

  if (teacherError) throw new Error(teacherError.message)
  if (!teacher) {
    throw new Error(
      "No teacher record is linked to this account. Contact an administrator."
    )
  }

  const assignments = await fetchAllRows<TeacherReportAssignmentRow>(
    (from, to) =>
      supabase
        .from("teacher_assignments")
        .select("program_id, year_level, section, campus, status")
        .eq("teacher_id", teacher.id)
        .eq("status", "active")
        .range(from, to)
        .returns<TeacherReportAssignmentRow[]>()
  )

  if (assignments.length === 0) {
    return { students: [], attendance: [], programs: [], rfidCards: [] }
  }

  const programIds = [...new Set(assignments.map((a) => a.program_id))]

  const [students, attendance, programs, rfidCards] = await Promise.all([
    fetchAllRows<TeacherReportStudentRow>((from, to) =>
      supabase
        .from("students")
        .select(
          "id, student_id, full_name, year_level, section, campus, program_id"
        )
        .eq("status", "active")
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<TeacherReportStudentRow[]>()
    ),
    fetchAllRows<TeacherReportAttendanceRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "id, student_id, attendance_date, time_in, time_out, attendance_status"
        )
        .gte("attendance_date", fromDate)
        .lte("attendance_date", toDate)
        .order("attendance_date", { ascending: true })
        .order("time_in", { ascending: true })
        .range(from, to)
        .returns<TeacherReportAttendanceRow[]>()
    ),
    fetchAllRows<TeacherReportProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name")
        .in("id", programIds)
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<TeacherReportProgramRow[]>()
    ),
    fetchAllRows<TeacherReportRfidCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("student_id, card_status")
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<TeacherReportRfidCardRow[]>()
    ),
  ])

  const assigned = students.filter((student) =>
    assignments.some((assignment) =>
      assignmentMatchesStudent(assignment, student)
    )
  )
  const assignedIds = new Set(assigned.map((student) => student.id))

  return {
    students: assigned,
    attendance: attendance.filter((record) =>
      assignedIds.has(record.student_id)
    ),
    programs,
    rfidCards: rfidCards.filter((card) => assignedIds.has(card.student_id)),
  }
}
