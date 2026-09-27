import type { ReactNode } from "react"
import { UsbAttendanceProvider } from "@/components/usb-attendance-reader"

import { requireRole } from "@/features/auth/server"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("admin")
  return <UsbAttendanceProvider>{children}</UsbAttendanceProvider>
}
