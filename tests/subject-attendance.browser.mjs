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
    const students=[{...common,id:1,student_id:'CARDLESS',full_name:'Cardless Student'}, {...common,id:2,student_id:'OTHER',full_name:'Other Campus',campus:'MV Campus'}];
    window.saved=[]; window.fail=false;
    function App(){
      const [records,setRecords]=React.useState([]);
      const [enrollments,setEnrollments]=React.useState([1,2].map(id=>({schedule_id:id,student_id:1,active:true})));
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
      return <><TeacherSubjectConsole schedules={currentSchedules} students={students} records={records} enrollments={enrollments} evidence={evidence} date="2026-09-08" today="2026-09-08"/>
        <SubjectRecords rows={records}/>
        <SubjectEnrollmentEditor schedules={currentSchedules} students={students} enrollments={enrollments}/>
        <SubjectSchedulesEditor assignments={[{id:10,year_level:'2nd Year',section:'21001',campus:'Main Campus',teacher:{full_name:'Teacher',status:'active'},course:{course_code:'SUB1',course_name:'Subject 1'}}]} schedules={schedules}/><Toaster/></>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "boundaries", setup(builder) {
    builder.onResolve({ filter: /^@\/features\/subject-attendance\/actions$/ }, () => ({ path: "actions", namespace: "fixture" }))
    builder.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: "navigation", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({ contents: args.path === "navigation"
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
  assert.equal(await page.getByLabel("Scheduled subject").inputValue(), '1')
  await page.getByText('No tap recorded', {exact:true}).waitFor()
  await page.getByText("Not confirmed yet", { exact: true }).waitFor()
  assert.equal(await page.getByText("Other Campus", { exact: true }).count(), 0)
  await page.getByRole("button", { name: "Present", exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[aria-live="polite"]')?.textContent.includes('Present: 1'))
  await page.getByLabel("Scheduled subject").selectOption("2")
  await page.getByText("Not confirmed yet", { exact: true }).waitFor()
  await page.getByRole("button", { name: "Absent", exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[aria-live="polite"]')?.textContent.includes('Rate: 50.0%'))
  await page.getByLabel("Scheduled subject").selectOption("1")
  assert(await page.getByRole("button", { name: "Present", exact: true }).isDisabled())
  await page.evaluate(() => { window.fail = true })
  await page.getByRole("button", { name: "Absent", exact: true }).click()
  await page.getByText("Injected save failure", { exact: true }).waitFor()
  assert(await page.getByRole("button", { name: "Present", exact: true }).isDisabled())
  const saved = await page.evaluate(() => window.saved)
  assert.equal(saved[0].scheduleId, 1); assert.equal(saved[1].scheduleId, 2)
  assert.equal(saved[0].expectedConfirmedAt, null)
  assert(saved[2].expectedConfirmedAt)
  assert(saved.every(row => !('timeIn' in row) && !('rfidCardId' in row)))
  await page.evaluate(() => { window.fail = false })
  await page.getByLabel("Scheduled subject").selectOption("2")
  await page.getByRole("button", { name: "Late", exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[aria-live="polite"]')?.textContent.includes('Rate: 100.0%'))
  assert(await page.getByRole("button", { name: "Late", exact: true }).isDisabled())
  await page.getByRole("button", { name: "Add subject schedule" }).click()
  await page.getByLabel("Teaching assignment").fill("Teacher")
  await page.getByRole("option").filter({hasText:'SUB1'}).click()
  await page.getByLabel("Weekday", {exact:true}).click()
  await page.getByRole('option', {name:'Monday',exact:true}).click()
  await page.getByLabel("Start time", { exact: true }).fill("08:00")
  await page.getByLabel("End time", { exact: true }).fill("09:00")
  await page.getByRole('button', {name:'Add',exact:true}).click()
  await page.waitForFunction(() => Boolean(window.scheduleSaved))
  assert.deepEqual(await page.evaluate(() => window.scheduleSaved), { assignmentId: 10, day: 1, start: "08:00", end: "09:00" })
  await page.getByRole("button", { name: "Actions for SUB1 on Tuesday", exact: true }).click()
  await page.getByRole('menuitem', {name:'Edit schedule time'}).click()
  const dialog = page.getByRole("dialog")
  await dialog.getByLabel("Start time", { exact: true }).fill("10:00")
  await dialog.getByLabel("End time", { exact: true }).fill("11:00")
  assert.equal(await page.evaluate(() => window.scheduleEdited), undefined)
  await dialog.getByRole("button", { name: "Save changes" }).click()
  await page.waitForFunction(() => Boolean(window.scheduleEdited))
  assert.deepEqual(await page.evaluate(() => window.scheduleEdited), { scheduleId: 1, start: "10:00", end: "11:00", expectedStart: "08:00", expectedEnd: "09:00" })
  await page.getByRole("button", { name: "Actions for SUB1 on Tuesday", exact: true }).click()
  await page.getByRole("menuitem", { name: "Retire schedule" }).click()
  await page.waitForFunction(() => window.retired === 1)

  await page.getByLabel('Subject session', {exact:true}).selectOption('1')
  await page.getByRole('checkbox', {name:'Enroll Other Campus (OTHER)',exact:true}).check()
  await page.getByLabel('Search students for enrollment').fill('CARDLESS')
  await page.getByRole('button', {name:'Save enrollment',exact:true}).click()
  await page.waitForFunction(()=>window.enrollmentSaved?.studentIds.includes(2))
  assert.deepEqual(await page.evaluate(()=>window.enrollmentSaved), {scheduleId:1,studentIds:[1,2],expectedVersion:1})
  await page.getByLabel('Scheduled subject').selectOption('1')
  await page.getByText('Tapped in', {exact:true}).waitFor()
  await page.getByText('No tap recorded', {exact:true}).waitFor()
  await page.getByRole('checkbox', {name:'Enroll Other Campus (OTHER)',exact:true}).uncheck()
  await page.evaluate(()=>{window.fail=true})
  await page.getByRole('button', {name:'Save enrollment',exact:true}).click()
  await page.getByText('Enrollment save failed', {exact:true}).waitFor()
  assert.equal(await page.getByText('Tapped in', {exact:true}).count(),1)
  await page.evaluate(()=>{window.fail=false;window.unavailable()})
  assert.equal(await page.getByText('RFID evidence unavailable', {exact:true}).count(),2)
  assert.equal(await page.getByRole('button',{name:'Absent',exact:true}).first().isEnabled(),true)
  await page.getByRole('button', {name:'Save enrollment',exact:true}).click()
  await page.waitForFunction(()=>!document.body.textContent.includes('Tapped in') && document.querySelectorAll('input[type=checkbox]:checked').length===1)
  await page.getByRole('checkbox', {name:'Enroll Cardless Student (CARDLESS)',exact:true}).uncheck()
  await page.getByRole('button', {name:'Save enrollment',exact:true}).click()
  await page.getByText(/No active students enrolled/).waitFor()
  assert.deepEqual(errors, [])
  console.log("PASS: automatic roster, no-tap Present/Late/Absent, RFID indicators/failure, enrollment add/remove/search/failure/empty state, retained history, schedule creation/retirement")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
