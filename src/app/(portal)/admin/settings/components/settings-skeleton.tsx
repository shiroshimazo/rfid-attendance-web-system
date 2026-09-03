import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FormCardSkeleton({ rows, label }: { rows: number; label: string }) {
  return (
    <Card aria-busy="true" aria-label={label}>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-end">
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </Card>
  )
}

/** Mirrors the settings layout so the page does not shift once data lands. */
export function SettingsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
      <div className="lg:col-span-2">
        <FormCardSkeleton rows={4} label="Loading admin information" />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <FormCardSkeleton rows={2} label="Loading password form" />

        <Card aria-busy="true" aria-label="Loading session details">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-2 h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
