import { SettingsSkeleton } from "./components/settings-skeleton"

export default function AdminSettingsLoading() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <SettingsSkeleton />
    </div>
  )
}
