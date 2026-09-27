import { requireRole } from "@/features/auth/server"
import type { SmsLogQuery, SmsStatus } from "@/features/sms-logs/query"
import { createServerSupabaseClient } from "@/services/supabase/server"

export interface SmsLogRow {
  id: number
  attendance_id: number
  parent_contact_number: string
  message: string
  sms_status: SmsStatus
  created_at: string
  sent_at: string | null
  delivery_enabled: boolean
  delivery_started_at: string | null
  delivery_result: string | null
  provider_message_id: string | null
  student: { full_name: string; student_id: string } | null
  attendance: {
    attendance_date: string
    campus: string
    card: { rfid_number: string } | null
  } | null
}

export const SMS_LOG_PAGE_SIZE = 25

export async function fetchSmsLogs(query: SmsLogQuery) {
  await requireRole("admin")
  const supabase = await createServerSupabaseClient()
  let request = supabase.from("sms_notifications").select(
    "id, attendance_id, parent_contact_number, message, sms_status, created_at, sent_at, delivery_enabled, delivery_started_at, delivery_result, provider_message_id, student:students(full_name, student_id), attendance:attendance_records!sms_attendance_belongs_to_student_fk(attendance_date, campus, card:rfid_cards(rfid_number))",
    { count: "exact" }
  ).gte("created_at", `${query.from}T00:00:00+08:00`)
    .lt("created_at", new Date(Date.parse(`${query.to}T00:00:00+08:00`) + 86400000).toISOString())
  if (query.status !== "all") request = request.eq("sms_status", query.status)
  const { data, count, error } = await request.order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range((query.page - 1) * SMS_LOG_PAGE_SIZE, query.page * SMS_LOG_PAGE_SIZE - 1)
    .returns<SmsLogRow[]>()
  if (error) throw new Error(error.message)
  return { rows: data ?? [], count: count ?? 0, pageCount: Math.max(1, Math.ceil((count ?? 0) / SMS_LOG_PAGE_SIZE)) }
}
