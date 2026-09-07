import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const date = "2026-09-03"
const student = { id: 1, student_id: "S-1", full_name: "Assigned", program_id: 1, year_level: "2nd Year", section: "21001", campus: "Main", status: "active" }
function harness(account = { id: "teacher-user", role: "teacher", status: "active" }, fail = false) {
  const calls = []
  const tables = {
    teachers: [{ id: 4, user_id: "teacher-user" }],
    teacher_assignments: [{ id: 1, teacher_id: 4, program_id: 1, year_level: "2nd Year", section: "21001", campus: "Main", status: "active" }],
    students: [student, { ...student, id: 2, full_name: "Outside campus", campus: "Other" }, { ...student, id: 3, full_name: "Archived", status: "archived" }],
    programs: [{ id: 1, program_code: "BSIT" }],
    attendance_records: [1, 2, 3].map(id => ({ id, student_id: id, rfid_card_id: id, attendance_date: date, time_in: "06:00:00", time_out: null, attendance_status: "Present", campus: id === 2 ? "Other" : "Main" })),
    rfid_cards: [1, 2, 3].map(id => ({ id, student_id: id, card_status: "Active", rfid_number: `0000000${id}` })),
    sms_notifications: [1, 2, 3].map(id => ({ id, student_id: id, attendance_id: id, created_at: "2026-09-09T00:00:00Z", sms_status: "Pending", message: "PRIVATE", parent_contact_number: "09123456789", "attendance_records.attendance_date": date })),
  }
  const supabase = { from(table) {
    const call = { table, filters: [], order: [], from: 0, to: Infinity }
    calls.push(call)
    const query = {
      select(value) { call.select = value; return this },
      eq(key, value) { call.filters.push(row => row[key] === value); return this },
      in(key, values) { call.filters.push(row => values.includes(row[key])); return this },
      gte(key, value) { call.filters.push(row => row[key] >= value); return this },
      lte(key, value) { call.filters.push(row => row[key] <= value); return this },
      order(key) { call.order.push(key); return this },
      range(from, to) { call.from = from; call.to = to; return this },
      returns() { return this },
      maybeSingle() { call.single = true; return this },
      then(resolve) {
        const rows = tables[table].filter(row => call.filters.every(fn => fn(row)))
        // A two-row server limit forces real paging, even for a short response.
        return Promise.resolve({ data: call.single ? rows[0] ?? null : rows.slice(call.from, Math.min(call.to + 1, call.from + 2)), error: fail ? { message: "injected read failure" } : null }).then(resolve)
      },
    }
    return query
  } }
  const load = createSourceLoader({
    "@/features/auth/server": {
      getCurrentAccount: async () => account,
      requireRole: async role => { assert.equal(role, account.role); assert.equal(account.status, "active"); return account },
    },
    "@/services/supabase/server": { createServerSupabaseClient: async () => supabase },
  })
  return { load, calls, tables }
}

test("teacher snapshot uses active assignments, stable paging, and never reads SMS", async () => {
  const { load, calls } = harness()
  const data = await load("src/services/reports/teacher-snapshot.ts").fetchTeacherReportsSnapshot({ authUserId: "teacher-user", fromDate: date, toDate: date })
  assert.deepEqual(data.students.map(row => row.id), [1])
  assert.deepEqual(data.attendance.map(row => row.id), [1])
  assert.deepEqual(data.rfidCards.map(row => row.id), [1])
  assert(!calls.some(call => call.table === "sms_notifications"))
  assert(calls.filter(call => !call.single).every(call => call.order.includes("id")))
})

test("teacher with no assignments gets an empty snapshot", async () => {
  const { load, tables, calls } = harness()
  tables.teacher_assignments = []
  const data = await load("src/services/reports/teacher-snapshot.ts").fetchTeacherReportsSnapshot({ authUserId: "teacher-user", fromDate: date, toDate: date })
  assert.equal(data.attendance.length, 0)
  assert(!calls.some(call => call.table === "attendance_records"))
})

test("admin snapshot retains archived history and date-filters SMS by linked attendance, including retries", async () => {
  const { load, calls } = harness({ id: "admin", role: "admin", status: "active" })
  const data = await load("src/features/reports/panel.ts").getAdminReportsData({ from: date, to: date })
  assert.equal(data.attendanceLogs.length, 3)
  assert.equal(data.smsLogs.length, 3)
  assert.equal(data.kpis.totalStudents, 2)
  assert(calls.every(call => call.order.includes("id")))
})

for (const [label, account, status] of [
  ["anonymous", null, 401],
  ["student", { role: "student", status: "active" }, 403],
  ["disabled admin", { role: "admin", status: "inactive" }, 403],
  ["archived teacher", { role: "teacher", status: "archived" }, 403],
]) {
  test(`PDF route denies ${label} before report reads`, async () => {
    const { load, calls } = harness(account)
    const response = await load("src/app/api/reports/pdf/route.ts").GET(new Request(`http://localhost/api/reports/pdf?from=${date}&to=${date}&role=admin`))
    assert.equal(response.status, status)
    assert.equal(calls.length, 0)
    assert.match(response.headers.get("cache-control"), /no-store/)
  })
}

test("PDF route validates dates before report reads", async () => {
  const { load, calls } = harness()
  const response = await load("src/app/api/reports/pdf/route.ts").GET(new Request("http://localhost/api/reports/pdf?from=bad&to=bad"))
  assert.equal(response.status, 400)
  assert.equal(calls.length, 0)
})

test("teacher PDF download ignores a forged admin role parameter", async () => {
  const { load, calls } = harness()
  const response = await load("src/app/api/reports/pdf/route.ts").GET(new Request(`http://localhost/api/reports/pdf?from=${date}&to=${date}&role=admin`))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("content-type"), "application/pdf")
  assert.match(response.headers.get("content-disposition"), /rfid-teacher-report/)
  assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0, 5).toString(), "%PDF-")
  assert(!calls.some(call => call.table === "sms_notifications"))
})

test("failed reads produce an error response, never a partial PDF", async () => {
  const { load } = harness({ id: "admin", role: "admin", status: "active" }, true)
  const response = await load("src/app/api/reports/pdf/route.ts").GET(new Request(`http://localhost/api/reports/pdf?from=${date}&to=${date}`))
  assert.equal(response.status, 500)
  assert.match(response.headers.get("content-type"), /json/)
})

test("student histories page all personal attendance, cards, and SMS under the same owner", async () => {
  const { load, calls, tables } = harness()
  tables.students = [{ ...student, user_id: "student-user" }]
  for (let id = 4; id <= 8; id++) {
    tables.attendance_records.push({ ...tables.attendance_records[0], id })
    tables.sms_notifications.push({ ...tables.sms_notifications[0], id, attendance_id: id })
  }
  const data = await load("src/services/attendance/student-attendance.ts").fetchStudentAttendanceSnapshot({ authUserId: "student-user" })
  assert.deepEqual(data.records.map(row => row.id), [1, 4, 5, 6, 7, 8])
  assert.deepEqual(data.sms.map(row => row.attendance_id), [1, 4, 5, 6, 7, 8])
  assert(calls.filter(call => !call.single).every(call => call.order.includes("id")))
})
