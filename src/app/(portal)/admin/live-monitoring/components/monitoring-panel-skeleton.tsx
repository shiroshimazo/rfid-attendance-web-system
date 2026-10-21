import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Mirrors the monitoring table card, so a new date range swaps only the table
 * and the surrounding panel keeps its shape while the records are read.
 */
export function MonitoringPanelSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading student taps">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,2fr)_1fr_1fr_1fr_auto]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2 rounded-lg border p-3">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-40" />
      </CardFooter>
    </Card>
  )
}
