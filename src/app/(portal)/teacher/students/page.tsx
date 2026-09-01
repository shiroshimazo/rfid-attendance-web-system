import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TeacherStudentsPage() {
  return (
    <ModulePlaceholder
      title="Students"
      description="Read-only student information and attendance history for assigned sections."
      scope={[
        "Assigned student identity and academic information",
        "Current attendance status",
        "Personal attendance history",
        "No teacher modification controls",
      ]}
    />
  )
}
