// Real NumberFlow and chart components behind a delayed Suspense boundary.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { readFile } from "node:fs/promises"
import postcss from "postcss"
import tailwindcss from "@tailwindcss/postcss"

const root = fileURLToPath(new URL("../", import.meta.url))
const tools = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = tools("esbuild")
const { chromium } = tools("playwright")
const cssPath = join(root, "src/app/globals.css")
const css = await postcss([tailwindcss({ base: root })]).process(await readFile(cssPath, "utf8"), { from: cssPath })
const bundle = await build({
  stdin: { contents: `
    import React, { Suspense, use, useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
    import { SummaryChart } from '@/app/(portal)/admin/reports/components/summary-chart';
    import { SummaryChart as TeacherSummaryChart } from '@/app/(portal)/teacher/reports/components/summary-chart';
    import { AttendanceTrendChart } from '@/app/(portal)/admin/dashboard/components/attendance-trend-chart';
    import { AttendanceTrendChart as TeacherTrendChart } from '@/app/(portal)/teacher/dashboard/components/attendance-trend-chart';
    import { GroupBreakdownChart } from '@/app/(portal)/admin/reports/components/group-breakdown-chart';
    import { RadialStatusChart } from '@/features/attendance/radial-status-chart';
    const data = new Promise(resolve => { window.finishLoading = () => resolve(1234.5); });
    window.animationStarts = 0;
    document.addEventListener('animationsstart', () => window.animationStarts++, true);
    const summary = [
      { date: '2025-09-01', label: 'Sep 1', present: 10, absent: 2, rate: 83.3 },
      { date: '2025-09-02', label: 'Sep 2', present: 12, absent: 3, rate: 80 },
      { date: '2026-08-31', label: 'Aug 31', present: NaN, absent: NaN, rate: null },
      { date: '2026-09-01', label: 'Sep 1', present: 15, absent: 1, rate: 93.8 },
      { date: '2026-09-02', label: 'Sep 2', present: 13, absent: 2, rate: 86.7 },
    ];
    const daily = summary.map(({ date, ...point }) => ({ ...point, key: date, label: date }));
    const trend = { daily, weekly: [daily[0]], monthly: [daily[3]] };
    function Content() {
      const initial = use(data);
      const [value, setValue] = useState(initial);
      const [chartTrend, setChartTrend] = useState(trend);
      window.updateValue = value => setValue(value);
      window.updateTrend = setChartTrend;
      return <>
        <SlidingNumber value={value} decimalPlaces={1} suffix="%" />
        <SummaryChart summary={summary} rangeLabel="This week" />
        <TeacherSummaryChart summary={summary} rangeLabel="This week" />
        <div style={{ position: 'relative', height: 380 }}><AttendanceTrendChart trend={chartTrend} hasHistory /></div>
        <div style={{ position: 'relative', height: 380 }}><TeacherTrendChart trend={chartTrend} hasHistory /></div>
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
  } else if (req.url === "/app.css") {
    res.setHeader("Content-Type", "text/css")
    res.end(css.css)
  } else {
    res.setHeader("Content-Type", "text/html")
    res.end('<html><head><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>')
  }
})
await new Promise(done => server.listen(0, "127.0.0.1", done))
let browser
function plotsFillAvailableHeight() {
  return [...document.querySelectorAll('[data-slot="line-chart"]')].every(chart => {
    const plot = chart.querySelector('svg')?.getBoundingClientRect()
    const legend = chart.querySelector('ul[aria-label="Series"]')?.getBoundingClientRect()
    // Category labels take 28px; the section leaves a 12px gap before the legend.
    return plot && legend && Math.abs(legend.top - plot.bottom - 40) < 2
  })
}
try {
  browser = await chromium.launch({ headless: true, channel: process.env.RFID_BROWSER_CHANNEL })
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ reducedMotion })
    page.setDefaultTimeout(5000)
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    await page.goto(`http://127.0.0.1:${server.address().port}`)
    await page.getByText("Loading data", { exact: true }).waitFor()
    assert.equal(await page.locator('number-flow-react, .recharts-surface, [data-slot="line-chart"]').count(), 0)
    assert.equal(await page.evaluate(() => window.animationStarts), 0)
    await page.evaluate(() => window.finishLoading())
    await page.getByRole("img", { name: "1,234.5%", exact: true }).waitFor()
    const charts = page.locator('[data-slot="line-chart"]')
    await charts.nth(3).waitFor()
    await page.waitForFunction(plotsFillAvailableHeight)
    const originalHeight = await charts.nth(2).locator('svg').getAttribute('height')
    await charts.nth(2).evaluate(chart => chart.closest('[data-slot="card"]').parentElement.style.height = '560px')
    await page.waitForFunction(plotsFillAvailableHeight)
    assert.ok(Number(await charts.nth(2).locator('svg').getAttribute('height')) > Number(originalHeight), 'plot grows with its section')
    const lines = charts.first().locator('path[stroke="var(--chart-2)"]')
    await lines.waitFor({ state: 'attached' })
    assert.equal((await lines.getAttribute('d')).match(/M/g).length, 2, 'null rate leaves a gap')
    for (const chart of await charts.all()) {
      assert.equal(await chart.locator('tbody tr').count(), 5)
      assert.deepEqual(await chart.locator('tbody tr').nth(2).locator('td').allTextContents(), ['No data', 'No data'])
      const present = chart.getByRole('button', { name: 'Present', exact: true })
      await present.click()
      assert.equal(await present.getAttribute('aria-pressed'), 'false')
      await present.click()
      assert.equal(await present.getAttribute('aria-pressed'), 'true')
      const inspector = chart.getByRole('slider')
      await page.mouse.move(0, 0)
      await inspector.focus()
      await inspector.press('Home')
      assert.match(await inspector.getAttribute('aria-valuetext'), /Present 10\. Absent 2/)
      await chart.getByRole('tooltip').waitFor()
      assert.match(await chart.getByRole('tooltip').innerText(), /83\.3% rate/)
      await inspector.press('ArrowRight')
      await inspector.press('ArrowRight')
      assert.match(await inspector.getAttribute('aria-valuetext'), /Present no data\. Absent no data/)
      await inspector.press('Escape')
      await chart.getByRole('tooltip').waitFor({ state: 'hidden' })
    }
    assert.match(await charts.first().locator('table').innerText(), /Sep 1, 2025/)
    assert.match(await charts.first().locator('table').innerText(), /Sep 1, 2026/)
    await page.evaluate(() => {
      const dates = ['Sep 8', 'Sep 9', 'Sep 10', 'Sep 22', 'Sep 25', 'Sep 27', 'Sep 28', 'Oct 28']
      const counts = [1, 4, 1, 1, 4, 1, 4, 0]
      const daily = dates.map((label, index) => ({
        key: label, label, present: counts[index], absent: 0, rate: index === 7 ? null : 100,
      }))
      window.updateTrend({ daily, weekly: [daily[0]], monthly: [daily[7]] })
    })
    await page.waitForFunction(() => [...document.querySelectorAll('[aria-label="Attendance trend, last 14 session days"]')].every(chart => {
      if (chart.querySelectorAll('tbody tr').length !== 8) return false
      return [...chart.querySelectorAll('path[stroke="var(--chart-2)"], path[stroke="var(--destructive)"]')].every(line => {
        const end = line.getPointAtLength(line.getTotalLength())
        return Math.abs(end.x - (Number(chart.querySelector('svg').getAttribute('width')) - 16)) < 1 &&
          Math.abs(end.y - (Number(chart.querySelector('svg').getAttribute('height')) - 8)) < 1
      })
    }))
    for (const chart of await page.locator('[aria-label="Attendance trend, last 14 session days"]').all()) {
      const inspector = chart.getByRole('slider')
      await inspector.focus()
      await inspector.press('End')
      assert.match(await inspector.getAttribute('aria-valuetext'), /Oct 28\. Present 0\. Absent 0/)
      await chart.getByRole('tooltip').waitFor()
      assert.match(await chart.getByRole('tooltip').innerText(), /Oct 28 · — rate/)
      assert.deepEqual(await chart.locator('tbody tr').last().locator('td').allTextContents(), ['0', '0'])
      await inspector.press('Escape')
    }
    await charts.nth(2).screenshot({ path: join(tmpdir(), 'rfid-beui-oct28-fixed.png') })
    for (const weekly of await page.getByRole('tab', { name: 'Weekly', exact: true }).all()) {
      await weekly.click()
    }
    for (const chart of await charts.all()) {
      if ((await chart.getAttribute('aria-label')).startsWith('Attendance trend')) {
        assert.match(await chart.getAttribute('aria-label'), /last 12 weeks/)
        assert.equal(await chart.locator('tbody tr').count(), 1)
      }
    }
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
    if (reducedMotion === "no-preference") {
      await page.screenshot({ path: join(tmpdir(), "rfid-beui-line-charts-desktop.png"), fullPage: true })
      await page.setViewportSize({ width: 375, height: 900 })
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.waitForFunction(() => [...document.querySelectorAll('[data-slot="line-chart"] svg')].every(svg => svg.getBoundingClientRect().width <= 375))
      await page.waitForFunction(plotsFillAvailableHeight)
      for (const chart of await charts.all()) {
        const bounds = await chart.boundingBox()
        assert.ok(bounds.width > 0 && bounds.x + bounds.width <= 375, 'chart fits mobile width')
      }
      for (const select of await page.getByRole('combobox', { name: 'Attendance trend range' }).all()) {
        await select.click()
        await page.getByRole('option', { name: 'Monthly', exact: true }).click()
      }
      for (const chart of await charts.all()) {
        if ((await chart.getAttribute('aria-label')).startsWith('Attendance trend')) {
          assert.match(await chart.getAttribute('aria-label'), /last 6 months/)
        }
      }
      await page.screenshot({ path: join(tmpdir(), "rfid-beui-line-charts-mobile.png"), fullPage: true })
    }
    assert.deepEqual(errors, [])
    await page.close()
  }
  console.log("PASS: loading boundary, all four line charts, gaps, multi-year dates, legend, keyboard tooltip, range controls, number updates, and reduced motion")
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
