import type { ReactNode } from "react"

import { requireRole } from "@/features/auth/server"

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireRole("student")
  return children
}
