// Exercises the actual client table with fixture updates; no database writes.
// Uses the same optional Playwright/esbuild tools as card-picker.browser.mjs.
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
    import { MonitoringTable } from '@/app/(portal)/admin/live-monitoring/components/monitoring-table';
    const initial = Array.from({length: 25}, (_, i) => ({
      id:i+1, studentId:'S-'+(i+1), name:i===0?'Ana Student':'Student '+(i+1),
      section:i===0?'A':'B', programId:i===0?'1':'2', programCode:i===0?'BSIT':'BSE',
      programName:i===0?'Information Technology':'Education', rfidNumber:'UID-'+(i+1),
      timeIn:'08:00:00', timeOut:i===1?'12:00:00':null,
    }));
    function App(){
      const [rows,setRows]=React.useState(initial);
      window.tapOut=()=>setRows(current=>current.map(row=>row.id===1?{...row,timeOut:'13:00:00'}:row));
      window.newTap=()=>setRows(current=>[{...initial[0],id:26,name:'New Student',rfidNumber:'NEW-UID'},...current]);
      window.clearDay=()=>setRows([]);
      return <MonitoringTable rows={rows}/>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"development"' },
})
const cssDir = join(root, ".next/static/chunks")
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n")
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "application/javascript"); res.end(bundle.outputFiles[0].text) }
  else if (req.url === "/app.css") { res.setHeader("Content-Type", "text/css"); res.end(css) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.setDefaultTimeout(5000)
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByText("Ana Student", { exact: true }).waitFor()
  assert.deepEqual(await page.getByRole("columnheader").allTextContents(), ["Name", "Section", "Program", "RFID Number", "Tap IN", "Tap Out"])
  assert.equal(await page.locator("tbody tr").count(), 20)
  await page.getByRole("link", { name: /next page/i }).click()
  assert.equal(await page.locator("tbody tr").count(), 5)
  await page.getByLabel("Search", { exact: true }).fill("uid-1")
  await page.getByText("Ana Student", { exact: true }).waitFor()
  async function select(label, option) {
    await page.getByRole("combobox", { name: label, exact: true }).click()
    await page.getByRole("option", { name: option, exact: true }).click()
  }
  await select("Program", "BSIT")
  await select("Section", "A")
  await select("Taps In/Out", "Taps In (awaiting out)")
  assert.equal(await page.locator("tbody tr").count(), 1)
  await page.evaluate(() => window.tapOut())
  await page.getByText("No matching taps", { exact: true }).waitFor()
  assert.equal(await page.getByLabel("Search", { exact: true }).inputValue(), "uid-1")
  await select("Taps In/Out", "Taps Out")
  await page.getByText("1:00 PM", { exact: true }).waitFor()
  await page.getByRole("button", { name: "Clear filters" }).click()
  await page.evaluate(() => window.newTap())
  await page.getByText("New Student", { exact: true }).waitFor()
  assert.match(await page.locator("tbody tr").first().innerText(), /New Student/)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByLabel("Search", { exact: true }).fill("NEW-UID")
  assert.equal(await page.locator("tbody tr").count(), 1)
  await page.getByRole("button", { name: "Clear filters" }).click()
  await page.evaluate(() => window.clearDay())
  await page.getByText("No taps yet today", { exact: true }).waitFor()
  assert.deepEqual(errors, [])
  console.log("PASS: columns, pagination, search, combined filters, tap updates, preserved filters, new rows, mobile controls, empty day")
} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}

