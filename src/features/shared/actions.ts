export interface ActionResult {
  ok: boolean
  message: string
  /** Field-level messages keyed by dotted form path, when validation failed. */
  fieldErrors?: Record<string, string>
}

/** Empty strings from a form are stored as SQL NULL, never as blanks. */
export function nullable(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function failure(
  message: string,
  fieldErrors?: Record<string, string>
): ActionResult {
  return { ok: false, message, fieldErrors }
}

export function success(message: string): ActionResult {
  return { ok: true, message }
}

export function flattenIssues(
  issues: { path: PropertyKey[]; message: string }[]
) {
  const fieldErrors: Record<string, string> = {}

  for (const issue of issues) {
    const path = issue.path.map(String).join(".")
    if (path && !fieldErrors[path]) fieldErrors[path] = issue.message
  }

  return fieldErrors
}

export const validationFailureMessage =
  "Check the highlighted fields and try again."

/** Turns a PostgREST error into something an administrator can act on. */
export function describeError(
  error: { message: string; code?: string },
  duplicateMessage = "A record with those unique details already exists."
) {
  if (error.code === "23505") return duplicateMessage

  return error.message
}
