import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { renderDocumentWithLayout } from "@formepdf/core"
import { findElements } from "@formepdf/core/layout"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const today = "2026-11-05", past = "2026-11-04"
const students = [ ["Main Campus", "archived"], ["MV Campus", "active"], ["Bulacan Campus", "active"], ["Main Campus", "archived"], ["Main Campus", "active"] ].map(([campus, status], index) => ({ id: index + 1, student_id: `S-${index + 1}`, full_name: `Student ${index + 1}`, campus, status, program_id: 1, year_level: "1st Year", section: "A" }))
const record = (id, student_id, attendance_date, attendance_status, campus = "Tap Campus") => ({ id, student_id, attendance_date, attendance_status, campus, time_in: "07:00:00", time_out: "15:00:00", rfid_card_id: 1 })
const snapshot = { students, programs: [{ id: 1, program_code: "IT" }], attendance: [record(1, 1, past, "Present"), record(2, 2, past, "Absent"), record(3, 5, past, "Present"), record(4, 2, today, "Late"), record(5, 3, today, "Present")], rfidCards: [{ id: 1, student_id: 1, rfid_number: "UID", card_status: "Lost" }], sms: [{ id: 1, attendance_id: 1, student_id: 1, parent_contact_number: "PRIVATE", message: "PRIVATE SMS", sms_status: "Sent", sent_at: `${today}T00:00:00Z`, created_at: `${today}T00:00:00Z` }] }
const calendar = { today, effectiveDays: [{ entry_id: 1, attendance_date: today, campus: "Main Campus", attendance_impact: "no_classes" }, { entry_id: 2, attendance_date: today, campus: "Bulacan Campus", attendance_impact: "online_manual" }, { entry_id: 99, attendance_date: past, campus: "Main Campus", attendance_impact: "no_classes" }], marks: [{ student_id: 1, attendance_date: past, status: "NoClasses", campus: "Old Campus", calendar_entry_id: 10 }, { student_id: 2, attendance_date: past, status: "OnlineManual", campus: "MV Campus", calendar_entry_id: 11 }, { student_id: 4, attendance_date: past, status: "NoClasses", campus: "Archived Without Tap", calendar_entry_id: 12 }] }
const options = { fromDate: past, toDate: today, generatedAt: new Date(`${today}T00:00:00Z`), calendar }
const load = createSourceLoader({ "@/features/auth/server": {}, "@/services/reports/snapshot": {}, "@/services/reports/teacher-snapshot": {} })
const { buildReportsData } = load("src/features/reports/panel.ts")
const { buildTeacherReportsData } = load("src/features/reports/teacher-panel.ts")

test("report exclusions retain historical campuses, archived students without taps, raw scans and all SMS evidence", () => {
  const original = structuredClone(snapshot)
  const data = buildReportsData(snapshot, options)
  assert.equal(data.kpis.totalPresent, 2); assert.equal(data.kpis.totalAbsent, 0); assert.equal(data.kpis.attendanceRate, 100)
  assert.equal(data.kpis.noClasses, 3); assert.equal(data.kpis.onlineManual, 2); assert.equal(data.kpis.rfidScans, 10)
  assert.ok(data.calendarExceptions.some(row => row.campus === "Archived Without Tap" && row.students === 1))
  assert.equal(data.attendanceLogs.length, 5); assert.equal(data.smsLogs[0].message, "PRIVATE SMS")
  const old = data.attendanceLogs.find(row => row.id === 1)
  assert.equal(old.status, "NoClasses"); assert.equal(old.recordedStatus, "Present"); assert.equal(old.campus, "Tap Campus"); assert.equal(old.calendarCampus, "Old Campus"); assert.equal(old.rfidNumber, "UID")
  assert.equal(data.attendanceLogs.find(row => row.id === 3).status, "Present") // No mark: never backfill an historical exception from the current roster.
  assert.equal(data.bySection.find(row => row.campus === "Old Campus").rate, null)
  assert.equal(data.summary[0].present, 1); assert.equal(data.summary[1].present, 1)
  const { CalendarExceptions } = load("src/features/reports/calendar-exceptions.tsx")
  const html = renderToStaticMarkup(React.createElement(CalendarExceptions, { rows: data.calendarExceptions }))
  assert.match(html, /No classes: 3 student-days/); assert.match(html, /Online \/ manual: 2 student-days/)
  assert.deepEqual(snapshot, original)
})

test("teacher shares exclusion calculations but excludes outside-scope students and SMS", () => {
  const teacher = buildTeacherReportsData({ ...snapshot, students: [students[1]], attendance: snapshot.attendance }, options)
  assert.equal(teacher.kpis.onlineManual, 1); assert.equal(teacher.kpis.noClasses, 0)
  assert.equal(teacher.kpis.totalPresent, 1); assert.equal(teacher.kpis.attendanceRate, 100)
  assert.equal(teacher.calendarExceptions.length, 1); assert.equal(teacher.calendarExceptions[0].campus, "MV Campus")
  assert.equal(teacher.attendanceLogs.length, 2); assert.equal("smsLogs" in teacher, false); assert.equal(JSON.stringify(teacher).includes("PRIVATE"), false)
})

