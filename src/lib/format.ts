const numberFormatter = new Intl.NumberFormat("en-US")

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

/** Renders a 0-100 ratio as a single-decimal percentage, e.g. `92.4%`. */
export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

/**
 * Formats a PostgreSQL `time` value (`07:32:00`) as `7:32 AM`.
 * Returns an em dash when the tap has not happened yet.
 */
export function formatClockTime(value: string | null | undefined) {
  if (!value) return "—"

  const [hours, minutes] = value.split(":")
  const hour = Number(hours)
  const minute = Number(minutes)

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "—"

  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`
}

/** Two-letter monogram used by avatar fallbacks, e.g. `Maria Santos` -> `MS`. */
export function initialsOf(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return "?"

  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : ""

  return `${first}${last}`.toUpperCase()
}

/** Formats a stored `yyyy-MM-dd` date, or an em dash when it is missing. */
export function formatDateValue(value: string | null | undefined) {
  if (!value) return "—"

  const parsed = new Date(`${value}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Formats a stored timestamp, e.g. `Sep 1, 2026, 8:04 AM`. */
export function formatTimestamp(value: string | null | undefined) {
  if (!value) return "—"

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
