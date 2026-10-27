import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const view = createSourceLoader()("src/features/calendar/admin-view.ts")
const now = new Date("2026-10-31T16:01:00Z")
const entry = (id, overrides = {}) => ({ id, title: `Announcement ${id}`, tags: ["event"], status: "published", attendance_impact: "normal", audience: "everyone", campuses: [], starts_on: "2026-11-01", ends_on: "2026-11-01", published_at: "2026-10-31T16:01:00Z", created_at: "2026-10-31T16:01:00Z", updated_at: "2026-10-31T16:01:00Z", description: null, reason: null, location: null, start_time: null, end_time: null, ...overrides })

test("admin query normalizes filters, repeated params, impossible dates and Manila midnight", () => {
  const defaults = view.parseAdminCalendarQuery({ month: "bad", date: "2026-02-30", status: "bad", search: ["ignored"], page: "Infinity" }, now)
  assert.equal(defaults.month, "2026-11"); assert.equal(defaults.date, "2026-11-01")
  assert.equal(defaults.status, "all"); assert.equal(defaults.search, ""); assert.equal(defaults.page, 1)
  const query = view.parseAdminCalendarQuery({ date: "2024-02-29", from: "2024-03-01", to: "2024-02-01", tab: "list", search: " hello ", status: "draft", page: "2" }, now)
  assert.equal(query.month, "2024-02"); assert.equal(query.date, "2024-02-29")
  assert.equal(query.from, "2024-02-01"); assert.equal(query.to, "2024-03-01")
  assert.equal(query.search, "hello"); assert.equal(query.status, "draft"); assert.equal(query.page, 2)
  assert.equal(view.parseAdminCalendarQuery({ month: "2026-12", date: "2024-02-29" }, now).date, "2026-12-01")
  assert.equal(view.parseAdminCalendarQuery({ month: "0000-01" }, now).month, "2026-11")
})

test("month expansion clips long entries, preserves drafts and normal events, and includes leap days", () => {
  assert.deepEqual(view.monthBounds("2024-02"), { start: "2024-02-01", end: "2024-02-29", next: "2024-03-01" })
  assert.deepEqual(view.monthBounds("2026-12"), { start: "2026-12-01", end: "2026-12-31", next: "2027-01-01" })
  assert.equal(view.monthBounds("0001-01").start, "0001-01-01")
  const days = view.calendarDays([
    entry(1, { starts_on: "2024-01-01", ends_on: "2024-12-31", status: "draft" }),
    entry(2, { starts_on: "2024-02-29", ends_on: "2024-03-01", status: "cancelled" }),
    entry(3, { starts_on: "2025-01-01", ends_on: "2025-01-01" }),
  ], "2024-02")
  assert.equal(Object.keys(days).length, 29)
  assert.deepEqual(days["2024-02-29"].map(row => row.id), [1, 2])
  assert.equal(days["2024-03-01"], undefined)
})

function queryClient(resolve) {
  return { from(table) {
    const calls = []
    const query = { then: (yes, no) => Promise.resolve(resolve(table, calls)).then(yes, no) }
    for (const method of ["select", "order", "range", "eq", "or", "contains", "ilike", "gte", "lte", "lt", "in"]) {
      query[method] = (...args) => { calls.push([method, ...args]); return query }
    }
    return query
  } }
}

