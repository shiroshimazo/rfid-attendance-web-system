import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderDocumentWithLayout } from "@formepdf/core"
import { findElements } from "@formepdf/core/layout"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const load = createSourceLoader({
  "@/features/auth/server": {}, "@/services/reports/snapshot": {},
  "@/services/reports/teacher-snapshot": {},
})
const { buildReportsData, parseReportsRange } = load("src/features/reports/panel.ts")
const { buildTeacherReportsData } = load("src/features/reports/teacher-panel.ts")
const { ReportPdfDocument } = load("src/features/reports/pdf-document.tsx")
const options = { fromDate: "2026-09-01", toDate: "2026-09-07", generatedAt: new Date("2026-09-06T16:00:00Z") }

export function reportFixture(count = 65) {
  return {
    students: Array.from({ length: count }, (_, i) => ({
      id: i + 1, student_id: `S-${i + 1}`, full_name: `Student ${i + 1} Peña`,
      year_level: "2nd Year", section: "21001", program_id: 1,
      campus: "Main Campus", status: i === 0 ? "archived" : "active",
    })),
    programs: [{ id: 1, program_code: "BSIT", program_name: "Information Technology" }],
    attendance: Array.from({ length: count }, (_, i) => ({
      id: i + 1, student_id: i + 1, rfid_card_id: i + 1,
      attendance_date: "2026-09-03", time_in: "06:16:00", time_out: i % 2 ? null : "12:30:00",
      attendance_status: i === 0 ? "Absent" : "Present", campus: i % 2 ? "Main Campus" : "Other Campus",
    })),
    rfidCards: Array.from({ length: count }, (_, i) => ({
      id: i + 1, student_id: i + 1, rfid_number: `0000${String(i + 1).padStart(4, "0")}`, card_status: "Lost",
    })),
    sms: [{ id: 1, attendance_id: 1, student_id: 1, parent_contact_number: "09123456789",
      message: "PRIVATE guardian notification", sms_status: "Sent", sent_at: "2026-09-09T01:00:00Z", created_at: "2026-09-09T00:00:00Z" }],
  }
}

test("full-range history survives archiving; current roster and represented students are separate", () => {
  const snapshot = reportFixture()
  snapshot.students.push({ ...snapshot.students[0], id: 999, student_id: "unused-archived" })
  snapshot.attendance.push({ ...snapshot.attendance[0], id: 999, attendance_date: "2026-08-31" })
  const data = buildReportsData(snapshot, options)
  assert.equal(data.attendanceLogs.length, 65)
  assert.equal(data.recentLogs.length, 50)
  assert.equal(data.kpis.totalStudents, 64)
  assert.equal(data.kpis.representedStudents, 65)
  assert.equal(data.attendanceLogs.at(-1).studentStatus, "archived")
  assert.equal(data.kpis.totalAbsent, 1)
  assert.equal(data.kpis.rfidScans, 98)
  assert.equal(data.smsLogs[0].attendanceDate, "2026-09-03")
  assert.equal(data.smsLogs[0].sent_at, "2026-09-09T01:00:00Z")
})

test("recorded card identity and campus remain distinct after a replacement or campus transfer", () => {
  const snapshot = reportFixture(2)
  snapshot.rfidCards.push({ id: 999, student_id: 1, rfid_number: "NEW-CARD", card_status: "Active" })
  const data = buildReportsData(snapshot, options)
  const historic = data.attendanceLogs.find(row => row.id === 1)
  assert.equal(historic.rfidNumber, "00000001")
  assert.equal(historic.rfidStatus, "Lost")
  assert.equal(historic.campus, "Other Campus")
  assert.equal(data.bySection.length, 2)
  assert.equal(data.bySection.find(row => row.campus === "Other Campus").absent, 1)
  assert.equal(data.bySection.find(row => row.campus === "Main Campus").present, 1)
})

