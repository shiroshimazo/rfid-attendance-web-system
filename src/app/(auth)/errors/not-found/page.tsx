import { ErrorState } from "@/components/error-state"

export default function NotFoundPage() {
  return (
    <ErrorState
      code="404"
      title="Page not found"
      description="The requested attendance page does not exist or may have moved."
    />
  )
}
