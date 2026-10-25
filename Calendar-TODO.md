# School Calendar & Announcements — approval checklist

Source: `Calendar.md`. Implementation has not started.

## Execution rule

Execute exactly one numbered task after the user's explicit confirmation. Report its changes, checks, and limitations, mark it complete only when verified, then request confirmation for the next task. Approval of one task does not approve later tasks. Never run git add or git commit.

Reuse existing shadcn/ui components in `src/components/ui`, existing action/auth/audit patterns, and the current feature/service split. Each implementation task includes focused tests where it adds behavior. Names below describe responsibilities; use repository naming conventions when implementing.

## Decisions to resolve in task 1

- Confirm the plan's overlap rule: only one published attendance-impacting entry per campus/date; all-campus entries conflict with campus-specific entries; normal events may overlap.
- R05 already means optional source cleanup in the scope audit. Preserve its history and give the calendar scope change an unambiguous identifier; update Calendar.md references consistently.
- Read receipts use upsert but the proposed RLS forbids updates. Allow authenticated recipients to update only their own receipts for visible entries, with active-account and verified-email checks.
- Enforce draft-only deletion and lifecycle/overlap checks at the database boundary, not just through UI actions. Broad admin table-write policies must not bypass those invariants.
- Cancellation emails are explicitly required in sections 2, 8, and 15. Interpret section 14's email exclusion as excluding cancelled entries from ordinary announcement selection, not suppressing the cancellation notification.
- Preserve historical reporting after edits/cancellation: past NoClasses marks survive, but the published-only view loses cancelled exceptions and there are no online-day marks. Resolve historical online state storage before schema work; do not silently recalculate past rates as absences.
- Define same-day edits/cancellation and transfers: reconciliation clamps to today, and existing future marks must not survive a student's move out of the targeted campus. Preserve immutable past campus snapshots.
- Restore the previous record_rfid_tap implementation before dropping calendar objects during rollback; preserve any audit helper changes appropriately.

## Ordered tasks — each requires separate confirmation

