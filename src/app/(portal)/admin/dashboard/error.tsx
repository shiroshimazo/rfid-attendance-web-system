"use client"

import { DashboardErrorCard } from "./components/dashboard-error-card"

export default function AdminDashboardError({ error }: { error: Error }) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <DashboardErrorCard
        message={
          error.message ||
          "The dashboard failed to render. Try again, and check the Supabase connection if the problem persists."
        }
      />
    </div>
  )
}
