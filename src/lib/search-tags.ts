/**
 * Search bars in this app accept several terms at once. Each term is a tag, and
 * a row is kept when it matches at least one tag, so adding a term widens the
 * result set rather than narrowing it.
 */

/** A short list of terms stays readable in the filter row. */
export const MAX_SEARCH_TAGS = 12

/** Long enough for a name, an ID, or an RFID number. */
export const MAX_SEARCH_TAG_LENGTH = 60

/**
 * Trims each term, drops blanks, and removes case-insensitive duplicates so
 * the same term is never shown twice.
 */
export function normalizeSearchTags(tags: readonly string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const raw of tags) {
    const tag = raw.trim().slice(0, MAX_SEARCH_TAG_LENGTH)

    if (!tag) continue

    const key = tag.toLowerCase()

    if (seen.has(key)) continue

    seen.add(key)
    normalized.push(tag)

    if (normalized.length >= MAX_SEARCH_TAGS) break
  }

  return normalized
}

/** Reads the search terms a URL carries, whether one or many were sent. */
export function searchTagsFromParams(
  value: string | string[] | undefined
): string[] {
  if (value === undefined) return []
  if (Array.isArray(value)) return normalizeSearchTags(value)

  return normalizeSearchTags([value])
}

/** True when the terms would narrow the result set. */
export function isSearchFiltered(tags: readonly string[]) {
  return tags.length > 0
}

/**
 * Keeps the row when the haystack contains at least one term. An empty term
 * list matches everything, so an untouched search bar never filters.
 */
export function matchesAnySearchTag(
  haystack: string,
  tags: readonly string[]
): boolean {
  if (tags.length === 0) return true

  const lowered = haystack.toLowerCase()

  return tags.some((tag) => lowered.includes(tag.toLowerCase()))
}

/** The same rule across several fields, where any one of them can match. */
export function matchesAnySearchTagIn(
  values: readonly (string | null | undefined)[],
  tags: readonly string[]
): boolean {
  if (tags.length === 0) return true

  const lowered = values
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase())

  return tags.some((tag) => {
    const needle = tag.toLowerCase()

    return lowered.some((value) => value.includes(needle))
  })
}

/** Compares two term lists so a debounce only fires on a real change. */
export function searchTagsEqual(
  a: readonly string[],
  b: readonly string[]
): boolean {
  if (a.length !== b.length) return false

  return a.every((tag, index) => tag === b[index])
}
