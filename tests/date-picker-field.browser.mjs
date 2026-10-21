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
    import { DatePickerField } from '@/components/ui/date-picker-field';
    function App() {
      const [initial, setInitial] = React.useState('2026-09-08');
      window.resetFilters = () => setInitial('2026-09-01');
      return <form key={initial} onSubmit={event => {
        event.preventDefault();
        window.submitted = Object.fromEntries(new FormData(event.currentTarget));
      }}>
        <label htmlFor="from">From date</label>
        <DatePickerField id="from" name="from" defaultValue={initial} />
        <label htmlFor="to">To date</label>
        <DatePickerField id="to" name="to" defaultValue="2026-09-30" />
        <DatePickerField name="disabled" defaultValue="2026-09-30" disabled />
        <button type="submit">Apply filters</button>
      </form>;
    }
    createRoot(document.getElementById('root')).render(<App />);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
})
const server = createServer((req, res) => {
  if (req.url === "/app.js") {
    res.setHeader("Content-Type", "application/javascript")
    res.end(bundle.outputFiles[0].text)
  } else {
    res.setHeader("Content-Type", "text/html")
    res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>')
  }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByRole("button", { name: "From date", exact: true }).click()
  assert.equal(await page.evaluate(() => window.submitted), undefined)
  await page.getByRole("button", { name: /Monday, September 7th, 2026/ }).click()
  assert.equal(await page.getByRole("dialog").count(), 0)
  await page.getByRole("button", { name: "Apply filters" }).click()
  assert.deepEqual(await page.evaluate(() => window.submitted), { from: "2026-09-07", to: "2026-09-30" })
  await page.evaluate(() => window.resetFilters())
  await page.waitForFunction(() => document.querySelector('input[name="from"]').value === "2026-09-01")
  assert.equal(await page.locator('input[type="date"]').count(), 0)
  assert.deepEqual(errors, [])
  console.log("PASS: calendar selection, GET form values, disabled field omission, and filter reset")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
