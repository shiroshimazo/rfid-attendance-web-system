import type { ReactNode } from "react"

import { UsbAttendanceReader } from "@/components/usb-attendance-reader"
import { requireRole } from "@/features/auth/server"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("admin")
  return <>
    <div className="px-4 pt-4 md:px-6 md:pt-6">
      <UsbAttendanceReader />
    </div>
    {children}
  </>
}
