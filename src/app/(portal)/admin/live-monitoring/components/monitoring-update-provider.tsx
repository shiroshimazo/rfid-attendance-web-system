"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

interface MonitoringUpdateValue {
  /** True while the panel reads a range that is newer than the one on screen. */
  isPending: boolean
  /** Applies a range in place; only the table reloads. */
  applyRange: (from: string, to: string) => void
  /** Goes back to the current day. */
  applyToday: () => void
}

/** A quick read still deserves a visible answer, so the state stays up briefly. */
const MIN_PENDING_MS = 300

const MonitoringUpdateContext = React.createContext<MonitoringUpdateValue | null>(null)

/** The loading state of the monitoring table, shared by the filter and the table. */
export function useMonitoringUpdate() {
  return React.useContext(MonitoringUpdateContext)
}

/**
 * Keeps the date filter and the table in step. A range change updates the URL
 * and the panel is read again in place, so the table is the only part of the
 * panel that waits. That wait is the table's loading state.
 */
export function MonitoringUpdateProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, startTransition] = React.useTransition()
  const [isPending, setPending] = React.useState(false)
  const requestedAt = React.useRef(0)

  React.useEffect(() => {
    if (isNavigating) {
      requestedAt.current = Date.now()
      setPending(true)
      return
    }

    const remaining = MIN_PENDING_MS - (Date.now() - requestedAt.current)
    if (remaining <= 0) {
      setPending(false)
      return
    }

    const timer = setTimeout(() => setPending(false), remaining)
    return () => clearTimeout(timer)
  }, [isNavigating])

  const applyRange = React.useCallback((from: string, to: string) => {
    const params = new URLSearchParams()
    params.set("from", from)
    params.set("to", to)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }, [pathname, router])

  const applyToday = React.useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }, [pathname, router])

  const value = React.useMemo(
    () => ({ isPending, applyRange, applyToday }),
    [isPending, applyRange, applyToday]
  )

  return <MonitoringUpdateContext.Provider value={value}>{children}</MonitoringUpdateContext.Provider>
}
