import { Skeleton } from "@/components/ui/skeleton"
export default function Loading() {
  return <div role="status" aria-label="Loading system logs" className="flex flex-1 flex-col gap-4 p-4 md:p-6"><Skeleton className="h-8 w-40" /><Skeleton className="h-32 w-full" /><Skeleton className="h-80 w-full" /></div>
}
