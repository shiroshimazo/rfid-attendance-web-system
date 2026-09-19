import {
  isAssignableGrouping,
  isPilotProgramCode,
  type AcademicCatalog,
  type CourseView,
  type ProgramView,
  type SectionView,
} from "@/features/academic/schema"
import {
  fetchAcademicCatalogSnapshot,
  type AcademicCatalogSnapshot,
} from "@/services/academic/directory"

export type { AcademicCatalogSnapshot }

const collator = new Intl.Collator(undefined, { numeric: true })

function tally<T>(rows: readonly T[], keyOf: (row: T) => string | null) {
  const counts = new Map<string, number>()

  for (const row of rows) {
    const key = keyOf(row)
    if (key !== null) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return counts
}

/** Mirrors the unique index: exact year level and campus, case-insensitive section. */
function groupingKey(
  programId: number,
  yearLevel: string | null,
  section: string | null,
  campus: string | null
) {
  if (!yearLevel || !section || !campus) return null

  return [programId, yearLevel, section.toUpperCase(), campus].join("|")
}

function distinctSorted(values: readonly string[]) {
  return [...new Set(values)].sort(collator.compare)
}

/** Pure projection so the view model can be reasoned about without a database. */
export function buildAcademicCatalog(
  snapshot: AcademicCatalogSnapshot
): AcademicCatalog {
  const programsById = new Map(
    snapshot.programs.map((program) => [program.id, program])
  )

  // Archived rows are history, not placements, so they never count as "in use".
  const students = snapshot.students.filter((row) => row.status !== "archived")
  const assignments = snapshot.assignments.filter((row) => row.status === "active")
  const schedules = snapshot.schedules.filter((row) => row.status === "active")
  const liveCourses = snapshot.courses.filter((row) => row.status !== "archived")
  const liveSections = snapshot.sections.filter((row) => row.status !== "archived")

  const byProgram = (rows: readonly { program_id: number }[]) =>
    tally(rows, (row) => String(row.program_id))
  const coursesByProgram = byProgram(liveCourses)
  const studentsByProgram = byProgram(students)
  const sectionsByProgram = byProgram(liveSections)
  const assignmentsByProgram = byProgram(assignments)
  const schedulesByProgram = byProgram(schedules)
  const assignmentsByCourse = tally(assignments, (row) => String(row.course_id))
  const schedulesByCourse = tally(schedules, (row) => String(row.course_id))
  const studentsByGrouping = tally(students, (row) =>
    groupingKey(row.program_id, row.year_level, row.section, row.campus)
  )
  const assignmentsByGrouping = tally(assignments, (row) =>
    groupingKey(row.program_id, row.year_level, row.section, row.campus)
  )

  const programs: ProgramView[] = snapshot.programs
    .map((program) => {
      const key = String(program.id)

      return {
        id: program.id,
        code: program.program_code,
        name: program.program_name,
        department: program.department,
        status: program.status,
        isPilot: isPilotProgramCode(program.program_code),
        usage: {
          courses: coursesByProgram.get(key) ?? 0,
          students: studentsByProgram.get(key) ?? 0,
          sections: sectionsByProgram.get(key) ?? 0,
          assignments: assignmentsByProgram.get(key) ?? 0,
          schedules: schedulesByProgram.get(key) ?? 0,
        },
      }
    })
    .sort((a, b) => collator.compare(a.code, b.code))

  const courses: CourseView[] = snapshot.courses
    .map((course) => {
      const program = programsById.get(course.program_id)

      return {
        id: course.id,
        programId: course.program_id,
        programCode: program?.program_code ?? "—",
        programName: program?.program_name ?? "Unknown program",
        programStatus: program?.status ?? "archived",
        isPilot: isPilotProgramCode(program?.program_code ?? ""),
        code: course.course_code,
        name: course.course_name,
        status: course.status,
        assignments: assignmentsByCourse.get(String(course.id)) ?? 0,
        schedules: schedulesByCourse.get(String(course.id)) ?? 0,
      }
    })
    .sort(
      (a, b) =>
        collator.compare(a.programCode, b.programCode) ||
        collator.compare(a.code, b.code)
    )

  const sections: SectionView[] = snapshot.sections
    .map((section) => {
      const program = programsById.get(section.program_id)
      const key = groupingKey(
        section.program_id,
        section.year_level,
        section.section_code,
        section.campus
      )

      return {
        id: section.id,
        programId: section.program_id,
        programCode: program?.program_code ?? "—",
        programStatus: program?.status ?? "archived",
        yearLevel: section.year_level,
        sectionCode: section.section_code,
        campus: section.campus,
        status: section.status,
        assignable: section.status === "active" && program?.status === "active" && isAssignableGrouping({
          programCode: program?.program_code ?? "",
          yearLevel: section.year_level,
          sectionCode: section.section_code,
          campus: section.campus,
        }),
        students: key ? (studentsByGrouping.get(key) ?? 0) : 0,
        assignments: key ? (assignmentsByGrouping.get(key) ?? 0) : 0,
      }
    })
    .sort(
      (a, b) =>
        collator.compare(a.programCode, b.programCode) ||
        collator.compare(a.yearLevel, b.yearLevel) ||
        collator.compare(a.sectionCode, b.sectionCode) ||
        collator.compare(a.campus, b.campus)
    )

  const activePrograms = programs.filter((row) => row.status === "active")
  const activeCourses = courses.filter((row) => row.status === "active")
  const activeSections = sections.filter((row) => row.status === "active")

  return {
    programs,
    courses,
    sections,
    kpis: {
      activePrograms: activePrograms.length,
      archivedPrograms: programs.filter((row) => row.status === "archived").length,
      activeCourses: activeCourses.length,
      assignableCourses: activeCourses.filter((row) => row.programStatus === "active").length,
      activeSections: activeSections.length,
      assignableSections: activeSections.filter((row) => row.assignable).length,
      unavailableEntries: activeCourses.filter((row) => row.programStatus !== "active").length + activeSections.filter((row) => !row.assignable).length,
    },
    yearLevels: distinctSorted(snapshot.sections.map((row) => row.year_level)),
    campuses: distinctSorted(snapshot.sections.map((row) => row.campus)),
  }
}

/** Server-side entry point used by the Academic Setup route. */
export async function getAcademicCatalog(): Promise<AcademicCatalog> {
  return buildAcademicCatalog(await fetchAcademicCatalogSnapshot())
}
