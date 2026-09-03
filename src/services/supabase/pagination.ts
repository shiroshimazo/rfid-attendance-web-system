import type { PostgrestError } from "@supabase/supabase-js"

/** PostgREST caps a single response at 1000 rows, so reads are paginated. */
export const PAGE_SIZE = 1000

const MAX_PAGES = 25

type PageResponse<T> = { data: T[] | null; error: PostgrestError | null }

/**
 * Reads every row of a query by walking `range()` windows until a short page
 * arrives. Throws the PostgREST message so callers can surface a real error.
 */
export async function fetchAllRows<T>(
  loadPage: (from: number, to: number) => PromiseLike<PageResponse<T>>
): Promise<T[]> {
  const rows: T[] = []

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = page * PAGE_SIZE
    const { data, error } = await loadPage(from, from + PAGE_SIZE - 1)

    if (error) throw new Error(error.message)
    if (!data || data.length === 0) break

    rows.push(...data)

    if (data.length < PAGE_SIZE) break
  }

  return rows
}
