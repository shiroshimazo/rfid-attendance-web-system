import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TeacherDashboardPage() {
  return (
    <ModulePlaceholder
      title="Teacher Dashboard"
      description="Attendance overview limited to the teacher's assigned students and sections."
      scope={[
        "Total assigned, present, absent, and attendance rate",
        "Assigned-student attendance trend",
        "Present and absent status distribution",
        "Today's assigned-student attendance table",
      ]}
    />
  )
}
