import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const common = { id: 1, fullName: "Example Person", gender: "", dateOfBirth: "", email: "new@example.test",
  profilePicture: "", status: "active", password: "Test-password-123", confirmPassword: "Test-password-123" }
const inputs = {
  teacher: { ...common, teacherId: "T01", civilStatus: "", phoneNumber: "", department: "IT", dateHired: "",
    assignments: [{ programId: 1, courseId: 2, yearLevel: "2nd Year", section: "21001", campus: "Main Campus" }] },
  student: { ...common, studentId: "S01", placeOfBirth: "", address: "", contactNumber: "", parentName: "Guardian",
    parentContactNumber: "+639171234567", programId: 1, yearLevel: "2nd Year", section: "21001", campus: "Main Campus" },
}

function fixture(kind) {
  const calls = []
  const state = { program: "BSIT", courseProgram: 1, existingEmail: "old@example.test", rpcError: null,
    emailError: null, emailThrows: false, configThrows: false, profileFound: false, profileReadError: null,
    cleanupError: null, denied: false }
  const supabase = {
    from: table => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => {
          calls.push(["read", table])
          if (table === "programs") return { data: { id: 1, program_code: state.program }, error: null }
          assert.equal(table, `${kind}s`)
          if (calls.some(call => call[0] === "createAuth")) return {
            data: state.profileFound ? { id: 1 } : null, error: state.profileReadError,
          }
          return { data: { id: 1, user_id: "target-user", email: state.existingEmail }, error: null }
        } }),
        in: async () => ({ data: [{ id: 2, program_id: state.courseProgram }], error: null }),
      }),
    }),
    rpc: async (name, payload) => { calls.push(["rpc", name, payload]); return { data: 1, error: state.rpcError } },
  }
  const admin = { from: table => {
    calls.push(["adminRead", table])
    return supabase.from(table)
  }, auth: { admin: {
    createUser: async payload => { calls.push(["createAuth", payload]); return { data: { user: { id: "target-user" } }, error: null } },
    updateUserById: async (id, payload) => {
      calls.push(["updateAuth", id, payload])
      if (state.emailThrows) throw Error("Network failed after request")
      return { data: { user: state.emailError ? null : { email: payload.email } }, error: state.emailError }
    },
    deleteUser: async id => { calls.push(["deleteAuth", id]); return { error: state.cleanupError } },
  } } }
  const load = createSourceLoader({
    "next/cache": { revalidatePath: path => calls.push(["revalidate", path]) },
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); if (state.denied) throw Error("Access denied") } },
    "@/services/supabase/server": { createServerSupabaseClient: async () => supabase },
    "@/services/supabase/admin": { createAdminSupabaseClient: () => { if (state.configThrows) throw Error("Missing config"); return admin } },
  })
  const actions = load(`src/features/${kind}s/actions.ts`)
  const title = kind[0].toUpperCase() + kind.slice(1)
  return { state, calls, load, create: actions[`create${title}Action`], update: actions[`update${title}Action`] }
}

