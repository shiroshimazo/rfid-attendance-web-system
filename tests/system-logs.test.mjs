import assert from "node:assert/strict"
import { test } from "node:test"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function harness({outage=false}={}) {
  const records=[]
  const load=createSourceLoader({
    "@/features/auth/server":{getCurrentAccount:async()=>({id:'admin-id',name:'Admin',role:'admin'})},
    "@/services/supabase/admin":{createAdminSupabaseClient:()=>({from(table){assert.equal(table,'system_logs');return {insert:async record=>{if(outage)throw Error('PRIVATE CONNECTION STRING');records.push(record);return {error:null}}}}})},
  })
  return {...load('src/services/audit/log.ts'),records,load}
}
test('action audit preserves success/failure results without retaining payloads or errors',async()=>{
  const h=harness()
  const success={ok:true,message:'PRIVATE STUDENT NAME'}
  assert.equal(await h.auditActivity('create_student','students',async()=>success),success)
  await h.auditActivity('update_student','students',async()=>({ok:false,message:'SECRET PASSWORD'}))
  await assert.rejects(h.auditActivity('update_student','students',async()=>{throw Error('SECRET TOKEN')}),/SECRET TOKEN/)
  const denied=Object.assign(Error('redirect'),{digest:'NEXT_REDIRECT;replace;/sign-in;307;'})
  await assert.rejects(h.auditActivity('update_student','students',async()=>{throw denied}),/redirect/)
  assert.deepEqual(h.records.map(row=>row.outcome),['success','failed','failed','denied'])
  assert(!JSON.stringify(h.records).includes('SECRET'))
  assert(!JSON.stringify(h.records).includes('PRIVATE'))
})
test('route audit distinguishes denied, failed and completed requests without reading bodies',async()=>{
  const h=harness()
  for(const status of [401,403,422,500,200]) {
    const response=new Response('SECRET BODY',{status})
    assert.equal(await h.auditRoute('rfid_tap','rfid_cards',async()=>response),response)
  }
  assert.deepEqual(h.records.map(row=>row.outcome),['denied','denied','failed','failed','success'])
  assert(!JSON.stringify(h.records).includes('SECRET'))
})
test('audit outage does not misreport an already completed operation',async()=>{
  const h=harness({outage:true})
  const original=console.error;const errors=[];console.error=(message)=>errors.push(message)
  try {assert.equal(await h.auditActivity('save','students',async()=>42),42)} finally {console.error=original}
  assert.equal(errors.length,1)
  assert(!errors[0].includes('PRIVATE'))
})
test('log filters validate dates, bound pagination and remove query grammar',()=>{
  const {parseLogQuery,logPageUrl}=harness().load('src/features/system-logs/query.ts')
  const now=new Date('2026-09-15T01:00:00Z')
  assert.deepEqual(parseLogQuery({},now),{search:'',entity:'all',outcome:'all',from:'2026-09-09',to:'2026-09-15',page:1})
  const q=parseLogQuery({search:'test%,(event.eq.secret)',entity:'invalid',outcome:'invalid',from:'2026-02-30',page:'-9'},now)
  assert.equal(q.from,'2026-09-09');assert.equal(q.page,1);assert(!/[%,()]/.test(q.search))
  assert.equal(parseLogQuery({from:'2026-09-15',to:'2026-09-01'},now).from,'2026-09-01')
  assert(logPageUrl(q,2).includes('page=2'))
})
