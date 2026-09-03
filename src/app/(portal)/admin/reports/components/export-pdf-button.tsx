"use client"

import { FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ExportPdfButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      data-print="hide"
      aria-label="Export this report as a PDF"
      onClick={() => window.print()}
    >
      <FileDown aria-hidden />
      Export PDF
    </Button>
  )
}
