import assert from "node:assert/strict"
import { test } from "node:test"
import { createClient } from "@supabase/supabase-js"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { PasswordRecovery, recoveryErrorMessage } = createSourceLoader()("src/features/auth/password-recovery.ts")

// Exercise the real SDK against a local fake Auth transport. No real email is
// sent and no hosted account/password is changed by this suite.
function fixture(role = "student") {
  const calls = []
  const user = { id: "00000000-0000-4000-8000-000000000001", email: `${role}@example.test`,
    app_metadata: { role, status: "active" }, user_metadata: {}, aud: "authenticated",
    created_at: new Date().toISOString() }
  const backend = { requestError: null, verifyError: null, updateError: null, logoutError: null,
    used: false, session: false, password: "Old-password-123" }
  let clientOptions
  const load = createSourceLoader({
    "@/services/supabase/config": {
      isSupabaseConfigured: () => true,
      supabaseUrl: "https://recovery.example.test",
      supabasePublishableKey: "test-publishable-key",
    },
    "@supabase/supabase-js": {
      createClient: (url, key, options) => {
        clientOptions = options
        return createClient(url, key, { ...options, global: { fetch: async (url, init) => {
          const path = new URL(url).pathname.replace("/auth/v1", "")
          const body = init.body ? JSON.parse(init.body) : undefined
          calls.push({ path, method: init.method, body, search: new URL(url).search })
          const response = (value, status = 200) => new Response(JSON.stringify(value), {
            status, headers: { "Content-Type": "application/json", "X-Supabase-Api-Version": "2024-01-01" },
          })
          const error = (code, status = 400) => response({ code, msg: "Private backend detail" }, status)
          if (path === "/recover") {
            if (backend.requestError) return error(backend.requestError, backend.requestError.startsWith("over_") ? 429 : 400)
            backend.used = false
            return response({})
          }
          if (path === "/verify") {
            if (backend.verifyError) return error(backend.verifyError)
            if (body.type !== "recovery" || body.token !== "012345" || backend.used) return error("otp_expired")
            backend.used = true
            backend.session = true
            const jwt = [Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
              Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600,
                amr: [{ method: "recovery", timestamp: Math.floor(Date.now() / 1000) }] })).toString("base64url"), "test-signature"].join(".")
            return response({ access_token: jwt, refresh_token: "test-refresh-token",
              token_type: "bearer", expires_in: 3600, user })
          }
          if (path === "/user" && init.method === "PUT") {
            if (backend.updateError) return error(backend.updateError)
            if (!backend.session) return error("session_not_found", 401)
            assert.deepEqual(Object.keys(body).sort(), ["code_challenge", "code_challenge_method", "password"])
            assert.equal(body.code_challenge, null)
            assert.equal(body.code_challenge_method, null)
            backend.password = body.password
            return response(user)
          }
          if (path === "/logout") {
            if (backend.logoutError) return error(backend.logoutError, 500)
            backend.session = false
            return response({})
          }
          assert.fail(`Unexpected Auth request: ${init.method} ${path}`)
        } } })
      },
    },
  })
  const client = load("src/services/supabase/recovery.ts").createRecoverySupabaseClient()
  return { flow: new PasswordRecovery(client.auth), client, backend, calls, user, clientOptions }
}

async function verified(f) {
  await f.flow.request(f.user.email)
  await f.flow.verify("012345")
}

for (const role of ["admin", "teacher", "student"]) {
  test(`${role}: email → recovery code → password → local sign-out, preserving account metadata`, async () => {
    const f = fixture(role)
    const original = structuredClone(f.user)
    await f.flow.request(`  ${role.toUpperCase()}@EXAMPLE.TEST  `)
    assert.equal(f.flow.snapshot.step, "code")
    assert.equal(f.flow.snapshot.email, f.user.email)
    assert.equal((await f.client.auth.getSession()).data.session, null)
    await f.flow.verify("012345")
    assert.equal(f.flow.snapshot.step, "password")
    await f.flow.save("New-password-456", "New-password-456")
    assert.equal(f.flow.snapshot.step, "complete")
    assert.equal(f.backend.password, "New-password-456")
    assert.equal((await f.client.auth.getSession()).data.session, null)
    assert.deepEqual(f.user, original)
    assert.deepEqual(f.calls.map(call => call.path), ["/recover", "/verify", "/user", "/logout"])
    assert.deepEqual(f.calls[1].body, {
      email: f.user.email, token: "012345", type: "recovery", gotrue_meta_security: {},
    })
    assert.equal(f.calls.at(-1).search, "?scope=local")
  })
}

test("recovery client does not persist or import portal/URL sessions", () => {
  const f = fixture()
  assert.equal(f.clientOptions.auth.persistSession, false)
  assert.equal(f.clientOptions.auth.detectSessionInUrl, false)
  assert.equal(f.clientOptions.auth.autoRefreshToken, false)
  assert.equal(f.clientOptions.auth.storageKey, "rfid-password-recovery")
})

test("password writes and verification cannot skip steps", async () => {
  const f = fixture()
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Verify your recovery code/)
  await assert.rejects(f.flow.verify("012345"), /Request a recovery code first/)
  await assert.rejects(f.flow.request("not-an-email"), /valid email/)
  assert.equal(f.calls.length, 0)
  await f.flow.request(f.user.email)
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Verify your recovery code/)
  assert.equal(f.calls.length, 1)
})

