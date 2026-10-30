import { fetchAllRows } from "@/services/supabase/pagination"
import { createServerSupabaseClient } from "@/services/supabase/server"
import { schoolDateKey } from "@/lib/school-time"

export interface CalendarEntryRow {
  id: number
  title: string
  description: string | null
  reason: string | null
  tags: string[]
  attendance_impact: "normal" | "no_classes" | "online_manual"
  audience: "everyone" | "teachers" | "students"
  campuses: string[]
  starts_on: string
  ends_on: string
  start_time: string | null
  end_time: string | null
  location: string | null
  is_pinned: boolean
  status: "draft" | "published" | "cancelled"
  published_at: string | null
  cancelled_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface CalendarEntryReadRow {
  entry_id: number
  user_id: string
  read_at: string
}

export interface AttendanceDayMarkRow {
  id: number
  student_id: number
  attendance_date: string
  status: "NoClasses" | "OnlineManual"
  calendar_entry_id: number
  campus: string
  created_at: string
}

export interface CalendarEmailDeliveryRow {
  id: number
  calendar_entry_id: number
  batch_id: string
  notification_type: "published" | "updated" | "cancelled"
  recipient_user_id: string | null
  recipient_email: string
  recipient_role: "teacher" | "student"
  subject: string
  html_body: string
  text_body: string
  status: "Pending" | "Sent" | "Failed"
  resend_email_id: string | null
  error_message: string | null
  attempt_count: number
  retry_allowed: boolean
  last_attempt_at: string | null
  sent_at: string | null
  created_at: string
}

export interface CalendarMonthDayRow {
  entry_id: number
  attendance_date: string
  campus: string
  attendance_impact: "no_classes" | "online_manual"
  title: string
  tags: string[]
  starts_on: string
  ends_on: string
}

export interface CalendarBellRow {
  id: number
  title: string
  description: string | null
  tags: string[]
  attendance_impact: "normal" | "no_classes" | "online_manual"
  audience: "everyone" | "teachers" | "students"
  campuses: string[]
  starts_on: string
  ends_on: string
  published_at: string
  updated_at: string
  read_at: string | null
}

export interface DashboardPostRow {
  id: number
  title: string
  description: string | null
  reason: string | null
  tags: string[]
  attendance_impact: "normal" | "no_classes" | "online_manual"
  audience: "everyone" | "teachers" | "students"
  campuses: string[]
  starts_on: string
  ends_on: string
  published_at: string
  is_pinned: boolean
}

export interface CampusOptionRow {
  campus: string
}

export interface RecipientCountRow {
  teacher_count: number
  student_count: number
  total: number
}

export interface AdminListParams {
  search?: string
  tag?: string
  impact?: "normal" | "no_classes" | "online_manual" | "all"
  status?: "draft" | "published" | "cancelled" | "all"
  audience?: "everyone" | "teachers" | "students" | "all"
  campus?: string | "all"
  from?: string
  to?: string
  page: number
  pageSize?: number
}

export interface AdminListResult {
  entries: CalendarEntryRow[]
  total: number
  page: number
  pageSize: number
}

/**
 * Admin list with filters, pagination, and deterministic ordering.
 * RLS already restricts to admin + published/cancelled for teacher/student.
 * The admin route authorizes the caller; authenticated reads still enforce RLS.
 */
export async function fetchAdminCalendarEntries({
  status = "all",
  audience = "all",
  campus = "all",
  from,
  to,
  page = 1,
  pageSize = 20,
  search,
  tag,
  impact = "all",
}: AdminListParams): Promise<AdminListResult> {
  const supabase = await createServerSupabaseClient()

  const fromIndex = (page - 1) * pageSize
  const toIndex = fromIndex + pageSize - 1

  let query = supabase
    .from("calendar_entries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(fromIndex, toIndex)

  if (status !== "all") query = query.eq("status", status)
  if (audience !== "all") query = query.eq("audience", audience)
  if (campus !== "all") query = query.or(`campuses.eq.{},campuses.cs.{${JSON.stringify(campus)}}`)
  if (from) query = query.gte("ends_on", from)
  if (to) query = query.lte("starts_on", to)
  if (search) query = query.ilike("title", `%${search.replace(/[\\%_]/g, "\\$&")}%`)
  if (tag && tag !== "all") query = query.contains("tags", [tag])
  if (impact !== "all") query = query.eq("attendance_impact", impact)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)

  return {
    entries: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}

/**
 * Month grid data: all published attendance-impacting days expanded per campus.
 * Uses the security-invoker view `calendar_attendance_days`.
 */
export async function fetchCalendarMonthGrid({
  monthStart,
  monthEnd,
}: { monthStart: string; monthEnd: string }): Promise<CalendarMonthDayRow[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("calendar_attendance_days")
    .select("entry_id, attendance_date, campus, attendance_impact, title, tags, starts_on, ends_on")
    .gte("attendance_date", monthStart)
    .lte("attendance_date", monthEnd)
    .order("attendance_date", { ascending: true })
    .order("entry_id", { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Day detail: all published entries for a specific date, plus attendance marks if admin/teacher.
 */
export async function fetchCalendarDayEntries(
  date: string,
  role: "admin" | "teacher" | "student"
): Promise<CalendarEntryRow[]> {
  const supabase = await createServerSupabaseClient()

  const query = supabase
    .from("calendar_entries")
    .select("*")
    .eq("status", "published")
    .lte("starts_on", date)
    .gte("ends_on", date)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })

  // RLS handles audience/campus filtering for teacher/student
  const { data, error } = await query
  if (error) throw new Error(error.message)

  if (role === "admin") return data ?? []

  return data ?? []
}

/**
 * Published and cancelled announcements for a visible date range; RLS scopes readers.
 */
export async function fetchReaderCalendarEntries(fromDate: string, toDate: string): Promise<CalendarEntryRow[]> {
  const supabase = await createServerSupabaseClient()
  return fetchAllRows<CalendarEntryRow>((from, to) => supabase.from("calendar_entries").select("*")
    .in("status", ["published", "cancelled"]).lte("starts_on", toDate).gte("ends_on", fromDate)
    .order("is_pinned", { ascending: false }).order("starts_on").order("id").range(from, to))
}

/**
 * Upcoming published entries for teacher/student calendars.
 * Limited to next 30 days, excludes cancelled.
 */
export async function fetchUpcomingCalendarEntries(
  days = 30
): Promise<CalendarEntryRow[]> {
  const supabase = await createServerSupabaseClient()
  const today = schoolDateKey(new Date())
  const end = new Date(`${today}T12:00:00Z`)
  end.setUTCDate(end.getUTCDate() + days - 1)
  const until = end.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("calendar_entries")
    .select("*")
    .eq("status", "published")
    .gte("ends_on", today)
    .lte("starts_on", until)
    .order("starts_on", { ascending: true })
    .order("is_pinned", { ascending: false })
    .order("id", { ascending: true })
    .limit(50)

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Distinct campus list for admin filters.
 */
export async function fetchCalendarCampuses(): Promise<string[]> {
  const supabase = await createServerSupabaseClient()

  const data = await fetchAllRows<{ campuses: string[] }>((from, to) => supabase
    .from("calendar_entries").select("campuses").order("id").range(from, to))

  const set = new Set<string>()
  for (const row of data ?? []) {
    for (const c of row.campuses ?? []) set.add(c)
  }
  return Array.from(set).sort()
}

/**
 * Recipient count for a published entry (admin-only RPC).
 */
export async function fetchCalendarEntryRecipientCount(
  entryId: number
): Promise<RecipientCountRow> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.rpc("calendar_entry_recipients", {
    p_entry_id: entryId,
  })

  if (error) throw new Error(error.message)

  let teacher_count = 0
  let student_count = 0
  for (const row of data ?? []) {
    if (row.role === "teacher") teacher_count++
    else if (row.role === "student") student_count++
  }
  return { teacher_count, student_count, total: teacher_count + student_count }
}

/**
 * Bell data: published entries visible to the current user, with read receipt.
 * Window: ends_on >= today OR published_at >= now - 7 days. Cap 20.
 * Unread is derived with isCalendarUnread; cancelled/draft are excluded.
 */
export async function fetchCalendarBellEntries(
  authUserId: string
): Promise<CalendarBellRow[]> {
  const supabase = await createServerSupabaseClient()
  const today = schoolDateKey(new Date())
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString()

  const { data: entries, error } = await supabase
    .from("calendar_entries")
    .select(
      "id, title, description, tags, attendance_impact, audience, campuses, starts_on, ends_on, published_at, updated_at"
    )
    .eq("status", "published")
    .or(`ends_on.gte.${today},published_at.gte.${cutoff}`)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  if (!entries || entries.length === 0) return []

  const { data: reads, error: readError } = await supabase
    .from("calendar_entry_reads")
    .select("entry_id, read_at")
    .eq("user_id", authUserId)
    .in("entry_id", entries.map((entry) => entry.id))

  if (readError) throw new Error(readError.message)

  const readByEntry = new Map(
    (reads ?? []).map((read) => [read.entry_id, read.read_at])
  )

  return entries.map((entry) => ({
    ...entry,
    read_at: readByEntry.get(entry.id) ?? null,
  })) as CalendarBellRow[]
}

/**
 * All currently visible entries in the bell window, for mark-all-read.
 * No 20-item cap: every matching unread entry should be cleared.
 */
export async function fetchVisibleCalendarEntries(
  authUserId: string
): Promise<CalendarBellRow[]> {
  const supabase = await createServerSupabaseClient()
  const today = schoolDateKey(new Date())
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString()

  const entries = await fetchAllRows<Omit<CalendarBellRow, "read_at">>((from, to) =>
    supabase
      .from("calendar_entries")
      .select(
        "id, title, description, tags, attendance_impact, audience, campuses, starts_on, ends_on, published_at, updated_at"
      )
      .eq("status", "published")
      .or(`ends_on.gte.${today},published_at.gte.${cutoff}`)
      .order("id", { ascending: true })
      .range(from, to)
      .returns<Omit<CalendarBellRow, "read_at">[]>()
  )

  if (entries.length === 0) return []

  const reads = await fetchAllRows<{ entry_id: number; read_at: string }>((from, to) =>
    supabase
      .from("calendar_entry_reads")
      .select("entry_id, read_at")
      .eq("user_id", authUserId)
      .order("entry_id", { ascending: true })
      .range(from, to)
      .returns<{ entry_id: number; read_at: string }[]>()
  )

  const readByEntry = new Map(reads.map((read) => [read.entry_id, read.read_at]))

  return entries.map((entry) => ({
    ...entry,
    read_at: readByEntry.get(entry.id) ?? null,
  }))
}

/**
 * Dashboard posts: published entries within 7 days of published_at,
 * pinned first, limited to 3, for teacher/student only.
 */
export async function fetchDashboardPosts(): Promise<DashboardPostRow[]> {
  const supabase = await createServerSupabaseClient()
  const now = new Date()
  const cutoff = new Date(now.getTime() - 7 * 86400000).toISOString()

  const { data, error } = await supabase
    .from("calendar_entries")
    .select(
      "id, title, description, reason, tags, attendance_impact, audience, campuses, starts_on, ends_on, published_at, is_pinned"
    )
    .eq("status", "published")
    .gt("published_at", cutoff)
    .lte("published_at", now.toISOString())
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Delivery log for admin: all delivery rows with entry context.
 */
export type CalendarDeliveryLogRow = Pick<CalendarEmailDeliveryRow,
  "id" | "calendar_entry_id" | "batch_id" | "notification_type" | "recipient_email" | "recipient_role" | "status" | "error_message" | "attempt_count" | "retry_allowed" | "last_attempt_at" | "sent_at" | "created_at"> & {
    calendar_entries: { id: number; title: string } | null
  }

export interface CalendarDeliveryFilters {
  search?: string[]
  type?: CalendarEmailDeliveryRow["notification_type"]
  status?: CalendarEmailDeliveryRow["status"]
  from?: string
  to?: string
}

export async function fetchCalendarDeliveryLog(
  page = 1,
  pageSize = 10,
  filters: CalendarDeliveryFilters = {}
): Promise<{ deliveries: CalendarDeliveryLogRow[]; total: number }> {
  const supabase = await createServerSupabaseClient()

  const fromIndex = (page - 1) * pageSize
  const toIndex = fromIndex + pageSize - 1

  let query = supabase
    .from("calendar_email_deliveries")
    .select(
      "id, calendar_entry_id, batch_id, notification_type, recipient_email, recipient_role, status, error_message, attempt_count, retry_allowed, last_attempt_at, sent_at, created_at, calendar_entries(id, title)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false }).order("id", { ascending: false })
  if (filters.search?.length) {
    const terms = filters.search
      .map(term => term.replace(/[,()*%"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160))
      .filter(Boolean)
    if (!terms.length) return { deliveries: [], total: 0 }
    const patterns = terms.map(term => `"%${term.replace(/[\\%_]/g, "\\$&")}%"`)
    const entryIds = new Set<number>()
    for (const term of terms) {
      if (/^\d+$/.test(term) && Number.isSafeInteger(Number(term))) entryIds.add(Number(term))
    }
    const { data: entries, error: entriesError } = await supabase
      .from("calendar_entries")
      .select("id")
      .or(patterns.map(pattern => `title.ilike.${pattern}`).join(","))
    if (entriesError) throw new Error(entriesError.message)
    for (const entry of entries ?? []) entryIds.add(entry.id)
    const conditions = patterns.map(pattern => `recipient_email.ilike.${pattern}`)
    const roles = ["teacher", "student"].filter(role => terms.some(term => role.includes(term.toLowerCase())))
    if (roles.length) conditions.push(`recipient_role.in.(${roles.join(",")})`)
    if (entryIds.size) conditions.push(`calendar_entry_id.in.(${[...entryIds].join(",")})`)
    query = query.or(conditions.join(","))
  }
  if (filters.type) query = query.eq("notification_type", filters.type)
  if (filters.status) query = query.eq("status", filters.status)
  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00+08:00`)
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999999+08:00`)
  const { data, error, count } = await query.range(fromIndex, toIndex)

  if (error) throw new Error(error.message)

  return {
    deliveries: (data ?? []) as unknown as CalendarDeliveryLogRow[],
    total: count ?? 0,
  }
}

/**
 * Delivery log for a single entry.
 */
export async function fetchCalendarEntryDeliveryLog(
  entryId: number
): Promise<CalendarEmailDeliveryRow[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("calendar_email_deliveries")
    .select("*")
    .eq("calendar_entry_id", entryId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
