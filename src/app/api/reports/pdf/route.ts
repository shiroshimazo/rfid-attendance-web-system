import { createElement } from "react"
import { getCurrentAccount } from "@/features/auth/server"
import { getAdminReportsData, parseReportsRange } from "@/features/reports/panel"
import { getTeacherReportsData } from "@/features/reports/teacher-panel"
import { ReportPdfDocument } from "@/features/reports/pdf-document"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" }

export async function GET(request: Request) {
  const account = await getCurrentAccount()
  if (!account) return Response.json({ error: "Sign in to download reports." }, { status: 401, headers })
  if (account.status !== "active" || (account.role !== "admin" && account.role !== "teacher")) {
    return Response.json({ error: "This account cannot download reports." }, { status: 403, headers })
  }
  const params = new URL(request.url).searchParams
  const from = params.get("from") ?? ""
  const to = params.get("to") ?? ""
  const range = parseReportsRange({ from, to })
  if (from !== range.from || to !== range.to) {
    return Response.json({ error: "Select a valid report date range." }, { status: 400, headers })
  }
  try {
    const input = account.role === "admin"
      ? { role: "admin" as const, data: await getAdminReportsData(range) }
      : { role: "teacher" as const, data: await getTeacherReportsData(range) }
    const { renderDocument } = await import("@formepdf/core")
    const bytes = await renderDocument(createElement(ReportPdfDocument, input))
    return new Response(new Uint8Array(bytes), { headers: {
      ...headers, "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rfid-${account.role}-report-${range.from}-to-${range.to}.pdf"`,
    } })
  } catch (error) {
    console.error("Report PDF generation failed", error instanceof Error ? error.message : "Unknown error")
    return Response.json({ error: "The complete report could not be exported. Try again or select a shorter date range." }, { status: 500, headers })
  }
}
