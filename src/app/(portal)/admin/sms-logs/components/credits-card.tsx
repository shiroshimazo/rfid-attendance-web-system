import { Card, CardContent } from "@/components/ui/card"
import { RefreshButton } from "@/components/refresh-button"
import { fetchSmsBalance } from "@/services/sms/balance"

export async function CreditsCard() {
  const balance = await fetchSmsBalance()
  return <Card><CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
    <div className="space-y-1">
      <h2 className="text-sm font-medium text-muted-foreground">SMS remaining credits</h2>
      <p className="text-2xl font-semibold tabular-nums">{balance.status === "available" ? balance.remaining : "Unavailable"}</p>
      <p className="text-sm text-muted-foreground">{balance.status === "available"
        ? "Current PhilSMS account balance."
        : balance.status === "not-configured" ? "Configure the PhilSMS API token to view credits."
          : "PhilSMS balance could not be loaded. Try refreshing."}</p>
    </div>
    <RefreshButton />
  </CardContent></Card>
}
