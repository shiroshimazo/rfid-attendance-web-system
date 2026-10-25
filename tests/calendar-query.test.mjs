import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const loader = createSourceLoader()
const query = loader("src/features/calendar/query.ts")
const { isWithinDashboardWindow, validateDeepLinkDate, validateDeepLinkMonth } = query
const schoolTime = loader("src/lib/school-time.ts")
const { schoolDateKey } = schoolTime

function manilaDate(base, offsetDays) {
  return schoolDateKey(new Date(base.getTime() + offsetDays * 86400000))
}

test("isWithinDashboardWindow: exact 7-day inclusive boundary", () => {
  const today = new Date("2026-10-26T12:00:00Z")
  const todayKey = manilaDate(today, 0)
  const weekAgoKey = manilaDate(today, -7)
  const eightDaysAgoKey = manilaDate(today, -8)

  assert.equal(isWithinDashboardWindow(todayKey), true)
  assert.equal(isWithinDashboardWindow(weekAgoKey), true)
  assert.equal(isWithinDashboardWindow(eightDaysAgoKey), false)
})

test("isWithinDashboardWindow: future published_at is outside window", () => {
  const today = new Date("2026-10-26T12:00:00Z")
  const tomorrowKey = manilaDate(today, 1)
  assert.equal(isWithinDashboardWindow(tomorrowKey), false)
})

test("isWithinDashboardWindow: Manila midnight crossing", () => {
  const afterMidnight = new Date("2026-10-25T16:00:00Z")
  const weekAgoKey = manilaDate(afterMidnight, -7)
  assert.equal(isWithinDashboardWindow(weekAgoKey), true)
})

test("validateDeepLinkDate: accepts valid YYYY-MM-DD", () => {
  assert.equal(validateDeepLinkDate("2026-10-25"), "2026-10-25")
  assert.equal(validateDeepLinkDate("2024-02-29"), "2024-02-29")
  assert.equal(validateDeepLinkDate("0001-01-01"), "0001-01-01")
  assert.equal(validateDeepLinkDate("9999-12-31"), "9999-12-31")
})

test("validateDeepLinkDate: rejects invalid dates and formats", () => {
  assert.equal(validateDeepLinkDate("2026-02-29"), null)
  assert.equal(validateDeepLinkDate("2026-13-01"), null)
  assert.equal(validateDeepLinkDate("2026-04-31"), null)
  assert.equal(validateDeepLinkDate("2026-1-01"), null)
  assert.equal(validateDeepLinkDate("2026/10/25"), null)
  assert.equal(validateDeepLinkDate("2026-10-25T00:00:00Z"), null)
  assert.equal(validateDeepLinkDate(""), null)
  assert.equal(validateDeepLinkDate("not-a-date"), null)
})

test("validateDeepLinkMonth: accepts valid YYYY-MM", () => {
  assert.equal(validateDeepLinkMonth("2026-10"), "2026-10")
  assert.equal(validateDeepLinkMonth("2026-01"), "2026-01")
  assert.equal(validateDeepLinkMonth("2026-12"), "2026-12")
  assert.equal(validateDeepLinkMonth("0001-01"), "0001-01")
  assert.equal(validateDeepLinkMonth("9999-12"), "9999-12")
})

test("validateDeepLinkMonth: rejects invalid months and formats", () => {
  assert.equal(validateDeepLinkMonth("2026-00"), null)
  assert.equal(validateDeepLinkMonth("2026-13"), null)
  assert.equal(validateDeepLinkMonth("2026/10"), null)
  assert.equal(validateDeepLinkMonth("2026-10-25"), null)
  assert.equal(validateDeepLinkMonth(""), null)
  assert.equal(validateDeepLinkMonth("not-a-month"), null)
})

test("schoolDateKey uses Manila timezone", () => {
  const utcMidnight = new Date("2026-10-25T16:00:00Z")
  const manilaKey = schoolDateKey(utcMidnight)
  assert.equal(manilaKey, "2026-10-26")
})

test("getCalendarMonthGrid is a function", () => {
  assert.equal(typeof query.getCalendarMonthGrid, "function")
})