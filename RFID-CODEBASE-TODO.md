# RFID Codebase Review and TODOs

Reviewed: 2026-09-05. Baseline commit: `d592923`.

This is one consolidated backlog, separated into web and hardware work. It reviews the current implementation against the RFID documentation. Checkboxes remain open until the acceptance criteria pass. This review does not change application code, database data, or firmware.

## Scope and evidence

The review covers the repository structure, authentication, all portal modules, server actions, validation schemas, attendance calculations, reports, Supabase clients, migrations, seed and maintenance SQL, shared components, and build configuration. The source inventory includes 254 TypeScript/TSX files, nine SQL files, and 29 Markdown files under `src`, `components`, `supabase`, and `rfid-docs`. Generated output and dependencies are excluded from source review.

Findings use static code inspection and local checks. They do not prove the state of the deployed Supabase project. No live database mutation, SMS transmission, or physical device test was performed. No firmware, wiring diagram, pin map, or hardware build configuration was found. Hardware items are implementation and verification work, not claims that a physical component is defective.

### Requirement references

- **FR:** [Functional Requirement](<rfid-docs/rfid-docs/Functional Requirements/Functional Requirement.md>) — role access, attendance, RFID ingestion, SMS, live updates, and reports.
- **LATE:** [Late Attendance Ruling](<rfid-docs/rfid-docs/Functional Requirements/Late Attendance Ruling.md>) — BSIT, 2nd Year, sections 21001–21010, Asia/Manila, first-tap classification, and future improvements.
- **ADMIN:** [Admin User Interaction](<rfid-docs/rfid-docs/System User Interaction/Admin User Interaction.md>) — admin screens, required fields, schedules, and exports.
- **TEACHER:** [Teacher User Interaction](<rfid-docs/rfid-docs/System User Interaction/Teacher User Interaction.md>) — assigned students, attendance, reports, and settings.
- **STUDENT:** [Student User Interaction](<rfid-docs/rfid-docs/System User Interaction/Student User Interaction.md>) — personal attendance, RFID and SMS status, and profile.
- **DB:** [Database Design](<rfid-docs/rfid-docs/Database Design/Database Design.md>) — relationships, one active card, attendance, and notifications.
- **ARCH:** [System Architecture](<rfid-docs/rfid-docs/Project Documentation/System Architecture.md>) — device/server/database responsibilities and arrival SMS flow.
- **OVERVIEW:** [Project Overview](<rfid-docs/rfid-docs/Project Documentation/Project Overview.md>) — specified equipment, campuses, and project objectives.
- **DEV:** [Development Guidelines](<rfid-docs/rfid-docs/Development Guidlines/Development Guidelines.md>) — strict TypeScript, reuse, validation, RLS, and testing.

Where older examples conflict with the pilot, use LATE for the pilot scope. Missing features explicitly listed as future improvements are not release-blocking v1 defects.

### Priority and finding types

- **P0:** Fix before using real accounts or student data.
- **P1:** Fix before declaring the pilot operational.
- **P2:** Improve reliability, usability, or maintainability after the critical path works.
- **P3:** Optional or explicitly deferred expansion.
- **Confirmed:** The behavior or omission is directly visible in source; some findings also have a local reproduction.
- **Missing:** Required implementation is absent from this repository.
- **Verify:** Deployment or physical evidence is needed.
- **Enhancement:** Recommended work beyond the currently implemented behavior; not necessarily an explicit v1 requirement.

## Current implementation worth preserving

- Admin, teacher, and student portal layouts call `requireRole`; server mutations also check the admin role. The absence of role redirects in `proxy.ts` does not mean the portals have no authorization.
- Supabase Auth owns passwords. The Auth trigger reads roles from application metadata, not editable user metadata.
- The academic migration scopes teacher access through assignments. Student attendance reads explicitly use the current student's ID.
- The database enforces one active card per student, one attendance row per student/day, and matching card/student ownership.
- Admin management screens, schedule editing, personal profiles, and password changes exist.
- Late filters, badges, charts, and several KPI cards exist. Present plus Late counts as attended in the reviewed aggregations.
- Realtime subscriptions and a publication migration exist. Their coverage and reliability still need work below.
- Print CSS exists in `src/app/globals.css:174`. PDF export currently uses browser printing; it is not a completely absent feature.

## Web part

The web part includes the Next.js API, Supabase schema/RLS, notification backend, and dashboards. These backend tasks must work before hardware can complete the end-to-end flow.

### Security and data integrity

#### W01 — Enforce account status inside database authorization

