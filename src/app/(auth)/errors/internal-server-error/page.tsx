import { ErrorState } from "@/components/error-state"

export default function InternalServerErrorPage() {
  return (
    <ErrorState
      code="500"
      title="Something went wrong"
      description="The attendance system could not complete this request. Please try again later."
    />
  )
}
