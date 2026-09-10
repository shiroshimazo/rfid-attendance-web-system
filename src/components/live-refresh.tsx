"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { schoolDateKey } from "@/lib/school-time"

import { isSupabaseConfigured } from "@/services/supabase/config"
import { createBrowserSupabaseClient } from "@/services/supabase/client"

const DEFAULT_TABLES = [
  "attendance_records",
  "subject_attendance",
  "subject_schedules",
  "rfid_cards",
  "sms_notifications",
  "students",
  "teachers",
  "teacher_assignments",
  "class_schedules",
  "programs",
  "courses",
] as const

interface LiveRefreshProps {
  tables?: readonly string[]
  channel?: string
  debounceMs?: number
}

/**
 * Subscribes to Supabase Realtime postgres_changes and revalidates the
 * current server-component tree via router.refresh(). Mount once per
 * live page (dashboards, attendance panels). Renders nothing.
 */
export function LiveRefresh({
  tables = DEFAULT_TABLES,
  channel = "live-attendance",
  debounceMs = 800,
}: LiveRefreshProps) {
  const router = useRouter()
  // Equal table lists must not reconnect on every server refresh.
  const tableKey = [...new Set(tables)].sort().join(",")

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const supabase = createBrowserSupabaseClient()
    let timer: ReturnType<typeof setTimeout> | null = null
    let connected = false
    let disposed = false
    let schoolDate = schoolDateKey(new Date())
    const schedule = () => {
      if (disposed || timer !== null) return
      timer = setTimeout(() => {
        timer = null
        if (disposed) return
        schoolDate = schoolDateKey(new Date())
        router.refresh()
      }, debounceMs)
    }

    const builder = supabase.channel(channel)
    for (const table of tableKey.split(",").filter(Boolean)) {
      builder.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        schedule
      )
    }

    builder.subscribe(status => {
      if (disposed) return
      connected = status === "SUBSCRIBED"
      if (connected) schedule() // Includes changes missed before initial/reconnection subscription.
    })
    const visible = () => { if (document.visibilityState === "visible") schedule() }
    window.addEventListener("online", schedule)
    document.addEventListener("visibilitychange", visible)
    // Recover missed changes while disconnected, and roll today's views over at
    // Manila midnight even when there are no database events.
    const recovery = setInterval(() => {
      if (document.visibilityState === "visible" && (!connected || schoolDateKey(new Date()) !== schoolDate)) schedule()
    }, 30_000)

    return () => {
      disposed = true
      if (timer !== null) clearTimeout(timer)
      clearInterval(recovery)
      window.removeEventListener("online", schedule)
      document.removeEventListener("visibilitychange", visible)
      void supabase.removeChannel(builder)
    }
  }, [router, channel, tableKey, debounceMs])

  return null
}
