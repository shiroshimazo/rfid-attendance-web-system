import assert from "node:assert/strict"
import { PassThrough } from "node:stream"
import { finished } from "node:stream/promises"
import { test } from "node:test"
import { createElement as h } from "react"
import { renderToPipeableStream } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

const { ReportBox } = createSourceLoader({
  "@/components/data-error-card": {
    DataErrorCard: ({ title }) => h("div", { role: "alert" }, title),
  },
})("src/features/reports/report-box.tsx")

for (const rejectFirst of [false, true]) {
  test(`report boxes stream separately when one ${rejectFirst ? "fails" : "finishes"}`, { timeout: 5000 }, async () => {
    const first = Promise.withResolvers()
    const second = Promise.withResolvers()
    const output = new PassThrough()
    let html = ""
    output.on("data", chunk => { html += chunk.toString() })
    const waitForText = text => new Promise(resolve => {
      if (html.includes(text)) return resolve()
      const check = () => {
        if (!html.includes(text)) return
        output.off("data", check)
        resolve()
      }
      output.on("data", check)
    })
    const stream = renderToPipeableStream(h("main", null,
      h("h1", null, "Reports"),
      h(ReportBox, { data: first.promise, fallback: h("div", null, "First skeleton") }, value => h("p", null, value)),
      h(ReportBox, { data: second.promise, fallback: h("div", null, "Second skeleton") }, value => h("p", null, value)),
    ), { onShellReady() { stream.pipe(output) } })
    try {
      await waitForText("Second skeleton")
      assert.match(html, /<h1>Reports<\/h1>/)
      assert.match(html, /First skeleton/)
      if (rejectFirst) first.reject(new Error("Unavailable"))
      else first.resolve("First ready")
      await waitForText(rejectFirst ? "Report data could not be loaded" : "First ready")
      assert.doesNotMatch(html, /Second ready/)
      second.resolve("Second ready")
      await finished(output)
      assert.match(html, /Second ready/)
    } finally {
      stream.abort()
      output.destroy()
    }
  })
}