- [ ] **P0 · Confirmed · FR Security, ARCH Security:** Make business-table access require an active account at the database boundary.
- **Evidence:** `supabase/migrations/202609010001_create_rfid_attendance_schema.sql:246` resolves a role without checking `users.status`; `:256` resolves a student without checking account/profile status. Owner policies permit access by identity. `teacher_can_access_student` in `202609030001_correct_academic_structure.sql:151` checks the teacher profile and assignment but not the linked account's status.
- **Impact:** A retained authenticated session can bypass the UI and continue permitted direct database operations. An archived admin still satisfies admin policies and can update account status. An archived student still matches personal-record policies.
- **Fix:** Centralize active-account checks, apply them to all relevant policies/helpers, and preserve only the minimal account lookup needed to show a disabled-account message. Do not rely solely on proxy redirects or sign-out.
- **Acceptance:** Test direct authenticated API reads/writes for active, inactive, and archived accounts in all three roles. Archived admins cannot restore themselves through direct table updates; active role access still works.

#### W02 — Keep account and profile status consistent across every action

- [x] **P1 · Implemented locally; database rollout pending · FR Authentication, ADMIN Manage Students/Teachers:** Use one lifecycle operation for create, edit, archive, and restore.
- **Implementation:** `supabase/migrations/202609070001_sync_profile_lifecycle.sql` synchronizes account status and dependent lifecycle changes within the profile write transaction. Student and teacher actions now use this shared database behavior instead of separate status requests. New teaching assignments inherit their teacher's status.
- **Behavior:** All three profile statuses synchronize the account. Student archiving retires active cards; restoring leaves lost/inactive/retired cards unchanged. Temporary student inactivity preserves the previous card policy. Teacher status changes also update existing assignments.
- **Verification:** `pnpm test:lifecycle` passes 14 PostgreSQL regression tests, including disabled-profile creation, edit/status updates, replacement assignment inheritance, restricted student writes, and rollback after injected failures.
- **Deployment:** Apply the new migration before deploying the actions. See `supabase/migrations/README.md` for rollout, existing-mismatch review, and rollback. Hosted Auth and concurrent-session verification remain staging checks. W01 authorization and W03 multi-request save integrity remain separate tasks.

#### W03 — Prevent partial saves and assignment loss

- [ ] **P1 · Confirmed · ADMIN management, DEV Database Rules:** Make related database writes atomic and make Auth synchronization recoverable.
- **Evidence:** `src/features/teachers/actions.ts:198` deletes assignments before inserting replacements. Student/teacher edits update profiles and public account rows before changing Auth email. Creation cleanup calls do not check cleanup results. `src/features/schedules/actions.ts:138` updates, inserts, and retires weekdays in separate requests.
- **Impact:** An invalid replacement assignment can erase the previous assignments. Email conflicts can leave the displayed email different from the login email. Failed schedule saves can update only part of the week.
- **Fix:** Use authorized transactional database functions for related SQL writes. Validate references first. Treat Auth calls as separate operations with checked compensation/reconciliation; an SQL transaction alone cannot roll back an external Auth API call.
- **Acceptance:** Simulate an invalid course, duplicate email, failed insert, and failed cleanup. Existing assignments remain intact, and partial Auth changes are either repaired or explicitly recoverable.

#### W04 — Unify RFID assignment rules and make replacement atomic

- [ ] **P1 · Confirmed · DB RFID Cards, FR RFID validation:** Share one authoritative assignment operation between both admin screens.
- **Evidence:** `src/features/students/actions.ts:269` does not check holder status. `src/features/rfid/actions.ts:86` rejects inactive holders. Both paths retire the existing active card before writing the replacement (`students/actions.ts:307`, `rfid/actions.ts:72`).
- **Impact:** The student screen can activate a card for an inactive/archived student. A failed replacement can leave the student without the previous working card.
- **Fix:** Check account/profile status, UID ownership, and attendance history consistently. Retire and activate cards inside one transaction with appropriate locking. Preserve the existing ownership foreign key and partial unique index.
- **Acceptance:** Both screens reject the same invalid operations. Concurrent replacements leave exactly one active card. A failed replacement leaves the old card active.

#### W05 — Enforce the pilot scope on server inputs

- [ ] **P1 · Confirmed · LATE Scope and Form Locks:** Validate actual catalog identity and eliminate accidental assignment wildcards.
- **Evidence:** Student and teacher schemas accept any positive program ID; their actions do not verify BSIT. Schedule actions already implement `assertPilotProgram`. `src/features/teachers/schema.ts` accepts blank year/section/campus; `assignmentRows` converts blanks to null, and teacher RLS interprets null as a wildcard.
- **Impact:** A crafted admin request can save non-pilot placement or grant a teacher program-wide access beyond the section shown by the pilot workflow. This requires admin mutation privileges; it is not a student privilege-escalation finding.
- **Fix:** Reuse server-side BSIT validation, validate active catalog entries and course/program ownership, and require explicit pilot assignment dimensions. If broad assignments are intentional, expose and document them as an explicit permission choice.
- **Acceptance:** Reject non-BSIT IDs, mismatched courses, and undocumented blank dimensions. A section-limited teacher cannot read another section or campus.

#### W06 — Canonicalize RFID UIDs before enforcing uniqueness

