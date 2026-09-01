import { ModulePlaceholder } from "@/components/module-placeholder"

export default function StudentProfilePage() {
  return (
    <ModulePlaceholder
      title="Student Profile"
      description="Review personal and academic information and maintain account security."
      scope={[
        "Profile picture and student ID",
        "Year level, section, campus, and contact information",
        "Read-only academic information",
        "Supabase password change",
      ]}
    />
  )
}
