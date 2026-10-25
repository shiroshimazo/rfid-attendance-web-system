import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const {
  calendarEntrySchema, calendarDateRangeSchema, calendarCampusesSchema,
  calendarPublishSchema, suggestCalendarImpact, calendarTags,
} = createSourceLoader()("src/features/calendar/schema.ts")

const entry = {
  title: "School meeting", tags: ["meeting"], attendanceImpact: "normal",
  audience: "everyone", campuses: [], startsOn: "2026-10-25", endsOn: "2026-10-25",
}
const noClasses = { ...entry, tags: ["no_classes"], attendanceImpact: "no_classes", reason: "Storm" }

function rejects(values, field) {
  const result = calendarEntrySchema.safeParse(values)
  assert.equal(result.success, false, JSON.stringify(values))
  if (field) assert(result.error.issues.some((issue) => issue.path[0] === field), result.error.message)
}

test("normalizes form text, blank optional fields, campus and tag duplicates", () => {
  const result = calendarEntrySchema.parse({
    ...entry, title: " A ", description: " Paragraph one.\n\nParagraph two. ",
    reason: "  ", location: " Room 1 ", startTime: " ", endTime: null,
    campuses: [" Main Campus ", "Main Campus", "main campus"], tags: ["event", "event"],
  })
  assert.equal(result.title, "A")
  assert.equal(result.description, "Paragraph one.\n\nParagraph two.")
  assert.equal(result.reason, null)
  assert.equal(result.location, "Room 1")
  assert.equal(result.startTime, null)
  assert.equal(result.endTime, null)
  assert.equal(result.isPinned, false)
  assert.deepEqual(result.tags, ["event"])
  assert.deepEqual(result.campuses, ["Main Campus", "main campus"])
  assert.deepEqual(calendarCampusesSchema.parse([]), [])
  assert.equal(calendarCampusesSchema.safeParse([" "]).success, false)
})

test("enforces text boundaries and required title without rejecting one character", () => {
  rejects({ ...entry, title: " " }, "title")
  for (const [field, limit] of [["title", 160], ["description", 5000], ["reason", 500], ["location", 200]]) {
    assert.equal(calendarEntrySchema.safeParse({ ...entry, [field]: "x".repeat(limit) }).success, true)
    rejects({ ...entry, [field]: "x".repeat(limit + 1) }, field)
  }
})

test("accepts real leap days and inclusive 366-day ranges; rejects invalid dates and 367 days", () => {
  for (const [startsOn, endsOn] of [["2024-02-29", "2024-02-29"], ["2024-01-01", "2024-12-31"], ["2026-01-01", "2027-01-01"]]) {
    assert.equal(calendarDateRangeSchema.safeParse({ startsOn, endsOn }).success, true)
    assert.equal(calendarEntrySchema.safeParse({ ...entry, startsOn, endsOn }).success, true)
  }
  for (const date of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "0000-01-01", "", "2026-10-25T00:00:00Z"]) {
    rejects({ ...entry, startsOn: date }, "startsOn")
  }
  for (const dates of [{ startsOn: "2024-01-01", endsOn: "2025-01-01" }, { startsOn: "2026-10-26", endsOn: "2026-10-25" }]) {
    assert.equal(calendarDateRangeSchema.safeParse(dates).success, false)
    rejects({ ...entry, ...dates }, "endsOn")
  }
})

test("time pairs require a single day and strictly later end time", () => {
  assert.equal(calendarEntrySchema.safeParse({ ...entry, startTime: " 00:00 ", endTime: "23:59" }).success, true)
  rejects({ ...entry, startTime: "08:00" }, "endTime")
  rejects({ ...entry, endTime: "09:00" }, "startTime")
  rejects({ ...entry, startTime: "08:00", endTime: "08:00" }, "endTime")
  rejects({ ...entry, startTime: "23:00", endTime: "01:00" }, "endTime")
  rejects({ ...entry, startTime: "08:00", endTime: "09:00", endsOn: "2026-10-26" }, "endsOn")
  for (const startTime of ["24:00", "08:60", "8:00", "08:00:00", 800]) {
    rejects({ ...entry, startTime, endTime: "09:00" }, "startTime")
  }
})

