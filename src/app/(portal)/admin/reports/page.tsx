import { ModulePlaceholder } from "@/components/module-placeholder"

export default function AdminReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports"
      description="Review summarized attendance, RFID activity, and parent SMS delivery."
      scope={[
        "Date-range attendance summaries",
        "Attendance by year level and section",
        "Recent RFID scan and failure logs",
        "PDF report export",
      ]}
    />
  )
}
