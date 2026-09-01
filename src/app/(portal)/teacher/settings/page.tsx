import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TeacherSettingsPage() {
  return (
    <ModulePlaceholder
      title="Teacher Settings"
      description="Review teacher employment information and maintain account security."
      scope={[
        "Profile picture and teacher ID",
        "Department, email, and phone number",
        "Read-only employment details",
        "Supabase password change",
      ]}
    />
  )
}
