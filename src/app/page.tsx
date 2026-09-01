import { redirect } from "next/navigation"

import { dashboardPathByRole } from "@/features/auth/roles"
import { getCurrentAccount } from "@/features/auth/server"

export default async function HomePage() {
  const account = await getCurrentAccount()

  if (!account || account.status !== "active") redirect("/sign-in")

  redirect(dashboardPathByRole[account.role])
}
