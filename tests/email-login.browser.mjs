import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root=fileURLToPath(new URL('../',import.meta.url))
const tools=createRequire(join(process.env.RFID_BROWSER_TOOLS??join(tmpdir(),'rfid-browser-tools'),'package.json'))
const {build}=tools('esbuild'),{chromium}=tools('playwright')
const bundle=await build({
  stdin:{contents:`
    import React from 'react';
    import {createRoot} from 'react-dom/client';
    import {LoginForm1} from '@/app/(auth)/sign-in/components/login-form-1';
    window.reply={path:'/teacher/dashboard'};
    createRoot(document.getElementById('root')).render(<LoginForm1/>);
  `,loader:'tsx',resolveDir:root},
  bundle:true,write:false,format:'iife',jsx:'automatic',logLevel:'silent',
  define:{'process.env.NODE_ENV':'"production"'},
  plugins:[{name:'boundaries',setup(builder){
    builder.onResolve({filter:/^@\/features\/auth\/email-login-actions$/},()=>({path:'actions',namespace:'fixture'}))
    builder.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'fixture'}))
    builder.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='navigation'
      ? 'export const useRouter=()=>({replace(path){window.path=path},refresh(){window.refreshed=true}});'
      : 'export const beginEmailLogin=async input=>{window.credentials=input;return window.reply}; export const verifyEmailLogin=async code=>{window.code=code;return {path:"/teacher/dashboard"}}; export const cancelEmailLogin=async()=>{}; export const resendEmailLogin=async()=>({sent:true});'}))
  }}],
})
const server=createServer((req,res)=>{
  if(req.url==='/app.js'){res.setHeader('Content-Type','application/javascript');res.end(bundle.outputFiles[0].text)}
  else {res.setHeader('Content-Type','text/html');res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>')}
})
await new Promise(done=>server.listen(0,'127.0.0.1',done))
let browser
try {
  browser=await chromium.launch({headless:true})
  const page=await browser.newPage(),errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByLabel('Email',{exact:true}).fill('teacher@example.test')
  await page.getByLabel('Password',{exact:true}).fill('correct-password')
  await page.getByRole('button',{name:'Sign in',exact:true}).click()
  await page.waitForFunction(()=>window.path==='/teacher/dashboard'&&window.refreshed)
  assert.equal(await page.getByLabel('Verification code',{exact:true}).count(),0)

  await page.reload()
  await page.evaluate(()=>{window.reply={email:'teacher@example.test'}})
  await page.getByLabel('Email',{exact:true}).fill('teacher@example.test')
  await page.getByLabel('Password',{exact:true}).fill('correct-password')
  await page.getByRole('button',{name:'Sign in',exact:true}).click()
  await page.getByText(/this browser will not need another code for 3 days/).waitFor()
  await page.getByLabel('Verification code',{exact:true}).fill('123456')
  await page.getByRole('button',{name:'Verify and sign in',exact:true}).click()
  await page.waitForFunction(()=>window.path==='/teacher/dashboard'&&window.code==='123456')
  assert.deepEqual(errors,[])
  console.log('PASS: remembered login redirects without a code form; expired/new browser login requires code and explains 3-day memory')
} finally {
  if(browser) await browser.close()
  await new Promise(done=>server.close(done))
}
