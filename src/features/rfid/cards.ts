import {
  fetchRfidCardDirectorySnapshot,
  type AccountStatus,
  type CardHolderRow,
  type RfidCardDirectorySnapshot,
  type RfidCardStatus,
} from "@/services/rfid/cards"
import type { ProgramOption } from "@/features/teachers/directory"

export type { AccountStatus, ProgramOption, RfidCardStatus }

export interface CardHolderView {
  id: number
  studentId: string
  fullName: string
  email: string
  programId: number
  programCode: string
  programName: string
  yearLevel: string
  section: string
  campus: string
  status: AccountStatus
}

export interface RfidCardView {
  id: number
  rfidNumber: string
  cardStatus: RfidCardStatus
  assignedDate: string
  createdAt: string
  updatedAt: string
  /** Null only if the holder row became invisible to the caller. */
  student: CardHolderView | null
}

export interface RfidCardDirectoryStats {
  total: number
  active: number
  lost: number
  /** Stored cards no student holds yet. */
  unassigned: number
  /** Active students who cannot tap in yet, so the gap is visible. */
  withoutActiveCard: number
}

export interface RfidCardDirectory {
  cards: RfidCardView[]
  programs: ProgramOption[]
  stats: RfidCardDirectoryStats
}

function toHolderView(
  student: CardHolderRow,
  programs: Map<number, RfidCardDirectorySnapshot["programs"][number]>
): CardHolderView {
  const program = programs.get(student.program_id)

  return {
    id: student.id,
    studentId: student.student_id,
    fullName: student.full_name,
    email: student.email,
    programId: student.program_id,
    programCode: program?.program_code ?? "—",
    programName: program?.program_name ?? "Unknown program",
    yearLevel: student.year_level,
    section: student.section,
    campus: student.campus,
    status: student.status,
  }
}

/** Pure projection so the view model can be reasoned about without a database. */
export function buildRfidCardDirectory(
  snapshot: RfidCardDirectorySnapshot
): RfidCardDirectory {
  const programsById = new Map(
    snapshot.programs.map((program) => [program.id, program])
  )

  const holdersById = new Map(
    snapshot.students.map((student) => [
      student.id,
      toHolderView(student, programsById),
    ])
  )

  const activeHolders = new Set(
    snapshot.cards
      .filter((card) => card.card_status === "Active" && card.student_id !== null)
      .map((card) => card.student_id)
  )

  const cards: RfidCardView[] = snapshot.cards.map((card) => ({
    id: card.id,
    rfidNumber: card.rfid_number,
    cardStatus: card.card_status,
    assignedDate: card.assigned_date,
    createdAt: card.created_at,
    updatedAt: card.updated_at,
    student:
      card.student_id === null
        ? null
        : (holdersById.get(card.student_id) ?? null),
  }))

  return {
    cards,
    programs: snapshot.programs
      .filter((program) => program.status === "active")
      .map((program) => ({
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
      })),
    stats: {
      total: cards.length,
      active: cards.filter((card) => card.cardStatus === "Active").length,
      lost: cards.filter((card) => card.cardStatus === "Lost").length,
      unassigned: snapshot.cards.filter((card) => card.student_id === null).length,
      withoutActiveCard: snapshot.students.filter(
        (student) => student.status === "active" && !activeHolders.has(student.id)
      ).length,
    },
  }
}

/** Server-side entry point used by the Manage RFID Cards route. */
export async function getRfidCardDirectory(): Promise<RfidCardDirectory> {
  return buildRfidCardDirectory(await fetchRfidCardDirectorySnapshot())
}
