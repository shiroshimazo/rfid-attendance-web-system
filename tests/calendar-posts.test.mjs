import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const post = (id, overrides = {}) => ({ id, title: `Announcement ${id}`, description: "School announcement", reason: null, tags: ["event"], attendance_impact: "normal", campuses: [], starts_on: "2026-11-05", ends_on: "2026-11-05", published_at: "2026-11-01T00:00:00Z", is_pinned: false, ...overrides })

test("dashboard query uses strict publication expiry, scoped published entries, pinned ordering and a stable three-item cap", async () => {
  const calls = []
  let failed = false
  const query = { then: (yes, no) => Promise.resolve({ data: [], error: failed ? { message: "Unavailable" } : null }).then(yes, no) }
  for (const name of ["select", "eq", "gt", "lte", "order", "limit"]) query[name] = (...args) => { calls.push([name, ...args]); return query }
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => ({ from: table => { assert.equal(table, "calendar_entries"); return query } }) } })
  const fetch = load("src/services/calendar/query.ts").fetchDashboardPosts
  await fetch()
  assert.ok(calls[0][1].includes("reason"))
  assert.deepEqual(calls.find(call => call[0] === "eq"), ["eq", "status", "published"])
  const cutoff = calls.find(call => call[0] === "gt"), now = calls.find(call => call[0] === "lte")
  assert.equal(cutoff[1], "published_at"); assert.equal(now[1], "published_at")
  assert.equal(Date.parse(now[2]) - Date.parse(cutoff[2]), 7 * 86400000)
  assert.deepEqual(calls.filter(call => call[0] === "order"), [["order", "is_pinned", { ascending: false }], ["order", "published_at", { ascending: false }], ["order", "id", { ascending: false }]])
  assert.deepEqual(calls.at(-1), ["limit", 3])
  failed = true
  await assert.rejects(fetch, /Unavailable/)
})

test("republishing restarts seven-day visibility; old pins and edits cannot extend expiry", () => {
  const { isWithinDashboardWindow } = createSourceLoader()("src/features/calendar/query.ts")
  const now = new Date("2026-11-08T12:34:56Z")
  const entry = post(1, { is_pinned: true, published_at: "2026-11-01T12:34:56Z", updated_at: now.toISOString() })
  assert.equal(isWithinDashboardWindow(entry.published_at, now), false)
  entry.published_at = "2026-11-08T12:00:00Z"
  assert.equal(isWithinDashboardWindow(entry.published_at, now), true)
  assert.equal(isWithinDashboardWindow("2026-11-01T12:34:56.001Z", now), true)
  assert.equal(isWithinDashboardWindow("2026-11-08T12:34:56.001Z", now), false)
})

test("dashboard boundary hides admin, empty and failed results while preserving role and auth guards", async () => {
  let role = "admin", entries = [], failed = false, denied = false, calls = 0
  const load = createSourceLoader({
    "@/features/auth/server": { requireCurrentAccount: async () => { if (denied) throw Error("Forbidden"); return { role } } },
    "@/services/calendar/query": { fetchDashboardPosts: async () => { calls++; if (failed) throw Error("private database failure"); return entries } },
    "next/navigation": { useRouter: () => ({}) },
  })
  const { DashboardAnnouncements } = load("src/components/calendar/dashboard-announcements.tsx")
  assert.equal(await DashboardAnnouncements(), null); assert.equal(calls, 0)
  role = "teacher"
  assert.equal(await DashboardAnnouncements(), null)
  entries = [post(1)]
  for (role of ["teacher", "student"]) {
    const result = await DashboardAnnouncements()
    assert.equal(result.props.role, role); assert.deepEqual(result.props.entries, entries)
  }
  failed = true
  assert.equal(await DashboardAnnouncements(), null)
  denied = true
  await assert.rejects(DashboardAnnouncements, /Forbidden/)
})

test("post markup includes scope, tags, dates, safe excerpts and role calendar links without read controls", () => {
  const load = createSourceLoader({ "next/navigation": { useRouter: () => ({}) } })
  const { AnnouncementPosts } = load("src/components/calendar/announcement-posts.tsx")
  const entries = [post(1, { title: "<script>Storm</script>", reason: "<unsafe>" + "x".repeat(300), description: "Hidden description", tags: ["no_classes"], attendance_impact: "no_classes", campuses: ["Main Campus"], is_pinned: true, ends_on: "2026-11-07" }), post(2)]
  for (const role of ["teacher", "student"]) {
    const html = renderToStaticMarkup(React.createElement(AnnouncementPosts, { entries, role }))
    assert.match(html, /Pinned/); assert.match(html, /No classes/); assert.match(html, /Campus: Main Campus/); assert.match(html, /Campus: All campuses/)
    assert.match(html, /Nov 5, 2026.*Nov 7, 2026/); assert.match(html, /&lt;script&gt;Storm&lt;\/script&gt;/); assert.match(html, /&lt;unsafe&gt;/)
    assert.ok(html.includes(`href="/${role}/calendar?date=2026-11-05"`))
    assert.doesNotMatch(html, /Hidden description|<script>|Mark all read|Notify recipients/)
    assert.equal(html.includes("x".repeat(241)), false)
  }
  assert.equal(renderToStaticMarkup(React.createElement(AnnouncementPosts, { entries: [], role: "student" })), "")
})

test("dashboard posts stream above KPIs and post failures do not replace attendance content", async () => {
  const noop = () => null
  for (const role of ["teacher", "student"]) {
    const feature = `@/features/attendance/${role}-dashboard`
    const load = createSourceLoader({
      [feature]: { [role === "teacher" ? "getTeacherDashboardData" : "getStudentDashboardData"]: async () => ({ today: "2026-11-05", kpis: {}, student: {} }) },
      "@/components/calendar/dashboard-announcements": { DashboardAnnouncements: noop },
      "@/components/live-refresh": { LiveRefresh: noop },
      "next/navigation": { useRouter: () => ({}) },
    })
    const Page = load(`src/app/(portal)/${role}/dashboard/page.tsx`).default
    const contentElement = Page().props.children[1].props.children
    const content = await contentElement.type()
    const children = content.props.children
    const postsIndex = children.findIndex(child => child?.props?.children?.type === noop)
    assert.ok(postsIndex >= 0)
    assert.equal(children[postsIndex].props.fallback, null)
    const offset = role === "teacher" ? 2 : 1
    assert.equal(children[postsIndex + offset].type, "h2")
    assert.equal(typeof children[postsIndex + offset + 1].type, "function")
  }
})
