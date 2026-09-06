// Standalone Chromium regression using real forms/components and local fixtures.
// No Auth/database calls. Optional tools stay outside the app's dependencies:
// npm install --prefix "$env:TEMP/rfid-browser-tools" --no-audit --no-fund playwright esbuild
// node "$env:TEMP/rfid-browser-tools/node_modules/playwright/cli.js" install chromium
// npm run build (provides production CSS)
// node tests/student-picker.browser.mjs
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { readFile, readdir } from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const tools = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = tools("esbuild")
const { chromium } = tools("playwright")
const bundle = await build({
  stdin: { contents: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { RfidCardRegisterDialog } from '@/app/(portal)/admin/rfid-cards/components/rfid-card-register-dialog';
    import { RfidCardAssignDialog } from '@/app/(portal)/admin/rfid-cards/components/rfid-card-assign-dialog';
    const students = [
      {id:1, studentId:'TEST-001', fullName:'Ana Test', programCode:'BSIT', section:'21001', status:'active', activeCardNumber:null},
      {id:2, studentId:'TEST-002', fullName:'Ben Sample', programCode:'BSIT', section:'21002', status:'active', activeCardNumber:null},
      ...Array.from({length:30}, (_,i)=>({id:i+3,studentId:'TEST-'+(i+3),fullName:'Student '+i,programCode:'BSIT',section:'21001',status:'active',activeCardNumber:null}))
    ];
    const card = {id:1,rfidNumber:'00000011',cardStatus:'Active',assignedDate:'2026-09-01',student:students[0]};
    function App() {
      const [register,setRegister] = React.useState(false);
      const [assign,setAssign] = React.useState(false);
      return <><button onClick={()=>setRegister(true)}>Open registration</button>
        <button onClick={()=>setAssign(true)}>Open reassignment</button>
        <button id="outside">Outside control</button>
        <RfidCardRegisterDialog open={register} onOpenChange={setRegister} students={students}/>
        <RfidCardAssignDialog card={assign ? card : null} onOpenChange={setAssign} students={students}/></>;
    }
    window.saved = [];
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "fixture-boundaries", setup(builder) {
    builder.onResolve({ filter: /^@\/features\/rfid\/actions$/ }, () => ({ path: "actions", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ contents: `
      const save = async input => {window.saved.push(input); return {ok:true,message:'Fixture saved'};};
      export const registerRfidCardAction = save; export const assignRfidCardAction = save;
    ` }))
    builder.onResolve({ filter: /^@\// }, args => ({ path: resolve(root, "src", args.path.slice(2) + (args.path.includes("/components/") ? ".tsx" : ".ts")) }))
  } }],
})
const cssDir = join(root, ".next/static/chunks")
const css = (await Promise.all((await readdir(cssDir)).filter(file => file.endsWith(".css")).map(file => readFile(join(cssDir, file), "utf8")))).join("\n")
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "application/javascript"); res.end(bundle.outputFiles[0].text) }
  else if (req.url === "/app.css") { res.setHeader("Content-Type", "text/css"); res.end(css) }
  else { res.setHeader("Content-Type", "text/html"); res.end('<html><head><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  page.setDefaultTimeout(5000)
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByRole("button", { name: "Open registration", exact: true }).click()
  await page.getByLabel("RFID card UID").fill("00:00:00:11")
  const input = page.locator("#register-card-student")
  await input.fill("Ana")
  const option = page.locator('[data-slot="combobox-item"]').filter({ hasText: "Ana Test" })
  await option.waitFor({ state: "visible" })
  assert.deepEqual(await option.evaluate(el => ({
    pointerEvents: getComputedStyle(el).pointerEvents,
    insideDialog: Boolean(el.closest('[role="dialog"]')),
    hiddenFromAccessibility: Boolean(el.closest('[aria-hidden="true"]')),
  })), { pointerEvents: "auto", insideDialog: true, hiddenFromAccessibility: false })
  await option.click()
  await page.locator('[data-slot="combobox-content"]').waitFor({ state: "detached" })
  assert.match(await input.inputValue(), /Ana Test/)
  await page.getByRole("button", { name: "Register card", exact: true }).click()
  await page.waitForFunction(() => window.saved.length === 1)
  assert.equal((await page.evaluate(() => window.saved[0])).studentId, 1)
  console.log("PASS: registration pointer selection submits the selected student ID")

  await page.getByRole("button", { name: "Open registration", exact: true }).click()
  await input.fill("TEST-002")
  await page.locator('[data-slot="combobox-item"]').filter({ hasText: "Ben Sample" }).waitFor({ state: "visible" })
  await input.press("ArrowDown")
  await input.press("Enter")
  assert.match(await input.inputValue(), /Ben Sample/)
  await page.locator('[data-slot="combobox-clear"]').click()
  assert.equal(await input.inputValue(), "")
  await input.fill("BSIT")
  await page.waitForFunction(() => document.querySelectorAll('[data-slot="combobox-item"]').length >= 2)
  assert((await page.locator('[data-slot="combobox-item"]').count()) >= 2)
  await input.press("Escape")
  await page.getByRole("dialog").waitFor({ state: "hidden" })
  console.log("PASS: search by student ID/program, keyboard selection, clear and modal Escape dismissal")

  await page.getByRole("button", { name: "Open reassignment", exact: true }).click()
  const assignInput = page.locator('input[role="combobox"]')
  await assignInput.fill("Ben")
  await page.locator('[data-slot="combobox-item"]').filter({ hasText: "Ben Sample" }).click()
  assert.match(await assignInput.inputValue(), /Ben Sample/)
  await page.getByRole("button", { name: /Reassign card|Save assignment/ }).click()
  await page.waitForFunction(() => window.saved.length === 2)
  assert.equal((await page.evaluate(() => window.saved[1])).studentId, 2)
  console.log("PASS: reassignment uses the same working student picker")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Open registration", exact: true }).click()
  await input.fill("Student")
  const lastOption = page.locator('[data-slot="combobox-item"]').filter({ hasText: /^Student 29/ })
  await lastOption.scrollIntoViewIfNeeded()
  await lastOption.click()
  assert.match(await input.inputValue(), /Student 29/)
  await page.evaluate(() => document.getElementById("outside").focus())
  assert.equal(await page.evaluate(() => document.activeElement?.id === "outside"), false)
  console.log("PASS: scrollable options on a narrow viewport; modal still traps background focus")
  assert.deepEqual(errors, [])
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
