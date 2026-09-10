import assert from "node:assert/strict"
import { after, test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const originalKey = process.env.RFID_DEVICE_API_KEY
const key = "local-test-device-secret-with-32-characters"
after(() => {
  if (originalKey === undefined) delete process.env.RFID_DEVICE_API_KEY
  else process.env.RFID_DEVICE_API_KEY = originalKey
})
const requestId = "10000000-0000-4000-8000-000000000001"
function setup({ configured = true, error = null, data = { ok: true, action: "time_in" }, throws = false } = {}) {
  process.env.RFID_DEVICE_API_KEY = key
  const calls = []
  const smsCalls = []
  const load = createSourceLoader({
    "@/services/sms/philsms": { deliverArrivalSms: async id => { smsCalls.push(id) } },
    "@/services/supabase/admin": {
      isSupabaseAdminConfigured: () => configured,
      createAdminSupabaseClient: () => ({ rpc: async (...args) => {
        calls.push(args)
        if (throws) throw new Error("private database details")
        return { data, error }
      } }),
    },
  })
  const { POST } = load("src/app/api/rfid/tap/route.ts")
  const send = (body = { requestId, uid: "00:00:00:11" }, headers = {}) => POST(new Request("http://localhost/api/rfid/tap", {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }))
  return { calls, send, smsCalls }
}
test("only an authenticated device reaches the service-role writer", async () => {
  const { calls, send } = setup()
  for (const authorization of ["", "Bearer incorrect", "Bearer " + key + "suffix"]) {
    const response = await send(undefined, { authorization })
    assert.equal(response.status, 401)
    assert.deepEqual((await response.json()).feedback, { led: "red", buzzer: "warning" })
  }
  assert.deepEqual(calls, [])
})
test("missing server or weak device configuration fails closed", async () => {
  let fixture = setup({ configured: false })
  assert.equal((await fixture.send()).status, 503)
  assert.deepEqual(fixture.calls, [])
  fixture = setup(); process.env.RFID_DEVICE_API_KEY = "short"
  assert.equal((await fixture.send()).status, 503)
  assert.deepEqual(fixture.calls, [])
})
test("invalid UID, JSON, timestamp injection and oversize bodies never reach SQL", async () => {
  const { calls, send } = setup()
  for (const body of ["{", {}, { requestId: "bad", uid: "00000011" }, { requestId, uid: "123" },
    { requestId, uid: "00000011", timestamp: "2026-01-01" }, { requestId, uid: "00000011", studentId: 1 }]) {
    assert.equal((await send(body)).status, 400)
  }
  assert.equal((await send("x".repeat(1025))).status, 413)
  assert.equal((await send(undefined, { "content-type": "text/plain" })).status, 415)
  assert.deepEqual(calls, [])
})
test("normalized UID and request ID alone reach SQL; device gets uncached result", async () => {
  const { calls, send } = setup()
  const response = await send()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("cache-control"), "no-store")
  assert.deepEqual(calls, [["record_rfid_tap", { p_request_id: requestId, p_uid: "00000011" }]])
})
test("invalid card and conflict responses keep their database feedback", async () => {
  for (const [code, status] of [["INVALID_CARD", 422], ["REQUEST_ID_CONFLICT", 409]]) {
    const data = { ok: false, code, feedback: { led: "red", buzzer: "warning" } }
    const { send } = setup({ data })
    const response = await send()
    assert.equal(response.status, status)
    assert.deepEqual(await response.json(), data)
  }
})
test("failures never expose credentials/database errors or claim a successful tap", async () => {
  for (const options of [{ error: { message: "private database details" } }, { data: null }, { throws: true }]) {
    const { send } = setup(options)
    const response = await send()
    assert.equal(response.status, 503)
    const result = await response.json()
    assert.equal(result.ok, false)
    assert.match(result.message, /same request ID/)
    assert(!JSON.stringify(result).includes("private"))
  }
})

test("only successful arrivals (including safe retries) invoke the SMS dispatcher", async () => {
  for (const [data, expected] of [[{ok:true,action:"time_in",attendanceId:5},[5]], [{ok:true,action:"time_in",attendanceId:5,replayed:true},[5]], [{ok:true,action:"time_out",attendanceId:5},[]], [{ok:false,code:"DAY_COMPLETE"},[]]]) {
    const x=setup({data}); await x.send(); assert.deepEqual(x.smsCalls,expected)
  }
})