- [ ] **P1 · Confirmed · FR RFID validation, ARCH RC522 flow:** Define one byte-based UID format for registration, ingestion, and storage.
- **Evidence:** `src/features/shared/schema.ts` uppercases text but accepts arbitrary letters and different separators. The local probe accepted `ZZZZ`. `rfid_cards.rfid_number` has text uniqueness only.
- **Impact:** `04-A1-B2-C3`, `04:A1:B2:C3`, and `04A1B2C3` remain distinct records even if they represent the same UID. A printed identifier may also differ from the reader UID.
- **Fix:** Normalize separators/case, require valid hexadecimal bytes and supported UID lengths, and add canonical uniqueness. Inventory collisions before migrating existing values. Provide a controlled reader-assisted enrollment flow.
- **Acceptance:** Equivalent representations resolve to one UID; malformed values fail. A real pilot card registers and matches the value read by the RC522.

### Attendance, schedules, and live updates

#### W07 — Use Asia/Manila consistently for attendance dates and timestamps

- [ ] **P1 · Confirmed · LATE Rule 7:** Introduce shared school-time helpers for date boundaries and display.
- **Evidence:** `src/features/attendance/schema.ts:26`, dashboard modules, and `src/features/reports/panel.ts:105` use local `format(value, "yyyy-MM-dd")`. `src/lib/format.ts` formats timestamps without an explicit timezone. Database date defaults use `current_date`.
- **Impact:** A UTC deployment can read the previous attendance day during the first eight hours of a Philippine day. SMS and report timestamps can display in the viewer's local timezone.
- **Fix:** Use explicit Asia/Manila conversion for attendance dates, schedule weekdays, report defaults, generated timestamps, and device responses. Avoid double-converting stored `time` values.
- **Acceptance:** The same instant produces the same school date and display on UTC and Philippine hosts. Test 23:59:59/00:00:00 Manila boundaries and the morning/afternoon late cutoffs.

#### W08 — Use one definition of absence and attendance rate

- [ ] **P1 · Confirmed · FR Dashboards/Reports, STUDENT My Attendance:** Define expected attendance days centrally and reuse them across roles.
- **Evidence:** Admin/teacher reports derive session days only from existing records (`src/features/reports/panel.ts:220`, `teacher-panel.ts:104`). Dashboards also force today into the set. `countPersonalAbsentDays` in `src/features/attendance/student-dashboard.ts:148` counts weekdays since the first personal record. Student history renders only stored records.
- **Impact:** A school day with no taps disappears from reports. A student can have an absence KPI with no matching history row. New students are evaluated using today's roster, and unscheduled days can count as absent.
- **Local reproduction:** One student and no records across two weekdays produced report `totalAbsent: 0`. With one attendance row, the report still returned zero absences while the personal calculation returned one.
- **Fix:** Specify enrollment start, scheduled days, when an absence becomes final, and the Excused denominator. Reuse that definition in dashboards, history, and exports. A schedule used for late detection is not automatically a complete academic calendar; define out-of-scope behavior explicitly.
- **Acceptance:** All views agree for no-tap school days, new enrollment, pre-class time, weekends, archived schedule days, and Excused records. Present plus Late remains attended.

#### W09 — Decide how to store absence and Excused records without fake taps

- [ ] **P1 · Confirmed design dependency · W08, DB Attendance:** Resolve the model before adding the absence job suggested by the old roadmap.
- **Evidence:** `supabase/migrations/202609010001_create_rfid_attendance_schema.sql:119` requires `rfid_card_id`; `:121` requires `time_in`, including for Absent and Excused statuses.
- **Fix:** Either derive missing-day rows from an explicit expected-attendance model or add a compatible model for no-tap statuses. Do not invent a midnight time-in or require a card for a student who never tapped. Any future correction flow must retain actor, reason, and previous values.
- **Acceptance:** An absent student without an assigned card can appear correctly in history and reports. Reprocessing is idempotent. Existing time-in/time-out records remain valid.

#### W10 — Repair Realtime table coverage and avoid refresh starvation

- [ ] **P1 · Confirmed plus deployment verification · FR Real-Time Updates:** Align published tables, subscriptions, and the data each page reads.
- **Evidence:** The publication migration includes only attendance, cards, SMS, and students. `/admin/schedules` subscribes to `class_schedules`, which is not added by any included migration. `/admin/teachers` uses defaults that omit teachers and assignments. `src/components/live-refresh.tsx:40` resets its 800 ms timer after every event and `:55` ignores subscription status.
- **Impact:** Schedule/teacher changes can remain stale in other tabs. Continuous events can postpone refresh indefinitely. A failed subscription has no visible stale-data state or explicit catch-up refresh.
- **Fix:** Publish and subscribe to the required tables, use bounded refresh scheduling, refresh after reconnection, and display connection status. Scope subscriptions where possible. Handle changes that remove a teacher's visibility, not only inserts into currently visible rows.
- **Acceptance:** Test two sessions, schedule/assignment changes, a sustained tap stream, disconnect/reconnect, and access revocation. Updates arrive within a documented bound without clicking refresh. Inspect the deployed publication rather than assuming migrations ran.

