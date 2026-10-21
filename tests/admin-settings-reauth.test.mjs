import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const adminId = "10000000-0000-0000-0000-000000000001"
const adminEmail = "admin@example.test"
const currentPhone = "09171234567"

function fixture() {
  const state = {
    user: {
      id: adminId,
      email: adminEmail,
      user_metadata: { full_name: "Admin Example", phone: currentPhone, avatar_url: "" },
    },
    passwordCheck: { ok: true },
    checks: [],
    updates: [],
    userRowUpdates: [],
    updateError: null,
  }

  const server = {
    auth: {
      getUser: async () => ({ data: { user: state.user }, error: null }),
      updateUser: async (payload) => {
        state.updates.push(payload)
        if (state.updateError) return { data: { user: null }, error: state.updateError }
        return {
          data: { user: { ...state.user, email: payload.email ?? state.user.email } },
          error: null,
        }
      },
    },
    from: (table) => ({
      update: (values) => {
        state.userRowUpdates.push([table, values])
        return { eq: () => Promise.resolve({ error: null }) }
      },
    }),
  }

  const load = createSourceLoader({
    "@/services/audit/log": {
      auditActivity: async (_event, _entity, operation) => operation(),
      auditRoute: async (_event, _entity, operation) => operation(),
    },
    "@/features/auth/server": {
      requireRole: async (role) => ({
        id: adminId,
        email: adminEmail,
        name: "Admin Example",
        role,
        status: "active",
      }),
    },
    "@/features/auth/verify-password": {
      verifyAccountPassword: async (userId, email, password) => {
        state.checks.push({ userId, email, password })
        return state.passwordCheck
      },
    },
    "@/services/supabase/server": { createServerSupabaseClient: async () => server },
    "next/cache": { revalidatePath: () => {} },
  })

  return { actions: load("src/features/profiles/actions.ts"), state }
}

const profile = {
  fullName: "Admin Example",
  email: adminEmail,
  phoneNumber: currentPhone,
  avatarUrl: "",
}

test("a protected profile change without the current password is refused", async () => {
  const { actions, state } = fixture()

  const result = await actions.updateAdminProfileAction({
    ...profile,
    email: "moved@example.test",
  })

  assert.equal(result.ok, false)
  assert.ok(result.fieldErrors.currentPassword)
  assert.equal(state.updates.length, 0)
})

test("a wrong current password is refused and nothing is written", async () => {
  const { actions, state } = fixture()
  state.passwordCheck = { ok: false, message: "That is not your current password." }

  const result = await actions.updateAdminProfileAction({
    ...profile,
    email: "moved@example.test",
    currentPassword: "wrong-password",
  })

  assert.equal(result.ok, false)
  assert.equal(result.fieldErrors.currentPassword, "That is not your current password.")
  assert.equal(state.checks.length, 1)
  assert.equal(state.updates.length, 0)
})

test("a proven current password saves the protected change", async () => {
  const { actions, state } = fixture()

  const result = await actions.updateAdminProfileAction({
    ...profile,
    email: "moved@example.test",
    currentPassword: "correct-password",
  })

  assert.equal(result.ok, true)
  assert.equal(state.checks[0].userId, adminId)
  assert.equal(state.checks[0].email, adminEmail)
  assert.equal(state.updates[0].email, "moved@example.test")
})

test("a changed phone number is protected as well", async () => {
  const { actions, state } = fixture()

  const result = await actions.updateAdminProfileAction({
    ...profile,
    phoneNumber: "09181234567",
  })

  assert.equal(result.ok, false)
  assert.ok(result.fieldErrors.currentPassword)
  assert.equal(state.updates.length, 0)
})

test("a changed photo address is protected as well", async () => {
  const { actions, state } = fixture()

  const result = await actions.updateAdminProfileAction({
    ...profile,
    avatarUrl: "https://example.test/photo.jpg",
  })

  assert.equal(result.ok, false)
  assert.ok(result.fieldErrors.currentPassword)
  assert.equal(state.updates.length, 0)
})

