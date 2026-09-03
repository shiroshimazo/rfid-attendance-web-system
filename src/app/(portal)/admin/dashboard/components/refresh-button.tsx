"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"

export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      aria-label="Refresh dashboard data"
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw
        aria-hidden
        className={isPending ? "animate-spin" : undefined}
      />
      Refresh
    </Button>
  )
}
