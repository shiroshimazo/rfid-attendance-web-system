import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const accounts = {
  student: {
    id: "20000000-0000-0000-0000-000000000001",
    email: "student@example.test",
  },
  teacher: {
    id: "30000000-0000-0000-0000-000000000001",
    email: "teacher@example.test",
  },
}

function fixture(role) {
  const account = accounts[role]
  const state = {
    user: { id: account.id, email: account.email },
    passwordCheck: { ok: true },
    checks: [],
    updates: [],
  }

  const server = {
    auth: {
      getUser: async () => ({ data: { user: state.user }, error: null }),
      updateUser: async (payload) => {
        state.updates.push(payload)
        return { data: { user: state.user }, error: null }
      },
    },
  }

  const load = createSourceLoader({
    "@/services/audit/log": {
      auditActivity: async (_event, _entity, operation) => operation(),
      auditRoute: async (_event, _entity, operation) => operation(),
    },
    "@/features/auth/server": {
      requireRole: async (requiredRole) => ({
        id: account.id,
        email: account.email,
        name: "Portal User",
        role: requiredRole,
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

  return { actions: load("src/features/profiles/actions.ts"), state, account }
}

const actionNames = {
  student: "changeStudentPasswordAction",
  teacher: "changeTeacherPasswordAction",
}

for (const role of ["student", "teacher"]) {
  const actionName = actionNames[role]

  test(`${role} password change requires the current password`, async () => {
    const { actions, state } = fixture(role)

    const result = await actions[actionName]({
      password: "new-password-1",
      confirmPassword: "new-password-1",
    })

    assert.equal(result.ok, false)
    assert.equal(result.fieldErrors.currentPassword, "Enter your current password")
    assert.equal(state.updates.length, 0)
  })

  test(`${role} password change rejects a wrong current password`, async () => {
    const { actions, state } = fixture(role)
    state.passwordCheck = { ok: false, message: "That is not your current password." }

    const result = await actions[actionName]({
      currentPassword: "wrong-password",
      password: "new-password-1",
      confirmPassword: "new-password-1",
    })

    assert.equal(result.ok, false)
    assert.equal(result.fieldErrors.currentPassword, "That is not your current password.")
    assert.equal(state.updates.length, 0)
  })

  test(`${role} password change stores the new password after proof`, async () => {
    const { actions, state, account } = fixture(role)

    const result = await actions[actionName]({
      currentPassword: "correct-password",
      password: "new-password-1",
      confirmPassword: "new-password-1",
    })

    assert.equal(result.ok, true)
    assert.deepEqual(state.checks, [
      { userId: account.id, email: account.email, password: "correct-password" },
    ])
    assert.deepEqual(state.updates[0], { password: "new-password-1" })
  })

  test(`${role} password change still requires matching confirmation`, async () => {
    const { actions, state } = fixture(role)

    const result = await actions[actionName]({
      currentPassword: "correct-password",
      password: "new-password-1",
      confirmPassword: "new-password-2",
    })

    assert.equal(result.ok, false)
    assert.equal(result.fieldErrors.confirmPassword, "Passwords do not match")
    assert.equal(state.updates.length, 0)
  })
}
