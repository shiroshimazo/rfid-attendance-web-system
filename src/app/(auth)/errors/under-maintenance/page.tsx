import { ErrorState } from "@/components/error-state"

export default function UnderMaintenancePage() {
  return (
    <ErrorState
      code="503"
      title="Maintenance in progress"
      description="The RFID attendance portal is temporarily unavailable while maintenance is completed."
    />
  )
}