test("tag/impact combinations enforce online precedence without silently changing input", () => {
  for (const [tags, expected] of [
    [["event"], "normal"], [["no_classes"], "no_classes"],
    [["online_class"], "online_manual"], [["no_classes", "online_class"], "online_manual"],
  ]) {
    assert.equal(suggestCalendarImpact(tags), expected)
    for (const attendanceImpact of ["normal", "no_classes", "online_manual"]) {
      const result = calendarEntrySchema.safeParse({ ...entry, tags, attendanceImpact, reason: "Storm" })
      assert.equal(result.success, attendanceImpact === expected)
    }
  }
  for (const tag of calendarTags.filter((tag) => !["no_classes", "online_class"].includes(tag))) {
    assert.equal(calendarEntrySchema.safeParse({ ...entry, tags: [tag] }).success, true)
  }
  rejects({ ...entry, tags: [] }, "tags")
  rejects({ ...entry, tags: ["unknown"] }, "tags")
})

test("attendance exceptions require everyone, a reason, and all-day times", () => {
  for (const values of [noClasses, { ...noClasses, tags: ["online_class"], attendanceImpact: "online_manual" }]) {
    assert.equal(calendarEntrySchema.safeParse(values).success, true)
    rejects({ ...values, reason: " " }, "reason")
    rejects({ ...values, reason: null }, "reason")
    rejects({ ...values, reason: undefined }, "reason")
    for (const audience of ["teachers", "students"]) rejects({ ...values, audience }, "audience")
    rejects({ ...values, startTime: "08:00", endTime: "09:00" }, "startTime")
  }
  for (const audience of ["everyone", "teachers", "students"]) {
    assert.equal(calendarEntrySchema.safeParse({ ...entry, audience }).success, true)
  }
})

test("rejects invalid types, enums, and client-supplied lifecycle fields", () => {
  for (const [field, value] of [
    ["attendanceImpact", "absent"], ["audience", "admin"], ["isPinned", "true"],
    ["campuses", null], ["campuses", [null]], ["title", null], ["tags", "event"],
  ]) rejects({ ...entry, [field]: value }, field)
  for (const field of ["status", "publishedAt", "cancelledAt", "createdBy", "updatedAt"]) {
    rejects({ ...entry, [field]: "forged" })
  }
})

test("publish cutoff uses Manila midnight; drafts and normal past events remain valid", () => {
  const yesterday = { ...noClasses, startsOn: "2026-10-24", endsOn: "2026-10-24" }
  const beforeMidnight = calendarPublishSchema(new Date("2026-10-24T15:59:59Z"))
  const midnight = calendarPublishSchema(new Date("2026-10-24T16:00:00Z"))
  assert.equal(beforeMidnight.safeParse(yesterday).success, true)
  assert.equal(midnight.safeParse(yesterday).success, false)
  assert.equal(midnight.safeParse(noClasses).success, true)
  assert.equal(calendarEntrySchema.safeParse(yesterday).success, true)
  assert.equal(midnight.safeParse({ ...entry, startsOn: "2020-01-01", endsOn: "2020-01-01" }).success, true)
  assert.equal(midnight.safeParse({ ...noClasses, startsOn: "2026-10-26", endsOn: "2026-10-26" }).success, true)
})


test("system-log filters accept calendar entities and preserve their URLs", () => {
  const { parseLogQuery, logPageUrl } = createSourceLoader()("src/features/system-logs/query.ts")
  for (const entity of ["calendar_entries", "attendance_day_marks", "calendar_email_deliveries"]) {
    const query = parseLogQuery({ entity }, new Date("2026-10-25T00:00:00Z"))
    assert.equal(query.entity, entity)
    assert(logPageUrl(query, 1).includes(`entity=${entity}`))
  }
})