for (const kind of ["teacher", "student"]) {
  test(`${kind}: non-BSIT catalog ID rejected before any Auth creation or write`, async () => {
    const f = fixture(kind)
    f.state.program = "BSHM"
    for (const action of [f.create, f.update]) {
      const result = await action(inputs[kind])
      assert.equal(result.ok, false)
      assert.match(result.message, /BSIT/)
    }
    assert(!f.calls.some(call => ["rpc", "createAuth", "updateAuth"].includes(call[0])))
  })

  test(`${kind}: RPC failure leaves login email untouched`, async () => {
    const f = fixture(kind)
    f.state.rpcError = { code: "23514", message: "Rejected write" }
    assert.equal((await f.update(inputs[kind])).ok, false)
    assert.equal(f.calls.filter(call => call[0] === "rpc").length, 1)
    assert(!f.calls.some(call => call[0] === "updateAuth"))
  })

  test(`${kind}: successful update uses one RPC before the Auth email change`, async () => {
    const f = fixture(kind)
    assert.equal((await f.update(inputs[kind])).ok, true)
    const writes = f.calls.filter(call => ["rpc", "updateAuth"].includes(call[0]))
    assert.deepEqual(writes.map(call => call[0]), ["rpc", "updateAuth"])
    assert.equal(writes[0][1], `save_${kind}_profile`)
    assert.equal(writes[0][2].p_id, 1)
    assert.deepEqual(writes[1][2], { email: "new@example.test", email_confirm: true })
  })

  test(`${kind}: rejected Auth email reports saved details and refreshes the directory`, async () => {
    const f = fixture(kind)
    f.state.emailError = { code: "email_exists", message: "Email already exists" }
    const result = await f.update(inputs[kind])
    assert.equal(result.ok, false)
    assert.match(result.message, /details were saved.*email could not be changed/)
    assert(result.fieldErrors.email)
    assert(f.calls.some(call => call[0] === "revalidate"))
  })

  test(`${kind}: ambiguous Auth response does not claim the email stayed unchanged`, async () => {
    const f = fixture(kind)
    f.state.emailThrows = true
    const result = await f.update(inputs[kind])
    assert.equal(result.ok, false)
    assert.match(result.message, /could not be confirmed.*Reload/)
    assert(f.calls.some(call => call[0] === "revalidate"))
  })

  test(`${kind}: missing email-change configuration fails before profile writes`, async () => {
    const f = fixture(kind)
    f.state.configThrows = true
    assert.equal((await f.update(inputs[kind])).ok, false)
    assert(!f.calls.some(call => call[0] === "rpc"))
  })

  test(`${kind}: unchanged email needs no service-role client`, async () => {
    const f = fixture(kind)
    f.state.existingEmail = inputs[kind].email
    f.state.configThrows = true
    assert.equal((await f.update(inputs[kind])).ok, true)
    assert(!f.calls.some(call => call[0] === "updateAuth"))
  })

  test(`${kind}: create uses the atomic RPC and no independent profile/assignment writes`, async () => {
    const f = fixture(kind)
    assert.equal((await f.create(inputs[kind])).ok, true)
    assert.deepEqual(f.calls.filter(call => ["createAuth", "rpc"].includes(call[0])).map(call => call[0]), ["createAuth", "rpc"])
  })

  test(`${kind}: failed create removes only an account with confirmed absent profile`, async () => {
    const f = fixture(kind)
    f.state.rpcError = { code: "23514", message: "Failed save" }
    assert.equal((await f.create(inputs[kind])).ok, false)
    assert(f.calls.some(call => call[0] === "adminRead"))
    assert.equal(f.calls.filter(call => call[0] === "deleteAuth").length, 1)
  })

  test(`${kind}: ambiguous create outcome retains committed or unreadable profiles`, async () => {
    for (const field of ["profileFound", "profileReadError"]) {
      const f = fixture(kind)
      f.state.rpcError = { code: "23514", message: "Rejected save" }
      f.state[field] = field === "profileFound" ? true : { message: "Connection error" }
      const result = await f.create(inputs[kind])
      assert.equal(result.ok, false)
      assert.match(result.message, /account was retained/)
      assert(!f.calls.some(call => call[0] === "deleteAuth"))
    }
  })

  test(`${kind}: failed orphan cleanup is reported`, async () => {
    const f = fixture(kind)
    f.state.rpcError = { code: "23514", message: "Failed save" }
    f.state.cleanupError = { message: "Delete failed" }
    assert.match((await f.create(inputs[kind])).message, /unused login account could not be removed/)
  })

  test(`${kind}: timeout retains the account even before a profile becomes visible`, async () => {
    const f = fixture(kind)
    f.state.rpcError = { message: "Request timed out", code: "" }
    assert.match((await f.create(inputs[kind])).message, /account was retained/)
    assert(!f.calls.some(call => ["deleteAuth", "adminRead"].includes(call[0])))
  })

  test(`${kind}: role check runs before any reads or writes`, async () => {
    const f = fixture(kind)
    f.state.denied = true
    await assert.rejects(f.update(inputs[kind]), /Access denied/)
    assert.equal(f.calls.length, 0)
  })
}

test("teacher requires explicit year, section and campus in both schemas", async () => {
  const f = fixture("teacher")
  const { assignmentFormSchema } = f.load("src/features/teachers/schema.ts")
  for (const field of ["yearLevel", "section", "campus"]) {
    const assignment = { ...inputs.teacher.assignments[0], [field]: "" }
    assert.equal((await f.create({ ...inputs.teacher, assignments: [assignment] })).ok, false)
    assert.equal(assignmentFormSchema.safeParse({ ...assignment, programId: "1", courseId: "2" }).success, false)
  }
  assert.equal(f.calls.length, 0)
})

test("teacher rejects a subject from another program before Auth account creation", async () => {
  const f = fixture("teacher")
  f.state.courseProgram = 999
  assert.match((await f.create(inputs.teacher)).message, /subject does not belong/)
  assert(!f.calls.some(call => call[0] === "createAuth"))
})

test("schedule validation rejects weekends, duplicate days and invalid campuses before requests", async () => {
  const f = fixture("student")
  const actions = f.load("src/features/schedules/actions.ts")
  const input = { programId: 1, yearLevel: "2nd Year", section: "21001", campus: null,
    timeStart: "06:00", graceMinutes: 15, status: "active", days: [1, 2, 3, 4, 5] }
  for (const days of [[0], [6], [], [1, 1]]) assert.equal((await actions.updateScheduleAction({ ...input, days })).ok, false)
  assert.equal((await actions.updateScheduleAction({ ...input, campus: "Other" })).ok, false)
  assert.equal(f.calls.length, 0)
  assert.equal((await actions.updateScheduleAction(input)).ok, true)
  assert.equal(f.calls.filter(call => call[0] === "rpc").length, 1)
  assert.equal(f.calls.find(call => call[0] === "rpc")[1], "save_schedule_week")
})

test("schedule status toggle also uses one serialized RPC", async () => {
  const f = fixture("student")
  const actions = f.load("src/features/schedules/actions.ts")
  assert.equal((await actions.setScheduleStatusAction({ programId: 1, yearLevel: "2nd Year", section: "21001", campus: null, status: "inactive" })).ok, true)
  assert.equal(f.calls.find(call => call[0] === "rpc")[1], "set_schedule_week_status")
})
