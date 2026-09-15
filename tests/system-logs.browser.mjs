import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"
const tools=createRequire(join(process.env.RFID_BROWSER_TOOLS??join(tmpdir(),"rfid-browser-tools"),"package.json"))
const {chromium}=tools("playwright")
const records=Array.from({length:31},(_,i)=>({id:i+1,created_at:'2026-09-15T08:00:00Z',actor_id:'admin',actor_name:i===0?'Alice Admin':'Bob Admin',actor_role:'admin',source:'database',event:'updated',entity:i===0?'students':'teachers',record_id:String(i+1),outcome:i===0?'failed':'success',details:{changed_fields:['status'],before:{status:'active'},after:{status:'archived'}}}))
let authorized=true, fail=false
const load=createSourceLoader({
  'next/link':{__esModule:true,default:({href,children,...props})=>React.createElement('a',{href,...props},children)},
  'next/navigation':{useRouter:()=>({refresh(){}}),redirect(url){throw Error('redirect:'+url)}},
  '@/components/live-refresh':{LiveRefresh:()=>null},
  '@/features/auth/server':{requireRole:async role=>{assert.equal(role,'admin');if(!authorized)throw Error('denied')}},
  '@/services/audit/directory':{fetchSystemLogs:async query=>{
    if(fail)throw Error('Injected log load failure')
    const filtered=records.filter(row=>(query.entity==='all'||row.entity===query.entity)&&(query.outcome==='all'||row.outcome===query.outcome)&&(!query.search||row.actor_name.toLowerCase().includes(query.search.toLowerCase())))
    return {rows:filtered.slice((query.page-1)*25,query.page*25),count:filtered.length,pageCount:Math.max(1,Math.ceil(filtered.length/25))}
  }},
})
const Page=load('src/app/(portal)/admin/system-logs/page.tsx').default
const server=createServer(async(req,res)=>{
  try {
    const query=Object.fromEntries(new URL(req.url,'http://localhost').searchParams)
    const element=await Page({searchParams:Promise.resolve(query)})
    res.setHeader('Content-Type','text/html');res.end('<!doctype html>'+renderToStaticMarkup(React.createElement('html',null,React.createElement('body',null,element))))
  }catch(error){res.statusCode=403;res.end(error.message)}
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
let browser
try{
  browser=await chromium.launch({headless:true})
  const page=await browser.newPage()
  const url=`http://127.0.0.1:${server.address().port}/admin/system-logs`
  await page.goto(url)
  assert.equal(await page.getByRole('row').count(),26,await page.locator('body').innerText())
  await page.getByRole('link',{name:'Next',exact:true}).click()
  await page.getByText('Page 2 of 2',{exact:true}).waitFor()
  assert.equal(await page.getByRole('row').count(),7)
  await page.getByLabel('Search',{exact:true}).fill('Alice')
  await page.getByLabel('Category',{exact:true}).selectOption('students')
  await page.getByLabel('Result',{exact:true}).selectOption('failed')
  await page.getByRole('button',{name:'Apply filters'}).click()
  await page.getByText('1 matching events',{exact:true}).waitFor()
  assert.equal(await page.getByRole('row').count(),2)
  await page.getByText('View details',{exact:true}).click()
  assert(await page.locator('pre').isVisible())
  assert((await page.locator('pre').textContent()).includes('archived'))
  await page.getByLabel('Search',{exact:true}).fill('Nobody')
  await page.getByRole('button',{name:'Apply filters'}).click()
  await page.getByRole('heading',{name:'No matching activity'}).waitFor()
  fail=true;await page.goto(url)
  await page.getByText('Injected log load failure',{exact:true}).waitFor()
  authorized=false;assert.equal((await page.goto(url)).status(),403)
  console.log('PASS: admin-only System Logs page, filters, pagination, expandable details, empty and error states')
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