- [ ] **01 — Finalize scope and rules.** Resolve the decisions above; update Calendar.md, the scope audit, and related scope/exclusion documentation. Record implementation as planned, not shipped. Check references and acceptance criteria for consistency.
- [ ] **02 — Calendar validation functions.** Add schema/enums and date, time, campus, tag/impact normalization and validation. Cover all-day rules, 366-day range, required reason, audience, and Manila dates with focused tests.
- [ ] **03 — Database foundation.** Add enums, entries, receipts, marks, delivery storage, indexes, constraints, and the agreed historical representation. Include migration tests; do not alter attendance_status or invent attendance_records.
- [ ] **04 — Access and recipient functions.** Implement current_user_campuses and calendar_entry_recipients; add RLS/grants and effective calendar view. Test role, campus, active account, verified email, own receipts, deduplication, and admin exclusion.
- [ ] **05 — Mark reconciliation function.** Implement sync_attendance_day_marks, today/future reconciliation, transfers, online exclusion, idempotence, and immutable historical marks. Test insertion/deletion counts.
- [ ] **06 — Save function.** Implement save_calendar_entry with lifecycle validation, campus normalization, concurrency-safe overlap protection for published edits, and reconciliation. Test invalid input and historical protection.
- [ ] **07 — Publish/republish function.** Implement publish_calendar_entry, permitted transitions, overlap lock, publish timestamps, and marks. Test concurrent/conflicting publication and republish behavior.
- [ ] **08 — Cancel/delete functions.** Implement cancellation and draft-only deletion, preserving history and reconciling affected dates. Test forbidden hard deletes and transitions, including direct database access.
- [ ] **09 — Database audit/realtime and recovery scripts.** Wire existing audit patterns and publication guards; add verification SQL, rollback SQL, and database docs. Test rollback dependency order and existing-data preservation.
- [ ] **10 — Preview database verification.** Identify a suitable preview target, apply the approved migration there, and run verification. Record actual results; never substitute local tests for preview proof or apply to an unidentified database.
- [ ] **11 — Calendar read queries.** Implement admin lists, month/day/upcoming data, campus options, recipient counts, bell/unread data, dashboard posts, and delivery log using existing services. Test visibility, limits, deep-link dates, and exact seven-day boundaries.
- [ ] **12 — Calendar mutation actions.** Implement role-checked save/publish/republish/cancel/delete/sync actions with existing ActionResult, audit, and revalidation patterns. Test authorization, errors, and transitions.
- [ ] **13 — Read receipt actions.** Implement mark-one and mark-all-read for currently visible entries; test re-reading edited entries and cross-user/cross-campus denial.
- [ ] **14 — Email templates and adapter.** Implement escaped HTML/text templates, campus/date links, Resend batch adapter, safe errors, and configuration checks; document environment variables. Verify current provider API documentation and test with mocked delivery.
- [ ] **15 — Email dispatch/retry functions.** Persist payloads and batches, send after response, track attempts/status, retry stored payloads, and trigger publish/cancel/checked important-edit notifications. Test duplicate prevention, partial failures, unchanged edits, and admin exclusion.
- [ ] **16 — RFID integration.** Add a new migration replacing the latest record_rfid_tap function; check calendar after identity/replay handling and before writes. Map NO_CLASSES/ONLINE_CLASS to HTTP 422. Test replay, normal taps, and zero attendance/SMS writes on rejection; update rollback restoration.
- [ ] **17 — Physical reader check.** Verify no-class/online messages, truncation, terminal handling, and ordinary time-in/time-out with the user and real reader. Keep this pending if hardware is unavailable.
- [ ] **18 — Admin calendar and list.** Build page, month/day selection, tabs, KPIs, filters/table, and loading/error/empty states with existing Calendar, Tabs, Card, Table, Badge, and Skeleton components.
- [ ] **19 — Entry form and lifecycle dialogs.** Build create/edit, tag-to-impact suggestions, campuses, date/time fields, inline errors, and publish/cancel/delete/republish confirmations. Reuse Dialog, AlertDialog, DateRangePicker, Input, Textarea, Select, Checkbox, RadioGroup, and Button. Test keyboard and mobile behavior.
- [ ] **20 — Delivery log and sync controls.** Connect admin delivery log, retry, recipient preview, and sync marks controls to approved actions; display pending/sent/failed and actionable errors.
- [ ] **21 — Read-only calendars and navigation.** Add shared teacher/student calendar, upcoming list, cancelled badges, campus labels, mobile agenda, and date/month deep links. Add all three navigation entries; verify role visibility.
- [ ] **22 — Bell, login toast, and realtime.** Integrate header bell, mark-read navigation, once-per-session toast, and existing LiveRefresh subscriptions. Keep portal rendering resilient to announcement query failure; exclude admins.
- [ ] **23 — Dashboard announcement posts.** Add teacher/student posts above KPIs, pinned ordering, three-item limit, and exact seven-day expiry. Test republish and failure fallback; no admin post.
- [ ] **24 — Shared attendance-state functions.** Resolve campus/date effective and historical state; calculate expected student-days, counts, rates, and trend buckets with null rates for zero expected attendance. Test mixed campuses and historical exceptions.
- [ ] **25 — Dashboard attendance integration.** Connect admin/teacher/student services, feature transformations, cards, KPI/charts, and campus status strips to task 24. Test normal-day regression and mixed-campus denominators.
- [ ] **26 — Daily attendance integration.** Update admin/teacher/student attendance surfaces and shared display badges where applicable. Keep Daily Attendance read-only and Subject Attendance editable on all dates. Test row/filter/count consistency.
- [ ] **27 — Reports and PDF integration.** Update admin/teacher report queries/calculations and PDF calendar-exception sections; sync only on authorized admin report/export paths. Test historical exceptions, excluded denominators, and retained subject confirmations.
- [ ] **28 — Documentation and regression verification.** Complete module/root/environment/migration docs and system-log entities. Run database, action, attendance, RFID, SMS, subject attendance, reports, lifecycle, live-refresh tests, lint, and build; report failures honestly.
- [ ] **29 — Browser and accessibility verification.** Exercise role workflows, notification timing, mocked email, mobile layouts, keyboard navigation, and visibility boundaries. Fix task-related defects and record remaining operational checks.
- [ ] **30 — Rollout.** Confirm target and exact release actions before execution; migration/verification precede app deployment. Configure verified Resend sender, publish an explicitly approved pilot announcement, verify delivery/realtime/attendance, and retain rollback instructions. Real recipient sends require explicit approval for the concrete pilot.

## Current status

- Completed: read Calendar.md; inspected existing UI components, package/test inventory, schedule action pattern, RFID service, and scope identifiers.
- Awaiting confirmation: task 01 only.
- No implementation code, database changes, deployment, or email sends performed.

Suggested planning commit: `docs(calendar): add approval-gated implementation checklist`