#### W11 — Implement the authenticated RFID ingestion endpoint

- [ ] **P1 · Missing · FR RFID and Time-In/Time-Out, LATE Rules 1–7:** Implement `POST /api/rfid/tap` and the atomic attendance operation behind it.
- **Evidence:** `src/app/api/rfid/tap/README.md` exists; there is no `route.ts` or attendance writer implementing the device flow.
- **Fix:** Authenticate a device, validate a bounded request, resolve canonical UID/card/student/account status, and derive campus from trusted device configuration. Persist an immutable event and update attendance atomically. The first accepted tap creates time-in; the second fills time-out without changing Present/Late. Define subsequent-tap behavior explicitly. Use a stable event ID so retries return the original result rather than creating time-out or duplicate SMS.
- **Late acceptance:** For sections 21001–21005, 06:15:00 is Present and 06:15:01 is Late. For 21006–21010, use 13:15:00/13:15:01. Use the applicable active weekday schedule. No matching schedule means Present; inactive/archived rows must not create Late. Out-of-scope placement remains Present under the current ruling.
- **Other acceptance:** Test unknown/lost/deactivated cards, inactive accounts, simultaneous readers, repeated delivery after a lost response, invalid credentials, third taps, and day rollover. Return only the student/display information needed by the device. Attendance success must survive an SMS provider failure.

#### W12 — Add immutable scan events and correct RFID metrics

- [ ] **P1 · Missing and confirmed metric defect · FR Report Requirements, ADMIN RFID Scans:** Separate physical scan events from daily attendance rows.
- **Evidence:** There is no scan-event table. `src/features/reports/panel.ts:382` sets `rfidScans` to daily attendance row count. Dashboard counts include time-out, so the metrics disagree. Recent logs contain time-in rows only and use the student's current preferred card status.
- **Local reproduction:** One record with time-in and time-out produced `rfidScans: 1`.
- **Fix:** Add event ID, device, event/receipt timestamps, outcome, linked attendance/card/student when known, and an appropriate campus snapshot. Define whether each metric counts received attempts, accepted taps, or unique events. Preserve event-time status instead of relabeling old scans after a card is lost.
- **Acceptance:** Two accepted physical taps count as two accepted scan events; a network retry counts once. Invalid cards are auditable without creating attendance. Losing a card does not rewrite the apparent result of yesterday's scan.

#### W13 — Implement durable SMS delivery and status tracking

- [ ] **P1 · Missing · FR SMS, ARCH Time-In flow:** Build the notification adapter, durable pending work, retries, and status persistence.
- **Evidence:** `src/services/sms/README.md` and `src/features/sms/README.md` contain descriptions only. The SMS table and student status UI exist, but there is no sender, worker, callback handler, or provider configuration.
- **Fix:** Create one durable notification job for the intended attendance event. Store provider references, attempt/error information, and Pending/Sent/Failed transitions. Authenticate provider callbacks if used. Validate and normalize guardian numbers before queueing. Retry transient failures with a defined limit and without creating duplicate notification jobs.
- **Requirement decision:** ARCH describes arrival SMS, while FR says successful attendance recording. Record whether time-out also sends an SMS and use separate arrival/departure wording; never send an arrival message for departure.
- **Acceptance:** A successful arrival produces the documented student/campus message. Provider failure does not undo attendance. Restart/retry and duplicate callbacks do not corrupt final status. Define whether Sent means provider acceptance or confirmed delivery.

#### W14 — Resolve schedule ambiguity and protect historical late classification

- [ ] **P1 · Confirmed · LATE schedules/backfill:** Make schedule selection deterministic and use the same policy in ingestion and backfill.
- **Evidence:** `class_schedules` permits an all-campus row and a campus-specific row for the same section/day. `supabase/backfill_late_status.sql:26` matches either and marks Late if a matching row qualifies. The script uses current student placement and current schedule values, with no historical cutoff/version restriction. `src/features/schedules/schema.ts:99` accepts weekends although the pilot UI offers weekdays; campus validation accepts arbitrary text.
- **Fix:** Define campus-specific versus shared-row precedence, including a disabled override. Enforce valid pilot weekdays/campuses and distinct days. Constrain or explicitly model cutoffs that cross midnight. For backfill, use a reviewed date range and recorded placement/schedule evidence; retain a reversible list of changed IDs and prior values.
- **Acceptance:** Conflicting shared/specific rows yield one documented result. Editing a schedule or moving a student does not silently reclassify unrelated historical attendance. Preview and update use identical selection logic.

### Reports and user-facing completeness

#### W15 — Export complete reports, independent of visible table pagination

