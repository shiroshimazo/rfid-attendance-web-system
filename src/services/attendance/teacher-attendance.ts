import type {
  AttendanceStatus,
  RfidCardStatus,
} from "@/services/attendance/dashboard"
import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"

export type { AttendanceStatus, RfidCardStatus }

export interface TeacherAttendanceAssignmentRow {
  program_id: number
  year_level: string | null
  section: string | null
  campus: string | null
  status: string
}

export interface TeacherAttendanceProgramRef {
  program_code: string
  program_name: string
}

export interface TeacherAttendanceStudentRow {
  id: number
  student_id: string
  full_name: string
  year_level: string
  section: string
  campus: string
  program_id: number
  program: TeacherAttendanceProgramRef | null
}

export interface TeacherAttendanceRecordRow {
  student_id: number
  attendance_date: string
  time_in: string
  time_out: string | null
  attendance_status: AttendanceStatus
}

export interface TeacherAttendanceCardRow {
  student_id: number
  card_status: RfidCardStatus
}

export interface TeacherAttendanceProgramRow {
  id: number
  program_code: string
  program_name: string
  department: string | null
}

export interface TeacherAttendanceSnapshot {
  /** The yyyy-MM-dd date the attendance rows were read for. */
  date: string
  /** Active students matching at least one active assignment. */
  students: TeacherAttendanceStudentRow[]
  /** Records for `date`, scoped to assigned students only. */
  attendance: TeacherAttendanceRecordRow[]
  /** Cards scoped to assigned students only. */
  cards: TeacherAttendanceCardRow[]
  /** Programs backing the teacher's active assignments. */
  programs: TeacherAttendanceProgramRow[]
}

export interface TeacherAttendanceSnapshotInput {
  /** Auth user id; resolved to `teachers.id` via `teachers.user_id`. */
  authUserId: string
  /** The `yyyy-MM-dd` date to read attendance records for. */
  date: string
}

const studentColumns =
  "id, student_id, full_name, year_level, section, campus, program_id, program:programs(program_code, program_name)"

/**
 * A null assignment field is a wildcard, mirroring
 * `teacher_can_access_student`: the student matches when every non-null
 * assignment field equals the student's own placement.
 */
function assignmentMatchesStudent(
  assignment: TeacherAttendanceAssignmentRow,
  student: TeacherAttendanceStudentRow
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
 * for one date. Row Level Security already restricts every table below to
 * rows the teacher may see, so no service-role key is involved. Students are
 * additionally filtered in memory against the teacher's active assignments,
 * so a student outside the assignment set can never leak into the panel.
 */
export async function fetchTeacherAttendanceSnapshot({
  authUserId,
  date,
}: TeacherAttendanceSnapshotInput): Promise<TeacherAttendanceSnapshot> {
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

  const assignments = await fetchAllRows<TeacherAttendanceAssignmentRow>(
    (from, to) =>
      supabase
        .from("teacher_assignments")
        .select("program_id, year_level, section, campus, status")
        .eq("teacher_id", teacher.id)
        .eq("status", "active")
        .range(from, to)
        .returns<TeacherAttendanceAssignmentRow[]>()
  )

  if (assignments.length === 0) {
    return { date, students: [], attendance: [], cards: [], programs: [] }
  }

  const programIds = [...new Set(assignments.map((a) => a.program_id))]

  const [students, attendance, cards, programs] = await Promise.all([
    fetchAllRows<TeacherAttendanceStudentRow>((from, to) =>
      supabase
        .from("students")
        .select(studentColumns)
        .eq("status", "active")
        .order("full_name", { ascending: true })
        .range(from, to)
        .returns<TeacherAttendanceStudentRow[]>()
    ),
    fetchAllRows<TeacherAttendanceRecordRow>((from, to) =>
      supabase
        .from("attendance_records")
        .select(
          "student_id, attendance_date, time_in, time_out, attendance_status"
        )
        .eq("attendance_date", date)
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<TeacherAttendanceRecordRow[]>()
    ),
    fetchAllRows<TeacherAttendanceCardRow>((from, to) =>
      supabase
        .from("rfid_cards")
        .select("student_id, card_status")
        .order("student_id", { ascending: true })
        .range(from, to)
        .returns<TeacherAttendanceCardRow[]>()
    ),
    fetchAllRows<TeacherAttendanceProgramRow>((from, to) =>
      supabase
        .from("programs")
        .select("id, program_code, program_name, department")
        .eq("status", "active")
        .in("id", programIds)
        .order("program_code", { ascending: true })
        .range(from, to)
        .returns<TeacherAttendanceProgramRow[]>()
    ),
  ])

  const assigned = students.filter((student) =>
    assignments.some((assignment) =>
      assignmentMatchesStudent(assignment, student)
    )
  )
  const assignedIds = new Set(assigned.map((student) => student.id))

  return {
    date,
    students: assigned,
    attendance: attendance.filter((record) =>
      assignedIds.has(record.student_id)
    ),
    cards: cards.filter((card) => assignedIds.has(card.student_id)),
    programs,
  }
}
