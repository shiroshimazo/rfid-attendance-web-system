import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const today = "2026-11-05", past = "2026-11-04"
const students = ["Main Campus", "MV Campus", "Bulacan Campus", "MV Campus"].map((campus, index) => ({ id: index + 1, student_id: `S-${index + 1}`, full_name: `Student ${index + 1}`, campus, program_id: 1, program: { program_code: "IT", program_name: "Computing" }, year_level: "1st Year", section: "A" }))
const query = { date: today, status: "all", programId: null, yearLevel: null, section: null, search: [] }
const records = [{ student_id: 1, attendance_date: today, attendance_status: "Late", time_in: "07:00:00", time_out: "15:00:00" }, { student_id: 2, attendance_date: today, attendance_status: "Present", time_in: "07:00:00", time_out: null }]
const calendar = { today, effectiveDays: [{ entry_id: 1, attendance_date: today, campus: "Main Campus", attendance_impact: "no_classes" }, { entry_id: 2, attendance_date: today, campus: "Bulacan Campus", attendance_impact: "online_manual" }], marks: [{ student_id: 1, attendance_date: past, campus: "Old Campus", status: "OnlineManual", calendar_entry_id: 3 }] }
const load = createSourceLoader({ "@/features/auth/server": {}, "@/services/attendance/panel": {}, "@/services/attendance/teacher-attendance": {}, "@/services/attendance/student-attendance": {} })
const admin = load("src/features/attendance/panel.ts").buildAttendancePanelData
const teacher = load("src/features/attendance/teacher-attendance.ts").buildTeacherAttendancePanelData
const student = load("src/features/attendance/student-attendance.ts").buildStudentAttendanceData
const snapshot = { students, attendance: records, cards: [], programs: [], placements: [], query, date: today }
const builds = [["admin", (q = query, state = calendar, date = q.date) => admin({ ...snapshot, query: q }, date, state)], ["teacher", (q = query, state = calendar, date = q.date) => teacher({ ...snapshot, date }, q, state)]]

test("calendar filters stay display-only and preserve current write/status contracts", () => {
  const schema = load("src/features/attendance/schema.ts")
  assert.deepEqual(schema.attendanceStatuses, ["Present", "Late", "Absent"])
  assert.deepEqual(schema.attendanceRowStatuses, ["Present", "Late", "Absent", "NoRecord"])
  for (const status of ["NoClasses", "OnlineManual"]) assert.equal(schema.parseAttendancePanelQuery({ status }).status, status)
  assert.equal(schema.attendanceStatusLabel("NoClasses"), "No classes")
  assert.equal(schema.attendanceStatusLabel("OnlineManual"), "Online / manual")
})

for (const [role, build] of builds) {
  test(`${role}: rows, exception filters, eligible counts and retained times agree`, () => {
    const data = build()
    assert.deepEqual(data.rows.map(row => row.status), ["NoClasses", "Present", "OnlineManual", "NoRecord"])
    assert.equal(data.kpis.present, 1); assert.equal(data.kpis.late, 0); assert.equal(data.kpis.absent, 0); assert.equal(data.kpis.noRecord, 1)
    assert.equal(data.kpis.noClasses, 1); assert.equal(data.kpis.onlineManual, 1); assert.equal(data.kpis.expectedStudents, 2)
    assert.equal(data.rows[0].timeIn, "07:00:00"); assert.equal(data.rows[0].timeOut, "15:00:00")
    for (const [status, id] of [["NoClasses", 1], ["Attended", 2], ["OnlineManual", 3], ["NoRecord", 4]]) {
      const filtered = build({ ...query, status })
      assert.deepEqual(filtered.rows.map(row => row.id), [id]); assert.deepEqual(filtered.kpis, data.kpis)
    }
    const historical = build({ ...query, date: past }, calendar, past)
    assert.equal(historical.rows[0].status, "OnlineManual"); assert.equal(historical.rows[0].campus, "Old Campus")
    assert.equal(historical.rows[2].status, "NoRecord")
  })
}

test("teacher cohort filters apply before exception counts and status filtering", () => {
  const data = teacher(snapshot, { ...query, search: ["Student 3"], status: "OnlineManual" }, calendar)
  assert.equal(data.kpis.totalAssigned, 1); assert.equal(data.kpis.onlineManual, 1); assert.equal(data.kpis.expectedStudents, 0)
  assert.deepEqual(data.rows.map(row => row.id), [3])
})

