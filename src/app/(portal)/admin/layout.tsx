import type { ReactNode } from "react"

import { requireRole } from "@/features/auth/server"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("admin")
  return children
}
