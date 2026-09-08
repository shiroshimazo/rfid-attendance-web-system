import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderDocumentWithLayout } from "@formepdf/core"
import { findElements } from "@formepdf/core/layout"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function setup({ forbidden = false, error = null } = {}) {
  const calls = [], paths = []
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { calls.push(["role", role]); if (forbidden) throw new Error("Forbidden") } },
    "@/services/supabase/server": { createServerSupabaseClient: async () => ({ rpc: async (name, input) => { calls.push([name, input]); return { error } } }) },
    "next/cache": { revalidatePath: path => paths.push(path) },
  })
  return { actions: load("src/features/subject-attendance/actions.ts"), load, calls, paths }
}
const confirmation = { scheduleId: 1, studentId: 2, date: "2026-09-08", status: "Present", expectedConfirmedAt: null }
test("teacher confirmation sends only decision/session/version fields, without a fabricated tap or caller-supplied identity", async () => {
  const { actions, calls, paths } = setup()
  const result = await actions.confirmSubjectAction({ ...confirmation, timeIn: "00:00", teacherId: 99, rfidCardId: 99 })
  assert.equal(result.ok, true)
  assert.deepEqual(calls, [["role", "teacher"], ["confirm_subject_attendance", {
    p_schedule_id: 1, p_student_id: 2, p_date: "2026-09-08", p_status: "Present", p_expected_confirmed_at: null,
  }]])
  for (const path of ["/admin/reports", "/teacher/reports", "/student/dashboard", "/student/my-attendance"]) assert(paths.includes(path))
})
test("invalid dates, IDs and retired statuses fail before database writes", async () => {
  for (const invalid of [{ date: "2026-02-30" }, { status: "Excused" }, { studentId: 0 }, { status: "Pending" }]) {
    const { actions, calls } = setup()
    assert.equal((await actions.confirmSubjectAction({ ...confirmation, ...invalid })).ok, false)
    assert.equal(calls.length, 1)
  }
})
test("confirmation database failure is surfaced and never claims success", async () => {
  const { actions, paths } = setup({ error: { message: "Attendance changed; refresh" } })
  assert.deepEqual(await actions.confirmSubjectAction(confirmation), { ok: false, message: "Attendance changed; refresh" })
  assert.deepEqual(paths, [])
})

test("occupied schedule returns a clear conflict message without successful-save refresh", async () => {
  const { actions, paths } = setup({ error: { code: "23P01", message: "exclusion violation" } })
  const result = await actions.createSubjectScheduleAction({ assignmentId: 1, day: 5, start: "10:30", end: "12:30" })
  assert.equal(result.ok, false)
  assert.match(result.message, /time is occupied.*section and campus/)
  assert.deepEqual(paths, [])
})
test("every subject mutation authorizes before RPC or validation", async () => {
  for (const name of ["confirmSubjectAction", "createSubjectScheduleAction", "retireSubjectScheduleAction", "editSubjectScheduleAction"]) {
    const { actions, calls } = setup({ forbidden: true })
    await assert.rejects(actions[name]({}), /Forbidden/)
    assert.equal(calls.length, 1)
  }
})
test("subject schedule writes use existing assignment and reject reversed times", async () => {
  const { actions, calls } = setup()
  assert.equal((await actions.createSubjectScheduleAction({ assignmentId: 1, day: 2, start: "09:00", end: "08:00" })).ok, false)
  assert.equal(calls.length, 1)
  assert.equal((await actions.createSubjectScheduleAction({ assignmentId: 1, day: 2, start: "08:00", end: "09:00" })).ok, true)
  assert.deepEqual(calls.at(-1), ["create_subject_schedule", { p_assignment_id: 1, p_day: 2, p_start: "08:00", p_end: "09:00" }])
})
test("shared subject totals and PDF preserve separate subject results without increasing daily RFID totals", async () => {
  const { load } = setup()
  const { subjectTotals } = load("src/features/subject-attendance/model.ts")
  const subjects = ["Present", "Absent", "Late"].map((status, index) => ({
    id: index + 1, schedule_id: index + 1, student_id: 1, attendance_date: "2026-09-08",
    attendance_status: status, time_start: "08:00", time_end: "09:00", student_number: "CARDLESS",
    student_name: "Cardless Student", teacher_name: `Teacher ${index}`, course_code: `SUBJECT-${index}`,
    course_name: `Subject ${index}`, program_code: "BSIT", year_level: "2nd Year", section: "21001",
    campus: "Main Campus", confirmed_at: "2026-09-08T00:00:00Z",
  }))
  assert.deepEqual(subjectTotals(subjects), { present: 1, late: 1, absent: 1, confirmed: 3, rate: 2 / 3 * 100 })
  assert.deepEqual(subjectTotals([]), { present: 0, late: 0, absent: 0, confirmed: 0, rate: null })
  const data = load("src/features/reports/panel.ts").buildReportsData({ students: [], attendance: [], programs: [], rfidCards: [], sms: [] }, { fromDate: "2026-09-08", toDate: "2026-09-08", generatedAt: new Date("2026-09-08T00:00:00Z") })
  data.subjectAttendance = subjects
  assert.equal(data.kpis.rfidScans, 0)
  const { ReportPdfDocument } = load("src/features/reports/pdf-document.tsx")
  const result = await renderDocumentWithLayout(createElement(ReportPdfDocument, { role: "admin", data }))
  assert.deepEqual(result.warnings, [])
  const text = findElements(result.layout, node => node.nodeType === "TextLine").map(node => node.textContent).join(" ")
  assert.match(text, /Rate: 66.7%/)
  assert.match(text, /Late: 1/); assert.match(text, /SUBJECT-2/); assert.match(text, /SUBJECT-0/); assert.match(text, /SUBJECT-1/)
  assert.match(text, /Daily RFID Evidence/)
  assert.match(text, /empty RFID time-in\/time-out/)
})
