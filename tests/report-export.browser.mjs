// Optional local tooling/setup matches tests/student-picker.browser.mjs.
// Tests the real download button against a loopback HTTP fixture, without Auth/Supabase.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
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
    import { Toaster } from 'sonner';
    import { ExportPdfButton } from '@/features/reports/export-pdf-button';
    function App() {
      const [from, setFrom] = React.useState('2026-09-01');
      return <><label>From<input aria-label="From" value={from} onChange={e=>setFrom(e.target.value)} /></label>
        <ExportPdfButton range={{from,to:'2026-09-07'}}/><Toaster/></>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
})
let mode = "pdf"
const requested = []
const pdf = Buffer.from("%PDF-1.7\nfixture download bytes\n%%EOF")
const server = createServer((req, res) => {
  if (req.url === "/app.js") { res.setHeader("Content-Type", "application/javascript"); res.end(bundle.outputFiles[0].text) }
  else if (req.url.startsWith("/api/reports/pdf?")) {
    requested.push(req.url)
    setTimeout(() => {
      if (mode === "error") { res.statusCode = 500; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ error: "Complete report unavailable" })) }
      else if (mode === "html") { res.setHeader("Content-Type", "text/html"); res.end("Sign in") }
      else { res.setHeader("Content-Type", "application/pdf"); res.end(pdf) }
    }, 300)
  } else { res.setHeader("Content-Type", "text/html"); res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ acceptDownloads: true })
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const downloadEvent = page.waitForEvent("download")
  await page.getByRole("button", { name: "Export PDF" }).click()
  assert(await page.getByRole("button", { name: "Generating PDF…" }).isDisabled())
  const download = await downloadEvent
  assert.equal(download.suggestedFilename(), "rfid-report-2026-09-01-to-2026-09-07.pdf")
  assert.deepEqual(await readFile(await download.path()), pdf)
  assert(requested[0].includes("from=2026-09-01&to=2026-09-07"))
  await page.getByRole("button", { name: "Export PDF" }).waitFor()

  mode = "error"
  await page.getByLabel("From").fill("2026-09-02")
  await page.getByRole("button", { name: "Export PDF" }).click()
  await page.getByText("Complete report unavailable", { exact: true }).waitFor()
  assert(requested[1].includes("from=2026-09-02"))
  assert(await page.getByRole("button", { name: "Export PDF" }).isEnabled())

  mode = "html"
  await page.getByRole("button", { name: "Export PDF" }).click()
  await page.getByText("The server did not return a PDF. Sign in and try again.", { exact: true }).waitFor()
  assert.deepEqual(errors, [])
  console.log("PASS: PDF download bytes/filename, selected range, pending state, retry and non-PDF errors")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
