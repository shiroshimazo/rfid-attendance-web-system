import type { PostgrestError } from "@supabase/supabase-js"

/** PostgREST caps a single response at 1000 rows, so reads are paginated. */
export const PAGE_SIZE = 1000

const MAX_PAGES = 1000

type PageResponse<T> = { data: T[] | null; error: PostgrestError | null }

/**
 * Callers must use a stable unique order. Advance by the actual rows returned:
 * the deployed server may impose a smaller cap than our requested page size.
 * Only an empty page proves completion; never return a silently capped result.
 */
export async function fetchAllRows<T>(
  loadPage: (from: number, to: number) => PromiseLike<PageResponse<T>>
): Promise<T[]> {
  const rows: T[] = []

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = rows.length
    const { data, error } = await loadPage(from, from + PAGE_SIZE - 1)

    if (error) throw new Error(error.message)
    if (!data || data.length === 0) return rows

    rows.push(...data)

  }

  throw new Error("The result is too large to load completely. Narrow the date range and try again.")
}
