import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const user = { id: "user-id", user_metadata: { full_name: "Account name" } }
const account = { id: user.id, email: "account@school.example", role: "admin", status: "active" }
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
function loadAuth(client) {
  return createSourceLoader({
    "@/services/supabase/config": { isSupabaseConfigured: () => true },
    "@/services/supabase/server": { createServerSupabaseClient: async () => client },
    "next/navigation": { redirect: path => { throw Error(`redirect:${path}`) } },
  })("src/features/auth/server.ts")
}

test("auth validates identity first, then overlaps verification and account reads", { timeout: 3000 }, async () => {
  const identity = deferred(), verification = deferred(), profile = deferred(), started = deferred()
  let reads = 0
  function begin() { if (++reads === 2) started.resolve() }
  const client = {
    auth: { getUser: () => identity.promise },
    rpc: name => { assert.equal(name, "has_verified_email_session"); begin(); return verification.promise },
    from: table => {
      assert.equal(table, "users")
      const query = { select: () => query, eq: (column, id) => { assert.equal(column, "id"); assert.equal(id, user.id); return query }, maybeSingle: () => { begin(); return profile.promise } }
      return query
    },
  }
  const result = loadAuth(client).getCurrentAccount()
  assert.equal(reads, 0)
  identity.resolve({ data: { user } })
  await started.promise
  assert.equal(reads, 2)
  verification.resolve({ data: true, error: null }); profile.resolve({ data: account })
  assert.deepEqual(await result, { ...account, name: "Account name" })
})

test("parallel auth reads still fail closed and preserve role/status guards", async () => {
  for (const scenario of ["missing-user", "unverified", "verification-error", "missing-account", "invalid-role", "inactive", "wrong-role", "valid"]) {
    let reads = 0
    const row = scenario === "missing-account" ? null : { ...account, role: scenario === "invalid-role" ? "owner" : scenario === "wrong-role" ? "teacher" : "admin", status: scenario === "inactive" ? "inactive" : "active" }
    const query = { select: () => query, eq: () => query, maybeSingle: async () => { reads++; return { data: row } } }
    const auth = loadAuth({
      auth: { getUser: async () => ({ data: { user: scenario === "missing-user" ? null : user } }) },
      rpc: async () => { reads++; return { data: scenario !== "unverified", error: scenario === "verification-error" ? { message: "Unavailable" } : null } },
      from: () => query,
    })
    if (["missing-user", "unverified", "verification-error", "missing-account", "invalid-role"].includes(scenario)) {
      assert.equal(await auth.getCurrentAccount(), null, scenario)
      if (scenario === "missing-user") assert.equal(reads, 0)
    } else if (scenario === "inactive") await assert.rejects(auth.requireRole("admin"), /redirect:\/errors\/unauthorized/)
    else if (scenario === "wrong-role") await assert.rejects(auth.requireRole("admin"), /redirect:\/teacher\/dashboard/)
    else assert.equal((await auth.requireRole("admin")).id, user.id)
  }
})
