"use client"

import { DataErrorCard } from "@/components/data-error-card"

export default function AdminRfidCardsError({ error }: { error: Error }) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <DataErrorCard
        title="Manage RFID Cards failed to render"
        message={
          error.message ||
          "Try again, and check the Supabase connection if the problem persists."
        }
      />
    </div>
  )
}