test("all-exception reports have null rates and preserve cancelled historical snapshots without current-roster backfill", () => {
  const historicalOnly = { ...calendar, effectiveDays: [] }
  const data = buildReportsData({ ...snapshot, students: [students[0], students[1], students[3]], attendance: snapshot.attendance.slice(0, 2) }, { ...options, toDate: past, calendar: historicalOnly })
  assert.equal(data.kpis.attendanceRate, null); assert.equal(data.kpis.totalAbsent, 0); assert.equal(data.kpis.noClasses, 2)
  assert.ok(data.byProgram.every(row => row.rate === null)); assert.equal(data.summary[0].rate, null)
  assert.equal(data.kpis.rfidScans, 4)
})

test("report sync validates and authorizes before mutation, uses SQL argument names, and never continues after sync failure", async () => {
  let denied = false, failed = false
  const calls = []
  const server = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { calls.push(["role", role]); if (denied) throw Error("Forbidden") } },
    "@/services/audit/log": { auditActivity: async (_, __, action) => action() },
    "@/services/supabase/server": { createServerSupabaseClient: () => ({ rpc: async (name, params) => { calls.push([name, params]); return { data: { inserted: 0, deleted: 0 }, error: failed ? {} : null } } }) },
  })
  const sync = server("src/features/reports/calendar.ts").syncReportCalendar
  denied = true; await assert.rejects(() => sync(past, today), /Forbidden/); assert.equal(calls.length, 1)
  denied = false; await assert.rejects(() => sync("bad", today)); assert.equal(calls.filter(call => call[0] === "sync_attendance_day_marks").length, 0)
  await sync("2020-01-01", today)
  assert.deepEqual(calls.at(-1), ["sync_attendance_day_marks", { p_from: "2020-01-01", p_to: today }])
  assert.match(await readFile("supabase/migrations/202610250003_calendar_attendance_marks.sql", "utf8"), /sync_attendance_day_marks\(p_from date, p_to date\)/)
  failed = true; await assert.rejects(() => sync(past, today), /report was not generated/)
})

test("only authorized admin report loading synchronizes, and synchronization finishes before calendar reads", async () => {
  let denied = false, syncFailed = false
  const calls = []
  const server = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { calls.push(role); if (denied) throw Error("Forbidden"); return { id: "teacher-user" } } },
    "@/features/reports/calendar": { syncReportCalendar: async () => { calls.push("sync"); if (syncFailed) throw Error("Sync failed") } },
    "@/services/calendar/attendance-state": { fetchCalendarAttendanceState: async () => { calls.push("calendar"); return calendar } },
    "@/services/reports/snapshot": { fetchReportsSnapshot: async () => snapshot },
    "@/services/reports/teacher-snapshot": { fetchTeacherReportsSnapshot: async () => ({ ...snapshot, students: [students[1]] }) },
    "@/services/attendance/subject-attendance": { fetchSubjectAttendance: async () => [] },
  })
  const admin = server("src/features/reports/panel.ts").getAdminReportsData
  const teacher = server("src/features/reports/teacher-panel.ts").getTeacherReportsData
  const range = { from: past, to: today }
  await admin(range); assert.deepEqual(calls, ["admin", "sync", "calendar"])
  calls.length = 0; await teacher(range); assert.deepEqual(calls, ["teacher", "calendar"])
  calls.length = 0; syncFailed = true; await assert.rejects(() => admin(range), /Sync failed/); assert.deepEqual(calls, ["admin", "sync"])
  calls.length = 0; denied = true; await assert.rejects(() => admin(range), /Forbidden/); assert.deepEqual(calls, ["admin"])
})

test("real PDF exports calendar exclusions and retains subject confirmations, campus history and RFID/SMS details", async () => {
  const data = buildReportsData(snapshot, options)
  data.subjectAttendance = [{ id: 1, attendance_date: past, attendance_status: "Late", time_start: "08:00", time_end: "09:00", student_number: "S-1", student_name: "Student 1", teacher_name: "Teacher", course_code: "ONLINE-101", course_name: "Online subject", program_code: "IT", year_level: "1st Year", section: "A", campus: "Old Campus", confirmed_at: `${past}T01:00:00Z` }]
  const { ReportPdfDocument } = load("src/features/reports/pdf-document.tsx")
  const result = await renderDocumentWithLayout(React.createElement(ReportPdfDocument, { role: "admin", data }))
  assert.deepEqual(result.warnings, [])
  const text = findElements(result.layout, node => node.nodeType === "TextLine").map(node => node.textContent).join(" ")
  for (const expected of ["Calendar exceptions", "Archived Without Tap", "Old Campus", "ONLINE-101", "Recorded RFID: Present", "PRIVATE SMS", "No-class student-days excluded"]) assert.ok(text.includes(expected), expected)
  assert.match(text, /Late: 1/)
  for (const page of result.layout.pages) for (const line of findElements(page, node => node.nodeType === "TextLine")) assert.ok(line.x >= 0 && line.y >= 0 && line.x + line.width <= page.width + 1 && line.y + line.height <= page.height + 1)
  const teacher = buildTeacherReportsData({ ...snapshot, students: [students[1]] }, options)
  teacher.subjectAttendance = data.subjectAttendance
  const teacherPdf = await renderDocumentWithLayout(React.createElement(ReportPdfDocument, { role: "teacher", data: teacher }))
  assert.deepEqual(teacherPdf.warnings, [])
  const teacherText = findElements(teacherPdf.layout, node => node.nodeType === "TextLine").map(node => node.textContent).join(" ")
  assert.match(teacherText, /Calendar exceptions/); assert.match(teacherText, /ONLINE-101/); assert.match(teacherText, /MV Campus/)
  assert.doesNotMatch(teacherText, /PRIVATE|Archived Without Tap/)
})