test("only six numeric digits are sent to verification, including a leading zero", async () => {
  const f = fixture()
  await f.flow.request(f.user.email)
  for (const code of ["", "12345", "1234567", "abcdef", "12 345"]) {
    await assert.rejects(f.flow.verify(code), /six-digit/)
  }
  assert.equal(f.calls.length, 1)
  await f.flow.verify("012345")
  assert.equal(f.flow.snapshot.step, "password")
  await f.flow.restart()
})

for (const code of ["otp_expired", "otp_disabled"]) {
  test(`${code}: backend rejection keeps password entry locked`, async () => {
    const f = fixture()
    await f.flow.request(f.user.email)
    f.backend.verifyError = code
    await assert.rejects(f.flow.verify("012345"), /invalid or has expired/)
    assert.equal(f.flow.snapshot.step, "code")
    await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Verify your recovery code/)
    assert.equal(f.backend.password, "Old-password-123")
  })
}

test("mismatched, too short, and too long passwords never reach Supabase", async () => {
  const f = fixture()
  await verified(f)
  await assert.rejects(f.flow.save("New-password-456", "different-password"), /Passwords do not match/)
  await assert.rejects(f.flow.save("short", "short"), /at least 8/)
  await assert.rejects(f.flow.save("a".repeat(73), "a".repeat(73)), /at most 72/)
  assert.equal(f.calls.filter(call => call.path === "/user").length, 0)
  assert.equal(f.flow.snapshot.step, "password")
  await f.flow.restart()
})

test("backend password-policy rejection allows retry without repeating code verification", async () => {
  const f = fixture()
  await verified(f)
  f.backend.updateError = "weak_password"
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /stronger password/)
  assert.equal(f.flow.snapshot.step, "password")
  f.backend.updateError = null
  await f.flow.save("Stronger-password-456!", "Stronger-password-456!")
  assert.equal(f.flow.snapshot.step, "complete")
})

test("successful password save is not repeated when sign-out needs retry", async () => {
  const f = fixture()
  await verified(f)
  f.backend.logoutError = "unexpected_failure"
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /password was saved/)
  assert.equal(f.flow.snapshot.step, "complete")
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Verify your recovery code/)
  f.backend.logoutError = null
  await f.flow.finish()
  assert.equal(f.calls.filter(call => call.path === "/user").length, 1)
  assert.equal((await f.client.auth.getSession()).data.session, null)
})

test("resend cooldown survives changing email and allows resend after 60 seconds", async (t) => {
  let now = Date.now()
  t.mock.method(Date, "now", () => now)
  const f = fixture()
  await f.flow.request(f.user.email)
  await assert.rejects(f.flow.request(f.user.email), /Please wait/)
  await f.flow.restart()
  await assert.rejects(f.flow.request("other@example.test"), /Please wait/)
  now += 60_000
  await f.flow.request(f.user.email)
  assert.equal(f.calls.filter(call => call.path === "/recover").length, 2)
})

test("server rate limits are respected and do not expose backend details", async () => {
  const f = fixture()
  f.backend.requestError = "over_email_send_rate_limit"
  await assert.rejects(f.flow.request(f.user.email), /Too many attempts/)
  assert.equal(f.flow.snapshot.step, "email")
  await assert.rejects(f.flow.request(f.user.email), /Please wait/)
  assert.equal(f.calls.length, 1)
})

test("unknown or disabled account responses produce the same request step", async () => {
  for (const code of [null, "user_not_found", "user_banned", "email_not_confirmed"]) {
    const f = fixture()
    f.backend.requestError = code
    await f.flow.request(f.user.email)
    assert.equal(f.flow.snapshot.step, "code")
  }
})

test("delivery failure remains on email entry with safe retry feedback", async () => {
  const f = fixture()
  f.backend.requestError = "unexpected_failure"
  await assert.rejects(f.flow.request(f.user.email), /Unable to send/)
  assert.equal(f.flow.snapshot.step, "email")
  assert.equal(recoveryErrorMessage(new Error("secret internal detail")), "Unable to connect. Please try again.")
})

test("restart revokes the verified session and locks password updates again", async () => {
  const f = fixture()
  await verified(f)
  await f.flow.restart()
  assert.equal(f.flow.snapshot.step, "email")
  assert.equal((await f.client.auth.getSession()).data.session, null)
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Verify your recovery code/)
})

test("concurrent submissions cannot send duplicate recovery emails", async () => {
  const f = fixture()
  const first = f.flow.request(f.user.email)
  await assert.rejects(f.flow.request(f.user.email), /current request/)
  await first
  assert.equal(f.calls.length, 1)
})

test("leaving during verification closes its eventual session", async () => {
  const f = fixture()
  await f.flow.request(f.user.email)
  const verify = f.flow.verify("012345")
  f.flow.dispose()
  await verify
  assert.equal((await f.client.auth.getSession()).data.session, null)
  await assert.rejects(f.flow.save("New-password-456", "New-password-456"), /Start over/)
})
