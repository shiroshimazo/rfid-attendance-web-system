import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

test('continuous events, reconnect, focus, offline recovery, midnight and cleanup', () => {
  const originals = Object.fromEntries(['window','document','setTimeout','clearTimeout','setInterval','clearInterval'].map(k=>[k,globalThis[k]]))
  const timers=new Map(), intervals=new Map(), windowEvents=new Map(), documentEvents=new Map()
  let counter=0, refreshes=0, cleanup, subscribe, removed=0, date='2026-09-09', dependencies
  const events=[]
  globalThis.setTimeout=fn=>{const id=++counter;timers.set(id,fn);return id}
  globalThis.clearTimeout=id=>timers.delete(id)
  globalThis.setInterval=fn=>{const id=++counter;intervals.set(id,fn);return id}
  globalThis.clearInterval=id=>intervals.delete(id)
  globalThis.window={addEventListener:(k,f)=>windowEvents.set(k,f),removeEventListener:k=>windowEvents.delete(k)}
  globalThis.document={visibilityState:'visible',addEventListener:(k,f)=>documentEvents.set(k,f),removeEventListener:k=>documentEvents.delete(k)}
  const flush=()=>{const callbacks=[...timers.values()];timers.clear();callbacks.forEach(f=>f())}
  try {
    const builder={on:(_event,filter,callback)=>{events.push({filter,callback});return builder},subscribe:callback=>{subscribe=callback}}
    const load=createSourceLoader({
      react:{useEffect:(fn,deps)=>{dependencies=deps;cleanup=fn()}},
      'next/navigation':{useRouter:()=>({refresh:()=>refreshes++})},
      '@/lib/school-time':{schoolDateKey:()=>date},
      '@/services/supabase/config':{isSupabaseConfigured:()=>true},
      '@/services/supabase/client':{createBrowserSupabaseClient:()=>({channel:()=>builder,removeChannel:()=>removed++})},
    })
    load('src/components/live-refresh.tsx').LiveRefresh({})
    assert.equal(typeof dependencies[2],'string')
    for(const name of ['attendance_records','sms_notifications','subject_attendance','teachers','teacher_assignments','class_schedules']) assert(events.some(e=>e.filter.table===name))
    subscribe('SUBSCRIBED');flush();assert.equal(refreshes,1)
    events[0].callback();const timer=[...timers.keys()][0]
    for(let i=0;i<100;i++) events[0].callback()
    assert.equal(timers.size,1);assert(timers.has(timer));flush();assert.equal(refreshes,2)
    events[0].callback();flush();assert.equal(refreshes,3)
    subscribe('CHANNEL_ERROR');[...intervals.values()][0]();flush();assert.equal(refreshes,4)
    subscribe('SUBSCRIBED');flush();assert.equal(refreshes,5)
    date='2026-09-10';[...intervals.values()][0]();flush();assert.equal(refreshes,6)
    intervals.values().next().value();assert.equal(timers.size,0)
    windowEvents.get('online')();flush();assert.equal(refreshes,7)
    documentEvents.get('visibilitychange')();flush();assert.equal(refreshes,8)
    events[0].callback();cleanup();assert.equal(timers.size,0);assert.equal(intervals.size,0)
    assert.equal(windowEvents.size,0);assert.equal(documentEvents.size,0);assert.equal(removed,1)
    subscribe('SUBSCRIBED');events[0].callback();assert.equal(timers.size,0)
  } finally {
    for(const [k,v] of Object.entries(originals)) {if(v===undefined) delete globalThis[k];else globalThis[k]=v}
  }
})

test('stored timestamps use Manila across midnight while date/time-only values stay unchanged',()=>{
  const {formatTimestamp,formatDateValue,formatClockTime}=createSourceLoader()('src/lib/format.ts')
  assert.equal(formatTimestamp('2026-09-09T16:01:00Z'),'Sep 10, 2026, 12:01 AM')
  assert.equal(formatTimestamp('2026-09-09T15:59:00Z'),'Sep 9, 2026, 11:59 PM')
  assert.equal(formatDateValue('2026-09-09'),'Sep 9, 2026')
  assert.equal(formatClockTime('06:15:00'),'6:15 AM')
})
