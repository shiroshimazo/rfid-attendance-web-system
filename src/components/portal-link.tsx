"use client"

import { useState, type ComponentProps } from "react"
import Link from "next/link"

export function PortalLink({ href, onMouseEnter, onFocus, ...props }: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [intent, setIntent] = useState(false)
  const pathname = typeof href === "string" ? href.split(/[?#]/)[0] : href.pathname
  // Admin report reads synchronize attendance marks; load them only on navigation.
  const canPrefetch = props["aria-current"] !== "page" && props["aria-selected"] !== true
    && pathname !== "/admin/reports" && !pathname?.startsWith("/admin/reports/")

  return <Link {...props} href={href} prefetch={canPrefetch && intent}
    onMouseEnter={event => { setIntent(true); onMouseEnter?.(event) }}
    onFocus={event => { setIntent(true); onFocus?.(event) }}
  />
}
