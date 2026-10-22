"use client"

import { motion, useReducedMotion } from "motion/react"
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

// Shared by every role and both navigation levels.
const navigationHighlight = "relative rounded-xl transition-[background-color,box-shadow,color] duration-150 motion-reduce:transition-none [--nav-glow:oklch(0.55_0.16_130)] dark:[--nav-glow:oklch(0.88_0.25_130)] before:pointer-events-none before:absolute before:inset-y-2.5 before:left-0 before:w-[3px] before:rounded-full before:bg-[var(--nav-glow)] before:opacity-0 before:transition-opacity before:duration-150 motion-reduce:before:transition-none focus-visible:before:opacity-100 focus-visible:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:bg-sidebar-accent hover:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--sidebar-foreground)_10%,transparent),inset_3px_0_0_color-mix(in_oklab,var(--nav-glow)_50%,transparent)] isolate overflow-visible data-[active=true]:bg-transparent"

// Move the existing active surface without moving labels or changing link behavior.
function NavigationHighlight({ level }: { level: "main" | "sub" }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      layoutId={reduceMotion ? undefined : `navigation-highlight-${level}`}
      initial={false}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-sidebar-accent bg-[linear-gradient(100deg,color-mix(in_oklab,var(--nav-glow)_16%,transparent),transparent_50%),linear-gradient(to_bottom,color-mix(in_oklab,var(--sidebar-foreground)_6%,transparent),transparent)] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--sidebar-foreground)_10%,transparent),inset_1px_0_0_color-mix(in_oklab,var(--nav-glow)_40%,transparent),0_3px_10px_rgb(0_0_0/0.06)] before:absolute before:inset-y-2.5 before:left-0 before:w-[3px] before:rounded-full before:bg-[var(--nav-glow)]"
    />
  )
}

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
                    <SidebarMenuButton tooltip={item.title} isActive={shouldBeOpen(item)} className={`${navigationHighlight} h-10 cursor-pointer group-data-[state=open]/collapsible:bg-sidebar-accent`}>
                      {shouldBeOpen(item) && <NavigationHighlight level="main" />}
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronDown aria-hidden="true" className="ml-auto transition-transform duration-150 group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 gap-1 border-l-0 py-1 pl-3">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="before:absolute before:-left-3 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-lg before:border-b before:border-l before:border-sidebar-border after:absolute after:-left-3 after:top-1/2 after:-bottom-1 after:border-l after:border-sidebar-border last:after:hidden">
                          <SidebarMenuSubButton asChild className={`${navigationHighlight} h-auto min-h-10 cursor-pointer py-2 pl-3 text-muted-foreground data-[active=true]:font-medium`} isActive={isActivePath(subItem.url)}>
                            <Link href={subItem.url} onNavigate={closeMobileSidebar} aria-current={isActivePath(subItem.url) ? "page" : undefined}>
                              {isActivePath(subItem.url) && <NavigationHighlight level="sub" />}
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
                <SidebarMenuButton asChild tooltip={item.title} className={`${navigationHighlight} h-10 cursor-pointer`} isActive={isActivePath(item.url)}>
                  <Link href={item.url} onNavigate={closeMobileSidebar} aria-current={isActivePath(item.url) ? "page" : undefined}>
                    {isActivePath(item.url) && <NavigationHighlight level="main" />}
                    {item.icon && <item.icon />}
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {isActivePath(item.url) && <ChevronRight aria-hidden="true" className="ml-auto group-data-[collapsible=icon]:hidden" />}
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
