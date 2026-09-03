import { RfidCardsSkeleton } from "./components/rfid-cards-skeleton"

export default function AdminRfidCardsLoading() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <RfidCardsSkeleton />
    </div>
  )
}
