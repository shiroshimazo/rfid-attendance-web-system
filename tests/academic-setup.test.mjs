import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

/** A thenable PostgREST stand-in: records each query and answers through `respond`. */
function fakeSupabase(respond) {
  const calls = []
  const from = (table) => {
    const query = { table, operation: "select", filters: [], payload: undefined, options: undefined, range: undefined, single: false }
    const builder = {
      select(_columns, options) { query.options = options; return builder },
      insert(payload) { query.operation = "insert"; query.payload = payload; return builder },
      update(payload) { query.operation = "update"; query.payload = payload; return builder },
      eq(column, value) { query.filters.push(["eq", column, value]); return builder },
      neq(column, value) { query.filters.push(["neq", column, value]); return builder },
      order() { return builder },
      range(start, end) { query.range = [start, end]; return builder },
      returns() { return builder },
      maybeSingle() { query.single = true; return builder },
      then(resolve, reject) {
        calls.push(query)
        return Promise.resolve().then(() => respond(query)).then(resolve, reject)
      },
    }
    return builder
  }
  return { client: { from }, calls }
}

function loadActions(respond, { denied = false } = {}) {
  const { client, calls } = fakeSupabase(respond)
  const revalidated = []
  const load = createSourceLoader({
    "@/services/audit/log": { auditActivity: async (_event, _entity, operation) => operation() },
    "next/cache": { revalidatePath: (path) => revalidated.push(path) },
    "@/features/auth/server": { requireRole: async (role) => {
      assert.equal(role, "admin")
      if (denied) throw Error("Access denied")
    } },
    "@/services/supabase/server": { createServerSupabaseClient: async () => client },
  })
  return { actions: load("src/features/academic/actions.ts"), calls, revalidated }
}

const unexpected = (query) => { throw new Error(`Unexpected ${query.operation} on ${query.table}`) }
const program = (code, status = "active") => ({ data: { id: 1, program_code: code, status }, error: null })

test("a duplicate subject code is reported on its field, not as a raw Postgres message", async () => {
  const { actions, calls } = loadActions((query) => {
    if (query.table === "programs") return program("BSIT")
    if (query.table === "courses" && query.operation === "insert") {
      return { data: null, error: { code: "23505", message: 'duplicate key value violates unique constraint "courses_program_code_unique_idx"' } }
    }
    return unexpected(query)
  })
  const result = await actions.createCourseAction({ programId: "1", courseCode: " ccs2207 ", courseName: "Networking", status: "active" })
  assert.equal(result.ok, false)
  assert.equal(result.fieldErrors.courseCode, "A subject with that code already exists in this program.")
  assert.doesNotMatch(result.message, /duplicate key/)
  assert.equal(calls.find((call) => call.operation === "insert").payload.course_code, "CCS2207")
})

test("archiving a program still in use is refused with counts before any write", async () => {
  const counts = { courses: 3, students: 41, academic_sections: 0, teacher_assignments: 0, subject_schedules: 0 }
  const { actions, calls } = loadActions((query) => {
    if (query.table === "programs" && query.single) return program("BSHM")
    if (query.options?.head) return { count: counts[query.table], error: null }
    return unexpected(query)
  })
  const result = await actions.setCatalogStatusAction({ kind: "program", id: 1, status: "archived" })
  assert.equal(result.ok, false)
  assert.equal(result.message, "3 subjects and 41 students still use this program. Archive or reassign them first.")
  assert(!calls.some((call) => call.operation === "update"))
  const filters = Object.fromEntries(calls.filter((call) => call.options?.head).map((call) => [call.table, call.filters]))
  assert.deepEqual(filters.students, [["eq", "program_id", 1], ["neq", "status", "archived"]])
  assert.deepEqual(filters.teacher_assignments, [["eq", "program_id", 1], ["eq", "status", "active"]])
})

test("an unused program archives with a single status update", async () => {
  const { actions, calls } = loadActions((query) => {
    if (query.table === "programs" && query.single) return program("BSHM")
    if (query.options?.head) return { count: 0, error: null }
    if (query.table === "programs" && query.operation === "update") return { data: null, error: null }
    return unexpected(query)
  })
  const result = await actions.setCatalogStatusAction({ kind: "program", id: 1, status: "archived" })
  assert.equal(result.ok, true)
  assert.equal(result.message, "BSHM was archived.")
  const writes = calls.filter((call) => call.operation !== "select")
  assert.deepEqual(writes.map((call) => [call.table, call.payload, call.filters]),
    [["programs", { status: "archived" }, [["eq", "id", 1]]]])
})

