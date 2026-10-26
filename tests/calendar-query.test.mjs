import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const loader = createSourceLoader()
const query = loader("src/features/calendar/query.ts")
const { isWithinDashboardWindow, isCalendarUnread, validateDeepLinkDate, validateDeepLinkMonth } = query
const schoolTime = loader("src/lib/school-time.ts")
const { schoolDateKey } = schoolTime

test("isWithinDashboardWindow: 7 days is the exclusive cutoff", () => {
  const now = new Date("2026-10-26T12:00:00Z")
  const exactCutoff = new Date(now.getTime() - 7 * 86400000).toISOString()
  const justInside = new Date(now.getTime() - 7 * 86400000 + 1).toISOString()
  const future = new Date(now.getTime() + 1).toISOString()

  assert.equal(isWithinDashboardWindow(exactCutoff, now), false)
  assert.equal(isWithinDashboardWindow(justInside, now), true)
  assert.equal(isWithinDashboardWindow(future, now), false)
})

test("isWithinDashboardWindow: recent post stays visible", () => {
  const now = new Date("2026-10-26T12:00:00Z")
  const sixDaysAgo = new Date(now.getTime() - 6 * 86400000).toISOString()
  assert.equal(isWithinDashboardWindow(sixDaysAgo, now), true)
})

test("isCalendarUnread: no receipt, edited receipt, and current receipt", () => {
  const updated = "2026-10-26T10:00:00Z"
  assert.equal(isCalendarUnread(updated, null), true)
  assert.equal(isCalendarUnread(updated, "2026-10-26T09:59:59Z"), true)
  assert.equal(isCalendarUnread(updated, "2026-10-26T10:00:00Z"), false)
  assert.equal(isCalendarUnread(updated, "2026-10-26T10:00:01Z"), false)
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