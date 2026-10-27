// Optional browser tooling lives outside the application dependency tree.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { readFile, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve, join } from "node:path"
import { createServer } from "node:http"
import postcss from "postcss"
import tailwind from "@tailwindcss/postcss"

const requireTools = createRequire(join(process.env.CALENDAR_BROWSER_TOOLS || join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = requireTools("esbuild")
const { chromium } = requireTools("playwright")
const output = await mkdtemp(join(tmpdir(), "calendar-dialog-check-"))
const root = process.cwd()
const fixture = `
import React from 'react'; import { createRoot } from 'react-dom/client';
import { EntryFormDialog } from '@/app/(portal)/admin/schedules/calendar/components/entry-form-dialog';
import { EntryActions } from '@/app/(portal)/admin/schedules/calendar/components/entry-actions';
import { CalendarPanel } from '@/app/(portal)/admin/schedules/calendar/components/calendar-panel';
import { DeliveryTable } from '@/app/(portal)/admin/schedules/calendar/components/delivery-table';
import { parseAdminCalendarQuery } from '@/features/calendar/admin-view';
import { DeliveryControl } from '@/app/(portal)/admin/schedules/calendar/components/delivery-controls';
import { ReaderCalendar } from '@/components/calendar/reader-calendar';
import { NotificationBell } from '@/components/calendar/notification-bell';
import { AnnouncementPosts } from '@/components/calendar/announcement-posts';
import { KpiCards as AdminKpis } from '@/app/(portal)/admin/dashboard/components/kpi-cards';
import { KpiCards as TeacherKpis } from '@/app/(portal)/teacher/dashboard/components/kpi-cards';
import { AttendanceDistributionChart } from '@/app/(portal)/admin/dashboard/components/attendance-distribution-chart';
import { AttendanceTrendChart } from '@/app/(portal)/admin/dashboard/components/attendance-trend-chart';
import { TodayAttendanceCard } from '@/app/(portal)/student/dashboard/components/today-attendance-card';
import { CampusStatusStrip } from '@/components/calendar/campus-status-strip';
import { buildDashboardCalendar } from '@/features/attendance/calendar-dashboard';
import { AttendanceTable as AdminDailyTable } from '@/app/(portal)/admin/attendance/components/attendance-table';
import { AttendanceTable as TeacherDailyTable } from '@/app/(portal)/teacher/attendance/components/attendance-table';
import { FiltersBar as DailyFilters } from '@/app/(portal)/admin/attendance/components/filters-bar';
import { KpiCards as DailyKpis } from '@/app/(portal)/admin/attendance/components/kpi-cards';
import { AttendanceHistoryTable } from '@/app/(portal)/student/my-attendance/components/attendance-history-table';
import { KpiCards as HistoryKpis } from '@/app/(portal)/student/my-attendance/components/kpi-cards';
import { CalendarExceptions } from '@/features/reports/calendar-exceptions';
import { SectionAttendanceTable } from '@/app/(portal)/teacher/reports/components/section-attendance-table';
import { KpiCards as TeacherReportKpis } from '@/app/(portal)/teacher/reports/components/kpi-cards';
const reportElement=document.createElement('section');reportElement.id='calendar-report';reportElement.className='@container/main space-y-4 p-4';document.body.appendChild(reportElement);const reportRoot=createRoot(reportElement);
window.__renderReport=()=>reportRoot.render(<><TeacherReportKpis kpis={{totalAssigned:2,totalPresent:0,totalAbsent:0,attendanceRate:null,rfidScans:2,noClasses:1,onlineManual:1}} sessionDays={2}/><CalendarExceptions rows={[{date:'2026-11-04',campus:'Old Campus',status:'NoClasses',students:1},{date:'2026-11-05',campus:'MV Campus',status:'OnlineManual',students:1}]}/><SectionAttendanceTable rows={[{key:'old',program:'IT',yearLevel:'1st Year',section:'A',campus:'Old Campus',total:1,present:0,late:0,absent:0,rate:null}]} rangeLabel="Nov 4 to Nov 5, 2026"/></>);
const dailyElement=document.createElement('section');dailyElement.id='calendar-daily';dailyElement.className='@container/main space-y-5 p-4';document.body.appendChild(dailyElement);const dailyRoot=createRoot(dailyElement);
window.__renderDaily=(status='all')=>{const rows=['NoClasses','Present','OnlineManual','NoRecord'].map((status,index)=>({id:index+1,name:'Student '+(index+1),studentId:'S-'+(index+1),programCode:'IT',programName:'Computing',section:'A',yearLevel:'1st Year',campus:index===0?'Main Campus':index===2?'Bulacan Campus':'MV Campus',status,timeIn:index<2?'07:00:00':null,timeOut:index===0?'15:00:00':null,rfidStatus:'Active'}));const visible=status==='all'?rows:rows.filter(row=>row.status===status);const history=[{id:'calendar:1:2026-11-05',hasTap:false,date:'2026-11-05',status:'NoClasses',campus:'Main Campus',timeIn:null,timeOut:null,rfidNumber:null,rfidStatus:'Unassigned',smsStatus:null,smsSentAt:null},{id:10,hasTap:true,date:'2026-11-04',status:'OnlineManual',recordedStatus:'Present',campus:'Old Campus',tapCampus:'Tap Campus',timeIn:'07:00:00',timeOut:'15:00:00',rfidNumber:'UID',rfidStatus:'Active',smsStatus:'Sent',smsSentAt:'2026-11-04T00:00:00Z'}];dailyRoot.render(<><section id="admin-daily" className="space-y-4"><h2>Admin daily attendance</h2><DailyKpis kpis={{totalStudents:4,present:1,late:0,absent:0,noRecord:1,noClasses:1,onlineManual:1,expectedStudents:2}} readableDate="Nov 5, 2026"/><DailyFilters query={{date:'2026-11-05',status,programId:null,yearLevel:null,section:null,search:[]}} options={{programs:[],yearLevels:[],sections:[]}}/><AdminDailyTable rows={visible} readableDate="Nov 5, 2026" hasStudents={true}/></section><section id="teacher-daily"><h2>Teacher daily attendance</h2><TeacherDailyTable rows={visible} readableDate="Nov 5, 2026" hasStudents={true}/></section><section id="student-daily" className="space-y-4"><h2>Student daily history</h2><HistoryKpis kpis={{totalPresent:0,totalLate:0,totalAbsent:0,attendanceRate:null,noClasses:1,onlineManual:1}}/><AttendanceHistoryTable rows={history}/></section></>);};
const dashboardElement=document.createElement('section');dashboardElement.id='calendar-dashboard';dashboardElement.className='@container/main space-y-5 p-4';document.body.appendChild(dashboardElement);const dashboardRoot=createRoot(dashboardElement);
window.__renderDashboard=(all=false)=>{const today='2026-11-05';const students=[{id:1,campus:'Main Campus'},{id:2,campus:'Main Campus'},{id:3,campus:'MV Campus'},{id:4,campus:'MV Campus'}];const records=students.map(student=>({student_id:student.id,attendance_date:today,attendance_status:student.id%2?'Present':'Absent'}));const effectiveDays=[{entry_id:1,attendance_date:today,campus:'Main Campus',attendance_impact:'no_classes'},...(all?[{entry_id:2,attendance_date:today,campus:'MV Campus',attendance_impact:'online_manual'}]:[])];const result=buildDashboardCalendar(students,records,today,{today,effectiveDays,marks:[]});const data={today,kpis:{totalStudents:4,totalAssigned:4,presentToday:result.counts.present,lateToday:result.counts.late,absentToday:result.counts.absent,expectedStudents:result.counts.expectedStudentDays,attendanceRate:result.counts.rate,rfidTapsToday:4},trend:result.trend};dashboardRoot.render(<><section id="calendar-dashboard-admin" className="space-y-4"><h2>Admin calendar attendance</h2><CampusStatusStrip states={result.campusStates}/><AdminKpis data={data}/><div className="grid gap-4 lg:grid-cols-2"><AttendanceDistributionChart distribution={result.distribution} attendanceRate={result.counts.rate}/><AttendanceTrendChart trend={result.trend} hasHistory={true}/></div></section><section id="calendar-dashboard-teacher"><h2>Teacher calendar attendance</h2><TeacherKpis data={data}/></section><TodayAttendanceCard attendance={{status:'OnlineManual',timeIn:'07:00:00',timeOut:null}}/></>);};
const postsElement=document.createElement('section');postsElement.id='dashboard-posts';postsElement.className='p-4';document.body.appendChild(postsElement);const postsRoot=createRoot(postsElement);
window.__renderPosts=(options={})=>postsRoot.render(<AnnouncementPosts role={options.role||'student'} entries={options.empty?[]:[{id:201,title:'Pinned closure',tags:['no_classes'],attendance_impact:'no_classes',campuses:['Main Campus'],starts_on:'2026-11-05',ends_on:'2026-11-06',reason:'Storm warning. '+('School notice details. '.repeat(30)),description:null,is_pinned:true,published_at:new Date(Date.now()-7*86400000+(options.expiring?1000:7*86400000)).toISOString()},{id:202,title:'Exam schedule',tags:['exam'],attendance_impact:'normal',campuses:[],starts_on:'2026-11-06',ends_on:'2026-11-06',reason:null,description:'Exam schedule details.',is_pinned:false,published_at:new Date().toISOString()},{id:203,title:'Online lessons update',tags:['online_class'],attendance_impact:'online_manual',campuses:['MV Campus'],starts_on:'2026-11-07',ends_on:'2026-11-07',reason:null,description:'Confirm attendance in Subject Attendance.',is_pinned:false,published_at:new Date().toISOString()}]} />);window.__renderPosts();
const bellElement=document.createElement('div');bellElement.className='flex justify-end p-4';document.body.appendChild(bellElement);const bellRoot=createRoot(bellElement);
const bellEntries=[{id:91,title:'Campus break',description:null,tags:['no_classes'],attendance_impact:'no_classes',audience:'everyone',campuses:['Main Campus'],starts_on:'2026-11-05',ends_on:'2026-11-05',published_at:'2026-11-01T00:00:00Z',updated_at:'2026-11-01T00:00:00Z',read_at:null},{id:92,title:'Online lessons notice',description:null,tags:['online_class'],attendance_impact:'online_manual',audience:'everyone',campuses:[],starts_on:'2026-11-06',ends_on:'2026-11-06',published_at:'2026-11-02T00:00:00Z',updated_at:'2026-11-02T00:00:00Z',read_at:null}];
window.__renderBell=(options={})=>bellRoot.render(<NotificationBell key={options.userId||'bell-user'} role={options.role||'student'} userId={options.userId||'bell-user'} entries={options.empty?[]:bellEntries.map(entry=>({...entry,read_at:options.read?'2026-11-03T00:00:00Z':null}))} />);window.__renderBell();
const readerRoot=document.createElement('section');readerRoot.id='reader-calendar';readerRoot.className='p-4';document.body.appendChild(readerRoot);
const readerEntry={id:71,title:'School assembly',tags:['event'],status:'published',attendance_impact:'normal',campuses:[],starts_on:'2026-11-05',ends_on:'2026-11-05',description:'School assembly details',start_time:null,end_time:null};
createRoot(readerRoot).render(<ReaderCalendar panel={{month:'2026-11',date:'2026-11-05',today:'2026-11-05',entries:[readerEntry,{...readerEntry,id:72,title:'Cancelled break',status:'cancelled',campuses:['Main Campus']},{...readerEntry,id:73,title:'Online lessons',attendance_impact:'online_manual',tags:['online_class']}],upcoming:[{...readerEntry,id:74,title:'December assembly',starts_on:'2026-12-01',ends_on:'2026-12-01'}]}} />);
const controls=document.createElement('div');document.body.appendChild(controls);createRoot(controls).render(<div className="p-4"><DeliveryControl today="2026-11-05" /><DeliveryControl today="2026-11-05" target={{id:9}} /><DeliveryControl today="2026-11-05" target={{batchId:'00000000-0000-0000-0000-000000000001'}} /></div>);
const base={id:1,title:'School event',description:null,reason:null,location:null,tags:['event'],attendance_impact:'normal',audience:'everyone',campuses:[],starts_on:'2026-11-05',ends_on:'2026-11-05',start_time:null,end_time:null,is_pinned:false,published_at:null,status:'draft'};
const adminElement=document.createElement('section');adminElement.id='admin-calendar';adminElement.className='p-4';document.body.appendChild(adminElement);const adminRoot=createRoot(adminElement);
window.__renderAdmin=(tab='calendar')=>adminRoot.render(<CalendarPanel key={tab} panel={{query:parseAdminCalendarQuery({month:'2026-11',date:'2026-11-05',tab},new Date('2026-11-05T12:00:00Z')),entries:[base],list:{entries:[base],total:1},campuses:['Main Campus'],deliveries:{},kpis:{upcoming:0,noClasses:0,published:0,failed:0}}}/>);
window.__renderDeliveries=()=>{window.__search='tab=deliveries';const deliveries=[['Failed',true],['Failed',false],['Pending',false],['Sent',false]].map(([status,retry_allowed],index)=>({id:index+1,calendar_entry_id:1,batch_id:'00000000-0000-0000-0000-000000000001',notification_type:'published',recipient_email:'recipient'+index+'@school.example',recipient_role:'teacher',status,retry_allowed,attempt_count:1,error_message:status==='Failed'?'Provider request needs review.':null,last_attempt_at:null,sent_at:null,calendar_entries:{title:'School event'}}));adminRoot.render(<DeliveryTable panel={{deliveries,total:4,filters:{},page:1,pageCount:1}} today="2026-11-05"/>);};
createRoot(document.getElementById('root')).render(<main className="space-y-5 p-4"><EntryFormDialog date="2026-11-05" today="2026-10-26" campuses={['Main Campus']} />{[base,{...base,id:2,title:'Published event',status:'published',published_at:'2026-10-26T00:00:00Z'},{...base,id:3,title:'Cancelled event',status:'cancelled',published_at:'2026-10-26T00:00:00Z'},{...base,id:4,title:'Past break',status:'published',published_at:'2026-10-24T00:00:00Z',starts_on:'2026-10-25',attendance_impact:'no_classes',tags:['no_classes'],reason:'Storm'}].map(entry=><section key={entry.id}><h2>{entry.title}</h2><EntryActions entry={entry} today="2026-10-26" campuses={['Main Campus']} /></section>)}</main>);
`
const actions = `
window.__calls=[];window.__failure=false;window.__previewFailure=false;
const run=async(name,payload)=>{window.__calls.push({name,payload});await new Promise(r=>setTimeout(r,100));return window.__failure?{ok:false,message:'Calendar conflict. Choose another date.',fieldErrors:{startsOn:'Calendar conflict.'}}:{ok:true,message:'Saved'};};
export const saveCalendarEntryAction=p=>run('save',p);
export const publishCalendarEntryAction=p=>run('publish',p);
export const republishCalendarEntryAction=p=>run('republish',p);
export const cancelCalendarEntryAction=p=>run('cancel',p);
export const deleteCalendarDraftAction=p=>run('delete',p);
export const retryCalendarEmailAction=p=>run('retry',p);
export const syncAttendanceMarksAction=(from,to)=>run('sync',{from,to});
export const markCalendarEntryReadAction=id=>run('read',id);
export const markAllCalendarEntriesReadAction=()=>run('readAll',null);
export const previewCalendarRecipientsAction=async()=>{await new Promise(r=>setTimeout(r,80));return window.__previewFailure?{ok:false,message:'Preview unavailable'}:{ok:true,recipients:{total:3,teacher_count:1,student_count:2}};};
`
const result = await build({ outfile: join(output, "app.js"), absWorkingDir: root, stdin: { contents: fixture, resolveDir: root, loader: "tsx" }, bundle: true, write: false, format: "iife", jsx: "automatic", define: { "process.env.NODE_ENV": '"development"' }, plugins: [{ name: "isolated-browser-mocks", setup(build) {
  build.onResolve({ filter: /^(@\/features\/calendar\/actions|next\/(navigation|link)|@\/components\/ui\/goey-toaster|@\/components\/live-refresh)$/ }, args => ({ path: args.path, namespace: "mock" }))
  build.onLoad({ filter: /.*/, namespace: "mock" }, args => ({ contents: args.path.includes("actions") ? actions : args.path.includes("navigation") ? 'export const useRouter=()=>({refresh(){window.__refreshes=(window.__refreshes||0)+1;},replace(url){window.__navigation=url;},push(url){window.__navigation=url;}});export const usePathname=()=>window.__pathname||"/student/calendar";export const useSearchParams=()=>new URLSearchParams(window.__search||"");' : args.path === "next/link" ? 'import React from "react";export default function Link(props){return React.createElement("a",props);}' : args.path.endsWith("live-refresh") ? 'export const LiveRefresh=()=>null;' : 'export const gooeyToast={success(){},error(){},info(title,options){(window.__toasts??=[]).push({title,description:options.description});window.__toastAction=options.action.onClick;}};', loader: "js", resolveDir: root }))
} }] })
const css = await postcss([tailwind()]).process(await readFile("src/app/globals.css", "utf8"), { from: resolve("src/app/globals.css") })
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "text/javascript"); res.end(result.outputFiles.find(file => file.path.endsWith("app.js")).text) }
  else if (req.url === "/app.css") { res.setHeader("Content-Type", "text/css"); res.end(css.css + result.outputFiles.filter(file => file.path.endsWith(".css")).map(file => file.text).join("\n")) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<!doctype html><html lang="en"><head><title>Calendar browser checks</title><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
let browser
let page
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CALENDAR_CHROMIUM })
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.clock.install({ time: new Date("2026-11-05T12:00:00Z") })
  const errors = []; page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const open = page.locator("#root").getByRole("button", { name: "New announcement", exact: true })
  await open.focus(); await page.keyboard.press("Enter")
  const dialog = page.locator('[data-slot="dialog-content"]')
  await dialog.waitFor()
  await page.getByLabel("Title", { exact: true }).fill("New event")
  assert.equal(await page.getByLabel("Start date", { exact: true }).inputValue(), "2026-11-05")
  await page.getByRole("button", { name: "Save draft", exact: true }).click()
  await dialog.waitFor({ state: "hidden" })
  assert.equal((await page.evaluate(() => window.__calls))[0].payload.startsOn, "2026-11-05")
  assert.equal((await page.evaluate(() => window.__calls))[0].payload.notifyRecipients, false)

  await open.click()
  await page.getByRole("button", { name: "Save draft", exact: true }).click()
  await page.getByRole("alert").waitFor()
  assert.equal(await page.getByLabel("Title", { exact: true }).getAttribute("aria-invalid"), "true")
  await page.getByLabel("Title", { exact: true }).fill("Online day")
  await page.getByRole("checkbox", { name: "Online class", exact: true }).check()
  assert.equal(await page.getByRole("radio", { name: "Online / manual", exact: true }).isChecked(), true)
  assert.equal(await page.getByLabel("Start time (PHT)", { exact: true }).isDisabled(), true)
  await page.getByRole("button", { name: "Save draft", exact: true }).click()
  assert.equal(await page.getByLabel("Reason (required)").getAttribute("aria-invalid"), "true")
  await page.getByLabel("Reason (required)").fill("Storm")
  await page.getByRole("checkbox", { name: "All campuses", exact: true }).uncheck()
  await page.getByRole("button", { name: "Save draft", exact: true }).click()
  await page.getByText("Choose at least one campus or select All campuses.").waitFor()
  await page.getByRole("checkbox", { name: "Main Campus", exact: true }).check()
  await page.evaluate(() => window.__failure = true)
  await page.getByRole("button", { name: "Save draft", exact: true }).click()
  await page.getByRole("alert").filter({ hasText: "Calendar conflict" }).waitFor()
  assert.equal(await dialog.isVisible(), true)
  await page.evaluate(() => window.__failure = false)
  await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
  assert.equal(await open.evaluate(element => element === document.activeElement), true)

  await page.getByRole("button", { name: "Edit Published event", exact: true }).click()
  assert.equal(await page.getByRole("checkbox", { name: "Notify recipients", exact: true }).isChecked(), false)
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Edit Past break", exact: true }).click()
  assert.equal(await page.getByLabel("Start date", { exact: true }).isDisabled(), true)
  assert.equal(await page.getByRole("checkbox", { name: "No classes", exact: true }).isDisabled(), true)
  assert.equal(await page.getByLabel("Title", { exact: true }).isEnabled(), true)
  await page.keyboard.press("Escape")

  await page.evaluate(() => window.__previewFailure = true)
  await page.getByRole("button", { name: "Publish: School event", exact: true }).click()
  const alert = page.getByRole("alertdialog")
  await page.getByText("Preview unavailable").waitFor()
  assert.equal(await alert.getByRole("button", { name: "Publish", exact: true }).isDisabled(), true)
  await page.evaluate(() => window.__previewFailure = false)
  await page.getByRole("button", { name: "Retry recipient preview" }).click()
  await page.getByText("Recipients: 3 (1 teachers, 2 students)").waitFor()
  await alert.getByRole("button", { name: "Publish", exact: true }).click()
  await alert.waitFor({ state: "hidden" })
  for (const [trigger, confirm, name] of [["Republish: Cancelled event", "Republish", "republish"], ["Cancel announcement: Past break", "Cancel announcement", "cancel"], ["Delete draft: School event", "Delete draft", "delete"]]) {
    await page.getByRole("button", { name: trigger, exact: true }).click()
    if (name === "republish") await page.getByText("Recipients: 3 (1 teachers, 2 students)").waitFor()
    if (name === "cancel") await page.getByText(/Historical calendar exceptions will not be changed/).waitFor()
    await alert.getByRole("button", { name: confirm, exact: true }).click()
    await alert.waitFor({ state: "hidden" })
    assert.equal((await page.evaluate(() => window.__calls)).at(-1).name, name)
  }
  assert.equal(await page.getByRole("button", { name: "Delete draft: Published event", exact: true }).count(), 0)

  await page.setViewportSize({ width: 375, height: 812 })
  await open.click(); await dialog.waitFor()
  for (let index = 0; index < 48; index++) {
    await page.keyboard.press("Tab")
    assert.equal(await dialog.evaluate(element => element.contains(document.activeElement)), true)
  }
  const bounds = await dialog.boundingBox()
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 376 && bounds.y >= 0 && bounds.y + bounds.height <= 813)
  await page.getByLabel("Start date", { exact: true }).fill("")
  assert.equal(await dialog.isVisible(), true)
  await page.getByLabel("Start date", { exact: true }).fill("2026-11-05")
  await dialog.getByRole("button", { name: /Nov 5, 2026/ }).click()
  await page.getByRole("grid").waitFor()
  assert.equal(await page.getByRole("button", { name: /November 6th, 2026/ }).isEnabled(), true)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-slot="popover-content"]')).opacity === "1")
  const pickerBounds = await page.locator('[data-slot="popover-content"]').boundingBox()
  assert.ok(pickerBounds.x >= 0 && pickerBounds.x + pickerBounds.width <= 376 && pickerBounds.y >= 0 && pickerBounds.y + pickerBounds.height <= 813)
  await page.screenshot({ path: join(output, "mobile-date-picker.png") })
  await page.keyboard.press("Escape")
  await page.locator('[data-slot="popover-content"]').waitFor({ state: "detached" })
  await dialog.getByRole("button", { name: "Close", exact: true }).last().scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(output, "mobile-form.png") })
  await page.keyboard.press("Escape")
  await dialog.waitFor({ state: "hidden" })
  await page.getByRole("button", { name: "Preview recipients", exact: true }).first().click()
  await page.getByText(/3 recipients: 1 teachers, 2 students/).waitFor()
  await page.getByRole("button", { name: "Sync attendance marks", exact: true }).click()
  await page.getByLabel("From date", { exact: true }).fill("2026-11-06")
  await page.getByLabel("To date", { exact: true }).fill("2026-11-07")
  await dialog.getByRole("button", { name: "Sync attendance marks", exact: true }).click()
  await dialog.getByRole("status").waitFor()
  assert.deepEqual((await page.evaluate(() => window.__calls)).at(-1), { name: "sync", payload: { from: "2026-11-06", to: "2026-11-07" } })
  assert.equal(await dialog.getByRole("button", { name: "Sync attendance marks", exact: true }).isDisabled(), true)
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Retry email", exact: true }).click()
  await page.evaluate(() => window.__failure = true)
  await dialog.getByRole("button", { name: "Retry email", exact: true }).click()
  await dialog.getByRole("alert").waitFor()
  assert.equal(await dialog.isVisible(), true)
  await page.evaluate(() => window.__failure = false)
  await dialog.getByRole("button", { name: "Retry email", exact: true }).click()
  await dialog.getByRole("status").waitFor()
  assert.deepEqual((await page.evaluate(() => window.__calls)).at(-1), { name: "retry", payload: { id: 9 } })
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Retry batch", exact: true }).click()
  await page.getByText(/even outside these filters/).waitFor()
  await dialog.getByRole("button", { name: "Retry batch", exact: true }).click()
  await dialog.getByRole("status").waitFor()
  assert.equal((await page.evaluate(() => window.__calls)).at(-1).payload.batchId, "00000000-0000-0000-0000-000000000001")
  await page.keyboard.press("Escape")
  const reader = page.locator("#reader-calendar")
  assert.equal(await reader.getByRole("button", { name: "New announcement", exact: true }).count(), 0)
  await reader.getByText("Campus: Main Campus", { exact: true }).first().waitFor()
  await reader.getByText("Attendance is confirmed in Subject Attendance.", { exact: false }).waitFor()
  const readerBounds = await reader.boundingBox()
  assert.ok(readerBounds.x >= 0 && readerBounds.x + readerBounds.width <= 376)
  await reader.getByLabel("Month", { exact: true }).fill("2026-12")
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?month=2026-12&date=2026-12-01")
  await reader.getByRole("button", { name: "December assembly", exact: true }).click()
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?month=2026-12&date=2026-12-01")
  await reader.getByLabel("Selected date", { exact: true }).fill("2026-11-06")
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?month=2026-11&date=2026-11-06")
  await reader.screenshot({ path: join(output, "reader-mobile.png") })
  await page.setViewportSize({ width: 1280, height: 900 })
  const selectedDay = reader.getByRole("button", { name: /November 5th, 2026.*School assembly/ })
  await selectedDay.focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?month=2026-11&date=2026-11-06")
  await reader.screenshot({ path: join(output, "reader-desktop.png") })
  assert.equal(await page.evaluate(() => window.__toasts.length), 1)
  assert.equal(await page.evaluate(() => window.__toasts[0].title), "Online class: Online lessons notice")
  await page.evaluate(() => window.__toastAction())
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?date=2026-11-06")
  await page.setViewportSize({ width: 375, height: 812 })
  const bell = page.getByRole("button", { name: "Announcements, 2 unread", exact: true })
  await bell.focus(); await page.keyboard.press("Enter")
  const notifications = page.getByRole("dialog", { name: "Announcements", exact: true })
  await notifications.waitFor()
  const bellBounds = await notifications.boundingBox()
  assert.ok(bellBounds.x >= 0 && bellBounds.x + bellBounds.width <= 376 && bellBounds.y >= 0 && bellBounds.y + bellBounds.height <= 813)
  await page.evaluate(() => { window.__failure=true; window.__navigation=null })
  await notifications.getByRole("button", { name: /Campus break/ }).click()
  await notifications.getByRole("alert").waitFor()
  assert.equal(await page.evaluate(() => window.__navigation), null)
  await page.evaluate(() => window.__failure=false)
  await notifications.getByRole("button", { name: /Campus break/ }).click()
  await notifications.waitFor({ state: "hidden" })
  assert.deepEqual((await page.evaluate(() => window.__calls)).at(-1), { name: "read", payload: 91 })
  assert.equal(await page.evaluate(() => window.__navigation), "/student/calendar?date=2026-11-05")
  await bell.click()
  await notifications.getByRole("button", { name: "Mark all read", exact: true }).click()
  await notifications.getByRole("status").waitFor()
  assert.equal((await page.evaluate(() => window.__calls)).at(-1).name, "readAll")
  await page.evaluate(() => window.__renderBell({read:true}))
  await page.getByRole("button", { name: "Announcements, 0 unread", exact: true }).waitFor()
  await page.screenshot({ path: join(output, "notification-bell-mobile.png") })
  await page.keyboard.press("Escape")
  await notifications.waitFor({ state: "hidden" })
  await page.reload()
  await page.getByRole("button", { name: "Announcements, 2 unread", exact: true }).waitFor()
  assert.equal(await page.evaluate(() => (window.__toasts??[]).length), 0)
  await page.evaluate(() => window.__renderBell({userId:'teacher-bell',role:'teacher'}))
  await page.waitForFunction(() => (window.__toasts??[]).length===1)
  await page.evaluate(() => window.__toastAction())
  assert.equal(await page.evaluate(() => window.__navigation), "/teacher/calendar?date=2026-11-06")
  await page.evaluate(() => window.__renderBell({userId:'empty-bell',empty:true}))
  await page.getByRole("button", { name: "Announcements, 0 unread", exact: true }).click()
  await page.getByText("No announcements.", { exact: true }).waitFor()
  assert.equal(await page.evaluate(() => (window.__toasts??[]).length), 1)
  assert.equal(await page.evaluate(() => sessionStorage.getItem('calendar-login-toast:empty-bell')), null)
  await page.keyboard.press("Escape")
  await page.getByRole("dialog", { name: "Announcements", exact: true }).waitFor({ state: "hidden" })
  const posts = page.locator("#dashboard-posts")
  assert.equal(await posts.getByRole("heading", { level: 3 }).count(), 3)
  assert.equal(await posts.getByRole("heading", { level: 3 }).first().textContent(), "Pinned closure")
  assert.equal(await posts.getByRole("link", { name: /View calendar.*Pinned closure/ }).getAttribute("href"), "/student/calendar?date=2026-11-05")
  const postsBounds = await posts.boundingBox()
  assert.ok(postsBounds.x >= 0 && postsBounds.x + postsBounds.width <= 376)
  await posts.screenshot({ path: join(output, "dashboard-posts-mobile.png") })
  await page.setViewportSize({ width: 1280, height: 900 })
  await posts.screenshot({ path: join(output, "dashboard-posts-desktop.png") })
  await page.clock.pauseAt(await page.evaluate(() => new Date(Date.now()+1000).toISOString()))
  const callsBeforePosts = await page.evaluate(() => window.__calls.length)
  await page.evaluate(() => window.__renderPosts({expiring:true}))
  await posts.getByRole("heading", { name: "Pinned closure", exact: true }).waitFor()
  await page.clock.runFor(999)
  assert.equal(await posts.getByRole("heading", { name: "Pinned closure", exact: true }).isVisible(), true)
  const refreshesBeforeExpiry = await page.evaluate(() => window.__refreshes || 0)
  await page.clock.runFor(1)
  await posts.getByRole("heading", { name: "Pinned closure", exact: true }).waitFor({ state: "hidden" })
  assert.ok(await page.evaluate(() => window.__refreshes) > refreshesBeforeExpiry)
  await page.evaluate(() => window.__renderPosts({role:'teacher'}))
  await posts.getByRole("heading", { name: "Pinned closure", exact: true }).waitFor()
  assert.equal(await posts.getByRole("link", { name: /View calendar.*Pinned closure/ }).getAttribute("href"), "/teacher/calendar?date=2026-11-05")
  assert.equal(await page.evaluate(() => window.__calls.length), callsBeforePosts)
  await page.evaluate(() => window.__renderPosts({empty:true}))
  await posts.getByRole("heading", { name: "Announcements", exact: true }).waitFor({ state: "hidden" })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.evaluate(() => window.__renderDashboard(false))
  await page.clock.runFor(1000)
  const dashboard = page.locator("#calendar-dashboard")
  await dashboard.getByRole("heading", { name: "Admin calendar attendance", exact: true }).waitFor()
  for (const role of ["admin", "teacher"]) {
    const rate = dashboard.locator(`#calendar-dashboard-${role}`).getByRole("link", { name: "View attendance rate", exact: true })
    await rate.getByRole("img", { name: "50.0%", exact: true }).waitFor()
  }
  await page.evaluate(() => window.__renderDashboard(true))
  await page.clock.runFor(1000)
  for (const role of ["admin", "teacher"]) {
    const rate = dashboard.locator(`#calendar-dashboard-${role}`).getByRole("link", { name: "View attendance rate", exact: true })
    assert.match(await rate.innerText(), /—/); assert.doesNotMatch(await rate.innerText(), /0%|NaN/)
  }
  await dashboard.getByText(/Online class today/).waitFor()
  assert.doesNotMatch(await dashboard.innerText(), /NaN|null%|undefined/)
  await dashboard.screenshot({ path: join(output, "calendar-dashboard-desktop.png") })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.clock.runFor(1000)
  const dashboardBounds = await dashboard.boundingBox()
  assert.ok(dashboardBounds.x >= 0 && dashboardBounds.x + dashboardBounds.width <= 376)
  await dashboard.screenshot({ path: join(output, "calendar-dashboard-mobile.png") })
  await page.evaluate(() => window.__renderDaily())
  await page.clock.runFor(1000)
  const daily = page.locator("#calendar-daily")
  await daily.getByRole("heading", { name: "Admin daily attendance", exact: true }).waitFor()
  assert.equal(await daily.locator('#admin-daily tbody tr').count(), 4)
  assert.equal(await daily.locator('#teacher-daily tbody tr').count(), 4)
  assert.equal(await daily.getByRole("button", { name: /Edit attendance|Save attendance|Confirm attendance/ }).count(), 0)
  await daily.getByRole("combobox", { name: "Filter by attendance status", exact: true }).click()
  await page.getByRole("option", { name: "No classes", exact: true }).click()
  assert.match(await page.evaluate(() => window.__navigation), /status=NoClasses/)
  await page.evaluate(() => window.__renderDaily('NoClasses'))
  await page.clock.runFor(1000)
  assert.equal(await daily.locator('#admin-daily tbody tr').count(), 1)
  assert.match(await daily.locator('#admin-daily tbody').innerText(), /No classes/)
  const historySection = daily.locator('#student-daily')
  await historySection.getByRole("button", { name: "View details for Nov 5, 2026", exact: true }).click()
  const historyDialog = page.getByRole("dialog", { name: "Attendance details", exact: true })
  await historyDialog.waitFor()
  await historyDialog.getByText(/Calendar exception for/).waitFor()
  assert.doesNotMatch(await historyDialog.innerText(), /Unassigned|UID|7:00 AM|Sent/)
  await page.keyboard.press("Escape")
  await historyDialog.waitFor({ state: "hidden" })
  await historySection.getByRole("button", { name: "View details for Nov 4, 2026", exact: true }).click()
  await historyDialog.getByText("Recorded tap campus", { exact: true }).waitFor()
  assert.match(await historyDialog.innerText(), /Tap Campus/); assert.match(await historyDialog.innerText(), /Subject Attendance/)
  assert.match(await historyDialog.innerText(), /Retained RFID status/); assert.match(await historyDialog.innerText(), /7:00 AM/)
  await page.keyboard.press("Escape")
  await historyDialog.waitFor({ state: "hidden" })
  await page.clock.runFor(1000)
  const dailyBounds = await daily.boundingBox()
  assert.ok(dailyBounds.x >= 0 && dailyBounds.x + dailyBounds.width <= 376)
  await daily.screenshot({ path: join(output, "calendar-daily-mobile.png"), animations: "disabled" })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.clock.runFor(1000)
  await daily.screenshot({ path: join(output, "calendar-daily-desktop.png"), animations: "disabled" })
  await page.evaluate(() => window.__renderReport())
  await page.clock.runFor(1000)
  const report = page.locator('#calendar-report')
  await report.getByText("Calendar exceptions", { exact: true }).waitFor()
  assert.match(await report.innerText(), /Old Campus/); assert.match(await report.innerText(), /Online \/ manual/)
  assert.match(await report.innerText(), /—/); assert.doesNotMatch(await report.innerText(), /NaN|null%|undefined/)
  await report.screenshot({ path: join(output, "calendar-report-desktop.png"), animations: "disabled" })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.clock.runFor(1000)
  const reportBounds = await report.boundingBox()
  assert.ok(reportBounds.x >= 0 && reportBounds.x + reportBounds.width <= 376)
  await report.screenshot({ path: join(output, "calendar-report-mobile.png"), animations: "disabled" })

  await page.clock.resume()
  await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" })
  await page.addScriptTag({ path: requireTools.resolve("axe-core/axe.min.js") })
  const accessibility = []
  async function audit(name, selector) {
    const result = await page.evaluate(async selector => {
      const result = await window.axe.run({ include: [selector] }, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } })
      const details = ({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary, any, all, none }) => ({ target, failureSummary, checks: [...any, ...all, ...none].map(({ message }) => message) })) })
      return { violations: result.violations.map(details), incomplete: result.incomplete.map(details) }
    }, selector)
    accessibility.push({ name, ...result })
    await writeFile(join(output, "accessibility.json"), JSON.stringify(accessibility, null, 2))
  }
  for (const dark of [false, true]) {
    await page.evaluate(dark => { document.documentElement.classList.toggle("dark", dark); document.documentElement.style.colorScheme=dark?"dark":"light"; window.__renderPosts(); window.__renderBell({ userId: "accessibility", role: "teacher" }); window.__pathname="/admin/schedules/calendar"; window.__search=""; window.__renderAdmin() }, dark)
    const theme = dark ? "dark" : "light"
    await page.setViewportSize({ width: 1280, height: 900 })
    const admin = page.locator("#admin-calendar")
    await admin.getByRole("tab", { name: "Calendar", exact: true }).waitFor()
    assert.equal(await admin.getByRole("group", { name: "Actions for School event", exact: true }).count(), 1)
    await audit(`${theme} admin calendar`, "#admin-calendar")
    await admin.getByRole("tab", { name: "All announcements", exact: true }).focus()
    await page.keyboard.press("Enter")
    assert.equal(await page.evaluate(() => window.__navigation), "/admin/schedules/calendar?tab=list")
    await page.evaluate(() => window.__renderAdmin("list"))
    await admin.getByLabel("Search titles").fill("School")
    await admin.getByLabel("Statuses", { exact: true }).click()
    await page.getByRole("option", { name: "Draft", exact: true }).click()
    await admin.getByRole("button", { name: "Apply filters", exact: true }).click()
    const adminParams = new URL(await page.evaluate(() => window.__navigation), "https://school.example").searchParams
    assert.equal(adminParams.get("status"), "draft"); assert.equal(adminParams.get("search"), "School")
    await audit(`${theme} admin list`, "#admin-calendar")
    await admin.getByRole("tab", { name: "Email deliveries", exact: true }).click()
    assert.equal(await page.evaluate(() => window.__navigation), "/admin/schedules/calendar?tab=deliveries")
    await page.evaluate(() => window.__renderDeliveries())
    await admin.getByRole("heading", { name: "Email deliveries", exact: true }).waitFor()
    assert.equal(await admin.getByRole("button", { name: "Retry email", exact: true }).count(), 1)
    assert.equal(await admin.getByText(/Acceptance is uncertain/).count(), 2)
    await admin.getByRole("combobox", { name: "Status", exact: true }).click()
    await page.getByRole("option", { name: "Failed", exact: true }).click()
    await admin.getByRole("button", { name: "Filter", exact: true }).click()
    const deliveryParams = new URL(await page.evaluate(() => window.__navigation), "https://school.example").searchParams
    assert.equal(deliveryParams.get("tab"), "deliveries"); assert.equal(deliveryParams.get("status"), "Failed")
    await audit(`${theme} email deliveries`, "#admin-calendar")
    await admin.screenshot({ path: join(output, `deliveries-${theme}-desktop.png`), animations: "disabled" })
    await page.setViewportSize({ width: 320, height: 812 })
    await audit(`${theme} mobile email deliveries`, "#admin-calendar")
    await admin.screenshot({ path: join(output, `deliveries-${theme}-mobile.png`), animations: "disabled" })
    await page.evaluate(() => { window.__search=""; window.__renderAdmin("list") })
    await audit(`${theme} mobile list`, "#admin-calendar")
    await audit(`${theme} mobile reader`, "#reader-calendar")
    await reader.screenshot({ path: join(output, `reader-${theme}-320px.png`), animations: "disabled" })
    await audit(`${theme} posts`, "#dashboard-posts")
    await audit(`${theme} attendance history`, "#student-daily")
    await audit(`${theme} report`, "#calendar-report")
    const exceptionTable = report.getByRole("table", { name: "Calendar attendance exceptions", exact: true })
    await exceptionTable.focus(); await page.keyboard.press("ArrowRight")
    await page.waitForFunction(() => document.querySelector('table[aria-label="Calendar attendance exceptions"]').parentElement.scrollLeft > 0)
    await open.click(); await dialog.waitFor()
    await audit(`${theme} entry form`, '[data-slot="dialog-content"]')
    await dialog.getByRole("button", { name: "Save draft", exact: true }).click()
    await dialog.getByRole("alert").first().waitFor()
    await audit(`${theme} validation errors`, '[data-slot="dialog-content"]')
    await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
    assert.equal(await open.evaluate(element => element === document.activeElement), true)
    const accessibleBell = page.getByRole("button", { name: "Announcements, 2 unread", exact: true })
    await accessibleBell.focus(); await page.keyboard.press("Enter")
    await notifications.waitFor()
    await audit(`${theme} bell`, '[data-slot="popover-content"]')
    await page.keyboard.press("Escape"); await notifications.waitFor({ state: "hidden" })
    assert.equal(await accessibleBell.evaluate(element => element === document.activeElement), true)
    await page.evaluate(() => window.__renderAdmin())
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      await audit(`${theme} reader ${width}px`, "#reader-calendar")
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 1, `${theme} ${width}px: page overflow ${overflow}px`)
    }
  }
  await writeFile(join(output, "accessibility.json"), JSON.stringify(accessibility, null, 2))
  assert.deepEqual(accessibility.filter(result => result.violations.length), [])
  assert.deepEqual(errors, [])
  await writeFile(join(output, "result.txt"), `PASS: mocked calendar lifecycle, forms, recipient preview, sync/retry and delivery history, role links, keyboard focus/escape/day selection/table scrolling, mobile layouts, session toast/read actions, exact post expiry/republish, attendance/history/report evidence and null rates. ${accessibility.length} light/dark axe-core ${requireTools("axe-core/package.json").version} scans: zero WCAG A/AA violations. Incomplete checks retained in accessibility.json for review; this is not accessibility certification or hosted acceptance.\n`)
  console.log(`PASS calendar dialog browser checks. Screenshots: ${output}`)
} catch (error) {
  await page?.screenshot({ path: join(output, "failure.png"), fullPage: true })
  if (page) await writeFile(join(output, "failure.html"), await page.content())
  console.error(`Browser failure artifacts: ${output}`)
  throw error
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
