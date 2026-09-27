import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
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
const server = createServer((req,res) => {
  if(req.url === '/app.js') { res.setHeader('Content-Type','application/javascript'); res.end(bundle.outputFiles[0].text) }
  else { res.setHeader('Content-Type','text/html'); res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0,'127.0.0.1',done))
let browser
try {
  browser = await chromium.launch({headless:true})
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror',error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const name = page.getByRole('textbox',{name:'Full name',exact:true})
  await name.fill('Unsaved Student')
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
  console.log('PASS: Add Student preserves its draft across focus and server-prop updates; explicit reopening resets it.')
} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}
