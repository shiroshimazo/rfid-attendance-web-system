import {
  PILOT_PROGRAM_CODE,
  PILOT_SECTIONS,
  PILOT_YEAR_LEVEL,
} from "@/features/academic/pilot"
import {
  addMinutesToTime,
  isSchedulePanelFiltered,
  sessionOfTime,
  toTimeInput,
  type ScheduleDirectory,
  type SchedulePanelQuery,
  type ScheduleView,
} from "@/features/schedules/schema"
import {
  fetchScheduleDirectorySnapshot,
  type ClassScheduleRow,
  type ScheduleDirectorySnapshot,
} from "@/services/schedules/directory"

export * from "@/features/schedules/schema"
export type { ScheduleDirectorySnapshot }

const endTimeBySection = new Map(
  PILOT_SECTIONS.map((section) => [section.code, section.timeEnd])
)

function keyOf(row: ClassScheduleRow) {
  return [row.program_id, row.year_level, row.section, row.campus ?? ""].join(
    "|"
  )
}

function toView(
  rows: ClassScheduleRow[],
  programCode: string
): ScheduleView {
  // Retired days keep their row on purpose: a missing row means "never Late".
  const live = rows.filter((row) => row.status !== "archived")
  const reference = live[0] ?? rows[0]
  const timeStart = toTimeInput(reference.time_start)
  const graceMinutes = reference.grace_minutes

  return {
    key: keyOf(reference),
    programId: reference.program_id,
    programCode,
    yearLevel: reference.year_level,
    section: reference.section,
    campus: reference.campus,
    session: sessionOfTime(timeStart),
    days: live.map((row) => row.day_of_week).sort((a, b) => a - b),
    timeStart,
    timeEnd: endTimeBySection.get(reference.section) ?? null,
    graceMinutes,
    lateCutoff: addMinutesToTime(timeStart, graceMinutes),
    status: live.some((row) => row.status === "active") ? "active" : "inactive",
    hasVariance: live.some(
      (row) =>
        toTimeInput(row.time_start) !== timeStart ||
        row.grace_minutes !== graceMinutes
    ),
    updatedAt: rows
      .map((row) => row.updated_at)
      .sort()
      .slice(-1)[0],
  }
}

function matchesQuery(view: ScheduleView, query: SchedulePanelQuery) {
  const needle = query.search.toLowerCase()

  if (
    needle &&
    ![view.section, view.programCode, view.campus ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  ) {
    return false
  }

  if (query.session !== "all" && view.session !== query.session) return false
  if (query.day !== "all" && !view.days.includes(query.day)) return false

  return true
}

/** Pure projection so the view model can be reasoned about without a database. */
export function buildScheduleDirectory(
  snapshot: ScheduleDirectorySnapshot,
  query: SchedulePanelQuery
): ScheduleDirectory {
  const programsById = new Map(
    snapshot.programs.map((program) => [program.id, program])
  )

  const grouped = new Map<string, ClassScheduleRow[]>()

  for (const row of snapshot.schedules) {
    const key = keyOf(row)
    grouped.set(key, [...(grouped.get(key) ?? []), row])
  }

  const views = [...grouped.values()]
    .map((rows) =>
      toView(
        [...rows].sort((a, b) => a.day_of_week - b.day_of_week),
        programsById.get(rows[0].program_id)?.program_code ?? "—"
      )
    )
    .sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }))

  // KPIs describe the whole pilot scope, not the current filter.
  const scheduled = views.filter((view) => view.days.length > 0)
  const graceTotal = scheduled.reduce(
    (total, view) => total + view.graceMinutes,
    0
  )
  const scheduledSections = new Set(scheduled.map((view) => view.section))

  return {
    query,
    schedules: views.filter((view) => matchesQuery(view, query)),
    kpis: {
      sectionsScheduled: scheduledSections.size,
      morningSections: scheduled.filter((view) => view.session === "morning")
        .length,
      afternoonSections: scheduled.filter((view) => view.session === "afternoon")
        .length,
      averageGrace:
        scheduled.length > 0
          ? Math.round((graceTotal / scheduled.length) * 10) / 10
          : 0,
    },
    unscheduledSections: PILOT_SECTIONS.map((section) => section.code).filter(
      (code) => !scheduledSections.has(code)
    ),
    totalSections: views.length,
    isFiltered: isSchedulePanelFiltered(query),
  }
}

/** Server-side entry point used by the Schedules route. */
export async function getScheduleDirectory(
  query: SchedulePanelQuery
): Promise<ScheduleDirectory> {
  return buildScheduleDirectory(await fetchScheduleDirectorySnapshot(), query)
}

export { PILOT_PROGRAM_CODE, PILOT_YEAR_LEVEL }