- [ ] **P1 · Confirmed · FR Report Requirements, ADMIN/TEACHER Export:** Produce a complete, readable export for the selected range.
- **Evidence:** Both `export-pdf-button.tsx` files call `window.print()`. Print CSS exists, but `admin/reports/components/recent-logs-table.tsx` renders `visible`, a ten-row page from a maximum of 50 records. Both section tables also render only their current page.
- **Impact:** Printing cannot include rows that were never rendered. The export also lacks the required SMS records and actual RFID scan log.
- **Fix:** Provide an export-specific full dataset and layout, including summary, student attendance, scan events, and notification records. Browser Save as PDF can remain if it meets the requirement; a new PDF library is not automatically necessary. Add heading, range, generation time, readable page breaks, and unambiguous totals.
- **Acceptance:** Export more than ten sections and more than 50 attendance events. Every intended row appears exactly once, regardless of the current page, responsive breakpoint, or theme. Teacher export remains assignment-scoped.

#### W16 — Preserve historical records when students move or are archived

- [ ] **P1 · Confirmed · FR Attendance Management/Reports, DB history:** Separate current-roster reporting from historical reporting.
- **Evidence:** `src/services/reports/snapshot.ts` selects active students only. `buildReportsData` then drops attendance whose student is outside that list. Admin attendance panels also start with active students. Reports derive program/year/section from current student data.
- **Impact:** Archiving a student removes their previous attendance from admin reports. Changing placement can move historical totals to the new section, and current roster size changes past denominators.
- **Fix:** Query historical attendance independently of current active status; retain the placement/eligibility context needed for historical reporting. Keep teacher history access deliberately scoped rather than widening it globally.
- **Acceptance:** An admin can find an archived student's old attendance. A transfer does not rewrite an earlier report's placement or totals. The same historical report is reproducible after roster changes.

#### W17 — Preserve campus identity in attendance and section reports

- [ ] **P1 · Confirmed · OVERVIEW multiple campuses, LATE campus scope:** Include campus in grouping and filtering where a section is intended to identify a class.
- **Evidence:** `src/features/reports/panel.ts:296` and `teacher-panel.ts:175` group by program/year/section only. Admin report students do not select campus. Dashboard section grouping uses the section label alone.
- **Impact:** Section 21001 at Main Campus and section 21001 at MV Campus merge into one class total.
- **Fix:** Carry campus through report queries and keys, label campus-specific totals, and offer an explicit combined-campus view when desired. Distinguish student home campus from the campus where a tap occurred.
- **Acceptance:** Two campuses with the same section code remain distinguishable in tables, exports, filters, and applicable schedules.

#### W18 — Stop silently truncating data reads

- [ ] **P1 · Confirmed · FR accurate attendance/reports, DEV Database Rules:** Make query completeness explicit.
- **Evidence:** `src/services/supabase/pagination.ts:6` limits reads to 25 pages and `:31` returns without reporting truncation. A local probe returned 25,000 rows from an always-full source. Student dashboard/history/SMS reads do not use pagination. Several paged queries sort by non-unique names, dates, or student IDs.
- **Fix:** Use database aggregates for totals and bounded server pagination for lists. Detect incomplete reads instead of presenting partial totals. Add stable unique ordering or cursor pagination. Apply pagination to personal history and SMS as well.
- **Acceptance:** Exercise datasets beyond the configured API row limit and beyond 25,000 rows. Totals remain complete; page boundaries neither omit nor duplicate tied rows. New inserts during paging have documented behavior.

#### W19 — Complete password recovery

- [ ] **P2 · Confirmed incomplete UI · FR Authentication, enhancement:** Connect the advertised recovery flow.
- **Evidence:** `src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx:35` displays “Supabase password recovery has not been connected yet.” No recovery callback/reset route exists.
- **Fix:** Implement recovery request, approved redirect handling, reset-session validation, password update, and expired/used-link handling. Return a generic request result that does not disclose account existence.
- **Acceptance:** A valid recovery link changes the password; expired/used links fail clearly. Regular unauthenticated requests cannot use the reset form to change another account.

#### W20 — Complete required status and identity presentation

- [ ] **P2 · Confirmed · ADMIN Dashboard, LATE display behavior:** Preserve stored statuses and restore missing required fields.
- **Evidence:** The admin dashboard attendance table lacks Program, although ADMIN lists it. `resolveTodayStatus` in `src/features/attendance/student-dashboard.ts:80` converts Late to Present and Excused to Absent, while history and Late KPIs retain richer status information.
- **Fix:** Include Program in the admin row model/table. Display the actual stored student status with a clear no-tap state; keep attended totals inclusive of Late. Distinguish absence from an Excused record.
- **Acceptance:** A Late student sees Late in today's card and history. An Excused record is not labeled Absent. Program remains accessible in the dashboard on narrow screens.

#### W21 — Make the teacher history link match its promise

