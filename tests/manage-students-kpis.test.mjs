import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement, Suspense } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-typescript.mjs"

function loadPage(students) {
  return createSourceLoader({
    "@/features/students/directory": { getStudentDirectory: async () => ({ students }) },
    "@/components/live-refresh": { LiveRefresh: () => null },
    "./components/students-directory": { StudentsDirectory: () => createElement("div", null, "Student records") },
    "@/components/motion-primitives/sliding-number": {
      SlidingNumber: ({ value }) => createElement("span", { "data-count": value }, value),
    },
  })("src/app/(portal)/admin/students/page.tsx").default
}

async function renderContent(students) {
  const page = loadPage(students)()
  const boundary = page.props.children.find(child => child.type === Suspense)
  return renderToStaticMarkup(await boundary.props.children.type())
}

test("Manage Students shows four KPI cards before records, including when empty", async () => {
  const html = await renderContent([])
  assert.match(html, /aria-label="Student summary"/)
  assert.equal((html.match(/data-count="0"/g) ?? []).length, 4)
  assert(html.indexOf("Student summary") < html.indexOf("Student records"))
})

test("student KPIs distinguish account status and active cards from card history", async () => {
  const html = await renderContent([
    { status: "active", activeCard: { id: 1 }, cards: [{ cardStatus: "Active" }] },
    { status: "active", activeCard: null, cards: [{ cardStatus: "Lost" }] },
    { status: "inactive", activeCard: null, cards: [] },
  ])
  for (const [label, value] of [["Total Students", 3], ["Active Students", 2], ["Inactive Students", 1], ["With Active RFID", 1]]) {
    assert.match(html, new RegExp(`${label}</div>[\\s\\S]*?data-count="${value}"`))
  }
})
