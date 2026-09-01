"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] duration-200 ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-2 size-10" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <p className="text-sm font-medium text-balance">RFID Attendance System</p>
        <div className="ml-auto flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
