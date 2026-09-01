import { AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  code: string
  title: string
  description: string
}

export function ErrorState({ code, title, description }: ErrorStateProps) {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>
        <p className="font-mono text-sm font-medium tabular-nums text-muted-foreground">
          Error {code}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
        <Button asChild className="mt-6 active:scale-[0.96] transition-transform">
          <Link href="/admin/dashboard">Return to dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
