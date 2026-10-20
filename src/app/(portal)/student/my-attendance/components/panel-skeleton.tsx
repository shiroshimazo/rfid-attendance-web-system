import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function KpiCardSkeleton() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-8 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  )
}

/** Mirrors the attendance panel layout so the page does not shift once data lands. */
export function PanelSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading attendance history"
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="aspect-square w-full max-w-[300px] rounded-full" />
          <div className="grid w-full max-w-sm gap-2.5">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
