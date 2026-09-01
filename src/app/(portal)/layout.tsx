import type { CSSProperties, ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireCurrentAccount } from "@/features/auth/server"

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const account = await requireCurrentAccount()

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar
        side="left"
        variant="floating"
        collapsible="icon"
        role={account.role}
        user={{ name: account.name, email: account.email, avatar: "" }}
      />
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
