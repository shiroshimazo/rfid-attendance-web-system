import assert from "node:assert/strict"
import { test, describe, mock, beforeEach, afterEach } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

describe("calendar actions", () => {
  let loader
  let actions

  beforeEach(() => {
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async () => ({ data: null, error: null }),
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")
  })

  afterEach(() => {
    mock.restoreAll()
  })

  test("saveCalendarEntryAction: rejects non-admin (throws redirect)", async () => {
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => { throw new Error("Forbidden") },
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({ rpc: async () => ({ data: null, error: null }) }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    await assert.rejects(
      actions.saveCalendarEntryAction({
        title: "Test",
        tags: ["event"],
        attendanceImpact: "normal",
        audience: "everyone",
        campuses: [],
        startsOn: "2026-10-26",
        endsOn: "2026-10-26",
      }),
      /Forbidden/
    )
  })

  test("saveCalendarEntryAction: validates payload with calendarEntrySchema", async () => {
    const result = await actions.saveCalendarEntryAction({
      title: "",
      tags: ["event"],
      attendanceImpact: "normal",
      audience: "everyone",
      campuses: [],
      startsOn: "2026-10-26",
      endsOn: "2026-10-26",
    })

    assert.equal(result.ok, false)
    assert.ok(result.fieldErrors?.title)
  })

  test("saveCalendarEntryAction: validates attendance impact matches tags", async () => {
    const result = await actions.saveCalendarEntryAction({
      title: "Test",
      tags: ["no_classes"],
      attendanceImpact: "normal",
      audience: "everyone",
      campuses: [],
      startsOn: "2026-10-26",
      endsOn: "2026-10-26",
    })

    assert.equal(result.ok, false)
    assert.ok(result.fieldErrors?.attendanceImpact)
  })

  test("saveCalendarEntryAction: requires reason for attendance-impacting", async () => {
    const result = await actions.saveCalendarEntryAction({
      title: "Test",
      tags: ["no_classes"],
      attendanceImpact: "no_classes",
      audience: "everyone",
      campuses: [],
      startsOn: "2026-10-26",
      endsOn: "2026-10-26",
      reason: "",
    })

    assert.equal(result.ok, false)
    assert.ok(result.fieldErrors?.reason)
  })

  test("saveCalendarEntryAction: accepts valid normal entry", async () => {
    let rpcCalled = false
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name, payload) => {
            rpcCalled = true
            assert.equal(name, "save_calendar_entry")
            assert.ok(payload.p_payload)
            return { data: { ok: true, id: 123 }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.saveCalendarEntryAction({
      title: "Valid Entry",
      tags: ["event"],
      attendanceImpact: "normal",
      audience: "everyone",
      campuses: [],
      startsOn: "2026-10-26",
      endsOn: "2026-10-26",
    })

    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
  })

  test("publishCalendarEntryAction: rejects non-admin (throws redirect)", async () => {
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => { throw new Error("Forbidden") },
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({ rpc: async () => ({ data: null, error: null }) }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    await assert.rejects(
      actions.publishCalendarEntryAction(1),
      /Forbidden/
    )
  })

  test("publishCalendarEntryAction: calls publish RPC", async () => {
    let rpcCalled = false
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name) => {
            rpcCalled = true
            assert.equal(name, "publish_calendar_entry")
            return { data: { ok: true }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.publishCalendarEntryAction(42)
    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
  })

  test("republishCalendarEntryAction: calls same publish RPC", async () => {
    let rpcCalled = false
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name) => {
            rpcCalled = true
            assert.equal(name, "publish_calendar_entry")
            return { data: { ok: true }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.republishCalendarEntryAction(99)
    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
  })

  test("cancelCalendarEntryAction: calls cancel RPC", async () => {
    let rpcCalled = false
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name) => {
            rpcCalled = true
            assert.equal(name, "cancel_calendar_entry")
            return { data: { ok: true }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.cancelCalendarEntryAction(7)
    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
  })

  test("deleteCalendarDraftAction: calls delete RPC", async () => {
    let rpcCalled = false
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name) => {
            rpcCalled = true
            assert.equal(name, "delete_calendar_draft")
            return { data: { ok: true }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.deleteCalendarDraftAction(5)
    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
  })

  test("syncAttendanceMarksAction: calls sync RPC with date range", async () => {
    let rpcCalled = false
    let rpcParams = null
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => operation(),
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async (name, params) => {
            rpcCalled = true
            rpcParams = params
            assert.equal(name, "sync_attendance_day_marks")
            return { data: { inserted: 3, deleted: 1 }, error: null }
          },
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    const result = await actions.syncAttendanceMarksAction("2026-10-20", "2026-10-30")
    assert.equal(result.ok, true)
    assert.equal(rpcCalled, true)
    assert.equal(rpcParams.p_from_date, "2026-10-20")
    assert.equal(rpcParams.p_to_date, "2026-10-30")
    assert.match(result.message, /3 created, 1 removed/)
  })

  test("all actions audit with correct event names", async () => {
    const events = []
    loader = createSourceLoader({
      "next/cache": { revalidatePath: () => {} },
      "@/services/audit/log": {
        auditActivity: async (event, entity, operation) => {
          events.push({ event, entity })
          return operation()
        },
      },
      "@/features/auth/server": {
        requireRole: async () => ({ id: "admin-uuid", role: "admin", email: "admin@test", name: "Admin", status: "active" }),
      },
      "@/services/supabase/server": {
        createServerSupabaseClient: () => ({
          rpc: async () => ({ data: { ok: true, id: 1 }, error: null }),
        }),
      },
    })
    actions = loader("src/features/calendar/actions.ts")

    await actions.saveCalendarEntryAction({
      title: "Test", tags: ["event"], attendanceImpact: "normal", audience: "everyone", campuses: [],
      startsOn: "2026-10-26", endsOn: "2026-10-26",
    })
    await actions.publishCalendarEntryAction(1)
    await actions.republishCalendarEntryAction(2)
    await actions.cancelCalendarEntryAction(3)
    await actions.deleteCalendarDraftAction(4)
    await actions.syncAttendanceMarksAction("2026-10-01", "2026-10-31")

    assert.deepEqual(events.map(e => e.event), [
      "save_calendar_entry",
      "publish_calendar_entry",
      "republish_calendar_entry",
      "cancel_calendar_entry",
      "delete_calendar_draft",
      "sync_attendance_day_marks",
    ])
    assert.deepEqual(events.map(e => e.entity), [
      "calendar_entries",
      "calendar_entries",
      "calendar_entries",
      "calendar_entries",
      "calendar_entries",
      "attendance_day_marks",
    ])
  })
})