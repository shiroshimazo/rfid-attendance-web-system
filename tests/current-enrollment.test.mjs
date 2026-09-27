import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

function setup({ denied = false, missing = false } = {}) {
  const calls = []
  const builder = {
    select() { return this },
    eq(...args) { calls.push(args); return this },
    async maybeSingle() { return {data: missing ? null : {id:7}, error:null} },
  }
  const load = createSourceLoader({
    '@/features/auth/server': {requireRole:async role => {assert.equal(role,'student'); if(denied)throw Error('denied'); return {id:'own-user'}}},
    '@/services/supabase/server': {createServerSupabaseClient:async () => ({from:() => builder})},
    '@/services/attendance/subject-attendance': {
      fetchSubjectEnrollments:async () => [
        {student_id:7,schedule_id:1,active:true},
        {student_id:7,schedule_id:2,active:false},
        {student_id:8,schedule_id:3,active:true},
        {student_id:7,schedule_id:4,active:true},
      ],
      fetchSubjectSchedules:async () => [1,2,3,4,5].map(id => ({id,status:id===4?'archived':'active'})),
    },
  })
  return {...load('src/features/subject-attendance/current-enrollment.ts'),calls}
}
test('current enrollment includes only own active enrollments and active schedules',async () => {
  const service=setup()
  const result=await service.getCurrentEnrollment()
  assert.deepEqual(result.schedules.map(row=>row.id),[1])
  assert.deepEqual(service.calls,[['user_id','own-user']])
})
test('nonstudents and missing profiles cannot read enrollment',async () => {
  const service=setup({denied:true})
  await assert.rejects(service.getCurrentEnrollment(),/denied/)
  assert.deepEqual(service.calls,[])
  await assert.rejects(setup({missing:true}).getCurrentEnrollment(),/No student record/)
})