test("teacher aggregation keeps the same rates and has no SMS field even if supplied", () => {
  const snapshot = reportFixture(2)
  const admin = buildReportsData(snapshot, options)
  const teacher = buildTeacherReportsData(snapshot, options)
  assert.deepEqual(teacher.bySection, admin.bySection)
  assert.equal(teacher.kpis.attendanceRate, 50)
  assert.equal(teacher.kpis.rfidScans, admin.kpis.rfidScans)
  assert(!("smsLogs" in teacher))
  assert(!JSON.stringify(teacher).includes("PRIVATE"))
})

test("empty reports and school-zone date defaults are explicit", () => {
  const data = buildReportsData(reportFixture(0), options)
  assert.equal(data.kpis.totalAbsent, 0)
  assert.equal(data.attendanceLogs.length, 0)
  assert.equal(data.smsLogs.length, 0)
  assert.deepEqual(parseReportsRange({}, options.generatedAt), { from: "2026-09-01", to: "2026-09-07" })
  assert.match(data.generatedAtLabel, /Sep 7, 2026/)
  assert.match(data.generatedAtLabel, /PHT/)
})

test("paging handles server caps below 1000 and reads beyond the previous 25,000-row ceiling", async () => {
  const { fetchAllRows } = load("src/services/supabase/pagination.ts")
  const all = Array.from({ length: 26_050 }, (_, i) => i)
  const rows = await fetchAllRows((from, to) => ({ data: all.slice(from, Math.min(to + 1, from + 37)), error: null }))
  assert.deepEqual(rows, all)
  await assert.rejects(fetchAllRows(() => ({ data: null, error: { message: "Read failed" } })), /Read failed/)
  await assert.rejects(fetchAllRows(() => ({ data: [1], error: null })), /too large to load completely/)
})

test("real admin PDF contains every row past the preview cap and all SMS text with repeated headers", async () => {
  const snapshot = reportFixture(125)
  snapshot.sms[0].message += `\n${"Long notification content. ".repeat(300)}END-OF-MESSAGE`
  const data = buildReportsData(snapshot, options)
  const result = await renderDocumentWithLayout(createElement(ReportPdfDocument, { role: "admin", data }))
  assert.equal(Buffer.from(result.pdf).subarray(0, 5).toString(), "%PDF-")
  assert.deepEqual(result.warnings, [])
  const text = findElements(result.layout, node => node.nodeType === "TextLine").map(node => node.textContent).join("\n")
  for (const student of snapshot.students) assert(text.includes(student.full_name), student.full_name)
  assert(text.includes("PRIVATE guardian notification"))
  assert(text.replace(/\s/g, "").includes("END-OF-MESSAGE"))
  const bodyText = findElements(result.layout, node => node.nodeType === "TextLine")
    .filter(node => !node.textContent.startsWith("RFID Attendance System |"))
    .map(node => node.textContent).join(" ").replace(/\s+/g, " ")
  assert.equal((bodyText.match(/Long notification content\./g) ?? []).length, 300)
  assert(text.includes("00000001")) // Oldest record falls outside the UI's newest 50.
  assert(result.layout.pages.length > 5)
  assert((text.match(/In \/ out \(PHT\)/g) ?? []).length > 1)
  // No rendered text should escape the physical page (tables and long messages).
  for (const page of result.layout.pages) {
    for (const line of findElements(page, node => node.nodeType === "TextLine")) {
      assert(line.x >= 0 && line.y >= 0 && line.x + line.width <= page.width + 1 && line.y + line.height <= page.height + 1,
        `Overflow: ${line.textContent}`)
    }
  }
})

test("real teacher PDF excludes guardian details and renders the empty state", async () => {
  const data = buildTeacherReportsData(reportFixture(0), options)
  // Even unexpected runtime fields cannot enable the admin section.
  data.smsLogs = reportFixture(1).sms
  const result = await renderDocumentWithLayout(createElement(ReportPdfDocument, { role: "teacher", data }))
  const text = findElements(result.layout, node => node.nodeType === "TextLine").map(node => node.textContent).join("\n")
  assert(text.includes("No attendance records"))
  assert(!text.includes("PRIVATE") && !text.includes("09123456789") && !text.includes("SMS notification records"))
})
