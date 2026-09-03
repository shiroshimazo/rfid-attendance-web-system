import {
  fetchTeacherDirectorySnapshot,
  type AccountStatus,
  type TeacherDirectorySnapshot,
} from "@/services/teachers/directory"

export type { AccountStatus }

export interface AssignmentView {
  id: number
  programId: number
  programCode: string
  programName: string
  courseId: number
  courseCode: string
  courseName: string
  yearLevel: string | null
  section: string | null
  campus: string | null
  status: AccountStatus
}

export interface TeacherView {
  id: number
  userId: string
  teacherId: string
  fullName: string
  profilePicture: string | null
  gender: string | null
  dateOfBirth: string | null
  civilStatus: string | null
  email: string
  phoneNumber: string | null
  department: string
  dateHired: string | null
  status: AccountStatus
  createdAt: string
  assignments: AssignmentView[]
}

export interface ProgramOption {
  id: number
  code: string
  name: string
  department: string | null
}

export interface CourseOption {
  id: number
  programId: number
  code: string
  name: string
}

export interface TeacherDirectory {
  teachers: TeacherView[]
  programs: ProgramOption[]
  courses: CourseOption[]
  /** Distinct department values already in use, for the filter and datalist. */
  departments: string[]
}

/** Pure projection so the view model can be reasoned about without a database. */
export function buildTeacherDirectory(
  snapshot: TeacherDirectorySnapshot
): TeacherDirectory {
  const programsById = new Map(
    snapshot.programs.map((program) => [program.id, program])
  )
  const coursesById = new Map(
    snapshot.courses.map((course) => [course.id, course])
  )

  const assignmentsByTeacher = new Map<number, AssignmentView[]>()

  for (const assignment of snapshot.assignments) {
    const program = programsById.get(assignment.program_id)
    const course = coursesById.get(assignment.course_id)

    // Skip rows whose catalog entry the caller is not allowed to read.
    if (!program || !course) continue

    const view: AssignmentView = {
      id: assignment.id,
      programId: program.id,
      programCode: program.program_code,
      programName: program.program_name,
      courseId: course.id,
      courseCode: course.course_code,
      courseName: course.course_name,
      yearLevel: assignment.year_level,
      section: assignment.section,
      campus: assignment.campus,
      status: assignment.status,
    }

    assignmentsByTeacher.set(assignment.teacher_id, [
      ...(assignmentsByTeacher.get(assignment.teacher_id) ?? []),
      view,
    ])
  }

  const teachers: TeacherView[] = snapshot.teachers.map((teacher) => ({
    id: teacher.id,
    userId: teacher.user_id,
    teacherId: teacher.teacher_id,
    fullName: teacher.full_name,
    profilePicture: teacher.profile_picture,
    gender: teacher.gender,
    dateOfBirth: teacher.date_of_birth,
    civilStatus: teacher.civil_status,
    email: teacher.email,
    phoneNumber: teacher.phone_number,
    department: teacher.department,
    dateHired: teacher.date_hired,
    status: teacher.status,
    createdAt: teacher.created_at,
    assignments: assignmentsByTeacher.get(teacher.id) ?? [],
  }))

  const departments = [
    ...new Set(teachers.map((teacher) => teacher.department).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  return {
    teachers,
    programs: snapshot.programs
      .filter((program) => program.status === "active")
      .map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
    courses: snapshot.courses.map((course) => ({
      id: course.id,
      programId: course.program_id,
      code: course.course_code,
      name: course.course_name,
    })),
    departments,
  }
}

/** Server-side entry point used by the Manage Teachers route. */
export async function getTeacherDirectory(): Promise<TeacherDirectory> {
  return buildTeacherDirectory(await fetchTeacherDirectorySnapshot())
}
