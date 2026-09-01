import type { ReactNode } from "react"

import { requireRole } from "@/features/auth/server"

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  await requireRole("teacher")
  return children
}
