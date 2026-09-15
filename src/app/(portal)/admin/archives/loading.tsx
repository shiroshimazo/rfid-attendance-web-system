import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <div className="flex flex-1 flex-col gap-4 p-4 md:p-6" aria-label="Loading archives" role="status">
    <Skeleton className="h-8 w-40" /><Skeleton className="h-10 w-full max-w-xl" /><Skeleton className="h-80 w-full" />
  </div>
}
