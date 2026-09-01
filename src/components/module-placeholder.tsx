import { CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ModulePlaceholderProps {
  title: string
  description: string
  scope: string[]
}

export function ModulePlaceholder({
  title,
  description,
  scope,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <Badge variant="secondary">Scaffold ready</Badge>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planned scope</CardTitle>
          <CardDescription>
            This route is ready for its Supabase-backed implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {scope.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
