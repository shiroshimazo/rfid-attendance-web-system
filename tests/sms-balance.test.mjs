import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

const originalFetch = globalThis.fetch
const original = Object.fromEntries(['PHILSMS_API_TOKEN','PHILSMS_API_URL'].map(key => [key,process.env[key]]))
afterEach(() => {
  globalThis.fetch = originalFetch
  for (const [key,value] of Object.entries(original)) {
    if(value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})
function setup({denied=false,payload={status:'success',data:{remaining_balance:'₱1'}},http=200}={}) {
  process.env.PHILSMS_API_TOKEN='test-token'
  delete process.env.PHILSMS_API_URL
  const calls=[]
  globalThis.fetch=async (...args) => { calls.push(args); return Response.json(payload,{status:http}) }
  const service=createSourceLoader({
    'server-only':{},
    '@/features/auth/server':{requireRole:async role => {assert.equal(role,'admin');if(denied)throw Error('denied')}},
  })('src/services/sms/balance.ts')
  return {...service,calls}
}
test('reads current PhilSMS balance with server-side token, preserving provider units and zero',async () => {
  const service=setup()
  assert.deepEqual(await service.fetchSmsBalance(),{status:'available',remaining:'₱1'})
  const [url,options]=service.calls[0]
  assert.equal(String(url),'https://app.philsms.com/api/v3/balance')
  assert.equal(options.method,'GET')
  assert.equal(options.headers.Authorization,'Bearer test-token')
  assert.equal(options.cache,'no-store')
  assert.equal(options.redirect,'error')
  assert.equal(options.body,undefined)
  const zero=setup({payload:{status:'success',data:{remaining_balance:0}}})
  assert.deepEqual(await zero.fetchSmsBalance(),{status:'available',remaining:'0'})
})
test('authorization and configuration failures never contact provider',async () => {
  const denied=setup({denied:true})
  await assert.rejects(denied.fetchSmsBalance(),/denied/)
  assert.equal(denied.calls.length,0)
  const service=setup()
  process.env.PHILSMS_API_URL='https://untrusted.test/api/v3/sms/send'
  assert.deepEqual(await service.fetchSmsBalance(),{status:'not-configured'})
  delete process.env.PHILSMS_API_URL
  delete process.env.PHILSMS_API_TOKEN
  assert.deepEqual(await service.fetchSmsBalance(),{status:'not-configured'})
  assert.equal(service.calls.length,0)
})
test('provider failures and malformed responses show unavailable, never fake zero credits',async () => {
  for(const payload of [{status:'error'}, {status:'success',data:{}}, {status:'success',data:{remaining_balance:''}}]) {
    assert.deepEqual(await setup({payload}).fetchSmsBalance(),{status:'unavailable'})
  }
  assert.deepEqual(await setup({http:503}).fetchSmsBalance(),{status:'unavailable'})
  const service=setup()
  globalThis.fetch=async () => {throw Error('timeout')}
  assert.deepEqual(await service.fetchSmsBalance(),{status:'unavailable'})
})