test("a name-only change needs no password and never asks for one", async () => {
  const { actions, state } = fixture()

  const result = await actions.updateAdminProfileAction({
    ...profile,
    fullName: "Renamed Admin",
  })

  assert.equal(result.ok, true)
  assert.equal(state.checks.length, 0)
  assert.equal(state.updates[0].data.full_name, "Renamed Admin")
})

test("the password change requires the current password", async () => {
  const { actions, state } = fixture()

  const result = await actions.changeAdminPasswordAction({
    password: "new-password-1",
    confirmPassword: "new-password-1",
  })

  assert.equal(result.ok, false)
  assert.equal(result.fieldErrors.currentPassword, "Enter your current password")
  assert.equal(state.updates.length, 0)
})

test("a wrong current password blocks the password change", async () => {
  const { actions, state } = fixture()
  state.passwordCheck = { ok: false, message: "That is not your current password." }

  const result = await actions.changeAdminPasswordAction({
    currentPassword: "wrong-password",
    password: "new-password-1",
    confirmPassword: "new-password-1",
  })

  assert.equal(result.ok, false)
  assert.equal(result.fieldErrors.currentPassword, "That is not your current password.")
  assert.equal(state.updates.length, 0)
})

test("a proven current password stores the new password", async () => {
  const { actions, state } = fixture()

  const result = await actions.changeAdminPasswordAction({
    currentPassword: "correct-password",
    password: "new-password-1",
    confirmPassword: "new-password-1",
  })

  assert.equal(result.ok, true)
  assert.equal(state.checks.length, 1)
  assert.deepEqual(state.updates[0], { password: "new-password-1" })
})

test("mismatched confirmation still blocks the password change", async () => {
  const { actions, state } = fixture()

  const result = await actions.changeAdminPasswordAction({
    currentPassword: "correct-password",
    password: "new-password-1",
    confirmPassword: "new-password-2",
  })

  assert.equal(result.ok, false)
  assert.equal(result.fieldErrors.confirmPassword, "Passwords do not match")
  assert.equal(state.updates.length, 0)
})

function verifyFixture(signIn) {
  const calls = []
  const load = createSourceLoader({
    "@supabase/supabase-js": {
      createClient: () => ({
        auth: {
          signInWithPassword: async (input) => {
            calls.push(["signIn", input])
            return signIn(input)
          },
          signOut: async (options) => {
            calls.push(["signOut", options])
            return { error: null }
          },
        },
      }),
    },
    "@/services/supabase/config": {
      supabaseUrl: "https://example.test",
      supabasePublishableKey: "test-key",
    },
  })
  return { verify: load("src/features/auth/verify-password.ts").verifyAccountPassword, calls }
}

test("a correct password proves the account and closes the proof session", async () => {
  const { verify, calls } = verifyFixture(async () => ({
    data: { user: { id: adminId } },
    error: null,
  }))

  const result = await verify(adminId, adminEmail, "correct-password")

  assert.equal(result.ok, true)
  assert.deepEqual(calls[0], ["signIn", { email: adminEmail, password: "correct-password" }])
  assert.deepEqual(calls[1], ["signOut", { scope: "local" }])
})

test("a password of another account never proves the signed-in one", async () => {
  const { verify } = verifyFixture(async () => ({
    data: { user: { id: "20000000-0000-0000-0000-000000000009" } },
    error: null,
  }))

  const result = await verify(adminId, adminEmail, "correct-password")

  assert.equal(result.ok, false)
  assert.equal(result.message, "That is not your current password.")
})

test("a rejected password fails the check and still closes the proof session", async () => {
  const { verify, calls } = verifyFixture(async () => ({
    data: { user: null },
    error: { message: "Invalid login credentials" },
  }))

  const result = await verify(adminId, adminEmail, "wrong-password")

  assert.equal(result.ok, false)
  assert.equal(result.message, "That is not your current password.")
  assert.equal(calls[1][0], "signOut")
})

test("an empty password is refused before any request is made", async () => {
  const { verify, calls } = verifyFixture(async () => ({ data: { user: null }, error: null }))

  const result = await verify(adminId, adminEmail, "")

  assert.equal(result.ok, false)
  assert.equal(result.message, "Enter your current password.")
  assert.equal(calls.length, 0)
})
