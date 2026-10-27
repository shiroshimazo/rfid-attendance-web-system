import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const row = (id, overrides = {}) => ({ id, title: `Announcement ${id}`, tags: ["event"], attendance_impact: "normal", campuses: [], starts_on: "2026-11-05", ends_on: "2026-11-05", published_at: "2026-11-01T00:00:00Z", updated_at: "2026-11-01T00:00:00Z", read_at: null, ...overrides })
const view = createSourceLoader()("src/features/calendar/notification-view.ts")

test("latest unread ignores current receipts and pinned ordering; edits become unread", () => {
  const entries = [row(1), row(2, { published_at: "2026-11-02T00:00:00Z", read_at: "2026-11-03T00:00:00Z" }), row(3, { published_at: "2026-11-02T00:00:00Z", read_at: "2026-10-31T00:00:00Z" })]
  assert.equal(view.latestUnreadCalendarEntry(entries).id, 3)
  assert.equal(view.latestUnreadCalendarEntry([entries[1]]), undefined)
  assert.equal(view.isCalendarUnread(entries[0].updated_at, entries[0].updated_at), false)
})

test("session toast is once per user, stays optional with blocked storage, and leads with exception state", () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  assert.equal(view.claimCalendarSessionToast("teacher", storage), true)
  assert.equal(view.claimCalendarSessionToast("teacher", storage), false)
  assert.equal(view.claimCalendarSessionToast("student", storage), true)
  assert.equal(view.claimCalendarSessionToast("blocked", { getItem() { throw Error("Denied") } }), false)
  assert.equal(view.claimCalendarSessionToast("full", { getItem() {}, setItem() { throw Error("Quota") } }), false)
  for (const [impact, prefix] of [["no_classes", "No classes:"], ["online_manual", "Online class:"]]) {
    const content = view.calendarToastContent(row(1, { attendance_impact: impact, campuses: ["Main Campus"], ends_on: "2026-11-07" }))
    assert.ok(content.title.startsWith(prefix)); assert.match(content.description, /Nov 5, 2026.*Nov 7, 2026.*Main Campus/)
  }
})

test("bell query excludes drafts/cancellations, caps 20 and reads only the caller's receipts", async () => {
  let reads = 0
  const client = { from(table) {
    const calls = []
    const query = { then: (yes, no) => Promise.resolve().then(() => {
      if (table === "calendar_entries") {
        assert.ok(calls.some(call => call[0] === "eq" && call[1] === "status" && call[2] === "published"))
        assert.ok(calls.some(call => call[0] === "limit" && call[1] === 20))
        assert.ok(calls.some(call => call[0] === "or" && /^ends_on.gte.*published_at.gte/.test(call[1])))
        return { data: [row(1), row(2)], error: null }
      }
      reads++
      assert.deepEqual(calls.find(call => call[0] === "eq"), ["eq", "user_id", "owner"])
      assert.deepEqual(calls.find(call => call[0] === "in"), ["in", "entry_id", [1, 2]])
      return { data: [{ entry_id: 2, read_at: "2026-11-03T00:00:00Z" }], error: null }
    }).then(yes, no) }
    for (const name of ["select", "eq", "or", "order", "limit", "in"]) query[name] = (...args) => { calls.push([name, ...args]); return query }
    return query
  } }
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => client } })
  const entries = await load("src/services/calendar/query.ts").fetchCalendarBellEntries("owner")
  assert.equal(entries[0].read_at, null); assert.equal(entries[1].read_at, "2026-11-03T00:00:00Z"); assert.equal(reads, 1)
})

test("notification boundary excludes admins/inactive users and safely hides failed reads", async () => {
  let calls = 0, failed = false
  const load = createSourceLoader({
    "@/services/calendar/query": { fetchCalendarBellEntries: async id => { calls++; assert.equal(id, "owner"); if (failed) throw Error("missing table / secret"); return [row(1)] } },
    "@/components/calendar/notification-bell": { NotificationBell() {} },
    "next/navigation": {}, "@/features/calendar/actions": {}, "@/components/ui/goey-toaster": {},
  })
  const { CalendarNotifications } = load("src/components/calendar/notifications.tsx")
  assert.equal(await CalendarNotifications({ account: { role: "admin", status: "active" } }), null)
  assert.equal(await CalendarNotifications({ account: { role: "student", status: "inactive" } }), null)
  assert.equal(calls, 0)
  for (const role of ["teacher", "student"]) {
    const bell = await CalendarNotifications({ account: { id: "owner", role, status: "active" } })
    assert.equal(bell.props.role, role); assert.equal(bell.props.userId, "owner"); assert.equal(bell.props.entries.length, 1)
  }
  failed = true
  assert.equal(await CalendarNotifications({ account: { id: "owner", role: "teacher", status: "active" } }), null)
})

test("bell renders accurate unread count, including edited entries, and an accessible empty trigger", () => {
  const load = createSourceLoader({ "next/navigation": { useRouter: () => ({}) }, "@/features/calendar/actions": {}, "@/components/ui/goey-toaster": {} })
  const { NotificationBell } = load("src/components/calendar/notification-bell.tsx")
  const html = renderToStaticMarkup(React.createElement(NotificationBell, { entries: [row(1), row(2, { read_at: "2026-11-03T00:00:00Z" }), row(3, { read_at: "2026-10-31T00:00:00Z" })], userId: "owner", role: "student" }))
  assert.match(html, /Announcements, 2 unread/)
  const empty = renderToStaticMarkup(React.createElement(NotificationBell, { entries: [], userId: "owner", role: "teacher" }))
  assert.match(empty, /Announcements, 0 unread/)
})

test("portal keeps children and realtime mounted independently of the notification query", async () => {
  let role = "student"
  const noop = () => null
  const load = createSourceLoader({
    "@/features/auth/server": { requireCurrentAccount: async () => ({ id: "owner", role, name: "User", email: "user@example.test" }) },
    "@/components/app-sidebar": { AppSidebar: noop }, "@/components/site-header": { SiteHeader: noop },
    "@/components/ui/sidebar": { SidebarProvider: noop, SidebarInset: noop },
    "@/components/live-refresh": { LiveRefresh: noop }, "@/components/calendar/notifications": { CalendarNotifications: noop },
  })
  const Layout = load("src/app/(portal)/layout.tsx").default
  const student = await Layout({ children: "portal-content" })
  const children = student.props.children[1].props.children
  assert.deepEqual(children[0].props.tables, ["calendar_entries", "calendar_entry_reads", "attendance_day_marks"])
  assert.equal(children[1].props.notifications.props.fallback, null)
  assert.equal(children[2].props.children, "portal-content")
  role = "admin"
  const admin = (await Layout({ children: "portal-content" })).props.children[1].props.children
  assert.equal(admin[0], false); assert.equal(admin[1].props.notifications, null)
})
