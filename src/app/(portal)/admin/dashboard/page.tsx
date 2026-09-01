import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminDashboardPage() {
  return (
    <ModulePlaceholder
      title="Admin Dashboard"
      description="Institution-wide RFID attendance monitoring and daily operational overview."
      scope={[
        "Total students, present, absent, attendance rate, and RFID taps today",
        "Daily, weekly, and monthly attendance trends",
        "Attendance distribution by year level and section",
        "Live student attendance status with time-in and time-out",
      ]}
    />
  )
}
