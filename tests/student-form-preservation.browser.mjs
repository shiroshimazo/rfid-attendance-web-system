import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const tools = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), 'rfid-browser-tools'), 'package.json'))
const { build } = tools('esbuild')
const { chromium } = tools('playwright')
const bundle = await build({
  stdin: { contents: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { StudentFormDialog } from '@/app/(portal)/admin/students/components/student-form-dialog';
    function App() {
      const [open, setOpen] = React.useState(true);
      const [revision, setRevision] = React.useState(0);
      React.useEffect(() => {
        window.refreshProps = () => setRevision(value => value + 1);
        window.setDialogOpen = setOpen;
      }, []);
      // Server refreshes deserialize fresh objects even for unchanged records.
      const programs = [{id:1,code:'BSIT',name:'BSIT',status:'active'}];
      return <><span id="revision">{revision}</span><StudentFormDialog open={open} onOpenChange={setOpen} programs={programs} groupings={[]}/></>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: 'tsx', resolveDir: root },
  bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', loader: {'.css':'empty'},
  define: { 'process.env.NODE_ENV': '"development"' },
  plugins: [{ name: 'actions', setup(builder) {
    builder.onResolve({filter: /^@\/features\/students\/actions$/}, () => ({path:'actions',namespace:'fixture'}))
    builder.onLoad({filter: /.*/,namespace:'fixture'}, () => ({contents:'export const createStudentAction=async()=>({ok:true}); export const updateStudentAction=createStudentAction;'}))
  }}],
})
const cssDirectory = join(root, '.next/static/chunks')
const css = (await Promise.all((await readdir(cssDirectory)).filter(name => name.endsWith('.css')).map(name => readFile(join(cssDirectory, name), 'utf8')))).join('\n')
const server = createServer((req,res) => {
  if(req.url === '/app.js') { res.setHeader('Content-Type','application/javascript'); res.end(bundle.outputFiles[0].text) }
  else if(req.url === '/app.css') { res.setHeader('Content-Type','text/css'); res.end(css) }
  else { res.setHeader('Content-Type','text/html'); res.end('<html lang="en"><head><title>Student form check</title><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0,'127.0.0.1',done))
let browser
try {
  browser = await chromium.launch({headless:true})
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror',error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByRole('dialog').waitFor()
  async function settleDialog() {
    await page.getByRole('dialog').evaluate(async dialog => {
      await new Promise(requestAnimationFrame)
      await Promise.all(dialog.getAnimations({subtree:true}).map(animation => animation.finished))
    })
  }
  async function assertAligned(left, right) {
    const [first, second] = await page.locator('[data-slot="form-item"]').evaluateAll((fields, labels) => labels.map(label => {
      const field = fields.find(field => field.querySelector('label')?.textContent.trim() === label)
      return field?.querySelector('[data-slot="form-control"]')?.getBoundingClientRect().top
    }), [left, right])
    assert(first !== undefined && second !== undefined, `${left} and ${right} must be visible`)
    assert(Math.abs(first - second) <= 1.5, `${left} and ${right} are misaligned: ${first}, ${second}`)
  }
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.classList.toggle('dark', theme === 'dark'), theme)
    for (const width of [1200, 768]) {
      await page.setViewportSize({width, height:1100})
      await settleDialog()
      await assertAligned('Full name', 'Email address')
      await assertAligned('Gender', 'Date of birth')
      await assertAligned('Place of birth', 'Contact number')
    }
    if (theme === 'dark') await page.screenshot({path:join(tmpdir(), 'rfid-student-form-desktop.png')})
    await page.setViewportSize({width:390, height:844})
    await settleDialog()
    const mobile = await page.getByRole('dialog').evaluate(dialog => {
      const bounds = dialog.getBoundingClientRect()
      return {
        overflow: dialog.scrollWidth > dialog.clientWidth,
        fieldsFit: [...dialog.querySelectorAll('[data-slot="form-item"]')].every(field => {
          const rect = field.getBoundingClientRect()
          return rect.left >= bounds.left && rect.right <= bounds.right
        }),
      }
    })
    assert.deepEqual(mobile, {overflow:false, fieldsFit:true})
    const nameBox = await page.getByLabel('Full name', {exact:true}).boundingBox()
    const emailBox = await page.getByLabel('Email address', {exact:true}).boundingBox()
    assert(emailBox.y > nameBox.y && Math.abs(nameBox.x - emailBox.x) <= 1)
    if (theme === 'dark') await page.screenshot({path:join(tmpdir(), 'rfid-student-form-mobile.png')})
  }
  await page.setViewportSize({width:1200, height:1100})
  const name = page.getByRole('textbox',{name:'Full name',exact:true})
  await name.fill('Unsaved Student')
  await page.getByRole('button', {name:'Next', exact:true}).click()
  await page.getByText('Enter a valid email', {exact:true}).waitFor()
  await assertAligned('Full name', 'Email address')
  await page.evaluate(() => {
    window.dispatchEvent(new Event('blur'));
    window.refreshProps();
    window.dispatchEvent(new Event('focus'));
  })
  await page.waitForFunction(() => document.getElementById('revision').textContent === '1')
  assert.equal(await name.inputValue(),'Unsaved Student','Fresh server props must preserve the Add Student draft')
  await page.evaluate(() => window.setDialogOpen(false))
  await page.getByRole('dialog').waitFor({state:'detached'})
  await page.evaluate(() => window.setDialogOpen(true))
  await name.waitFor()
  assert.equal(await name.inputValue(),'','An explicitly reopened Add Student form starts fresh')
  assert.deepEqual(errors,[])
  console.log('PASS: desktop fields align with helper text and validation; mobile fields stack without overflow in both themes; drafts survive refresh and reset on reopening.')
} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}
