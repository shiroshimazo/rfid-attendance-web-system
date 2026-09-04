# Schedules service

Reads `public.class_schedules` (the Late Attendance Ruling table) with the
caller's own Supabase session, so Row Level Security decides visibility:
administrators read and write every row, teachers read their assigned
sections only.

The service returns raw rows. Grouping section rows into one editable
schedule, deriving the session, and computing the late cutoff all happen in
`src/features/schedules/directory.ts`, so the projection stays testable
without a database.
