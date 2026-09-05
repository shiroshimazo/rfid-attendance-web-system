import { recordStatus, type AttendanceRowStatus } from "@/features/attendance/schema"
import { requireRole } from "@/features/auth/server"
import { schoolDateKey } from "@/lib/school-time"
import type { ProgramOption } from "@/features/teachers/directory"
import {
  fetchTeacherStudentsSnapshot,
  type AttendanceStatus,
  type TeacherStudentsSnapshot,
} from "@/services/students/teacher-directory"

export type {
  AttendanceRowStatus,
  AttendanceStatus,
  ProgramOption,
  TeacherStudentsSnapshot,
}

export interface TeacherStudentRow {
  id: number
  studentId: string
  fullName: string
  profilePicture: string | null
  programId: number
  programCode: string
  programName: string
  yearLevel: string
  section: string
  campus: string
  /** Today's tap state; NoRecord means the student has not tapped in yet. */
  status: AttendanceRowStatus
  timeIn: string | null
  timeOut: string | null
}

export interface TeacherStudentsOptions {
  programs: ProgramOption[]
  yearLevels: string[]
  sections: string[]
}

export interface TeacherStudentsData {
  /** The yyyy-MM-dd date the statuses were read for. */
  date: string
  students: TeacherStudentRow[]
  options: TeacherStudentsOptions
  hasStudents: boolean
}

function distinctSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true })
  )
}

/** Pure projection, so the shape can be reasoned about without a database. */
export function buildTeacherStudentsData(
  snapshot: TeacherStudentsSnapshot
): TeacherStudentsData {
  const { students, attendance, programs } = snapshot

  const recordsByStudent = new Map(
    attendance
      .filter((record) => record.attendance_date === snapshot.date)
      .map((record) => [record.student_id, record])
  )

  return {
    date: snapshot.date,
    students: students.map((student) => {
      const record = recordsByStudent.get(student.id)

      return {
        id: student.id,
        studentId: student.student_id,
        fullName: student.full_name,
        profilePicture: student.profile_picture,
        programId: student.program_id,
        programCode: student.program?.program_code ?? "—",
        programName: student.program?.program_name ?? "Unknown program",
        yearLevel: student.year_level,
        section: student.section,
        campus: student.campus,
        status: record ? recordStatus(record.attendance_status) : "NoRecord",
        timeIn: record?.time_in ?? null,
        timeOut: record?.time_out ?? null,
      }
    }),
    options: {
      programs: programs.map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
      yearLevels: distinctSorted(
        students.map((student) => student.year_level)
      ),
      sections: distinctSorted(students.map((student) => student.section)),
    },
    hasStudents: students.length > 0,
  }
}

/** Server-side entry point used by the teacher students route. */
export async function getTeacherStudentsData(
  now: Date = new Date()
): Promise<TeacherStudentsData> {
  const account = await requireRole("teacher")
  const snapshot = await fetchTeacherStudentsSnapshot({
    authUserId: account.id,
    date: schoolDateKey(now),
  })

  return buildTeacherStudentsData(snapshot)
}