test("a subject cannot be restored while its program is archived", async () => {
  const { actions, calls } = loadActions((query) => {
    if (query.table === "courses" && query.single) return { data: { id: 5, course_code: "HM101", program_id: 1 }, error: null }
    if (query.table === "programs" && query.single) return program("BSHM", "archived")
    return unexpected(query)
  })
  const result = await actions.setCatalogStatusAction({ kind: "course", id: 5, status: "active" })
  assert.equal(result.ok, false)
  assert.equal(result.message, "Restore BSHM first.")
  assert(!calls.some((call) => call.operation !== "select"))
})

test("the BSIT pilot program can be neither archived, recoded, nor deactivated", async () => {
  const { actions, calls } = loadActions((query) => {
    if (query.table === "programs" && query.single) return program("BSIT")
    return unexpected(query)
  })
  const archived = await actions.setCatalogStatusAction({ kind: "program", id: 1, status: "archived" })
  assert.equal(archived.ok, false)
  assert.match(archived.message, /pilot program/)
  const base = { id: 1, programName: "BS Information Technology", department: "", status: "active" }
  const recoded = await actions.updateProgramAction({ ...base, programCode: "BSIT2" })
  assert(recoded.fieldErrors.programCode)
  const inactive = await actions.updateProgramAction({ ...base, programCode: "bsit", status: "inactive" })
  assert(inactive.fieldErrors.status)
  assert(!calls.some((call) => call.operation !== "select"))
})

test("editing a subject writes only its catalog row, never its program or attendance history", async () => {
  const { actions, calls, revalidated } = loadActions((query) => {
    if (query.table === "courses" && query.single) return { data: { id: 5, status: "active" }, error: null }
    if (query.table === "courses" && query.operation === "update") return { data: null, error: null }
    return unexpected(query)
  })
  const result = await actions.updateCourseAction({ id: 5, programId: "999", courseCode: "ccs2207", courseName: "Renamed subject", status: "active" })
  assert.equal(result.ok, true)
  const writes = calls.filter((call) => call.operation !== "select")
  assert.deepEqual(writes.map((call) => call.table), ["courses"])
  assert.deepEqual(writes[0].payload, { course_code: "CCS2207", course_name: "Renamed subject", status: "active" })
  assert.deepEqual(writes[0].filters, [["eq", "id", 5]])
  assert(revalidated.includes("/admin/academic"))
  assert(revalidated.includes("/admin/teachers"))
})

test("a new class grouping reuses the catalog's spelling and says when it is catalog only", async () => {
  const { actions, calls } = loadActions((query) => {
    if (query.table === "programs") return program("BSIT")
    if (query.table === "academic_sections" && query.range) {
      return { data: query.range[0] === 0 ? [{ year_level: "2nd Year", campus: "Main Campus" }] : [], error: null }
    }
    if (query.table === "academic_sections" && query.operation === "insert") return { data: null, error: null }
    return unexpected(query)
  })
  const result = await actions.createSectionAction({ programId: "1", yearLevel: " 2nd   year ", sectionCode: "21011", campus: "main campus" })
  assert.equal(result.ok, true)
  assert.deepEqual(calls.find((call) => call.operation === "insert").payload,
    { program_id: 1, year_level: "2nd Year", section_code: "21011", campus: "Main Campus" })
  assert.match(result.message, /cannot be assigned during the pilot/)
})

test("every catalog action checks the administrator role before touching the database", async () => {
  const { actions, calls } = loadActions(unexpected, { denied: true })
  for (const run of [
    () => actions.createProgramAction({ programCode: "BSHM", programName: "Hospitality", department: "", status: "active" }),
    () => actions.updateCourseAction({ id: 1, courseCode: "HM1", courseName: "Intro", status: "active" }),
    () => actions.createSectionAction({ programId: "1", yearLevel: "1st Year", sectionCode: "HM-1", campus: "Main Campus" }),
    () => actions.updateSectionAction({ id: 1, status: "inactive" }),
    () => actions.setCatalogStatusAction({ kind: "section", id: 1, status: "archived" }),
  ]) await assert.rejects(run(), /Access denied/)
  assert.equal(calls.length, 0)
})

