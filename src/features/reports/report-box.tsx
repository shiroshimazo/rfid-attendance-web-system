import { Suspense, type ReactNode } from "react"
import { DataErrorCard } from "@/components/data-error-card"

async function ReportBoxContent<T>({ data, children }: {
  data: Promise<T>; children: (data: T) => ReactNode
}) {
  let result: T
  try {
    result = await data
  } catch (error) {
    return <DataErrorCard title="Report data could not be loaded" message={error instanceof Error ? error.message : "Try loading this report again."} />
  }
  return children(result)
}

export function ReportBox<T>({ data, fallback, children }: {
  data: Promise<T>; fallback: ReactNode; children: (data: T) => ReactNode
}) {
  return <Suspense fallback={fallback}><ReportBoxContent data={data}>{children}</ReportBoxContent></Suspense>
}
