import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { getRfidCardDirectory } from "@/features/rfid/cards"

import { RfidCardsDirectory } from "./components/rfid-cards-directory"
import { RfidCardsSkeleton } from "./components/rfid-cards-skeleton"

export const metadata: Metadata = {
  title: "Manage RFID Cards",
}

// Card records change from this page itself, so nothing is cached.
export const dynamic = "force-dynamic"

async function RfidCardsContent() {
  let directory

  try {
    directory = await getRfidCardDirectory()
  } catch (error) {
    return (
      <DataErrorCard
        title="RFID cards could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading RFID card records."
        }
      />
    )
  }

  return <RfidCardsDirectory directory={directory} />
}

export default function AdminRfidCardsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-rfid-cards" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Manage RFID Cards
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Register cards, assign them to students, and control which card the
            reader accepts. Only one card can stay active per student.
          </p>
        </div>
      </div>

      <Suspense fallback={<RfidCardsSkeleton />}>
        <RfidCardsContent />
      </Suspense>
    </div>
  )
}