const model = createSourceLoader({ "@/services/academic/directory": {} })
const { buildAcademicCatalog } = model("src/features/academic/catalog.ts")
const schema = model("src/features/academic/schema.ts")

test("catalog usage ignores archived history and flags what the pilot cannot assign", () => {
  const placement = { year_level: "2nd Year", section: "21001", campus: "Main Campus" }
  const result = buildAcademicCatalog({
    programs: [
      { id: 1, program_code: "BSIT", program_name: "BS Information Technology", department: null, status: "active" },
      { id: 2, program_code: "BSHM", program_name: "BS Hospitality Management", department: null, status: "active" },
    ],
    courses: [
      { id: 10, program_id: 1, course_code: "CCS2207", course_name: "Quantitative Methods", status: "active" },
      { id: 11, program_id: 1, course_code: "OLD1", course_name: "Retired", status: "archived" },
      { id: 12, program_id: 2, course_code: "HM101", course_name: "Introduction", status: "active" },
    ],
    sections: [
      { id: 20, program_id: 1, year_level: "2nd Year", section_code: "21001", campus: "Main Campus", status: "active" },
      { id: 21, program_id: 1, year_level: "2nd Year", section_code: "21011", campus: "Main Campus", status: "active" },
    ],
    students: [{ program_id: 1, ...placement, status: "active" }, { program_id: 1, ...placement, status: "archived" }],
    assignments: [{ program_id: 1, course_id: 10, ...placement, status: "active" }],
    schedules: [{ program_id: 1, course_id: 10, ...placement, status: "archived" }],
  })

  assert.deepEqual(result.programs.find((row) => row.code === "BSIT").usage,
    { courses: 1, students: 1, sections: 2, assignments: 1, schedules: 0 })
  // Subjects sort by program code, then subject code.
  assert.deepEqual(result.courses.map((row) => [row.code, row.isPilot, row.assignments, row.schedules]),
    [["HM101", false, 0, 0], ["CCS2207", true, 1, 0], ["OLD1", true, 0, 0]])
  assert.deepEqual(result.sections.map((row) => [row.sectionCode, row.assignable, row.students]),
    [["21001", true, 1], ["21011", false, 0]])
  assert.deepEqual(result.kpis, { activePrograms: 2, archivedPrograms: 0, activeCourses: 2, pilotCourses: 1,
    activeSections: 2, assignableSections: 1, catalogOnly: 3 })
})

test("pickers offer catalog groupings, disable catalog-only ones, and keep saved values", () => {
  const groupings = schema.toClassGroupingOptions([
    { program_id: 1, year_level: "2nd Year", section_code: "21001", campus: "Main Campus", status: "active" },
    { program_id: 1, year_level: "2nd Year", section_code: "21001", campus: "MV Campus", status: "archived" },
    { program_id: 1, year_level: "2nd Year", section_code: "21011", campus: "Main Campus", status: "active" },
  ], [{ id: 1, program_code: "BSIT" }])
  const scope = { programId: 1, yearLevel: "2nd Year" }

  assert.deepEqual(schema.sectionPickerOptions(groupings, { ...scope, current: "" }), [
    { value: "21001", label: "21001 — Morning", disabled: false },
    { value: "21011", label: "21011 — Catalog only", disabled: true },
  ])
  assert.deepEqual(
    schema.campusPickerOptions(groupings, { ...scope, section: "21001", current: "MV Campus" }).map((option) => option.label),
    ["Main Campus", "MV Campus — No longer offered"]
  )
  assert.equal(schema.isOfferedCampus(groupings, { ...scope, section: "21011" }, "Main Campus"), false)
  assert.deepEqual(schema.sectionPickerOptions(groupings, { programId: null, yearLevel: "2nd Year", current: "" }), [])
})

test("usage sentences name what still depends on an entry", () => {
  assert.equal(
    schema.usageSentence(schema.programUsageParts({ courses: 3, students: 41, sections: 0, assignments: 0, schedules: 0 }), "this program"),
    "3 subjects and 41 students still use this program."
  )
  assert.equal(schema.usageSentence([[1, "student", "students"]], "this grouping"), "1 student still uses this grouping.")
  assert.equal(schema.usageSentence([[0, "student", "students"]], "this grouping"), "")
  assert.equal(schema.parseAcademicTab("Subjects"), "subjects")
  assert.equal(schema.parseAcademicTab(["nope"]), "programs")
})
