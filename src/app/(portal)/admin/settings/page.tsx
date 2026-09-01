import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminSettingsPage() {
  return (
    <ModulePlaceholder
      title="Admin Settings"
      description="Maintain the administrator profile and account password."
      scope={[
        "Profile picture and personal information",
        "Email and phone number",
        "Supabase password change",
        "Authenticated session details",
      ]}
    />
  )
}
