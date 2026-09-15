"use client"

import { ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavigationItem } from "@/config/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  label,
  items,
}: {
  label: string
  items: NavigationItem[]
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false)
  }

  const isActivePath = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`)

  // Check if any subitem is active to determine if parent should be open
  const shouldBeOpen = (item: NavigationItem) =>
    item.items?.some((subItem) => isActivePath(subItem.url)) || false

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={`${item.title}-${pathname}`}
            asChild
            defaultOpen={shouldBeOpen(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={shouldBeOpen(item)} className="h-10 cursor-pointer rounded-xl group-data-[state=open]/collapsible:bg-sidebar-accent">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronDown aria-hidden="true" className="ml-auto transition-transform duration-150 group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 gap-1 border-l-0 py-1 pl-3">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="before:absolute before:-left-3 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-lg before:border-b before:border-l before:border-sidebar-border after:absolute after:-left-3 after:top-1/2 after:-bottom-1 after:border-l after:border-sidebar-border last:after:hidden">
                          <SidebarMenuSubButton asChild className="h-auto min-h-10 cursor-pointer rounded-xl py-2 text-muted-foreground data-[active=true]:font-medium" isActive={isActivePath(subItem.url)}>
                            <Link href={subItem.url} onNavigate={closeMobileSidebar} aria-current={isActivePath(subItem.url) ? "page" : undefined}>
                              <span className="min-w-0 flex-1 whitespace-normal leading-snug">{subItem.title}</span>
                              {isActivePath(subItem.url) && <ChevronRight aria-hidden="true" />}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title} className="cursor-pointer" isActive={isActivePath(item.url)}>
                  <Link href={item.url} onNavigate={closeMobileSidebar}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
