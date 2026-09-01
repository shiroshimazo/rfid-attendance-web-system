import { ErrorState } from "@/components/error-state"

export default function ForbiddenPage() {
  return (
    <ErrorState
      code="403"
      title="Access forbidden"
      description="Your account does not have permission to view this RFID attendance resource."
    />
  )
}
