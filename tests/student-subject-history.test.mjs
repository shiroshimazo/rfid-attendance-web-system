import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createSourceLoader} from './helpers/load-typescript.mjs'
const load=createSourceLoader()
const {filterSubjectHistory,emptySubjectFilters}=load('src/features/subject-attendance/student-history-model.ts')
const {subjectTotals}=load('src/features/subject-attendance/model.ts')
const rows=[1,2,3].map(id=>({id,student_name:'Student',student_number:'STU-1',course_code:id===1?'SOSLIT':'ITE1',course_name:'Subject',teacher_name:'Teacher',section:'21003',campus:id===3?'Main Campus':'MV Campus',program_code:'BSIT',year_level:'2nd Year',attendance_date:`2026-09-0${id}`,time_start:'08:00',attendance_status:['Present','Late','Absent'][id-1]}))
test('inclusive range and combined filters operate on confirmation snapshots',()=>{
 const result=filterSubjectHistory(rows,{...emptySubjectFilters,search:'21003',from:'2026-09-02',to:'2026-09-03',subject:'ITE1',campus:'MV Campus'},'date','desc')
 assert.deepEqual(result.map(r=>r.id),[2]);assert.equal(subjectTotals(result).rate,100)
 assert.equal(subjectTotals(filterSubjectHistory(rows,{...emptySubjectFilters,search:'unknown'},'date','desc')).rate,null)
})
test('sorting is stable, does not mutate input, and result filters never invent records',()=>{
 const original=structuredClone(rows)
 assert.deepEqual(filterSubjectHistory(rows,emptySubjectFilters,'date','desc').map(r=>r.id),[3,2,1])
 assert.deepEqual(filterSubjectHistory(rows,{...emptySubjectFilters,result:'Absent'},'date','asc').map(r=>r.id),[3])
 assert.deepEqual(filterSubjectHistory(rows,{...emptySubjectFilters,from:'2026-09-04',to:'2026-09-01'},'date','asc'),[])
 assert.deepEqual(rows,original)
})