test("admin list uses literal title search, overlap, all-campus inclusion, filters and stable pagination", async () => {
  const client = queryClient((table, calls) => {
    assert.equal(table, "calendar_entries")
    for (const expected of [
      ["gte", "ends_on", "2026-11-01"], ["lte", "starts_on", "2026-11-30"],
      ["or", 'campuses.eq.{},campuses.cs.{"Main Campus"}'], ["ilike", "title", "%100\\%\\_meeting%"],
      ["contains", "tags", ["meeting"]], ["eq", "status", "published"], ["eq", "attendance_impact", "normal"],
      ["order", "id", { ascending: false }], ["range", 20, 39],
    ]) assert.ok(calls.some(call => JSON.stringify(call) === JSON.stringify(expected)), JSON.stringify(expected))
    return { data: [entry(1)], count: 21, error: null }
  })
  const service = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: async () => client } })("src/services/calendar/query.ts")
  const result = await service.fetchAdminCalendarEntries({ page: 2, status: "published", search: "100%_meeting", tag: "meeting", impact: "normal", campus: "Main Campus", from: "2026-11-01", to: "2026-11-30" })
  assert.equal(result.total, 21); assert.equal(result.entries.length, 1)
})

test("overview and campus queries read past server caps; KPIs use exact counts and Manila month boundaries", async () => {
  const all = [entry(1), entry(2, { status: "draft", campuses: ["Draft Campus"] }), entry(3)]
  const client = queryClient((table, calls) => {
    const select = calls.find(call => call[0] === "select")
    if (select[2]?.head) {
      if (calls.some(call => call[1] === "published_at")) {
        assert.ok(calls.some(call => call[0] === "gte" && call[2] === "2026-11-01T00:00:00+08:00"))
        assert.ok(calls.some(call => call[0] === "lt" && call[2] === "2026-12-01T00:00:00+08:00"))
      }
      return { count: 1200, error: null }
    }
    assert.equal(table, "calendar_entries")
    const from = calls.find(call => call[0] === "range")[1]
    assert.ok(!calls.some(call => call[0] === "eq" && call[1] === "status"))
    return { data: all.slice(from, from + 2), error: null }
  })
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: async () => client } })
  const result = await load("src/services/calendar/admin.ts").fetchAdminCalendarOverview("2026-11-01", "2026-11-30", "2026-12-01", "2026-11-01", "2026-11-30")
  assert.equal(result.entries.length, 3); assert.equal(result.upcoming, 1200)
  assert.deepEqual(await load("src/services/calendar/query.ts").fetchCalendarCampuses(), ["Draft Campus"])
})

function panelLoader(deny = false) {
  const calls = []
  const deliveryCalls = []
  const entries = [entry(1, { attendance_impact: "no_classes", ends_on: "2026-11-03" }), entry(2, { attendance_impact: "no_classes", campuses: ["West"], ends_on: "2026-11-02" }), entry(3, { attendance_impact: "no_classes", status: "draft", ends_on: "2026-11-05" })]
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); if (deny) throw new Error("Forbidden") } },
    "@/services/calendar/query": {
      fetchAdminCalendarEntries: async query => { calls.push(query.page); return { entries: query.page > 1 ? [] : entries, total: 3, page: query.page, pageSize: 20 } },
      fetchCalendarCampuses: async () => ["West"],
    },
    "@/services/calendar/admin": {
      fetchAdminCalendarOverview: async () => ({ entries, upcoming: 3, published: 2, failed: 1 }),
      fetchCalendarDeliveryStatuses: async ids => { deliveryCalls.push(ids); return [{ calendar_entry_id: 1, status: "Sent" }, { calendar_entry_id: 1, status: "Failed" }] },
    },
  })
  return { get: load("src/features/calendar/admin.ts").getAdminCalendarPanel, calls, deliveryCalls }
}

test("calendar view skips hidden list and delivery reads while keeping overview data", async () => {
  const fixture = panelLoader()
  const panel = await fixture.get(view.parseAdminCalendarQuery({}, now))
  assert.deepEqual(fixture.calls, []); assert.deepEqual(fixture.deliveryCalls, [])
  assert.equal(panel.entries.length, 3); assert.equal(panel.kpis.noClasses, 3)
})

