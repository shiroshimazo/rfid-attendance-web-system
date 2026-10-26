import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return <div role="status" aria-label="Loading calendar" className="flex flex-col gap-4">
    <span className="sr-only">Loading calendar…</span>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <Card key={index}><CardContent className="space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-16" /></CardContent></Card>)}
    </div>
    <Skeleton className="h-10 w-64" />
    <Card><CardContent><Skeleton className="h-96 w-full" /></CardContent></Card>
  </div>
}
