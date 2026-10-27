import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function clientMock(resolve) {
  return { from(table) {
    const calls = []
    const query = { then: (yes, no) => Promise.resolve(resolve(table, calls)).then(yes, no) }
    for (const method of ["select", "in", "eq", "lte", "gte", "order", "limit", "range"]) query[method] = (...args) => { calls.push([method, ...args]); return query }
    return query
  } }
}

test("reader month reads normal/cancelled announcements, omit drafts, and page past server caps", async () => {
  const rows = Array.from({ length: 5 }, (_, id) => ({ id }))
  const client = clientMock((table, calls) => {
    assert.equal(table, "calendar_entries")
    for (const expected of [["in", "status", ["published", "cancelled"]], ["lte", "starts_on", "2024-02-29"], ["gte", "ends_on", "2024-02-01"], ["order", "id"]]) assert.ok(calls.some(call => JSON.stringify(call) === JSON.stringify(expected)))
    assert.equal(calls.some(call => call[0] === "eq" && call[1] === "attendance_impact"), false)
    const range = calls.find(call => call[0] === "range")
    return { data: rows.slice(range[1], range[1] + 2), error: null }
  })
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => client } })
  assert.deepEqual(await load("src/services/calendar/query.ts").fetchReaderCalendarEntries("2024-02-01", "2024-02-29"), rows)
})

test("upcoming reads include ongoing published entries and exactly 30 inclusive dates", async () => {
  const client = clientMock((_, calls) => {
    assert.ok(calls.some(call => call[0] === "eq" && call[1] === "status" && call[2] === "published"))
    const from = calls.find(call => call[0] === "gte")
    const to = calls.find(call => call[0] === "lte")
    assert.equal(from[1], "ends_on"); assert.equal(to[1], "starts_on")
    assert.equal((Date.parse(to[2]) - Date.parse(from[2])) / 86400000, 29)
    assert.ok(calls.some(call => call[0] === "limit" && call[1] === 50))
    return { data: [], error: null }
  })
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => client } })
  await load("src/services/calendar/query.ts").fetchUpcomingCalendarEntries()
})

test("reader feature guards both roles before reading, normalizes deep links, and exposes query errors", async () => {
  let denied = false, failed = false
  const roles = [], calls = []
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { roles.push(role); if (denied) throw Error("Forbidden") } },
    "@/services/calendar/query": { fetchReaderCalendarEntries: async (...args) => { calls.push(args); if (failed) throw Error("Unavailable"); return [] }, fetchUpcomingCalendarEntries: async () => [] },
  })
  const get = load("src/features/calendar/reader.ts").getReaderCalendarPanel
  assert.equal((await get("teacher", { date: "2024-02-29" })).month, "2024-02")
  assert.deepEqual(calls[0], ["2024-02-01", "2024-02-29"])
  assert.equal((await get("student", { month: "2026-11", date: "2026-12-31" })).date, "2026-11-01")
  denied = true
  await assert.rejects(() => get("student", {}), /Forbidden/)
  assert.equal(calls.length, 2); assert.deepEqual(roles, ["teacher", "student", "student"])
  denied = false; failed = true
  await assert.rejects(() => get("teacher", {}), /Unavailable/)
})

test("read-only calendar renders cancellation/campus details, exception guidance, and empty states without mutation controls", () => {
  const load = createSourceLoader({ "next/navigation": { useRouter: () => ({}), usePathname: () => "/student/calendar", useSearchParams: () => new URLSearchParams() } })
  const { ReaderCalendar } = load("src/components/calendar/reader-calendar.tsx")
  const base = { id: 1, title: "<script>Event</script>", tags: ["event"], status: "published", attendance_impact: "normal", campuses: [], starts_on: "2026-11-05", ends_on: "2026-11-06", start_time: "09:00:00", end_time: "10:00:00", description: "<unsafe>", reason: null, location: "Hall", is_pinned: false }
  const entries = [base, { ...base, id: 2, title: "Storm", attendance_impact: "no_classes", campuses: ["Main Campus"], tags: ["no_classes"], start_time: null, end_time: null }, { ...base, id: 3, title: "Cancelled online", status: "cancelled", attendance_impact: "online_manual" }, { ...base, id: 4, title: "Online class", attendance_impact: "online_manual", start_time: null, end_time: null }]
  const panel = { month: "2026-11", date: "2026-11-05", today: "2026-11-05", entries, upcoming: [base] }
  const html = renderToStaticMarkup(React.createElement(ReaderCalendar, { panel }))
  assert.match(html, /Cancelled/); assert.match(html, /Campus: Main Campus/); assert.match(html, /Campus: All campuses/)
  assert.match(html, /RFID taps are not expected/); assert.match(html, /Attendance is confirmed in Subject Attendance/)
  assert.match(html, /does not apply to today or future attendance/); assert.match(html, /09:00 – 10:00 PHT/)
  assert.match(html, /&lt;script&gt;Event&lt;\/script&gt;/); assert.match(html, /&lt;unsafe&gt;/)
  assert.doesNotMatch(html, /<script>|New announcement|Preview recipients|Save draft|Retry email|Notify recipients/)
  const empty = renderToStaticMarkup(React.createElement(ReaderCalendar, { panel: { ...panel, entries: [], upcoming: [] } }))
  for (const text of ["No announcements this month", "No announcements on this date", "No upcoming announcements"]) assert.ok(empty.includes(text))
})

test("calendar navigation entries stay under their own role and in the approved order", () => {
  const { navigationByRole } = createSourceLoader({ "@hugeicons/core-free-icons": {}, "@hugeicons/react": {} })("src/config/navigation.ts")
  for (const role of ["admin", "teacher", "student"]) {
    const items = navigationByRole[role].flatMap(group => group.items)
    const all = items.flatMap(item => [item, ...(item.items ?? [])])
    const calendars = all.filter(item => item.title === "Calendar")
    assert.equal(calendars.length, 1)
    assert.equal(calendars[0].url, role === "admin" ? "/admin/schedules/calendar" : `/${role}/calendar`)
    assert.equal(all.some(item => item.url.startsWith(role === "student" ? "/teacher/" : "/student/")), false)
    if (role === "admin") {
      const schedules = items.find(item => item.title === "Schedules").items
      assert.equal(schedules.at(-2).title, "Class Schedules"); assert.equal(schedules.at(-1).title, "Calendar")
    } else assert.equal(items[items.findIndex(item => item.title === "Calendar") - 1].title, role === "teacher" ? "My Schedule" : "My Attendance")
  }
})

test("shared reader page protects routes and renders a retry panel on failed reads", async () => {
  let denied = false
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async () => { if (denied) throw Error("Forbidden") } },
    "@/features/calendar/reader": { getReaderCalendarPanel: async () => { throw Error("database connection secret") } },
    "next/navigation": { unstable_rethrow() {}, useRouter: () => ({}) },
  })
  const { ReaderCalendarPage } = load("src/components/calendar/reader-page.tsx")
  const page = await ReaderCalendarPage({ role: "teacher", searchParams: Promise.resolve({}) })
  const suspense = page.props.children[1]
  const content = await suspense.props.children.type(suspense.props.children.props)
  const html = renderToStaticMarkup(content)
  assert.match(html, /Calendar could not be loaded/); assert.doesNotMatch(html, /database connection secret/)
  denied = true
  await assert.rejects(() => ReaderCalendarPage({ role: "student", searchParams: Promise.resolve({}) }), /Forbidden/)
})
