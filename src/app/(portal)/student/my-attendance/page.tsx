import { ModulePlaceholder } from "@/components/module-placeholder"

export default function StudentAttendancePage() {
  return (
    <ModulePlaceholder
      title="My Attendance"
      description="Personal attendance history visible only to the signed-in student."
      scope={[
        "Total present, absent, and personal attendance rate",
        "Attendance dates with time-in and time-out",
        "RFID and parent SMS status",
        "Attendance detail view by date and campus",
      ]}
    />
  )
}
