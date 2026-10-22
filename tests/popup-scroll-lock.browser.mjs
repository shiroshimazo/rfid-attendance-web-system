// Shared modal/select scroll-lock regression; uses the current global popup CSS.
import { readFile } from "node:fs/promises"
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
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
    import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
    import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
    import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
    function Gender() { return <Select><SelectTrigger aria-label="Gender"><SelectValue placeholder="Gender" /></SelectTrigger>
      <SelectContent><SelectItem value="female">Female</SelectItem><SelectItem value="male">Male</SelectItem></SelectContent></Select>; }
    createRoot(document.getElementById('root')).render(<>
      <Gender />
      <Dialog><DialogTrigger>Open form</DialogTrigger><DialogContent><DialogTitle>Add student</DialogTitle><DialogDescription>Profile</DialogDescription><Gender /></DialogContent></Dialog>
      <Sheet><SheetTrigger>Open sheet</SheetTrigger><SheetContent><SheetTitle>Add teacher</SheetTitle><SheetDescription>Profile</SheetDescription><Gender /></SheetContent></Sheet>
    </>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
})
const globals = await readFile(join(root, 'src/app/globals.css'), 'utf8')
const popupCss = globals.slice(globals.indexOf('/* Radix Select'), globals.indexOf('@media (prefers-reduced-motion: reduce)', globals.indexOf('/* Radix Select')))
const css = `html { scrollbar-gutter: stable; } body { margin: 0; min-height: 200vh; }
[data-slot$="overlay"] { position: fixed; inset: 0; }
[data-slot="dialog-content"], [data-slot="sheet-content"] { position: fixed; top: 100px; left: 30%; width: 40%; background: white; }
[data-slot="select-content"] { background: white; }
${popupCss}`
const server = createServer((req, res) => {
  if (req.url === '/app.js') { res.setHeader('Content-Type', 'application/javascript'); res.end(bundle.outputFiles[0].text) }
  else { res.setHeader('Content-Type', 'text/html'); res.end(`<html><head><style>${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`) }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1200, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`http://127.0.0.1:${server.address().port}`)
    for (const opener of ['Open form', 'Open sheet']) {
      await page.getByRole('button', { name: opener, exact: true }).click()
      const dialog = page.getByRole('dialog')
      await dialog.waitFor()
      const metrics = () => page.evaluate(() => ({
        overflow: getComputedStyle(document.body).overflow,
        margin: getComputedStyle(document.body).marginRight,
        width: document.body.getBoundingClientRect().width,
      }))
      const before = await metrics()
      assert.equal(before.overflow, 'hidden')
      await dialog.getByRole('combobox', { name: 'Gender' }).click()
      await page.getByRole('option', { name: 'Female', exact: true }).waitFor()
      assert.deepEqual(await metrics(), before, 'Opening a nested select must preserve modal scroll lock and width')
      await page.getByRole('option', { name: 'Female', exact: true }).click()
      assert.deepEqual(await metrics(), before)
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
    }
    await page.getByRole('combobox', { name: 'Gender' }).click()
    await page.getByRole('option', { name: 'Male', exact: true }).waitFor()
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'visible', 'Standalone selects retain existing page scrolling')
    await page.getByRole('option', { name: 'Male', exact: true }).click()
  }
  assert.deepEqual(errors, [])
  console.log('PASS: nested selects preserve modal scroll lock and width on desktop/mobile; standalone selects unchanged')
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
