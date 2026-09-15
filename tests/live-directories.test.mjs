import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader({
  "@/services/students/directory": {},
  "@/services/teachers/directory": {},
  "@/services/schedules/directory": {},
})
const { buildStudentDirectory } = load("src/features/students/directory.ts")
const { buildTeacherDirectory } = load("src/features/teachers/directory.ts")
const { buildScheduleDirectory, parseSchedulePanelQuery } = load("src/features/schedules/directory.ts")

for (const kind of ["students", "teachers"]) {
  test(`${kind}: archives are excluded from live rows and filter choices, restoration returns them`, () => {
    const records = ["active", "inactive", "archived"].map((status, id) => ({
      id, status, full_name: status, section: status, year_level: "2nd Year", campus: status, department: status,
    }))
    const snapshot = { [kind]: records, programs: [], cards: [], courses: [], assignments: [] }
    const build = kind === "students" ? buildStudentDirectory : buildTeacherDirectory
    const result = build(snapshot)
    assert.deepEqual(result[kind].map(row => row.status), ["active", "inactive"])
    assert(!result[kind === "students" ? "sections" : "departments"].includes("archived"))
    assert.equal(snapshot[kind][2].status, "archived", "projection must not alter retained records")
    records[2].status = "active"
    assert.equal(build(snapshot)[kind].length, 3)
  })
}

test("class schedules exclude archived weekdays and fully archived sections from live rows and counts", () => {
  const row = { program_id: 1, year_level: "2nd Year", campus: null, time_start: "06:00:00", grace_minutes: 15, updated_at: "2026-09-15T00:00:00Z" }
  const snapshot = { programs: [], schedules: [
    { ...row, id: 1, section: "21001", day_of_week: 1, status: "active" },
    { ...row, id: 2, section: "21001", day_of_week: 2, status: "archived" },
    { ...row, id: 3, section: "21002", day_of_week: 1, status: "archived" },
    { ...row, id: 4, section: "21003", day_of_week: 1, status: "inactive" },
  ] }
  const query = parseSchedulePanelQuery({})
  const result = buildScheduleDirectory(snapshot, query)
  assert.deepEqual(result.schedules.map(row => row.section), ["21001", "21003"])
  assert.deepEqual(result.schedules[0].days, [1])
  assert.equal(result.totalSections, 2)
  assert.equal(result.kpis.sectionsScheduled, 2)
  assert(result.unscheduledSections.includes("21002"))
  snapshot.schedules[2].status = "active"
  assert.equal(buildScheduleDirectory(snapshot, query).totalSections, 3)
})
