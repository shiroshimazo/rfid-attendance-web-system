import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminStudentsPage() {
  return (
    <ModulePlaceholder
      title="Manage Students"
      description="Manage student profiles, academic placement, guardian contacts, and account status."
      scope={[
        "Personal and academic information",
        "Parent or guardian contact information",
        "Campus, program, year level, and section",
        "RFID assignment and account archive status",
      ]}
    />
  )
}
