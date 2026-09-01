import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminRfidCardsPage() {
  return (
    <ModulePlaceholder
      title="Manage RFID Cards"
      description="Register MIFARE cards, assign them to students, and control card status."
      scope={[
        "RFID UID registration and masked display",
        "One active card assignment per student",
        "Active, inactive, lost, and deactivated statuses",
        "Assignment history and audit metadata",
      ]}
    />
  )
}
