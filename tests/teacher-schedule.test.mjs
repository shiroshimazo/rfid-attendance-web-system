import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function setup(rows, authorize = async () => ({ role: "teacher" })) {
  let reads = 0
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => {
      assert.equal(role, "teacher")
      return authorize()
    } },
    "@/services/attendance/subject-attendance": {
      fetchSubjectSchedules: async () => { reads++; return rows },
    },
  })
  return { ...load("src/features/schedules/teacher-schedule.ts"), reads: () => reads }
}

test("weekly schedule excludes inactive sessions and sorts Monday to Sunday, then time", async () => {
  const rows = [
    { id: 1, day_of_week: 0, time_start: "08:00:00", status: "active" },
    { id: 2, day_of_week: 1, time_start: "13:00:00", status: "active" },
    { id: 3, day_of_week: 1, time_start: "08:00:00", status: "active" },
    { id: 4, day_of_week: 2, time_start: "08:00:00", status: "inactive" },
    { id: 5, day_of_week: 6, time_start: "08:00:00", status: "active" },
  ]
  const original = structuredClone(rows)
  assert.deepEqual((await setup(rows).getTeacherSchedule()).map(row => row.id), [3, 2, 5, 1])
  assert.deepEqual(rows, original)
  assert.deepEqual(await setup([]).getTeacherSchedule(), [])
})

test("schedule requires teacher access before reading data", async () => {
  const service = setup([], async () => { throw new Error("Access denied") })
  await assert.rejects(service.getTeacherSchedule(), /Access denied/)
  assert.equal(service.reads(), 0)
})
