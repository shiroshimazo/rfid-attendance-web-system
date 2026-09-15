import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function setup({ role = "admin", status = "active", missing = false, uploadError = null } = {}) {
  const uploads = []
  const buckets = []
  const storage = {
    getBucket: async () => ({ error: missing ? new Error("Missing") : null }),
    createBucket: async (...args) => { buckets.push(args); return { error: null } },
    from: () => ({
      upload: async (...args) => { uploads.push(args); return { error: uploadError } },
      getPublicUrl: (path) => ({ data: { publicUrl: `https://example.com/${path}` } }),
    }),
  }
  const load = createSourceLoader({
    "@/services/audit/log": { auditActivity: async (_event, _entity, operation) => operation(), auditRoute: async (_event, _entity, operation) => operation() },
    "@/features/auth/server": { getCurrentAccount: async () => ({ id: "admin-id", role, status }) },
    "@/services/supabase/admin": { createAdminSupabaseClient: () => ({ storage }) },
  })
  return { POST: load("src/app/api/teacher-profile-image/route.ts").POST, uploads, buckets }
}

function request(bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), type = "image/png") {
  const data = new FormData()
  data.set("file", new File([bytes], "photo.png", { type }))
  return new Request("https://example.com/api/teacher-profile-image", { method: "POST", body: data })
}

test("only active administrators can upload", async () => {
  for (const options of [{ role: "teacher" }, { status: "inactive" }]) {
    const { POST, uploads } = setup(options)
    assert.equal((await POST(request())).status, 403)
    assert.equal(uploads.length, 0)
  }
})

test("rejects empty, oversized, disguised, and mismatched images", async () => {
  const { POST, uploads } = setup()
  for (const input of [request(new Uint8Array()), request(new Uint8Array(2 * 1024 * 1024 + 1)), request("<svg></svg>"), request(undefined, "image/jpeg")]) {
    assert.equal((await POST(input)).status, 400)
  }
  assert.equal(uploads.length, 0)
})

test("creates storage when missing and returns persistent image URL", async () => {
  const { POST, uploads, buckets } = setup({ missing: true })
  const response = await POST(request())
  assert.equal(response.status, 200)
  assert.match((await response.json()).url, /^https:\/\/example.com\/admin-id\/.*\.png$/)
  assert.equal(buckets.length, 1)
  assert.equal(uploads[0][2].upsert, false)
  assert.equal(uploads[0][2].contentType, "image/png")
})

test("reports storage failure without returning a URL", async () => {
  const { POST } = setup({ uploadError: new Error("Private service error") })
  const response = await POST(request())
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: "Image upload failed. Please try again." })
})