- [ ] **P2 · Confirmed usability gap · FR Teacher Students:** Provide a real per-student history view or relabel the current action.
- **Evidence:** `teacher/students/components/student-view-dialog.tsx` links “View attendance history” to `/teacher/attendance?search=...`; the destination fetches one date and defaults to today.
- **Fix:** Add an assignment-scoped date-range history view keyed by student ID, or clearly label the current link as daily attendance and provide a discoverable history workflow.
- **Acceptance:** A teacher can review an assigned student's records across several dates without confusing today's search result with complete history. An unassigned student ID remains inaccessible.

### Maintainability and operational readiness

#### W22 — Strengthen date, phone, and image input validation

- [ ] **P2 · Confirmed · DEV validation, FR SMS:** Reject invalid data before a database/provider error.
- **Evidence:** Shared date fields check only `yyyy-MM-dd` shape; a local probe accepted `2026-02-31`. Guardian phone validation checks length only. `optionalUrl` permits any parseable URL scheme.
- **Fix:** Validate real dates and appropriate field bounds, normalize supported guardian phone numbers, and permit only intended image URL schemes. If uploads are added, validate files and ownership server-side.
- **Acceptance:** Invalid calendar dates and non-phone strings return field errors. Valid local/international guardian formats normalize consistently. Unsupported image schemes are rejected.

#### W23 — Limit notification and personal-data exposure by role

- [ ] **P2 · Enhancement and policy decision · FR protect student information:** Define field-level access before adding richer teacher reports.
- **Evidence:** Teacher RLS permits assigned student rows, including columns not selected by the teacher UI. SMS RLS currently allows owner/admin only (`202609010001_create_rfid_attendance_schema.sql:336`). The old hardware roadmap suggests granting teachers SMS reads.
- **Fix:** Specify which teacher-visible fields are needed. Use an appropriately secured projection/API if teachers need delivery status without guardian phone numbers or message content. Do not blindly grant full SMS-table access to satisfy report UI work.
- **Acceptance:** Test direct API requests, not only hidden UI columns. Teachers cannot read unassigned students; students cannot read anyone else's notification data. Approved teacher notification summaries expose only approved fields.

#### W24 — Align seed data and maintenance scripts with the pilot

- [ ] **P2 · Confirmed · LATE pilot, DEV database safety:** Make a clean local setup exercise the current pilot and preserve real history during cleanup.
- **Evidence:** `supabase/seed.sql:203` seeds `1st Year`/`BSIT-1A`, while current forms require 2nd Year/21001–21010. Seed also adds legacy subjects. `cleanup_old_sections.sql` and `cleanup_bshm.sql` delete student history through cascades and leave Auth accounts behind.
- **Fix:** Seed representative morning/afternoon pilot data and all relevant outcomes. Keep demo credentials and notification rows confined to demo environments. Replace production cleanup guidance with scoped, previewable archive/migration steps and explicit account reconciliation.
- **Acceptance:** A fresh local database supports add/edit and late-boundary scenarios without forced placement migration. Cleanup rehearsals preserve the intended attendance history and leave no unintended active orphan accounts.

#### W25 — Add repeatable automated checks and database permission tests

- [ ] **P1 · Missing verification coverage · DEV Test Before Merging:** Establish a reproducible release gate.
- **Evidence:** `package.json` defines dev/build/start/lint only. No repository test suite or CI workflow was found. Current pure aggregation functions provide useful seams for focused tests.
- **Fix:** Add tests for W01–W18 at their responsible layer: unit tests for dates/rates, isolated database tests for RLS/constraints/transactions, and a small end-to-end suite for role login, management, reports, and ingestion. Run migrations on a disposable database in CI.
- **Acceptance:** A documented command checks lint, TypeScript, core logic, RLS, and production build. Include concurrent taps, failed multi-step writes, timezone boundaries, late thresholds, pagination limits, and archived-user access.

#### W26 — Reduce refresh/query cost without weakening authorization

- [ ] **P2 · Enhancement · FR live dashboards, DEV reuse:** Avoid repeatedly loading entire histories and directories for every live event.
- **Evidence:** `LiveRefresh` refreshes the server tree; admin/teacher dashboards load months of attendance. Directory tables paginate in the browser after loading all rows. Teacher services independently repeat assignment resolution and matching.
- **Fix:** Use scoped database aggregates, server pagination, and page-specific subscriptions. Share stable assignment and attendance helpers where behavior is identical. Measure latency/query count before and after changes; never substitute a service-role query for proper user-scoped access.
- **Acceptance:** A sustained pilot workload has bounded refresh/query traffic and unchanged totals/RLS behavior. Search and pagination stay responsive with realistic roster and attendance sizes.

#### W27 — Add auditability and recovery procedures

- [ ] **P2 · Enhancement · FR security, DB records:** Record sensitive administrative changes and document recovery.
- **Evidence:** Management actions mutate status, assignments, cards, and schedules without a dedicated actor/reason audit record. Repository setup guidance does not provide a complete migration verification or restore rehearsal.
- **Fix:** Audit lifecycle changes, card issuance, schedule changes, and later attendance corrections. Document migration order, required configuration, backup/restore, failed notification recovery, and device credential rotation. Keep credentials and unnecessary student data out of operational logs.
- **Acceptance:** A reviewer can identify who changed a card or schedule and when. Restore a disposable backup and reconcile outstanding attendance/SMS work successfully.

