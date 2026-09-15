import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

const hash = value => createHash('sha256').update(value).digest('hex')
const userId = '10000000-0000-4000-8000-000000000001'
const credentials = {email:'teacher@example.test',password:'correct-password'}
const start = Date.parse('2026-09-13T00:00:00Z')
const duration = 72 * 60 * 60 * 1000

function fixture() {
  const store = new Map(), options = new Map(), tables = {
    users:[{id:userId,role:'teacher',status:'active'}],
    login_email_challenges:[], login_email_trust:[], email_verified_sessions:[],
  }
  const calls = [], published = []
  const state = {user:{id:userId,email:credentials.email}, passwordError:false, cookieError:false, fail:null}
  let sessionCount = 0, otpAvailable = false
  const jar = {
    get:name => store.has(name) ? {value:store.get(name)} : undefined,
    set:(name,value,settings) => {store.set(name,value);options.set(name,settings)},
    delete:name => store.delete(name),
  }
  function query(table) {
    let operation = 'select', values, filters = []
    const builder = {
      select:() => builder,
      insert:value => {operation='insert';values=value;return builder},
      delete:() => {operation='delete';return builder},
      eq:(key,value) => {filters.push(row=>row[key]===value);return builder},
      gt:(key,value) => {filters.push(row=>row[key]>value);return builder},
      then:(resolve,reject) => execute().then(resolve,reject),
      maybeSingle:async () => {const result=await execute();return {...result,data:result.data?.[0]??null}},
    }
    async function execute() {
      calls.push([table,operation])
      if(state.fail===`${table}:${operation}`) return {data:null,error:{message:'Injected failure'}}
      if(operation==='insert') {tables[table].push({...values});return {data:null,error:null}}
      const found=tables[table].filter(row=>filters.every(filter=>filter(row)))
      if(operation==='delete') tables[table]=tables[table].filter(row=>!found.includes(row))
      return {data:found,error:null}
    }
    return builder
  }
  const admin = {
    from:query,
    rpc:async (_name,{challenge_hash}) => {
      const row=tables.login_email_challenges.find(row=>row.token_hash===challenge_hash && row.expires_at>new Date().toISOString() && (row.attempts??0)<5)
      if(row) row.attempts=(row.attempts??0)+1
      return {data:row?[row]:[],error:null}
    },
  }
  function session() {
    const id=`20000000-0000-4000-8000-${String(++sessionCount).padStart(12,'0')}`
    return {access_token:`header.${Buffer.from(JSON.stringify({session_id:id})).toString('base64url')}.signature`,refresh_token:`refresh-${sessionCount}`}
  }
  const load = createSourceLoader({
    "@/services/audit/log": { auditActivity: async (_event, _entity, operation) => operation(), auditRoute: async (_event, _entity, operation) => operation() },
    './roles':createSourceLoader()('src/features/auth/roles.ts'),
    'next/headers':{cookies:async()=>jar},
    '@/services/supabase/admin':{createAdminSupabaseClient:()=>admin},
    '@/services/supabase/config':{supabaseUrl:'https://example.test',supabasePublishableKey:'test-key'},
    '@/services/supabase/server':{createServerSupabaseClient:async()=>({auth:{setSession:async value=>{
      if(state.cookieError) return {error:{message:'Cookie error'}}
      published.push(value);return {error:null}
    }}})},
    '@supabase/supabase-js':{createClient:()=>({auth:{
      signInWithPassword:async input=>{calls.push(['password',input]);return state.passwordError?{data:{},error:{message:'Invalid'}}:{data:{user:state.user,session:session()},error:null}},
      signOut:async()=>{calls.push(['signOut']);return {error:null}},
      signInWithOtp:async()=>{calls.push(['sendCode']);otpAvailable=true;return {error:null}},
      verifyOtp:async({token})=>{
        if(token!=='123456'||!otpAvailable) return {data:{},error:{message:'Invalid'}}
        otpAvailable=false;return {data:{user:state.user,session:session()},error:null}
      },
    }})},
  })
  return {actions:load('src/features/auth/email-login-actions.ts'),store,options,tables,calls,state,published}
}

async function verify(f) {
  assert.deepEqual(await f.actions.beginEmailLogin(credentials),{email:credentials.email})
  assert.deepEqual(await f.actions.verifyEmailLogin('123456'),{path:'/teacher/dashboard'})
}

