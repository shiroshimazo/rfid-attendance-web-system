"use client"

import type { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { PhilippineClock } from "@/components/philippine-clock"

export function SiteHeader({ notifications }: { notifications?: ReactNode }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-2 size-10" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <p className="min-w-0 truncate text-sm font-medium">RFID Attendance System</p>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <PhilippineClock />
          {notifications}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
