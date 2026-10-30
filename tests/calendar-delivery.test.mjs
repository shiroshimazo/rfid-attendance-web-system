import assert from "node:assert/strict"
import { test } from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

test("delivery search matches any tag across titles, IDs, recipients and roles", async () => {
  const calls = []
  const load = createSourceLoader({
    "@/services/supabase/server": { createServerSupabaseClient: () => ({ from: table => {
      const query = { then: resolve => resolve({ data: table === "calendar_entries" ? [{ id: 9 }] : [], count: 0, error: null }) }
      for (const method of ["select", "order", "or", "range"]) query[method] = (...args) => { calls.push([table, method, ...args]); return query }
      return query
    } }) },
  })
  const fetch = load("src/services/calendar/query.ts").fetchCalendarDeliveryLog
  await fetch(1, 10, { search: ["42", "TEACH"] })
  assert.deepEqual(calls.filter(call => call[1] === "or"), [
    ["calendar_entries", "or", 'title.ilike."%42%",title.ilike."%TEACH%"'],
    ["calendar_email_deliveries", "or", 'recipient_email.ilike."%42%",recipient_email.ilike."%TEACH%",recipient_role.in.(teacher),calendar_entry_id.in.(42,9)'],
  ])
  for (const [search, expected] of [["student", "recipient_role.in.(student)"], ["t", "recipient_role.in.(teacher,student)"], ["notice", null]]) {
    calls.length = 0
    await fetch(1, 10, { search: [search] })
    const filter = calls.find(call => call[0] === "calendar_email_deliveries" && call[1] === "or")[2]
    assert.ok(!filter.includes("recipient_role.ilike"))
    if (expected) assert.ok(filter.includes(expected))
    else assert.ok(!filter.includes("recipient_role."))
  }
})

test("delivery reads filter Manila dates, paginate stably and exclude stored email bodies", async () => {
  const calls = []
  const query = { then: resolve => resolve({ data: [], count: 0, error: null }) }
  for (const name of ["select", "order", "eq", "gte", "lte", "range"]) query[name] = (...args) => { calls.push([name, ...args]); return query }
  const load = createSourceLoader({ "@/services/supabase/server": { createServerSupabaseClient: () => ({ from: () => query }) } })
  await load("src/services/calendar/query.ts").fetchCalendarDeliveryLog(2, 25, { type: "updated", status: "Failed", from: "2026-10-01", to: "2026-10-31" })
  for (const expected of [["eq", "notification_type", "updated"], ["eq", "status", "Failed"], ["gte", "created_at", "2026-10-01T00:00:00+08:00"], ["lte", "created_at", "2026-10-31T23:59:59.999999+08:00"], ["range", 25, 49], ["order", "id", { ascending: false }]]) assert.ok(calls.some(call => JSON.stringify(call) === JSON.stringify(expected)))
  assert.doesNotMatch(calls[0][1], /html_body|text_body|\*/)
})

test("delivery panel guards access, normalizes filters and clamps stale pages", async () => {
  let denied = false
  const calls = []
  const load = createSourceLoader({
    "@/features/auth/server": { requireRole: async role => { assert.equal(role, "admin"); if (denied) throw Error("Forbidden") } },
    "@/services/calendar/query": { fetchCalendarDeliveryLog: async (...args) => { calls.push(args); return { deliveries: [], total: 26 } } },
  })
  const get = load("src/features/calendar/delivery.ts").getCalendarDeliveryPanel
  const result = await get({ page: "99", entry: "-1", status: "bad", type: ["published"], from: "2026-11-03", to: "2026-11-01" })
  assert.equal(result.page, 3); assert.equal(result.pageCount, 3)
  assert.equal(result.filters.from, "2026-11-01"); assert.equal(result.filters.to, "2026-11-03")
  assert.equal(result.filters.entryId, undefined); assert.equal(result.filters.status, undefined); assert.equal(result.filters.type, undefined)
  assert.deepEqual(result.filters.search, ["-1"])
  assert.deepEqual(calls.map(call => call[0]), [99, 3])
  denied = true
  await assert.rejects(() => get({}), /Forbidden/)
  assert.equal(calls.length, 2)
})

test("sync rejects invalid or oversized ranges before RPC and preserves counts", async () => {
  let calls = 0, denied = false
  const load = createSourceLoader({
    "next/cache": { revalidatePath() {} },
    "@/features/auth/server": { requireRole: async () => { if (denied) throw Error("Forbidden") } },
    "@/features/calendar/notifications": {},
    "@/services/audit/log": { auditActivity: async (_, __, action) => action() },
    "@/services/calendar/query": {},
    "@/services/supabase/server": { createServerSupabaseClient: () => ({ rpc: async () => { calls++; return { data: { inserted: 4, deleted: 2 }, error: null } } }) },
  })
  const sync = load("src/features/calendar/actions.ts").syncAttendanceMarksAction
  for (const [from, to] of [["bad", "2026-11-01"], ["2026-11-02", "2026-11-01"], ["2026-01-01", "2027-02-01"]]) assert.equal((await sync(from, to)).ok, false)
  assert.equal(calls, 0)
  assert.match((await sync("2026-11-01", "2026-11-03")).message, /4 created, 2 removed/)
  denied = true
  await assert.rejects(() => sync("2026-11-01", "2026-11-03"), /Forbidden/)
  assert.equal(calls, 1)
})

test("delivery table exposes retry only for definite failures and escapes recipient/error text", () => {
  const load = createSourceLoader({
    "next/navigation": { useRouter: () => ({}), usePathname: () => "/admin/schedules/calendar", useSearchParams: () => new URLSearchParams() },
    "@/components/live-refresh": { LiveRefresh: () => null },
    "@hugeicons/core-free-icons": { Search01Icon: [] },
    "./tag-input.module.css": { default: {} },
    "./delivery-controls": { DeliveryControl: () => null, DeliveryRetryMenu: () => React.createElement("button", null, "Retry email") },
    "@/features/calendar/actions": {},
  })
  const { DeliveryTable } = load("src/app/(portal)/admin/schedules/calendar/components/delivery-table.tsx")
  const rows = [ ["Failed", true], ["Failed", false], ["Pending", false], ["Sent", false] ].map(([status, retry_allowed], id) => ({ id, calendar_entry_id: 1, batch_id: "batch", notification_type: "published", recipient_email: "<script>evil</script>", recipient_role: "teacher", status, retry_allowed, attempt_count: 1, error_message: "<unsafe>", last_attempt_at: null, sent_at: null, calendar_entries: { title: "Event" } }))
  const html = renderToStaticMarkup(React.createElement(DeliveryTable, { panel: { deliveries: rows, total: 4, filters: {}, page: 1, pageCount: 1 }, today: "2026-11-01" }))
  assert.equal((html.match(/>Retry email</g) ?? []).length, 1)
  assert.match(html, /Search email deliveries/)
  assert.match(html, /&lt;unsafe&gt;/); assert.doesNotMatch(html, /<script>/)
})
