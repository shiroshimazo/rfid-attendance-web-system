// Real NumberFlow and chart components behind a delayed Suspense boundary.
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
    import React, { Suspense, use, useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
    import { SummaryChart } from '@/app/(portal)/admin/reports/components/summary-chart';
    import { GroupBreakdownChart } from '@/app/(portal)/admin/reports/components/group-breakdown-chart';
    import { RadialStatusChart } from '@/features/attendance/radial-status-chart';
    const data = new Promise(resolve => { window.finishLoading = () => resolve(1234.5); });
    window.animationStarts = 0;
    document.addEventListener('animationsstart', () => window.animationStarts++, true);
    function Content() {
      const initial = use(data);
      const [value, setValue] = useState(initial);
      window.updateValue = value => setValue(value);
      return <>
        <SlidingNumber value={value} decimalPlaces={1} suffix="%" />
        <SummaryChart summary={[
          { label: 'Mon', present: 10, absent: 2 },
          { label: 'Tue', present: 15, absent: 1 },
        ]} rangeLabel="This week" />
        <GroupBreakdownChart byProgram={[{ group: 'IT', present: 10, absent: 2, total: 12, rate: 83.3 }]} byYearLevel={[]} />
        <RadialStatusChart slices={[{ status: 'present', count: 10 }, { status: 'absent', count: 2 }]}
          config={{ present: { label: 'Present', color: 'green' }, absent: { label: 'Absent', color: 'red' } }}
          headline={<SlidingNumber value={12} />} caption="students" ariaLabel="Status chart" />
      </>;
    }
    createRoot(document.getElementById('root')).render(
      <Suspense fallback={<p>Loading data</p>}><Content /></Suspense>
    );
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
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ reducedMotion })
    page.setDefaultTimeout(5000)
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    await page.goto(`http://127.0.0.1:${server.address().port}`)
    await page.getByText("Loading data", { exact: true }).waitFor()
    assert.equal(await page.locator('number-flow-react, .recharts-surface').count(), 0)
    assert.equal(await page.evaluate(() => window.animationStarts), 0)
    await page.evaluate(() => window.finishLoading())
    await page.getByRole("img", { name: "1,234.5%", exact: true }).waitFor()
    await page.locator('.recharts-line-curve').first().waitFor()
    await page.locator('.recharts-bar-rectangle').first().waitFor()
    await page.locator('.recharts-radial-bar-sector').first().waitFor()
    await page.waitForFunction(() => document.querySelector('number-flow-react')?._data?.value === 1234.5)
    if (reducedMotion === "no-preference") {
      await page.waitForFunction(() => window.animationStarts > 0)
    } else {
      assert.equal(await page.evaluate(() => window.animationStarts), 0)
    }
    await page.evaluate(() => window.updateValue(-9.2))
    await page.getByRole("img", { name: "-9.2%", exact: true }).waitFor()
    await page.waitForFunction(() => document.querySelector('number-flow-react')?._data?.value === -9.2)
    await page.evaluate(() => window.updateValue(NaN))
    await page.getByRole("img", { name: "0.0%", exact: true }).waitFor()
    assert.deepEqual(errors, [])
    await page.close()
  }
  console.log("PASS: loading boundary, number entrance/update, chart render, formatting, and reduced motion")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
