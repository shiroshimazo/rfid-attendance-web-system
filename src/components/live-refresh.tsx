"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { isSupabaseConfigured } from "@/services/supabase/config"
import { createBrowserSupabaseClient } from "@/services/supabase/client"

const DEFAULT_TABLES = [
  "attendance_records",
  "rfid_cards",
  "sms_notifications",
  "students",
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const supabase = createBrowserSupabaseClient()
    const schedule = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        router.refresh()
      }, debounceMs)
    }

    const builder = supabase.channel(channel)
    for (const table of tables) {
      builder.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        schedule
      )
    }

    builder.subscribe()

    return () => {
      if (timer.current) clearTimeout(timer.current)
      void supabase.removeChannel(builder)
    }
  }, [router, channel, tables, debounceMs])

  return null
}
