import assert from "node:assert/strict"
import { test, afterEach } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"
const originalFetch = globalThis.fetch
const original = Object.fromEntries(["PHILSMS_ENABLED","PHILSMS_API_TOKEN","PHILSMS_SENDER_ID","PHILSMS_API_URL"].map(k=>[k,process.env[k]]))
afterEach(()=>{ globalThis.fetch=originalFetch; for(const [k,v] of Object.entries(original)) { if(v===undefined) delete process.env[k]; else process.env[k]=v } })
function setup({ claim = { id:1,recipient:'09171234567',message:'Student arrived at MV Campus.' }, failFinish=false }={}) {
  Object.assign(process.env,{PHILSMS_ENABLED:'true',PHILSMS_API_TOKEN:'test-token',PHILSMS_SENDER_ID:'School',PHILSMS_API_URL:'https://app.philsms.com/api/v3/sms/send'})
  const calls=[]; const sends=[]
  const load=createSourceLoader({'@/services/supabase/admin':{createAdminSupabaseClient:()=>({rpc:async(name,args)=>{
    calls.push([name,args]); if(name==='claim_arrival_sms') return {data:claim,error:null}
    if(failFinish) throw new Error('database unavailable')
    return {error:null}
  }})}})
  globalThis.fetch=async(url,options)=>{sends.push([url,options]); return Response.json({status:'success',data:{uid:'provider-1'}})}
  return {...load('src/services/sms/philsms.ts'),calls,sends}
}
test('normalizes Philippine mobile formats without network-prefix guessing or multi-recipient injection',()=>{
  const {normalizePhilippineMobile:n}=setup()
  for(const v of ['09171234567','+639171234567','639171234567','0917-123-4567']) assert.equal(n(v),'639171234567')
  for(const v of ['09911234567','09201234567']) assert.equal(n(v),'63'+v.slice(1))
  for(const v of ['123','09171234567,09911234567','abc','+12025550123']) assert.equal(n(v),null)
})
test('disabled or invalid configuration never claims or sends',async()=>{
  for(const [key,value] of [['PHILSMS_ENABLED','false'],['PHILSMS_API_TOKEN',''],['PHILSMS_SENDER_ID',''],['PHILSMS_API_URL','https://evil.test']]) {
    const x=setup(); process.env[key]=value; await x.deliverArrivalSms(1); assert.equal(x.calls.length,0); assert.equal(x.sends.length,0)
  }
})
test('accepted message persists Sent outcome once with recipient and campus message intact',async()=>{
  const x=setup(); await x.deliverArrivalSms(5)
  assert.equal(x.sends.length,1)
  const [url,opt]=x.sends[0]; assert.equal(url,'https://app.philsms.com/api/v3/sms/send')
  assert.equal(opt.headers.Authorization,'Bearer test-token'); assert.equal(opt.redirect,'error')
  assert.deepEqual(JSON.parse(opt.body),{recipient:'639171234567',sender_id:'School',type:'plain',message:'Student arrived at MV Campus.'})
  assert.equal(x.calls[1][1].p_result,'accepted'); assert.equal(x.calls[1][1].p_provider_id,'provider-1')
  assert.equal(x.calls[0][1].p_attempt,x.calls[1][1].p_attempt)
})
test('already claimed or historical arrival never sends',async()=>{
  const x=setup({claim:null}); await x.deliverArrivalSms(5); assert.equal(x.sends.length,0)
})
test('invalid guardian number persists failure without calling provider',async()=>{
  const x=setup({claim:{id:1,recipient:'invalid',message:'Arrival'}}); await x.deliverArrivalSms(5)
  assert.equal(x.sends.length,0); assert.equal(x.calls[1][1].p_result,'invalid_recipient')
})
test('provider rejection is Failed; timeouts and malformed success remain unknown',async()=>{
  for(const [response,expected] of [[()=>Response.json({status:'error'}, {status:401}),'rejected'],[()=>Response.json({status:'error'},{status:503}),'unknown'],[()=>new Response('bad json'),'unknown'],[()=>{throw new Error('timeout')},'unknown'],[()=>Response.json({status:'success',data:{status:'Failed'}}),'rejected']]) {
    const x=setup(); globalThis.fetch=async()=>response(); await x.deliverArrivalSms(5); assert.equal(x.calls[1][1].p_result,expected)
  }
})
test('Unicode names use unicode and completion failure never throws back to attendance',async()=>{
  const x=setup({claim:{id:1,recipient:'09911234567',message:'Jos\u00e9 arrived.'},failFinish:true})
  await assert.doesNotReject(()=>x.deliverArrivalSms(5)); assert.equal(JSON.parse(x.sends[0][1].body).type,'unicode')
})