#### W28 — Remove roadmap drift and small maintenance debt

- [ ] **P2 · Confirmed · DEV clear/reusable code:** Update planning documents to reflect the source, then remove verified dead duplication.
- **Evidence:** `ROADMAP-WEB-NOW.md` still says print CSS and Late UI are absent. `ROADMAP-HARDWARE-LATER.md` parks server-side SMS/API work with hardware. Two `sliding-number.tsx` implementations exist in root and `src` component trees. Lint reports unused `children` at `src/components/ui/combobox.tsx:277`.
- **Fix:** Point existing roadmaps to the maintained backlog or reconcile their statuses. Mark implementation and deployment verification separately. Verify imports before consolidating duplicate/unused components. Keep shared types and query code in their documented layers.
- **Acceptance:** No contradictory “missing” claims remain for working code. Lint is warning-free, and removing duplicate code does not break imports or UI behavior.

#### W29 — Add or verify profile photo handling and resilient UI behavior

- [ ] **P2 · Enhancement/verification · ADMIN Settings, DEV UI Guidelines:** Finish the intended photo workflow and verify interactive screens.
- **Evidence:** Profile photos are URL fields; no upload/storage policy is included. Forms, tables, and modal workflows exist, but no browser accessibility/responsive checks are recorded in this review.
- **Fix:** If “Change Photo” means uploading a file, add authenticated storage access, file limits, and cleanup. Otherwise clearly label URL-based photo entry. Verify keyboard navigation, field errors, focus return, narrow-screen tables, refresh during editing, and reduced-motion behavior.
- **Acceptance:** Photo changes work through the documented method. Keyboard users complete each management dialog. Live data updates do not unexpectedly erase an unfinished form. Required information remains accessible on mobile.

#### W30 — Keep future academic features explicitly separate from pilot blockers

- [ ] **P3 · Enhancement/deferred · LATE Future Improvements:** Schedule these after the core attendance path is verified.
- **Candidates:** A teacher read-only schedule view; course aliases for CPE211/CC104/ADV02; holiday/exam overrides; audited Excused management; per-subject periods; onboarding additional programs/year levels; and optional catalog/assignment administration screens.
- **Evidence:** LATE explicitly lists these future directions. `202609060001_bsit_pilot_courses.sql` seeds canonical codes but stores no aliases. Current admin navigation does not require standalone Programs, Courses, or an assignment matrix.
- **Acceptance:** Each accepted extension updates the requirements and role rules first. Store aliases under the same subject identity. Keep per-subject attendance and early-departure penalties out of v1 unless scope is deliberately expanded.

## Hardware part

The specified stack is ESP32 30-Pin ESP-WROOM-32U, RC522, MIFARE Classic 1K cards, a 2.8-inch SPI TFT LCD, green/red LEDs, an active buzzer, and 240-ohm resistors. The exact board/display variants and actual wiring still require inspection. Do not infer a compatible pin map or electrical limits from screen size alone.

#### H01 — Create a reproducible firmware project

- [ ] **P1 · Missing · OVERVIEW Hardware, ARCH Device Layer:** Add firmware source, build configuration, dependency versions, and flashing instructions.
- **Work:** Separate RFID reading, network/API transport, display, feedback, and device configuration. Keep credentials out of tracked source. Provide a simulator or fixture for the W11 response contract before connecting production data.
- **Acceptance:** A clean machine can build and flash the documented board. Firmware reports its version/device ID and starts in a clear ready or fault state.

#### H02 — Document and verify the physical circuit

- [ ] **P1 · Missing/verify · OVERVIEW equipment list:** Produce a pin map, schematic, and bill of materials for the actual assembled modules.
- **Work:** Verify power/logic requirements, common ground, peak supply demand, GPIO restrictions, LED resistor sizing, buzzer drive requirements, and the actual TFT controller. Document shared SPI pins, separate chip-select lines, and bus ownership for RC522/TFT. Check the antenna arrangement for the actual ESP-WROOM-32U board.
- **Acceptance:** Reader and display operate together under load without resets, bus contention, or electrical-limit violations. Record the tested wiring and component variants. Do not commit unverified pin assignments as a working design.

#### H03 — Make physical card handling match the server UID contract

- [ ] **P1 · Missing · FR RFID identification, W06/W11:** Read and encode the real card UID consistently.
- **Work:** Use the same canonical byte order/format as registration. Handle read failure, unsupported cards, card removal, and reader recovery. Apply a documented physical debounce/removal rule so holding a card in place does not create immediate time-out.
- **Acceptance:** Test every pilot card type against registration. A held card produces one intended event. A later deliberate second tap produces time-out. Rapid taps from different students are not accidentally suppressed.

