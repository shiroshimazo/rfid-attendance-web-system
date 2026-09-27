// Real subject controls with local fixtures; optional tooling matches report-export.browser.mjs.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const tools = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = tools("esbuild")
const { chromium } = tools("playwright")
const bundle = await build({
  stdin: { contents: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { Toaster } from 'sonner';
    import { TeacherSubjectConsole } from '@/features/subject-attendance/teacher-console';
    import { SubjectSchedulesEditor } from '@/features/subject-attendance/schedules-editor';
    import { SubjectRecords } from '@/features/subject-attendance/records';
    import { SubjectEnrollmentEditor } from '@/features/subject-attendance/enrollment-editor';
    const common={program_id:1,year_level:'2nd Year',section:'21001',campus:'Main Campus'};
    const schedules=[1,2].map(id=>({...common,id,roster_version:1,teacher_id:1,course_id:id,day_of_week:2,time_start:id===1?'08:00':'09:00',time_end:id===1?'09:00':'10:00',status:'active',course:{course_code:'SUB'+id,course_name:'Subject '+id},teacher:{full_name:'Teacher'}}));
    const students=Array.from({length:25},(_,i)=>({...common,id:i+1,student_id:'S'+(i+1),full_name:'Student '+(i+1)}));
    window.saved=[]; window.fail=false;
    function App(){
      const [records,setRecords]=React.useState([]); const [date,setDate]=React.useState('2026-09-08'); window.changeDate=setDate;
      const [enrollments,setEnrollments]=React.useState([1,2].flatMap(id=>students.map(student=>({schedule_id:id,student_id:student.id,active:true}))));
      const [currentSchedules,setSchedules]=React.useState(schedules);
      const [evidence,setEvidence]=React.useState([{student_id:2,time_in:'08:01',time_out:null}]);
      window.unavailable=()=>setEvidence(null);
      window.enrollFixture=async input=>{
        window.enrollmentSaved=input;
        if(window.fail) return {ok:false,message:'Enrollment save failed'};
        setEnrollments(old=>[...old.filter(row=>row.schedule_id!==input.scheduleId),...input.studentIds.map(id=>({schedule_id:input.scheduleId,student_id:id,active:true}))]);
        setSchedules(old=>old.map(row=>row.id===input.scheduleId?{...row,roster_version:row.roster_version+1}:row));
        return {ok:true,message:'Enrollment saved'};
      };
      window.confirmFixture=async input=>{
        window.saved.push(input);
        await new Promise(resolve=>setTimeout(resolve,150));
        if(window.fail) return {ok:false,message:'Injected save failure'};
        const schedule=schedules.find(row=>row.id===input.scheduleId);
        const row={...common,id:input.scheduleId,schedule_id:input.scheduleId,student_id:1,student_name:'Cardless Student',student_number:'CARDLESS',attendance_date:input.date,attendance_status:input.status,time_start:schedule.time_start,time_end:schedule.time_end,teacher_name:'Teacher',course_code:schedule.course.course_code,course_name:schedule.course.course_name,program_code:'BSIT',confirmed_at:new Date().toISOString()};
        setRecords(old=>[...old.filter(item=>item.schedule_id!==row.schedule_id),row]);
        return {ok:true,message:'Saved'};
      };
      return <><TeacherSubjectConsole schedules={currentSchedules} students={students} records={records} enrollments={enrollments} evidence={evidence} date={date} today="2026-09-15"/>
        <SubjectRecords rows={records}/>
        <SubjectEnrollmentEditor schedules={currentSchedules} students={students} enrollments={enrollments}/>
        <SubjectSchedulesEditor assignments={[{id:10,year_level:'2nd Year',section:'21001',campus:'Main Campus',teacher:{full_name:'Teacher',status:'active'},course:{course_code:'SUB1',course_name:'Subject 1'}}]} schedules={[...schedules,{...schedules[0],id:99,status:"archived",course:{course_code:"ARCHIVED_ONLY",course_name:"Archived Subject"}}]}/><Toaster/></>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "boundaries", setup(builder) {
    builder.onResolve({ filter: /^@\/components\/ui\/goey-toaster$/ }, () => ({ path: "toast", namespace: "fixture" }))
    builder.onResolve({ filter: /^@\/features\/subject-attendance\/actions$/ }, () => ({ path: "actions", namespace: "fixture" }))
    builder.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: "navigation", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({ resolveDir: root, contents: args.path === "toast" ? 'export { toast as gooeyToast } from "sonner";' : args.path === "navigation"
      ? 'export const useRouter=()=>({refresh(){},push(url){window.pushed=url}});'
      : 'export const saveSubjectEnrollmentAction=input=>window.enrollFixture(input); export const confirmSubjectAction=input=>window.confirmFixture(input); export const createSubjectScheduleAction=async input=>{window.scheduleSaved=input;return {ok:true,message:"Schedule saved"}}; export const editSubjectScheduleAction=async input=>{window.scheduleEdited=input;return {ok:true,message:"Schedule updated"}}; export const retireSubjectScheduleAction=async id=>{window.retired=id;return {ok:true,message:"Schedule retired"}};' }))
  } }],
})
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "application/javascript"); res.end(bundle.outputFiles[0].text) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)

  const sheet=page.locator('[data-slot="card"]').filter({has:page.getByText('Confirm Attendance by Subject',{exact:true})});
  assert.equal(await sheet.locator('tbody tr').count(),25);
  await sheet.getByRole('button',{name:'Present',exact:true}).first().click();
  await page.waitForFunction(()=>window.saved.length===1);
  await sheet.getByRole('button',{name:'Present',exact:true}).first().waitFor();
  await page.waitForFunction(()=>document.querySelector('tbody tr button').disabled && !document.body.textContent.includes('Saving confirmation'));
  await page.evaluate(()=>window.changeDate('2026-09-15'));
  await sheet.getByText('Attendance sheet ? Sep 15, 2026',{exact:true}).waitFor();
  assert.equal(await sheet.getByText('Not confirmed yet',{exact:true}).count(),25);
  await page.evaluate(()=>window.changeDate('2026-09-08'));
  await sheet.getByText('Attendance sheet ? Sep 8, 2026',{exact:true}).waitFor();
  assert.equal(await sheet.getByText('Not confirmed yet',{exact:true}).count(),24);
  assert.equal(await sheet.locator('tbody tr').count(),25);
  console.log('PASS: full 25-student sheet, new scheduled date starts unconfirmed, previous date retains confirmation');
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
