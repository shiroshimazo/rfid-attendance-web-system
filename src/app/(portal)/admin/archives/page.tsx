import type { Metadata } from "next"
import { requireRole } from "@/features/auth/server"
import { fetchArchiveDirectory } from "@/services/archives/directory"
import { ArchivesPanel } from "@/features/archives/panel"
import { LiveRefresh } from "@/components/live-refresh"

export const metadata: Metadata = { title: "Archives" }
export const dynamic = "force-dynamic"

export default async function ArchivesPage() {
  await requireRole("admin")
  const directory = await fetchArchiveDirectory()
  return <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
    <LiveRefresh channel="live-admin-archives" />
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Archives</h1>
      <p className="text-sm text-muted-foreground">Find and restore archived records. Attendance history stays available in reports.</p>
    </div>
    <ArchivesPanel directory={directory} />
  </div>
}
