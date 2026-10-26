"use client"

import { DataErrorCard } from "@/components/data-error-card"

export default function CalendarError() {
  return <div className="p-4 md:p-6"><DataErrorCard title="Calendar could not be displayed" message="Try again to reload the calendar." /></div>
}
