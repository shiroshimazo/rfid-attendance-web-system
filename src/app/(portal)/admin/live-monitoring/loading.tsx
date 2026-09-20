import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <div aria-label="Loading live monitoring" className="space-y-6 p-4 md:p-6">
    <Skeleton className="h-8 w-56" />
    <Skeleton className="h-96 w-full rounded-xl" />
  </div>
}
