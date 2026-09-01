import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminAttendancePage() {
  return (
    <ModulePlaceholder
      title="Attendance"
      description="Search and monitor all campus attendance transactions."
      scope={[
        "Date, status, year level, section, program, and campus filters",
        "Student time-in and time-out records",
        "RFID and parent SMS delivery status",
        "Live updates from successful ESP32 taps",
      ]}
    />
  )
}
