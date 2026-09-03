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
