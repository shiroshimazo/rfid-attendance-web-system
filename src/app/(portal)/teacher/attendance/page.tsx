import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TeacherAttendancePage() {
  return (
    <ModulePlaceholder
      title="Attendance"
      description="Read-only attendance records for students assigned to the signed-in teacher."
      scope={[
        "Student, date, section, program, and status filters",
        "Time-in, time-out, RFID, and attendance status",
        "Row Level Security for assigned sections only",
        "Realtime updates without manual refresh",
      ]}
    />
  )
}
