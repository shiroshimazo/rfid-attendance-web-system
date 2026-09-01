import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TeacherReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports"
      description="Class and section attendance reporting for the signed-in teacher."
      scope={[
        "Attendance summary and trends",
        "Section-level attendance",
        "Assigned-student scope enforced by RLS",
        "PDF report export",
      ]}
    />
  )
}
