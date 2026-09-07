"use client"

import { useState } from "react"
import { FileDown, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { ReportsRange } from "@/features/reports/panel"

export function ExportPdfButton({ range }: { range: ReportsRange }) {
  const [pending, setPending] = useState(false)
  async function download() {
    setPending(true)
    try {
      const response = await fetch(`/api/reports/pdf?${new URLSearchParams({ from: range.from, to: range.to })}`, { cache: "no-store" })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || "Could not download the report. Please try again.")
      }
      if (!response.headers.get("content-type")?.includes("application/pdf")) {
        throw new Error("The server did not return a PDF. Sign in and try again.")
      }
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement("a")
      link.href = url
      link.download = `rfid-report-${range.from}-to-${range.to}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30_000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not download the report.")
    } finally {
      setPending(false)
    }
  }
  return <Button variant="outline" size="sm" onClick={download} disabled={pending} aria-busy={pending}>
    {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <FileDown className="size-4" aria-hidden />}
    {pending ? "Generating PDF…" : "Export PDF"}
  </Button>
}
