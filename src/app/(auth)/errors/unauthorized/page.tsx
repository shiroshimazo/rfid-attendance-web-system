import { ErrorState } from "@/components/error-state"

export default function UnauthorizedPage() {
  return (
    <ErrorState
      code="401"
      title="Sign-in required"
      description="Please sign in with a school-issued account before accessing this page."
    />
  )
}