#### H04 — Provision device identity and secure transport

- [ ] **P1 · Missing · ARCH Wi-Fi communication/security, W11:** Give each reader a revocable identity and trusted campus assignment.
- **Work:** Validate server TLS certificates. Provision Wi-Fi and device credentials without embedding a Supabase service-role key. Define credential rotation, revocation, and safe logging. Keep the device API separate from human portal login.
- **Acceptance:** Reject an invalid server certificate and a revoked device. Rotating one reader's credential does not disable every reader. Device logs and repository files contain no production secrets.

#### H05 — Handle outages, retries, and reboot without duplicate attendance

- [ ] **P1 · Missing · FR accurate attendance, W11/W12:** Use a stable event ID across retries and define offline behavior.
- **Work:** Use bounded network timeouts and retry backoff. Preserve an event ID until its result is known. If offline queueing is supported, persist a bounded queue across reboot, record event time/clock confidence, and reconcile delayed events under an explicit server policy. Otherwise display “not recorded” during outages.
- **Acceptance:** Losing the response after a committed time-in does not turn the retry into time-out. Reboot/power loss does not silently lose a promised queued event. No green success signal appears for an unconfirmed online transaction.

#### H06 — Implement TFT, LED, and buzzer states from server outcomes

- [ ] **P1 · Missing · FR Successful/Failed Tap, ARCH Display:** Show the required student name, year level, date, time, and result.
- **Work:** Define ready, reading, waiting, time-in success, time-out success, invalid card, disabled account/card, connection failure, and server-error states. Use distinct green/red feedback and documented buzzer patterns. Handle long names and clear personal details after a defined interval.
- **Acceptance:** Every server result maps to the correct display/LED/sound state. Invalid cards never show another student's details. SMS failure remains distinguishable from attendance failure. Feedback does not block processing indefinitely.

#### H07 — Verify clock, campus, and schedule boundaries on actual readers

- [ ] **P1 · Verify · LATE, OVERVIEW campuses, W07/W11/W14:** Test the complete timing contract at the device boundary.
- **Work:** Specify whether the server uses receipt time or a validated captured time, particularly for delayed/offline events. Use Asia/Manila for display and attendance decisions. Confirm campus comes from authorized configuration and define handling when the student's campus differs.
- **Acceptance:** Bench-test both late cutoffs, midnight rollover, no schedule, disabled schedule, weekday/weekend behavior, and two campuses. TFT date/time agrees with stored attendance and portal display.

#### H08 — Run an end-to-end acceptance and endurance test

- [ ] **P1 · Verify · FR complete system flow:** Validate the assembled device with the completed web backend before declaring the pilot finished.
- **Work:** Test valid/unknown/lost/deactivated cards; inactive students; first/second/third taps; two simultaneous readers; Wi-Fi and API failures; SMS provider failure; power interruption; repeated scanning; and restoration. Record throughput, response latency, error rate, and recovery outcomes against agreed pilot targets.
- **Acceptance:** One accepted event yields the intended attendance mutation and notification job. All three dashboards update within the agreed bound. A teacher sees only assigned students, a student sees only personal records, and the display/LED/buzzer matches the committed result. Archive the test evidence and known limits.

## Recommended execution order

1. Fix authorization and write integrity: W01–W06. Establish the relevant W25 tests immediately.
2. Agree on school-time, absence, and schedule semantics: W07–W09 and W14. Fix live-update coverage with W10.
3. Implement the backend event path: W11–W13. Use a device simulator while H01–H04 are prepared.
4. Correct reporting and read completeness: W15–W18. Finish remaining P2 user workflows and operational work.
5. Integrate firmware behavior: H03–H07. Run H08 against a disposable or controlled pilot environment.
6. Consider W30 only after the operational pilot meets the required behavior.

## Validation performed during this review

- `pnpm lint`: passed with zero errors and one unused-`children` warning in `src/components/ui/combobox.tsx:277`.
- `pnpm exec tsc --noEmit --incremental false`: the local command wrapper could not resolve `tsc`. Running `node node_modules/typescript/bin/tsc --noEmit --incremental false` directly passed.
- `node node_modules/next/dist/bin/next build`: passed on the network-enabled retry, including compilation, TypeScript, and route generation. The restricted-environment attempt failed only while fetching Inter from Google Fonts. Build infrastructure therefore needs access to that font source, or the font should be bundled locally for offline builds.
- Local read-only probes executed the existing aggregation/validation/pagination code with synthetic data. They reproduced report/personal absence disagreement, time-out undercount in report scans, silent 25,000-row truncation, invalid-date acceptance, and non-hex UID acceptance.
- No existing automated test suite was found. No live RLS, migration, browser, device, or SMS-delivery acceptance claim is made by these checks.

Completion means the required behaviors pass their acceptance checks, not merely that the dashboard looks complete or the TypeScript build passes.
