import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminTeachersPage() {
  return (
    <ModulePlaceholder
      title="Manage Teachers"
      description="Create, update, archive, and review teacher accounts and assignments."
      scope={[
        "Teacher identity and employment information",
        "Department and assigned section management",
        "Account status and archive workflow",
        "Administrator-issued account credentials",
      ]}
    />
  )
}
