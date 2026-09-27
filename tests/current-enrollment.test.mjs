import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

function setup({ denied = false, missing = false, empty = false, teacherError = null } = {}) {
  const calls = []
  const teacherCalls = []
  const builder = {
    select() { return this },
    eq(...args) { calls.push(args); return this },
    async maybeSingle() { return {data: missing ? null : {id:7}, error:null} },
  }
  const load = createSourceLoader({
    'server-only': {},
    '@/services/supabase/admin': {createAdminSupabaseClient: () => ({
      from(table) {
        teacherCalls.push(['from',table])
        return {
          select(columns) { teacherCalls.push(['select',columns]); return this },
          in(column,ids) { teacherCalls.push(['in',column,ids]); return this },
          async returns() { return {data:[{id:11,full_name:'Assigned Teacher'}],error:teacherError} },
        }
      },
    })},
    '@/features/auth/server': {requireRole:async role => {assert.equal(role,'student'); if(denied)throw Error('denied'); return {id:'own-user'}}},
    '@/services/supabase/server': {createServerSupabaseClient:async () => ({from:() => builder})},
    '@/services/attendance/subject-attendance': {
      fetchSubjectEnrollments:async () => [
        {student_id:7,schedule_id:1,active:true},
        {student_id:7,schedule_id:2,active:false},
        {student_id:8,schedule_id:3,active:true},
        {student_id:7,schedule_id:4,active:true},
      ],
      fetchSubjectSchedules:async () => empty ? [] : [1,2,3,4,5].map(id => ({id,teacher_id:id+10,status:id===4?'archived':'active'})),
    },
  })
  return {...load('src/features/subject-attendance/current-enrollment.ts'),calls,teacherCalls}
}
test('current enrollment includes only own active enrollments and active schedules',async () => {
  const service=setup()
  const result=await service.getCurrentEnrollment()
  assert.deepEqual(result.schedules.map(row=>row.id),[1])
  assert.deepEqual(service.calls,[['user_id','own-user']])
  assert.deepEqual(result.schedules[0].teacher,{full_name:'Assigned Teacher'})
  assert.deepEqual(service.teacherCalls,[['from','teachers'],['select','id, full_name'],['in','id',[11]]])
})
test('nonstudents and missing profiles cannot read enrollment',async () => {
  const service=setup({denied:true})
  await assert.rejects(service.getCurrentEnrollment(),/denied/)
  assert.deepEqual(service.calls,[])
  assert.deepEqual(service.teacherCalls,[])
  await assert.rejects(setup({missing:true}).getCurrentEnrollment(),/No student record/)
})

test('empty enrollments skip privileged lookup; lookup errors preserve enrollment',async () => {
  const service=setup({empty:true})
  assert.deepEqual((await service.getCurrentEnrollment()).schedules,[])
  assert.deepEqual(service.teacherCalls,[])
  const failed = await setup({teacherError:{message:'failed'}}).getCurrentEnrollment()
  assert.equal(failed.teacherNamesUnavailable,true)
  assert.deepEqual(failed.schedules.map(row=>row.id),[1])
})
