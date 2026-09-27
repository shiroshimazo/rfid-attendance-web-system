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
    import { UsbAttendanceProvider, UsbAttendanceReader } from '@/components/usb-attendance-reader';
    window.starts=0; window.stops=0; window.submitted=0;
    Object.defineProperty(navigator,'serial',{value:{requestPort:async()=>({})}});
    function App() {
      const [panel,setPanel]=React.useState('monitoring');
      const [mounted,setMounted]=React.useState(true);
      window.navigate=setPanel; window.logout=()=>setMounted(false);
      return mounted ? <UsbAttendanceProvider>{panel==='monitoring' ? <UsbAttendanceReader/> : <p>Other admin panel</p>}</UsbAttendanceProvider> : <p>Signed out</p>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: 'tsx', resolveDir: root },
  bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', loader: {'.css':'empty'},
  define: { 'process.env.NODE_ENV': '"development"' },
  plugins: [{ name: 'usb-boundaries', setup(builder) {
    builder.onResolve({filter: /^@\/features\/rfid-tap\/usb-action$/}, () => ({path:'action',namespace:'fixture'}))
    builder.onResolve({filter: /^@\/lib\/rfid-usb-attendance$/}, () => ({path:'transport',namespace:'fixture'}))
    builder.onLoad({filter: /.*/,namespace:'fixture'}, ({path}) => ({contents:path==='action'
      ? 'export async function recordUsbTapAction(){window.submitted++;return {status:200,body:{}}}'
      : `export async function runUsbAttendance(port,signal,submit,notify){
          window.starts++; window.tap=()=>submit({requestId:'test',uid:'12345678'}); notify('Connected');
          await new Promise(resolve=>signal.addEventListener('abort',()=>{window.stops++;resolve()},{once:true}));
        }`
    }))
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
  await page.getByRole('button',{name:'Connect USB reader',exact:true}).click()
  await page.getByText('Connected',{exact:true}).waitFor()
  await page.evaluate(()=>window.navigate('students'))
  await page.getByText('Other admin panel').waitFor()
  assert.equal(await page.getByRole('region',{name:'USB attendance reader'}).count(),0)
  await page.evaluate(()=>window.tap())
  assert.deepEqual(await page.evaluate(()=>[window.starts,window.stops,window.submitted]),[1,0,1])
  await page.evaluate(()=>window.navigate('monitoring'))
  await page.getByRole('button',{name:'Disconnect reader',exact:true}).waitFor()
  assert.equal(await page.evaluate(()=>window.starts),1)
  await page.getByRole('button',{name:'Disconnect reader',exact:true}).click()
  await page.getByRole('button',{name:'Connect USB reader',exact:true}).waitFor()
  assert.equal(await page.evaluate(()=>window.stops),1)
  await page.getByRole('button',{name:'Connect USB reader',exact:true}).click()
  await page.getByText('Connected',{exact:true}).waitFor()
  await page.evaluate(()=>window.logout())
  await page.waitForFunction(()=>window.stops===2)
  assert.deepEqual(errors,[])
  console.log('PASS: hidden controls preserve USB session and tap submission across admin panels; disconnect and logout release session.')

} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}
