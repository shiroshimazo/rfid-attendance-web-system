/**
 * BSIT 2nd Year pilot academic scope (Late Attendance Ruling).
 * Single source of truth for every form, filter, and validation that must
 * stay inside the pilot: program locked to BSIT, year fixed to 2nd Year,
 * sections 21001-21010, three campuses, eight subjects.
 */

export const PILOT_PROGRAM_CODE = "BSIT" as const
export const PILOT_PROGRAM_NAME = "BS Information Technology" as const
export const PILOT_YEAR_LEVEL = "2nd Year" as const

export type PilotSession = "morning" | "afternoon"

export interface PilotSection {
  code: string
  session: PilotSession
  /** Class start, Philippines Time, matches class_schedules.time_start. */
  timeStart: string
  timeEnd: string
}

const MORNING_SECTIONS = ["21001", "21002", "21003", "21004", "21005"]
const AFTERNOON_SECTIONS = ["21006", "21007", "21008", "21009", "21010"]

export const PILOT_SECTIONS: readonly PilotSection[] = [
  ...MORNING_SECTIONS.map((code) => ({
    code,
    session: "morning" as const,
    timeStart: "06:00",
    timeEnd: "12:30",
  })),
  ...AFTERNOON_SECTIONS.map((code) => ({
    code,
    session: "afternoon" as const,
    timeStart: "13:00",
    timeEnd: "19:30",
  })),
]

export const PILOT_SECTION_CODES: readonly string[] = PILOT_SECTIONS.map(
  (section) => section.code
)

export const PILOT_CAMPUSES = [
  "Main Campus",
  "MV Campus",
  "Bulacan Campus",
] as const

export type PilotCampus = (typeof PILOT_CAMPUSES)[number]

/** Canonical course codes of the eight pilot subjects. */
export const PILOT_COURSE_CODES = [
  "CCS2207",
  "CCS1204",
  "CCS1201",
  "CCS2105",
  "CCS2107",
  "ITE1",
  "SOSLIT",
  "PE3",
] as const

export function isPilotSection(value: string): boolean {
  return (PILOT_SECTION_CODES as readonly string[]).includes(value)
}

export function isPilotCampus(value: string): value is PilotCampus {
  return (PILOT_CAMPUSES as readonly string[]).includes(value)
}