test('successful verification creates hashed 72-hour browser proof and keeps the code short-lived', async t=>{
  t.mock.timers.enable({apis:['Date'],now:start})
  const f=fixture()
  assert.deepEqual(await f.actions.beginEmailLogin(credentials),{email:credentials.email})
  assert.equal(f.published.length,0)
  assert.equal(f.options.get('login-email-challenge').maxAge,600)
  assert.deepEqual(await f.actions.verifyEmailLogin('123456'),{path:'/teacher/dashboard'})
  const token=f.store.get('login-email-trust')
  assert.match(token,/^[a-f0-9]{64}$/)
  assert.equal(f.tables.login_email_trust[0].token_hash,hash(token))
  assert.equal(f.tables.login_email_trust[0].expires_at,new Date(start+duration).toISOString())
  assert.equal(f.options.get('login-email-trust').maxAge,259200)
  assert.equal(f.options.get('login-email-trust').httpOnly,true)
  assert.equal(f.options.get('login-email-trust').sameSite,'strict')
  assert.equal(f.store.has('login-email-challenge'),false)
  assert.equal(f.published.length,1)
  assert('error' in await f.actions.verifyEmailLogin('123456'))
})

test('logout and password login reuse trust without sending a code or extending its deadline',async t=>{
  t.mock.timers.enable({apis:['Date'],now:start})
  const f=fixture();await verify(f)
  const saved={...f.tables.login_email_trust[0]},token=f.store.get('login-email-trust')
  // Logout clears Auth cookies; the separate HttpOnly trust cookie survives.
  f.published.length=0
  t.mock.timers.setTime(start+duration-1)
  const signOuts=f.calls.filter(call=>call[0]==='signOut').length
  assert.deepEqual(await f.actions.beginEmailLogin(credentials),{path:'/teacher/dashboard'})
  assert.equal(f.calls.filter(call=>call[0]==='sendCode').length,1)
  assert.equal(f.calls.filter(call=>call[0]==='signOut').length,signOuts)
  assert.equal(f.tables.email_verified_sessions.length,2)
  assert.equal(f.published.length,1)
  assert.deepEqual(f.tables.login_email_trust,[saved])
  assert.equal(f.store.get('login-email-trust'),token)
  t.mock.timers.setTime(start+duration)
  assert.deepEqual(await f.actions.beginEmailLogin(credentials),{email:credentials.email})
  assert.equal(f.calls.filter(call=>call[0]==='sendCode').length,2)
  assert.equal(f.published.length,1)
})

test('another browser, tampered token, revoked proof, changed email and another account require a code',async t=>{
  t.mock.timers.enable({apis:['Date'],now:start})
  for(const change of [
    f=>f.store.delete('login-email-trust'),
    f=>f.store.set('login-email-trust','0'.repeat(64)),
    f=>f.store.set('login-email-trust','malformed'),
    f=>{f.tables.login_email_trust.length=0},
    f=>{f.state.user={...f.state.user,email:'changed@example.test'}},
    f=>{f.state.user={id:'10000000-0000-4000-8000-000000000002',email:credentials.email};f.tables.users.push({id:f.state.user.id,role:'student',status:'active'})},
  ]) {
    const f=fixture();await verify(f);change(f)
    assert.deepEqual(await f.actions.beginEmailLogin(credentials),{email:f.state.user.email})
    assert.equal(f.published.length,1)
  }
})

test('trust never skips password, account status or verified-session registration failures',async t=>{
  t.mock.timers.enable({apis:['Date'],now:start})
  for(const change of [
    f=>{f.state.passwordError=true},
    f=>{f.tables.users[0].status='inactive'},
    f=>{f.state.fail='email_verified_sessions:insert'},
    f=>{f.state.cookieError=true},
  ]) {
    const f=fixture();await verify(f);change(f)
    assert('error' in await f.actions.beginEmailLogin(credentials))
    assert.equal(f.published.length,1)
  }
})

test('invalid codes, expired challenges and trust-storage errors never publish a session or remember a browser',async t=>{
  t.mock.timers.enable({apis:['Date'],now:start})
  for(const mode of ['invalid','expired','storage']) {
    t.mock.timers.setTime(start)
    const f=fixture();await f.actions.beginEmailLogin(credentials)
    if(mode==='expired') t.mock.timers.setTime(start+600_000)
    if(mode==='storage') f.state.fail='login_email_trust:insert'
    assert('error' in await f.actions.verifyEmailLogin(mode==='invalid'?'000000':'123456'))
    assert.equal(f.published.length,0)
    assert.equal(f.store.has('login-email-trust'),false)
  }
})
