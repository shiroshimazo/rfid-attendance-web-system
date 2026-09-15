import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
const root = fileURLToPath(new URL("../", import.meta.url))
const tooling = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = tooling("esbuild")
const { chromium } = tooling("playwright")
const bundle = await build({
  stdin: { contents: `
    import React from 'react'; import {createRoot} from 'react-dom/client';
    import {ArchivesPanel} from '@/features/archives/panel';
    const record=(id,category,name)=>({id,category,name,details:'21001 Main Campus',archivedAt:null,reason:null});
    window.calls=[]; window.fail=false;
    function App(){
      const [directory,setDirectory]=React.useState({students:{records:Array.from({length:12},(_,i)=>record(i+1,'students','Student '+(i+1)))},teachers:{records:[]},subject_schedules:{records:[record(1,'subject_schedules','Math')]},class_schedules:{records:[],error:'Injected load failure'}});
      window.restoreFixture=async input=>{window.calls.push(input);await new Promise(r=>setTimeout(r,100));if(window.fail)return {ok:false,message:'Timetable conflict'};setDirectory(old=>({...old,[input.category]:{records:old[input.category].records.filter(row=>row.id!==input.id)}}));return {ok:true,message:'Restored'}};
      return <ArchivesPanel directory={directory}/>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader:'tsx', resolveDir:root }, bundle:true, write:false, format:'iife', jsx:'automatic', logLevel:'silent',
  define:{'process.env.NODE_ENV':'"production"'},
  plugins:[{name:'fixtures',setup(builder){
    builder.onResolve({filter:/^\.\/actions$/,namespace:'file'},args=>args.importer.endsWith('archives/panel.tsx')||args.importer.endsWith('archives\\panel.tsx')?{path:'actions',namespace:'fixture'}:undefined);
    builder.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'fixture'}));
    builder.onResolve({filter:/^@\/components\/ui\/goey-toaster$/},()=>({path:'toast',namespace:'fixture'}));
    builder.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='actions'?'export const restoreArchiveAction=input=>window.restoreFixture(input)':args.path==='toast'?'export const gooeyToast={success(){},error(){}}':'export const useRouter=()=>({refresh(){}})'}));
  }}],
})
const server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/app.js'?'application/javascript':'text/html');res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<html><body><div id="root"></div><script src="/app.js"></script></body></html>')})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
let browser
try {
  browser=await chromium.launch({headless:true})
  const page=await browser.newPage()
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByRole('button',{name:'Restore Student 1',exact:true}).waitFor()
  assert.equal(await page.getByRole('button',{name:/^Restore Student/}).count(),10)
  await page.getByRole('link',{name:'Go to next page'}).click()
  await page.getByRole('button',{name:'Restore Student 12',exact:true}).waitFor()
  await page.getByRole('textbox').fill('Student 1')
  assert.equal(await page.getByRole('button',{name:/^Restore Student/}).count(),4)
  await page.getByRole('button',{name:'Restore Student 1',exact:true}).click()
  await page.getByRole('button',{name:'Cancel',exact:true}).click()
  assert.equal((await page.evaluate(()=>window.calls)).length,0)
  await page.getByRole('button',{name:'Restore Student 1',exact:true}).click()
  await page.getByRole('button',{name:'Restore record',exact:true}).click()
  await page.getByRole('alertdialog').waitFor({state:'hidden'})
  assert.equal(await page.getByRole('button',{name:'Restore Student 1',exact:true}).count(),0)
  await page.getByRole('tab',{name:/Teachers/}).click()
  await page.getByRole('heading',{name:'No archived teachers'}).waitFor()
  await page.getByRole('tab',{name:/Subject Schedules/}).click()
  await page.evaluate(()=>{window.fail=true})
  await page.getByRole('button',{name:'Restore Math',exact:true}).click()
  await page.getByRole('button',{name:'Restore record',exact:true}).click()
  await page.getByRole('alert').filter({hasText:'Timetable conflict'}).waitFor()
  assert.equal(await page.getByRole('alertdialog').count(),1)
  await page.getByRole('button',{name:'Cancel',exact:true}).click()
  await page.getByRole('tab',{name:/Class Schedules/}).click()
  await page.getByText('Injected load failure',{exact:true}).waitFor()
  assert.deepEqual(errors,[])
  console.log('PASS: archive tabs, pagination, search, cancel, restore success/failure, empty and load-error states')
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve))}
