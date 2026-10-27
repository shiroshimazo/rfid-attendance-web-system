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
import { DeliveryControl } from '@/app/(portal)/admin/schedules/calendar/components/delivery-controls';
import { ReaderCalendar } from '@/components/calendar/reader-calendar';
const readerRoot=document.createElement('section');readerRoot.id='reader-calendar';readerRoot.className='p-4';document.body.appendChild(readerRoot);
const readerEntry={id:71,title:'School assembly',tags:['event'],status:'published',attendance_impact:'normal',campuses:[],starts_on:'2026-11-05',ends_on:'2026-11-05',description:'School assembly details',start_time:null,end_time:null};
createRoot(readerRoot).render(<ReaderCalendar panel={{month:'2026-11',date:'2026-11-05',today:'2026-11-05',entries:[readerEntry,{...readerEntry,id:72,title:'Cancelled break',status:'cancelled',campuses:['Main Campus']},{...readerEntry,id:73,title:'Online lessons',attendance_impact:'online_manual',tags:['online_class']}],upcoming:[{...readerEntry,id:74,title:'December assembly',starts_on:'2026-12-01',ends_on:'2026-12-01'}]}} />);
const controls=document.createElement('div');document.body.appendChild(controls);createRoot(controls).render(<div className="p-4"><DeliveryControl today="2026-11-05" /><DeliveryControl today="2026-11-05" target={{id:9}} /><DeliveryControl today="2026-11-05" target={{batchId:'00000000-0000-0000-0000-000000000001'}} /></div>);
const base={id:1,title:'School event',description:null,reason:null,location:null,tags:['event'],attendance_impact:'normal',audience:'everyone',campuses:[],starts_on:'2026-11-05',ends_on:'2026-11-05',start_time:null,end_time:null,is_pinned:false,published_at:null,status:'draft'};
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
export const previewCalendarRecipientsAction=async()=>{await new Promise(r=>setTimeout(r,80));return window.__previewFailure?{ok:false,message:'Preview unavailable'}:{ok:true,recipients:{total:3,teacher_count:1,student_count:2}};};
`
const result = await build({ absWorkingDir: root, stdin: { contents: fixture, resolveDir: root, loader: "tsx" }, bundle: true, write: false, format: "iife", jsx: "automatic", define: { "process.env.NODE_ENV": '"development"' }, plugins: [{ name: "isolated-browser-mocks", setup(build) {
  build.onResolve({ filter: /^(@\/features\/calendar\/actions|next\/navigation|@\/components\/ui\/goey-toaster)$/ }, args => ({ path: args.path, namespace: "mock" }))
  build.onLoad({ filter: /.*/, namespace: "mock" }, args => ({ contents: args.path.includes("actions") ? actions : args.path.includes("navigation") ? 'export const useRouter=()=>({refresh(){},replace(url){window.__navigation=url;}});export const usePathname=()=>"/student/calendar";export const useSearchParams=()=>new URLSearchParams();' : 'export const gooeyToast={success(){},error(){}};', loader: "js" }))
} }] })
const css = await postcss([tailwind()]).process(await readFile("src/app/globals.css", "utf8"), { from: resolve("src/app/globals.css") })
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "text/javascript"); res.end(result.outputFiles[0].text) }
  else if (req.url === "/app.css") { res.setHeader("Content-Type", "text/css"); res.end(css.css) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
let browser
let page
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CALENDAR_CHROMIUM })
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []; page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const open = page.getByRole("button", { name: "New announcement", exact: true })
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
  for (let index = 0; index < 12; index++) {
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
  assert.deepEqual(errors, [])
  await writeFile(join(output, "result.txt"), "PASS: mocked create/edit, validation, impact rules, historical scope, lifecycle actions, recipient preview, keyboard focus/escape, mobile dialog bounds, sync/retry controls, reader layouts, deep links, and keyboard day selection.\n")
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
