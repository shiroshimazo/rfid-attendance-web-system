import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FieldSkeleton({
  labelWidth = "w-28",
  descriptionWidth,
}: {
  labelWidth?: string
  /** Width of the helper line under the input, when the field has one. */
  descriptionWidth?: string
}) {
  return (
    <div className="space-y-2">
      <Skeleton className={`h-4 ${labelWidth}`} />
      <Skeleton className="h-9 w-full" />
      {descriptionWidth ? (
        <Skeleton className={`h-3 ${descriptionWidth}`} />
      ) : null}
    </div>
  )
}

/** Mirrors the admin information card: photo row, two-column grid, footer. */
function ProfileCardSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading admin information">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="min-w-56 flex-1 space-y-1">
            <FieldSkeleton descriptionWidth="w-56" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton descriptionWidth="w-16" />
          <div className="sm:col-span-2">
            <FieldSkeleton descriptionWidth="w-72" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </Card>
  )
}

/** Mirrors the password card: current, new, and confirmation are all shown. */
function PasswordCardSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading password form">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-4 w-64" />
        <Skeleton className="mt-2 h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldSkeleton descriptionWidth="w-48" />
        <FieldSkeleton descriptionWidth="w-28" />
        <FieldSkeleton />
      </CardContent>
      <CardFooter className="justify-end">
        <Skeleton className="h-9 w-40" />
      </CardFooter>
    </Card>
  )
}

/** Mirrors the session card, whose rows are a label and a value side by side. */
function SessionCardSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading session details">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-4 w-56" />
        <Skeleton className="mt-2 h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/** Mirrors the settings layout so the page does not shift once data lands. */
export function SettingsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
      <div className="lg:col-span-2">
        <ProfileCardSkeleton />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <PasswordCardSkeleton />
        <SessionCardSkeleton />
      </div>
    </div>
  )
}
