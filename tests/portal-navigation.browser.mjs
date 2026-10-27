import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"

const optional = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = optional("esbuild")
const { chromium } = optional("playwright")
const bundle = await build({
  stdin: { contents: `
    import React from 'react'; import {createRoot} from 'react-dom/client';
    import {PortalLink} from '@/components/portal-link';
    window.prefetches=[];window.hovered=0;window.focused=0;window.navigated=0;
    createRoot(document.getElementById('root')).render(<nav>
      <PortalLink href="/admin/students" onMouseEnter={()=>window.hovered++}>Students</PortalLink>{' '}
      <PortalLink href="/teacher/settings" onFocus={()=>window.focused++} onNavigate={()=>window.navigated++}>Settings</PortalLink>{' '}
      <PortalLink href="/admin/reports?from=2026-11-01">Admin reports</PortalLink>{' '}
      <PortalLink href={{pathname:'/admin/reports'}}>Report object</PortalLink>
      <PortalLink href="/admin/dashboard" aria-current="page">Current page</PortalLink>
    </nav>);
  `, loader: "tsx", resolveDir: process.cwd() },
  bundle: true, write: false, format: "iife", jsx: "automatic",
  define: { "process.env.NODE_ENV": '"development"' },
  plugins: [{ name: "next-link-boundary", setup(builder) {
    builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: "link", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ contents: `
      import React,{useEffect} from 'react';
      export default function Link({href,prefetch,onNavigate,onClick,...props}){
        const url=typeof href==='string'?href:href.pathname;
        useEffect(()=>{if(prefetch)window.prefetches.push(url)},[url,prefetch]);
        return <a {...props} href={url} data-prefetch={String(prefetch)} onClick={event=>{
          onClick?.(event); if(!event.defaultPrevented){event.preventDefault();window.destination=url;onNavigate?.({preventDefault(){}})}
        }}/>;
      }
    `, loader: "tsx", resolveDir: process.cwd() }))
  } }],
})
const server = createServer((request, response) => {
  response.setHeader("Content-Type", request.url === "/app.js" ? "application/javascript" : "text/html")
  response.end(request.url === "/app.js" ? bundle.outputFiles[0].text : '<html lang="en"><body><div id="root"></div><script src="/app.js"></script></body></html>')
})
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
let browser
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.RFID_CHROMIUM ?? process.env.CALENDAR_CHROMIUM })
  const page = await browser.newPage()
  const errors = []; page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const students = page.getByRole("link", { name: "Students", exact: true })
  await students.waitFor()
  assert.deepEqual(await page.evaluate(() => window.prefetches), [])
  await students.hover()
  await page.waitForFunction(() => window.prefetches.length === 1)
  assert.equal(await page.evaluate(() => window.destination), undefined)
  const settings = page.getByRole("link", { name: "Settings", exact: true })
  await settings.focus()
  await page.waitForFunction(() => window.prefetches.length === 2)
  for (const name of ["Admin reports", "Report object", "Current page"]) {
    const report = page.getByRole("link", { name, exact: true })
    await report.hover(); await report.focus()
    assert.equal(await report.getAttribute("data-prefetch"), "false")
  }
  assert.deepEqual(await page.evaluate(() => window.prefetches), ["/admin/students", "/teacher/settings"])
  assert.equal(await page.evaluate(() => window.hovered), 1)
  assert.ok(await page.evaluate(() => window.focused) > 0)
  await settings.click()
  assert.equal(await page.evaluate(() => window.destination), "/teacher/settings")
  assert.equal(await page.evaluate(() => window.navigated), 1)
  assert.deepEqual(errors, [])
  console.log("PASS: intent prefetch, keyboard focus, preserved navigation callbacks, and no speculative admin report sync.")
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
