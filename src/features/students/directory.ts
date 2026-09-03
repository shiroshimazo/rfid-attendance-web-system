import {
  fetchStudentDirectorySnapshot,
  type AccountStatus,
  type RfidCardStatus,
  type StudentDirectorySnapshot,
} from "@/services/students/directory"
import type { ProgramOption } from "@/features/teachers/directory"

export type { AccountStatus, ProgramOption, RfidCardStatus }

export interface StudentCardView {
  id: number
  rfidNumber: string
  cardStatus: RfidCardStatus
  assignedDate: string
}

export interface StudentView {
  id: number
  userId: string
  studentId: string
  fullName: string
  profilePicture: string | null
  gender: string | null
  dateOfBirth: string | null
  placeOfBirth: string | null
  address: string | null
  contactNumber: string | null
  email: string
  parentName: string
  parentContactNumber: string
  programId: number
  programCode: string
  programName: string
  yearLevel: string
  section: string
  campus: string
  status: AccountStatus
  createdAt: string
  /** The card the reader should accept, when one is active. */
  activeCard: StudentCardView | null
  /** Every card ever issued, newest first, for the assignment history. */
  cards: StudentCardView[]
}

export interface StudentDirectory {
  students: StudentView[]
  programs: ProgramOption[]
  yearLevels: string[]
  sections: string[]
  campuses: string[]
}

function toCardView(card: StudentDirectorySnapshot["cards"][number]): StudentCardView {
  return {
    id: card.id,
    rfidNumber: card.rfid_number,
    cardStatus: card.card_status,
    assignedDate: card.assigned_date,
  }
}

function distinctSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
}

/** Pure projection so the view model can be reasoned about without a database. */
export function buildStudentDirectory(
  snapshot: StudentDirectorySnapshot
): StudentDirectory {
  const programsById = new Map(
    snapshot.programs.map((program) => [program.id, program])
  )

  const cardsByStudent = new Map<number, StudentCardView[]>()

  for (const card of snapshot.cards) {
    cardsByStudent.set(card.student_id, [
      ...(cardsByStudent.get(card.student_id) ?? []),
      toCardView(card),
    ])
  }

  const students: StudentView[] = snapshot.students.map((student) => {
    const program = programsById.get(student.program_id)
    const cards = cardsByStudent.get(student.id) ?? []

    return {
      id: student.id,
      userId: student.user_id,
      studentId: student.student_id,
      fullName: student.full_name,
      profilePicture: student.profile_picture,
      gender: student.gender,
      dateOfBirth: student.date_of_birth,
      placeOfBirth: student.place_of_birth,
      address: student.address,
      contactNumber: student.contact_number,
      email: student.email,
      parentName: student.parent_name,
      parentContactNumber: student.parent_contact_number,
      programId: student.program_id,
      programCode: program?.program_code ?? "—",
      programName: program?.program_name ?? "Unknown program",
      yearLevel: student.year_level,
      section: student.section,
      campus: student.campus,
      status: student.status,
      createdAt: student.created_at,
      activeCard: cards.find((card) => card.cardStatus === "Active") ?? null,
      cards,
    }
  })

  return {
    students,
    programs: snapshot.programs
      .filter((program) => program.status === "active")
      .map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
    yearLevels: distinctSorted(students.map((student) => student.yearLevel)),
    sections: distinctSorted(students.map((student) => student.section)),
    campuses: distinctSorted(students.map((student) => student.campus)),
  }
}

/** Server-side entry point used by the Manage Students route. */
export async function getStudentDirectory(): Promise<StudentDirectory> {
  return buildStudentDirectory(await fetchStudentDirectorySnapshot())
}
