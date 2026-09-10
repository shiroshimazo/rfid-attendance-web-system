// Real profile forms in React development mode; optional tooling matches report-export.browser.mjs.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { readFile, readdir } from "node:fs/promises"
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
    import { TeacherFormDialog } from '@/app/(portal)/admin/teachers/components/teacher-form-dialog';
    import { StudentFormDialog } from '@/app/(portal)/admin/students/components/student-form-dialog';
    const programs=[{id:1,code:'BSIT',name:'BSIT',status:'active'}];
    const courses=[{id:1,programId:1,code:'SOSLIT',name:'Sosyedad at Literatura with a very long subject description'}];
    const teacher={id:1,fullName:'Teacher Test',email:'teacher@example.test',teacherId:'T-001',department:'IT',status:'active',gender:'',civilStatus:'',assignments:[{programId:1,courseId:1,yearLevel:'2nd Year',section:'21003',campus:'MV Campus'}]};
    const student={id:1,fullName:'Student Test',email:'student@example.test',studentId:'S-001',programId:1,yearLevel:'2nd Year',section:'21003',campus:'MV Campus',status:'active',parentName:'Guardian',parentContactNumber:'09123456789'};
    function App(){
      const [kind,setKind]=React.useState('teacher');
      const [open,setOpen]=React.useState(true);
      return <><button onClick={()=>{setKind('teacher');setOpen(true)}}>Open teacher</button><button onClick={()=>{setKind('student');setOpen(true)}}>Open student</button><button onClick={()=>{setKind('student-edit');setOpen(true)}}>Edit student</button>
        {kind==='teacher'?<TeacherFormDialog open={open} onOpenChange={setOpen} teacher={teacher} programs={programs} courses={courses} departments={['IT']}/>:<StudentFormDialog student={kind==='student-edit'?student:undefined} open={open} onOpenChange={setOpen} programs={programs}/>}</>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"development"' },
  plugins: [{ name: "boundaries", setup(builder) {
    builder.onResolve({ filter: /^@\/features\/(teachers|students)\/actions$/ }, () => ({ path: "actions", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ contents:
      'export const createTeacherAction=async()=>{window.saveCount=(window.saveCount||0)+1;return {ok:true}}; export const updateTeacherAction=createTeacherAction; export const createStudentAction=createTeacherAction; export const updateStudentAction=createTeacherAction;'
    }))
  } }],
})
const cssDirectory = join(root, '.next/static/chunks')
const css = (await Promise.all((await readdir(cssDirectory)).filter(name=>name.endsWith('.css')).map(name=>readFile(join(cssDirectory,name),'utf8')))).join('\n')
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "application/javascript"); res.end(bundle.outputFiles[0].text) }
  else if(req.url === "/app.css") { res.setHeader("Content-Type", "text/css"); res.end(css) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<html><head><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({viewport:{width:1200,height:900}})
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  page.on("console", message => { if(message.type()==='error') errors.push(message.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  async function select(label, option) {
    await page.getByRole('combobox',{name:label,exact:true}).click()
    await page.getByRole('option',{name:option,exact:true}).click()
    await page.getByRole('combobox',{name:label,exact:true}).filter({hasText:option}).waitFor()
  }
  for (const number of [2,3,4,1]) {
    await page.getByRole('button',{name:new RegExp('^Step '+number+':')}).click()
    assert.equal(await page.getByRole('button',{name:new RegExp('^Step '+number+':')}).getAttribute('aria-current'),'step')
  }
  await page.getByRole('textbox',{name:'Full name',exact:true}).fill('Edited Teacher')
  await page.getByRole('button',{name:/^Step 4:/}).click()
  await page.getByRole('button',{name:/^Step 1:/}).click()
  assert.equal(await page.getByRole('textbox',{name:'Full name',exact:true}).inputValue(),'Edited Teacher')
  await select('Civil status','Single')
  await select('Civil status','Married')
  await select('Gender','Female')
  await page.getByRole('button',{name:'Next',exact:true}).click()
  await page.getByRole('button',{name:'Next',exact:true}).click()
  const course = page.getByRole('combobox',{name:'Course/Subject',exact:true})
  await course.waitFor()
  for (const width of [1200,768,390]) {
    await page.setViewportSize({width,height:900})
    const dimensions=await course.evaluate(el=>{
      const field=el.closest('[data-slot="form-item"]')
      const grid=field.parentElement
      const value=el.querySelector('[data-slot="select-value"]')
      return {trigger:el.getBoundingClientRect().width,field:field.getBoundingClientRect().width,grid: grid.getBoundingClientRect().width,scroll:grid.scrollWidth,client:grid.clientWidth,valueWidth:value.clientWidth,valueScroll:value.scrollWidth,overflow:getComputedStyle(value).textOverflow}
    })
    assert(dimensions.trigger<=dimensions.field+1,JSON.stringify(dimensions))
    assert(dimensions.scroll<=dimensions.client+1,JSON.stringify(dimensions))
    assert.equal(dimensions.overflow,'ellipsis')
    await course.click()
    await page.getByRole('option',{name:/SOSLIT/}).click()
  }
  await page.getByRole('button',{name:'Close',exact:true}).click()
  await page.getByRole('button',{name:'Open student',exact:true}).click()
  await select('Gender','Male')
  await select('Gender','Female')
  assert(await page.getByRole('button',{name:/^Step 3:/}).isDisabled())
  await page.getByRole('button',{name:'Close',exact:true}).click()
  await page.getByRole('button',{name:'Edit student',exact:true}).click()
  for (const number of [2,3,4,1]) {
    await page.getByRole('button',{name:new RegExp('^Step '+number+':')}).click()
    assert.equal(await page.getByRole('button',{name:new RegExp('^Step '+number+':')}).getAttribute('aria-current'),'step')
  }
  for (const kind of ['student','teacher']) {
    if(kind==='teacher') {
      await page.getByRole('button',{name:'Open teacher',exact:true}).click()
    }
    await page.getByRole('button',{name:/^Step 1:/}).click()
    await page.getByRole('textbox',{name:'Full name',exact:true}).fill(`Updated ${kind}`)
    await page.getByRole('textbox',{name:kind==='student'?'Contact number':'Phone number',exact:true}).fill('+639171234567')
    await page.getByRole('button',{name:/^Step 2:/}).click()
    if(kind==='student') {
      await page.getByRole('textbox',{name:'Parent or guardian contact number',exact:true}).fill('+639201234567')
    }
    await page.getByRole('button',{name:'Next',exact:true}).click()
    await page.waitForFunction(()=>document.querySelector('[aria-current="step"]')?.getAttribute('aria-label').startsWith('Step 3:'))
    await page.getByRole('button',{name:'Next',exact:true}).click()
    await page.getByRole('button',{name:'Save changes',exact:true}).waitFor()
    const summary = page.locator('dl')
    await summary.getByText(`Updated ${kind}`,{exact:true}).waitFor()
    await summary.getByText('+639171234567',{exact:true}).waitFor()
    if(kind==='student') {
      await summary.getByText('Student contact',{exact:true}).waitFor()
      await summary.getByText('Guardian contact',{exact:true}).waitFor()
      await summary.getByText('+639201234567',{exact:true}).waitFor()
    }
    assert.equal(await page.getByRole('button',{name:/^Step 4:/}).getAttribute('aria-current'),'step')
    assert.equal(await page.evaluate(()=>window.saveCount||0),kind==='student'?0:1)
    await page.locator('form').evaluate(form=>form.requestSubmit())
    assert.equal(await page.evaluate(()=>window.saveCount||0),kind==='student'?0:1)
    await page.getByRole('button',{name:'Save changes',exact:true}).click()
    await page.getByRole('dialog').waitFor({state:'hidden'})
    assert.equal(await page.evaluate(()=>window.saveCount),kind==='student'?1:2)
  }
  assert.deepEqual(errors, [])
  console.log('PASS: profile selects and responsive subject layout; edit step jumps 2/3/4/1, retained values, explicit-save-only navigation and guided create mode')
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
