import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url))
const tools=createRequire(join(process.env.RFID_BROWSER_TOOLS??join(tmpdir(),'rfid-browser-tools'),'package.json'))
const {build}=tools('esbuild'),{chromium}=tools('playwright')
const require=createRequire(import.meta.url)
const postcss=require('postcss'),tailwind=require('@tailwindcss/postcss')
const css=(await postcss([tailwind()]).process(await readFile(join(root,'src/app/globals.css'),'utf8'),{from:join(root,'src/app/globals.css')})).css
const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{StudentSubjectHistory}from'@/features/subject-attendance/student-history';
const rows=Array.from({length:12},(_,i)=>({id:i+1,schedule_id:1,student_id:1,student_name:'Jeremy Malana',student_number:'STU-001',course_code:i%2?'ITE1':'SOSLIT',course_name:i%2?'IT Elective 1':'Sosyedad at Literatura',teacher_name:'Azucena Lim',section:'21003',campus:'MV Campus',program_code:'BSIT',year_level:'2nd Year',attendance_date:'2026-09-'+String(i+1).padStart(2,'0'),time_start:'10:30',time_end:'12:30',attendance_status:i%3===0?'Absent':i%3===1?'Present':'Late',confirmed_at:'2026-09-09T04:30:00Z'}));
function App(){const[data,setData]=React.useState(rows);window.empty=()=>setData([]);window.restore=()=>setData(rows);return <main className="p-4 md:p-6"><StudentSubjectHistory rows={data}/></main>};createRoot(document.getElementById('root')).render(<App/>);`,loader:'tsx',resolveDir:root},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}})
const server=createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('Content-Type','application/javascript');res.end(bundle.outputFiles[0].text)}else if(req.url==='/app.css'){res.setHeader('Content-Type','text/css');res.end(css)}else{res.setHeader('Content-Type','text/html');res.end('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/app.css"><style>body{--font-inter:Arial,sans-serif}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>')}})
await new Promise(done=>server.listen(0,'127.0.0.1',done))
let browser
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto(`http://127.0.0.1:${server.address().port}`)
 await page.getByText('Subject Attendance',{exact:true}).waitFor()
 assert.equal(await page.locator('tbody tr').count(),10)
 await page.getByRole('link',{name:'Go to page 2',exact:true}).click();assert.equal(await page.locator('tbody tr').count(),2)
 await page.getByLabel('Search subject attendance').fill('SOSLIT');assert.equal(await page.locator('tbody tr').count(),6)
 await page.getByRole('combobox',{name:'Results',exact:true}).click();await page.getByRole('option',{name:'Late',exact:true}).click();assert.equal(await page.locator('tbody tr').count(),2)
 await page.getByRole('button',{name:'Clear all',exact:true}).click();assert.equal(await page.locator('tbody tr').count(),10)
 await page.getByRole('button',{name:/Date \/ session/}).click();assert.match(await page.locator('tbody tr').first().innerText(),/2026-09-01/)
 await page.getByRole('button',{name:'Date range',exact:true}).click();await page.getByText('Both dates are included.',{exact:false}).waitFor();await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'More filters',exact:true}).click();await page.getByRole('combobox',{name:'Campuses'}).click();await page.getByRole('option',{name:'MV Campus'}).click();await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'Clear all',exact:true}).click()
 await page.screenshot({path:join(tmpdir(),'student-subject-history-desktop.png'),fullPage:true})
 await page.setViewportSize({width:390,height:844})
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page must not overflow at mobile width')
 await page.screenshot({path:join(tmpdir(),'student-subject-history-mobile.png'),fullPage:true})
 await page.getByLabel('Search subject attendance').fill('notfound');await page.getByText('No confirmations match these filters.',{exact:false}).waitFor()
 await page.getByRole('button',{name:'Clear all',exact:true}).click();await page.evaluate(()=>window.empty());await page.getByText('No teacher confirmations yet.',{exact:false}).waitFor()
 await page.evaluate(()=>{window.restore();document.documentElement.classList.add('dark')});await page.waitForTimeout(400);await page.screenshot({path:join(tmpdir(),'student-subject-history-dark.png'),fullPage:true})
 assert.deepEqual(errors,[]);console.log('PASS: filters, clear, sorting, date/more popovers, empty states, mobile overflow, light/dark rendering')
}finally{if(browser)await browser.close();await new Promise(done=>server.close(done))}
