// Real date filter and table with a mocked router; optional tooling matches date-picker-field.browser.mjs.
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
    import { MonitoringDateFilter } from '@/app/(portal)/admin/live-monitoring/components/monitoring-date-filter';
    import { MonitoringTable } from '@/app/(portal)/admin/live-monitoring/components/monitoring-table';
    import { MonitoringUpdateProvider } from '@/app/(portal)/admin/live-monitoring/components/monitoring-update-provider';
    function App() {
      const [range, setRange] = React.useState({ from: '2026-09-01', to: '2026-09-10' });
      window.resetRange = () => setRange({ from: '2026-09-01', to: '2026-09-30' });
      return <MonitoringUpdateProvider>
        <MonitoringDateFilter key={range.from + ':' + range.to} from={range.from} to={range.to} />
        <MonitoringTable rows={[]} />
      </MonitoringUpdateProvider>;
    }
    createRoot(document.getElementById('root')).render(<App />);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "boundaries", setup(builder) {
    builder.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: "navigation", namespace: "fixture" }))
    builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: "link", namespace: "fixture" }))
    builder.onResolve({ filter: /\.css$/ }, () => ({ path: "css", namespace: "fixture" }))
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({ resolveDir: root, contents: args.path === "navigation"
      ? 'export const useRouter=()=>({push(url,options){window.pushed={url,options}}});export const usePathname=()=>"/admin/live-monitoring";'
      : args.path === "link"
      ? 'import React from "react"; export default function Link({href,children,onClick}){return React.createElement("a",{href,onClick},children)}'
      : "export default {}" }))
  } }],
})
const requests = []
const server = createServer((req, res) => {
  if (req.url === "/app.js") {
    res.setHeader("Content-Type", "application/javascript")
    res.end(bundle.outputFiles[0].text)
  } else {
    requests.push(req.url)
    res.setHeader("Content-Type", "text/html")
    res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>')
  }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(5000)
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const form = page.locator("form")
  assert.equal(await form.getAttribute("action"), "/admin/live-monitoring")
  assert.equal(await form.getAttribute("method"), "get")
  assert.deepEqual(await page.locator('input[type="hidden"]').evaluateAll(nodes => nodes.map(node => [node.name, node.value])), [
    ["from", "2026-09-01"],
    ["to", "2026-09-10"],
  ])
  await page.getByRole("button", { name: "From date", exact: true }).click()
  await page.getByRole("button", { name: /Monday, September 7th, 2026/ }).click()
  assert.equal(await page.locator('input[name="from"]').inputValue(), "2026-09-07")
  await page.getByRole("button", { name: "Apply dates", exact: true }).click()
  assert.deepEqual(await page.evaluate(() => window.pushed), {
    url: "/admin/live-monitoring?from=2026-09-07&to=2026-09-10",
    options: { scroll: false },
  })
  // The table is the part of the panel that waits, so it carries the state.
  await page.locator('tbody [role="status"]').getByText("Updating taps", { exact: true }).waitFor()
  assert.equal(await page.locator('tbody td[colspan="7"]').count(), 1)
  assert.equal(await page.getByText("No taps in this date range", { exact: true }).count(), 0)
  assert.equal(await page.locator('[aria-busy="true"]').count() > 0, true)
  await page.locator('tbody [role="status"]').waitFor({ state: "hidden" })
  await page.getByText("No taps in this date range", { exact: true }).waitFor()
  // Today stays on the current route and drops the range.
  await page.getByRole("link", { name: "Today", exact: true }).click()
  assert.deepEqual(await page.evaluate(() => window.pushed), {
    url: "/admin/live-monitoring",
    options: { scroll: false },
  })
  // The submit is handled in place: the panel is never reloaded.
  assert.deepEqual(requests, ["/"])
  assert.equal(new URL(page.url()).search, "")
  await page.evaluate(() => window.resetRange())
  await page.waitForFunction(() => document.querySelector('input[name="from"]').value === "2026-09-01")
  assert.deepEqual(await page.locator('input[type="hidden"]').evaluateAll(nodes => nodes.map(node => [node.name, node.value])), [
    ["from", "2026-09-01"],
    ["to", "2026-09-30"],
  ])
  assert.deepEqual(errors, [])
  console.log("PASS: plain GET form, picker draft, in-place range apply, table loading state, and reset")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
