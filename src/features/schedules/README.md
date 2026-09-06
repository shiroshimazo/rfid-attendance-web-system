# Schedules feature

View model and server actions behind `/admin/schedules`, the administrator's
side of the Late Attendance Ruling.

- `schema.ts` — panel query parsing plus the zod schemas shared by the dialog
  and the server actions. Program and year level are pinned to the BSIT
  2nd Year pilot.
- `directory.ts` — groups the weekday rows of `class_schedules` into one
  editable schedule per section, derives the session from the start time, and
  computes `late cutoff = time start + grace`.
- `actions.ts` — admin-only writes. Schedules are never deleted: unchecking a
  class day retires that row to `archived`, and the status toggle switches a
  section off, so "no row means never Late" stays a deliberate decision.

P02 saves each week in one database transaction and serializes saves/status
toggles for the same program/year/section/campus. Server schemas and RPCs reject
weekends, repeated days, and non-pilot placement. Apply the
[P02 migration](../../../supabase/migrations/README.md#p02-safe-management-saves-rollout)
before deploying these actions. Existing all-campus schedules are preserved;
campus precedence for attendance lookup remains a P10 decision.
