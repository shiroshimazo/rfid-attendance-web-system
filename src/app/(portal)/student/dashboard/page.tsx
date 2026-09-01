import { ModulePlaceholder } from "@/components/module-placeholder"

export default function StudentDashboardPage() {
  return (
    <ModulePlaceholder
      title="Student Dashboard"
      description="A private summary of the signed-in student's current RFID attendance status."
      scope={[
        "Student identity, year level, section, and campus",
        "Today's attendance status, time-in, and time-out",
        "RFID card registration and active status",
        "Parent SMS sent, pending, or failed status",
      ]}
    />
  )
}