test("list delivery reads start while the independent overview is still pending", { timeout: 3000 }, async () => {
  let finishOverview, startedDeliveries
  const overview = new Promise(resolve => { finishOverview = resolve })
  const deliveries = new Promise(resolve => { startedDeliveries = resolve })
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async () => {} },
    "@/services/calendar/query": {
      fetchAdminCalendarEntries: async () => ({ entries: [entry(1)], total: 1 }),
      fetchCalendarCampuses: async () => [],
    },
    "@/services/calendar/admin": {
      fetchAdminCalendarOverview: () => overview,
      fetchCalendarDeliveryStatuses: async () => { startedDeliveries(); return [] },
    },
  })
  const result = load("src/features/calendar/admin.ts").getAdminCalendarPanel(view.parseAdminCalendarQuery({ tab: "list" }, now))
  await deliveries
  finishOverview({ entries: [], upcoming: 0, published: 0, failed: 0 })
  assert.equal((await result).list.total, 1)
})

test("panel counts distinct no-class dates, clamps empty pages, aggregates emails and gates admin access", async () => {
  const query = view.parseAdminCalendarQuery({ page: "99", tab: "list" }, now)
  const fixture = panelLoader()
  const panel = await fixture.get(query)
  assert.deepEqual(fixture.calls, [99, 1]); assert.equal(panel.query.page, 1)
  assert.equal(panel.kpis.noClasses, 3)
  assert.deepEqual(panel.deliveries[1], { Pending: 0, Sent: 1, Failed: 1 })
  const denied = panelLoader(true)
  await assert.rejects(() => denied.get(query), /Forbidden/)
  assert.deepEqual(denied.calls, [])
})

test("calendar and list render real components with labels, overflow indicators, escaping and empty states", async () => {
  const load = createSourceLoader({ "@/features/calendar/actions": {}, "@/components/ui/goey-toaster": { gooeyToast: {} }, "next/navigation": {
    useRouter: () => ({ replace() {} }), usePathname: () => "/admin/schedules/calendar", useSearchParams: () => new URLSearchParams(),
  } })
  const { CalendarPanel } = load("src/app/(portal)/admin/schedules/calendar/components/calendar-panel.tsx")
  const panel = await panelLoader().get(view.parseAdminCalendarQuery({ tab: "list" }, now))
  panel.query.tab = "calendar"
  panel.entries = Array.from({ length: 5 }, (_, index) => entry(index, { title: "<script>Title</script>" }))
  let html = renderToStaticMarkup(React.createElement(CalendarPanel, { panel }))
  assert.ok(html.includes("+2")); assert.ok(html.includes("5 announcements"))
  assert.ok(html.includes("&lt;script&gt;Title&lt;/script&gt;")); assert.ok(!html.includes("<script>Title"))
  assert.ok(html.includes('type="date"')); assert.ok(html.includes("All announcements"))
  panel.query.tab = "list"
  html = renderToStaticMarkup(React.createElement(CalendarPanel, { panel }))
  assert.ok(html.includes("Search titles")); assert.ok(html.includes("Email status")); assert.ok(html.includes("Apply filters"))
  panel.list.entries = []; panel.list.total = 0
  html = renderToStaticMarkup(React.createElement(CalendarPanel, { panel }))
  assert.ok(html.includes("No matching announcements"))
  panel.query.tab = "calendar"; panel.entries = []
  html = renderToStaticMarkup(React.createElement(CalendarPanel, { panel }))
  assert.ok(html.includes("No announcements this month")); assert.ok(html.includes("No announcements on this date"))
})

test("summary failures reject instead of displaying false zero counts", async () => {
  const client = queryClient((_table, calls) => calls.some(call => call[0] === "select" && call[2]?.head)
    ? { count: null, error: { message: "private database details" } }
    : { data: [], error: null })
  const service = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: async () => client } })("src/services/calendar/admin.ts")
  await assert.rejects(() => service.fetchAdminCalendarOverview("2026-11-01", "2026-11-30", "2026-12-01", "2026-11-01", "2026-11-30"), { message: "Calendar summary could not be loaded." })
})