test("student history merges calendar-only days without fabricating tap/card/SMS evidence or changing stored records", () => {
  const identity = { id: 1, campus: "Main Campus" }
  const retained = { id: 10, attendance_date: past, attendance_status: "Present", campus: "Tap Campus", time_in: "07:00:00", time_out: "15:00:00", rfid_card_id: 4 }
  const input = { student: identity, records: [retained], cards: [{ id: 4, rfid_number: "UID", card_status: "Active" }], sms: [{ attendance_id: 10, sms_status: "Sent", sent_at: "2026-11-04T00:00:00Z" }] }
  const original = structuredClone(input)
  const data = student(input, today, { ...calendar, marks: [...calendar.marks, { student_id: 999, attendance_date: "2026-11-03", status: "NoClasses", campus: "Other", calendar_entry_id: 9 }] })
  const old = data.rows.find(row => row.date === past), current = data.rows.find(row => row.date === today)
  assert.equal(old.status, "OnlineManual"); assert.equal(old.campus, "Old Campus"); assert.equal(old.tapCampus, "Tap Campus")
  assert.equal(old.recordedStatus, "Present"); assert.equal(old.rfidNumber, "UID"); assert.equal(old.smsStatus, "Sent")
  assert.equal(current.hasTap, false); assert.equal(typeof current.id, "string"); assert.equal(current.timeIn, null); assert.equal(current.rfidNumber, null); assert.equal(current.smsStatus, null)
  assert.equal(data.rows.length, 2); assert.equal(data.kpis.totalPresent, 0); assert.equal(data.kpis.attendanceRate, null)
  assert.equal(data.kpis.noClasses, 1); assert.equal(data.kpis.onlineManual, 1)
  assert.deepEqual(input, original)
  const cancelled = student(input, today, { ...calendar, effectiveDays: [] })
  assert.equal(cancelled.rows.length, 1); assert.equal(cancelled.rows[0].status, "OnlineManual")
})

test("daily/history getters read calendar state with the requested dates and propagate failures instead of normalizing them", async () => {
  let failed = false
  const ranges = []
  const server = createSourceLoader({
    "@/features/auth/server": { requireRole: async () => ({ id: "user" }) },
    "@/services/calendar/attendance-state": { fetchCalendarAttendanceState: async (...args) => { ranges.push(args); if (failed) throw Error("Calendar unavailable"); return calendar } },
    "@/services/attendance/panel": { fetchAttendancePanelSnapshot: async () => snapshot },
    "@/services/attendance/teacher-attendance": { fetchTeacherAttendanceSnapshot: async () => snapshot },
    "@/services/attendance/student-attendance": { fetchStudentAttendanceSnapshot: async () => ({ student: students[0], records: [], cards: [], sms: [] }) },
  })
  const now = new Date("2026-11-04T16:00:00Z")
  for (const [file, method] of [["panel", "getAttendancePanelData"], ["teacher-attendance", "getTeacherAttendancePanelData"], ["student-attendance", "getStudentAttendanceData"]]) {
    const get = server(`src/features/attendance/${file}.ts`)[method]
    const invoke = () => file === "student-attendance" ? get(now) : get(query, now)
    failed = false; await invoke()
    assert.equal(ranges.at(-1)[0], file === "student-attendance" ? "0001-01-01" : today)
    assert.equal(ranges.at(-1)[1], today); assert.equal(ranges.at(-1)[2], now)
    failed = true; await assert.rejects(invoke, /Calendar unavailable/)
  }
})

test("daily tables remain read-only and calendar-only detail shows guidance without a card assignment", () => {
  for (const [role, build] of builds) {
    const Table = load(`src/app/(portal)/${role}/attendance/components/attendance-table.tsx`).AttendanceTable
    const html = renderToStaticMarkup(React.createElement(Table, { rows: build().rows, readableDate: today, hasStudents: true }))
    assert.match(html, /No classes/); assert.match(html, /Online \/ manual/); assert.match(html, /Main Campus/)
    assert.doesNotMatch(html, /Edit attendance|Save attendance|Confirm attendance/)
  }
  const data = student({ student: students[0], records: [], cards: [], sms: [] }, today, calendar)
  const Dialog = load("src/app/(portal)/student/my-attendance/components/attendance-detail-dialog.tsx").AttendanceDetailDialog
  // The portal-rendered dialog is exercised interactively in the mocked browser harness.
  assert.equal(Dialog({ record: data.rows[0], onOpenChange() {} }).props.open, true)
})
