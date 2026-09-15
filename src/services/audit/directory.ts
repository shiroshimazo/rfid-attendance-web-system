import { createServerSupabaseClient } from "@/services/supabase/server"
import type { LogQuery } from "@/features/system-logs/query"

export interface SystemLog {
  id: number; created_at: string; actor_id: string | null; actor_name: string; actor_role: string;
  source: string; event: string; entity: string; record_id: string | null;
  outcome: "success" | "failed" | "denied"; details: Record<string, unknown>;
}
export const LOG_PAGE_SIZE = 25
export async function fetchSystemLogs(query: LogQuery) {
  const supabase = await createServerSupabaseClient()
  let request = supabase.from("system_logs")
    .select("id, created_at, actor_id, actor_name, actor_role, source, event, entity, record_id, outcome, details", { count: "exact" })
    .gte("created_at", `${query.from}T00:00:00+08:00`)
    .lt("created_at", new Date(Date.parse(`${query.to}T00:00:00+08:00`) + 86400000).toISOString())
  if (query.entity !== "all") request = request.eq("entity", query.entity)
  if (query.outcome !== "all") request = request.eq("outcome", query.outcome)
  if (query.search) request = request.or(`actor_name.ilike.%${query.search}%,event.ilike.%${query.search}%,record_id.ilike.%${query.search}%`)
  const { data, count, error } = await request.order("created_at", { ascending: false }).order("id", { ascending: false })
    .range((query.page - 1) * LOG_PAGE_SIZE, query.page * LOG_PAGE_SIZE - 1).returns<SystemLog[]>()
  if (error) throw new Error(error.message)
  return { rows: data ?? [], count: count ?? 0, pageCount: Math.max(1, Math.ceil((count ?? 0) / LOG_PAGE_SIZE)) }
}
