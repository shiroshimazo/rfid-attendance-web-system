"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DashboardErrorCard({ message }: { message: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Card role="alert" className="border-destructive/30">
      <CardHeader>
        <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden className="size-5" />
        </div>
        <CardTitle>Dashboard data could not be loaded</CardTitle>
        <CardDescription className="text-pretty">{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => startTransition(() => router.refresh())}
        >
          <RefreshCw
            aria-hidden
            className={isPending ? "animate-spin" : undefined}
          />
          {isPending ? "Retrying" : "Try again"}
        </Button>
      </CardContent>
    </Card>
  )
}
