# Web System — Build Now

Source: gap audit of this repo against `rfid-docs` (Functional Requirement,
Database Design, System Architecture, Admin/Teacher/Student User Interaction).
SMS + ESP32 work is parked in `ROADMAP-HARDWARE-LATER.md`.

Status legend: DONE = coded, OPEN = still to build, PENDING = coded, needs deploy step.

| # | Module | Gap vs rfid-docs | Evidence | Priority | Status |
|---|--------|------------------|----------|----------|--------|
| 1 | All dashboards + panels | Must update live with no manual refresh (FR Real-Time Updates) | Was zero `channel.subscribe`, only `refresh-button.tsx` + `force-dynamic` | High | DONE (code) / PENDING (migration deploy) — new `src/components/live-refresh.tsx` wired into 11 pages, new `supabase/migrations/202609040001_enable_realtime.sql` |
| 2 | RefreshButton removal | Buttons no longer needed once live | Was mounted in 11 pages under `src/app/(portal)` | High | DONE — zero mounts left in `src/app`; unused `src/components/refresh-button.tsx` remains, safe to delete |
| 3 | Admin Dashboard | Bar chart missing Program grouping (only Year/Section) | `src/app/(portal)/admin/dashboard/page.tsx` passes `byYearLevel`/`bySection` only | Med | DONE |
| 4 | Reports Admin/Teacher | No RFID logs table, no SMS columns; recent logs lack RFID/SMS detail | `src/services/reports/snapshot.ts` never fetches `sms_notifications`; `src/features/reports/panel.ts` `AttendanceLog` has no smsStatus | High | OPEN |
| 5 | Reports export | Fake PDF, just `window.print()` | `export-pdf-button.tsx:13` | Med | OPEN — use jsPDF/react-pdf with BestLink header, date range, summary |
| 6 | Academic catalog | No Programs/Courses CRUD pages, dropdowns only | No `admin/programs/page.tsx`, no `admin/courses/page.tsx` | High | OPEN |
| 7 | Teacher assignments | No standalone matrix view, buried in teacher dialog | Only `teacher-form-dialog`, no assignments page | Med | OPEN |
| 8 | Attendance logic | No absence backfill job; Late/Excused enums unused in UI | `features/attendance/dashboard.ts` computes absent as total-minus-present, no writer | Med | OPEN — add nightly backfill cron |
| 9 | Proxy auth | No role gate, no inactive/archived block at edge | `src/proxy.ts` session refresh only | Med | OPEN — add redirects to `/sign-in`, `/errors/*` |
| 10 | Profile pictures | Text URL only, no Storage bucket/upload | `students.profile_picture text`, no storage policy | Low | OPEN |
| 11 | Print CSS | `data-print` attrs exist, no print stylesheet for clean output | `reports/page.tsx` region/hide attrs only | Low | OPEN |

## Deploy step (required for #1)

Apply the realtime migration in Supabase (`supabase db push` or SQL editor),
otherwise subscriptions stay silent. Verify: open a dashboard in two tabs,
insert an attendance row, both tabs refresh within ~1s with no click.
