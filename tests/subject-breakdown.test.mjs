import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { subjectBreakdown } = createSourceLoader()("src/features/reports/subject-breakdown.ts")
const row = {
  id: 1, schedule_id: 10, student_id: 1, attendance_date: "2026-10-30",
  attendance_status: "Present", time_start: "09:00", time_end: "10:00",
  student_number: "S001", student_name: "Student One", teacher_name: "Teacher One",
  course_code: "CS101", course_name: "Computing", program_code: "BSCS",
  year_level: "1", section: "A", campus: "Main", confirmed_at: "2026-10-30T10:00:00Z",
}

test("counts each confirmed result in its own column without student identities", () => {
  const groups = subjectBreakdown([
    row,
    { ...row, id: 2, student_id: 2, attendance_status: "Late" },
    { ...row, id: 3, student_id: 3, attendance_status: "Absent" },
    { ...row, id: 4, student_id: 4 },
  ])
  assert.equal(groups.length, 1)
  assert.deepEqual([groups[0].present, groups[0].late, groups[0].absent], [2, 1, 1])
  assert.equal("student_name" in groups[0], false)
  assert.equal("student_number" in groups[0], false)
})

test("keeps dates, schedules, sections, and subjects separate", () => {
  const groups = subjectBreakdown([
    row,
    { ...row, attendance_date: "2026-10-29" },
    { ...row, schedule_id: 11 },
    { ...row, section: "B" },
    { ...row, course_code: "CS102", course_name: "Programming" },
  ])
  assert.equal(groups.length, 5)
  assert.equal(groups.at(-1).attendance_date, "2026-10-29")
  assert.equal(groups.reduce((total, group) => total + group.present, 0), 5)
})

test("empty records produce no fabricated absences", () => {
  assert.deepEqual(subjectBreakdown([]), [])
})
