// Standalone Chromium regression using real forms/components and local fixtures.
// No Auth/database calls. Optional tools stay outside the app's dependencies:
// npm install --prefix "$env:TEMP/rfid-browser-tools" --no-audit --no-fund playwright esbuild
// node "$env:TEMP/rfid-browser-tools/node_modules/playwright/cli.js" install chromium
// npm run build (provides production CSS)
// node tests/card-picker.browser.mjs
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
    import { RfidAssignDialog } from '@/app/(portal)/admin/students/components/rfid-assign-dialog';
    const cards = [
      {id:1, rfidNumber:'00000011', cardStatus:'Inactive', assignedDate:'2026-09-01', studentId:null},
      {id:2, rfidNumber:'00000022', cardStatus:'Inactive', assignedDate:'2026-09-02', studentId:null},
      ...Array.from({length:30}, (_,i)=>({id:i+3, rfidNumber:'000000'+String(i+30), cardStatus:'Inactive', assignedDate:'2026-09-03', studentId:null})),
      {id:99, rfidNumber:'AABBCCDD', cardStatus:'Active', assignedDate:'2026-09-04', studentId:1},
      {id:98, rfidNumber:'11223344', cardStatus:'Active', assignedDate:'2026-09-04', studentId:2},
    ];
    const held = {id:99, rfidNumber:'AABBCCDD', cardStatus:'Active', assignedDate:'2026-09-04'};
    const free = {id:1, fullName:'Ana Test', activeCard:null, cards:[]};
    const holder = {id:1, fullName:'Ana Test', activeCard:held, cards:[held]};
    function App() {
      const [assign,setAssign] = React.useState(false);
      const [reassign,setReassign] = React.useState(false);
      return <><button onClick={()=>setAssign(true)}>Open assignment</button>
        <button onClick={()=>setReassign(true)}>Open reassignment</button>
        <button id="outside">Outside control</button>
        <RfidAssignDialog student={assign ? free : null} cards={cards} onOpenChange={setAssign}/>
        <RfidAssignDialog student={reassign ? holder : null} cards={cards} onOpenChange={setReassign}/></>;
    }
    window.saved = [];
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  // Component CSS imports are served from the production build below.
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "fixture-boundaries", setup(builder) {
    builder.onResolve({ filter: /^@\/features\/students\/actions$/ }, () => ({ path: "actions", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ contents: `
      const save = async input => {window.saved.push(input); return {ok:true,message:'Fixture saved'};};
      export const assignRfidCardAction = save; export const releaseRfidCardAction = save;
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
  await page.getByRole("button", { name: "Open assignment", exact: true }).click()
  const input = page.locator("#assign-student-card")
  await input.fill("00000022")
  const option = page.locator('[data-slot="combobox-item"]').filter({ hasText: "00000022" })
  await option.waitFor({ state: "visible" })
  assert.deepEqual(await option.evaluate(el => ({
    pointerEvents: getComputedStyle(el).pointerEvents,
    insideDialog: Boolean(el.closest('[role="dialog"]')),
    hiddenFromAccessibility: Boolean(el.closest('[aria-hidden="true"]')),
  })), { pointerEvents: "auto", insideDialog: true, hiddenFromAccessibility: false })
  await option.click()
  await page.locator('[data-slot="combobox-content"]').waitFor({ state: "detached" })
  assert.match(await input.inputValue(), /00000022/)
  await page.getByRole("button", { name: "Save card", exact: true }).click()
  await page.waitForFunction(() => window.saved.length === 1, null, { polling: 100 })
  assert.deepEqual(await page.evaluate(() => window.saved[0].cardId), 2)
  console.log("PASS: pointer selection submits the selected card ID")

  await page.getByRole("button", { name: "Open assignment", exact: true }).click()
  await input.fill("00000011")
  await page.locator('[data-slot="combobox-item"]').filter({ hasText: "00000011" }).waitFor({ state: "visible" })
  await input.press("ArrowDown")
  await input.press("Enter")
  assert.match(await input.inputValue(), /00000011/)
  await page.locator('[data-slot="combobox-clear"]').click()
  assert.equal(await input.inputValue(), "")
  // Typed like a user: the status text matches every stored card.
  await input.pressSequentially("Inactive", { delay: 20 })
  const listed = page.locator('[data-slot="combobox-item"]')
  await listed.nth(1).waitFor({ state: "visible" })
  assert((await listed.count()) >= 2)
  await input.press("Escape")
  await page.getByRole("dialog").waitFor({ state: "hidden" })
  console.log("PASS: search by status, keyboard selection, clear and modal Escape dismissal")

  await page.getByRole("button", { name: "Open reassignment", exact: true }).click()
  const holderInput = page.locator('input[role="combobox"]')
  assert.match(await holderInput.inputValue(), /AABBCCDD/, "the held card is preselected")
  await page.getByRole("button", { name: "Release card", exact: true }).click()
  await page.waitForFunction(() => window.saved.length === 2, null, { polling: 100 })
  assert.deepEqual(await page.evaluate(() => window.saved[1]), { cardId: 99 })
  console.log("PASS: releasing returns the held card to the card list")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Open assignment", exact: true }).click()
  await input.fill("0000005")
  const lastOption = page.locator('[data-slot="combobox-item"]').filter({ hasText: /^00000059/ })
  await lastOption.scrollIntoViewIfNeeded()
  await lastOption.click()
  assert.match(await input.inputValue(), /00000059/)
  await page.evaluate(() => document.getElementById("outside").focus())
  assert.equal(await page.evaluate(() => document.activeElement?.id === "outside"), false)
  console.log("PASS: scrollable options on a narrow viewport; modal still traps background focus")
  assert.deepEqual(errors, [])
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
