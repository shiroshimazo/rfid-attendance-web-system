# RFID documentation alignment: keep, remove, and proceed

Reviewed: 2026-09-05. Repository HEAD: `009b7d8`, including the existing uncommitted working-tree changes.

**Project decision: preserve the documented RFID attendance system, remove Excused from the current feature scope, and finish the attendance capture, SMS, and reporting requirements before expanding anything.**

This document began as an analysis and implementation plan. **R01 is complete in the codebase, and the user has confirmed executing its database migration.** The cleanup list supplied in `C:/Users/Jeremy/Downloads/table.md` was rechecked against HEAD `05cd3d8` on 2026-09-05. The other recommendations remain open unless explicitly stated otherwise. No hosted records were converted or deleted by this assistant.

**R02 is also complete:** unsupported tasks have been removed from the active
release instructions. This audit is the single active scope checklist; module
READMEs and the supporting UI review must follow it. Required work in P01–P11
follows the individual status below; documenting an exclusion does not complete
those implementations. P01 is DONE: local tests passed, and the user confirmed
hosted migration execution, application deactivation/reactivation, and all nine
hosted SQL verification results as PASS on 2026-09-06.

## 1. Which documents control the scope?

Use your instruction for this audit first: **no Excused workflow and no additional features outside the RFID requirements.** Then use the current requirements and role interaction documents below. A future-improvement entry does not by itself authorize a new feature now. Existing code, tests, READMEs, and generated roadmaps are evidence of implementation, not proof that a feature is required.

| Reference | Source | What it establishes |
| --- | --- | --- |
| FR | [Functional Requirement](<rfid-docs/rfid-docs/Functional Requirements/Functional Requirement.md>) | Three roles, management permissions, attendance, RFID taps, SMS, Realtime, and PDF reports. |
| LATE | [Late Attendance Ruling](<rfid-docs/rfid-docs/Functional Requirements/Late Attendance Ruling.md>) | Current pilot restrictions, first-tap late rule, schedules, and separately listed future work. |
| ADMIN | [Admin User Interaction](<rfid-docs/rfid-docs/System User Interaction/Admin User Interaction.md>) | Eight admin menu items, form fields, report content, and the existing schedules panel. |
| TEACHER | [Teacher User Interaction](<rfid-docs/rfid-docs/System User Interaction/Teacher User Interaction.md>) | Five teacher menu items, assigned students only, read-only student records, and PDF reports. |
| STUDENT | [Student User Interaction](<rfid-docs/rfid-docs/System User Interaction/Student User Interaction.md>) | Three student menu items, personal attendance, RFID/SMS status, profile, and password changes. |
| DB | [Database Design](<rfid-docs/rfid-docs/Database Design/Database Design.md>) | Required entities, relationships, one active card per student, and status values for cards/SMS. |
| ARCH | [System Architecture](<rfid-docs/rfid-docs/Project Documentation/System Architecture.md>) | Device-to-server flow, time-in/time-out, arrival SMS, and role isolation. |
| OVERVIEW | [Project Overview](<rfid-docs/rfid-docs/Project Documentation/Project Overview.md>) | Project objectives, specified hardware, three campuses, and technology stack. |
| DEV | [Development Guidelines](<rfid-docs/rfid-docs/Development Guidlines/Development Guidelines.md>) | Reuse, strict TypeScript, validation, Supabase Auth/RLS, and preserving working modules. |

### Important conflict: Excused is mentioned, but only as future work

At the original audit, `LATE`, line 121, listed "Holiday/exam-day overrides and administrator Excused flow" under **Future Improvements**, not the v1 late rules. R01 has since replaced that future-work instruction with an explicit scope exclusion. The main functional requirements and role screen specifications do not define how anyone requests, approves, or assigns Excused.

At the original audit, the code supported Excused in its database enum, shared types, filters, charts, aggregate calculations, and tests. No implemented Excused request/approval action or dedicated screen was found. **R01 now removes the active support while retaining compatibility with historical database values.** This audit cannot establish who introduced it or whether AI authored it.

Your instruction resolves the current-release decision: remove this business status from active product behavior. Preserve any existing data until it has been reviewed; do not silently relabel records.

### Current attendance boundary

| Item | Decision | Reason |
| --- | --- | --- |
| Present | KEEP | Explicit throughout FR and the role docs. |
| Absent | KEEP, FINISH ITS RULE | Explicitly required, but the docs do not define when an untapped day becomes a final absence. |
| Late | KEEP | LATE v1 explicitly defines it. It counts as attended together with Present. |
| Excused | REMOVED FROM CURRENT SCOPE | R01 complete. Historical database values remain preserved; new unsupported decisions are blocked by the migration the user confirmed executing. |
| `NoRecord` / "No tap recorded yet" | KEEP AS AN EMPTY-DATA DISPLAY ONLY | Current code uses it when no attendance row exists. It is not a database enum or an approved new attendance decision. Do not store it as an attendance result or use it to invent an absence policy. |
| RFID Active / Inactive / Lost / Deactivated | KEEP | Explicit DB card statuses; these are different from attendance statuses. |
| SMS Pending / Sent / Failed | KEEP | Explicit FR, DB, and STUDENT requirements. |

## 2. Whole-system disposition

"Keep" means retain the module and its documented responsibility. It does not mean every implementation detail is complete or correct.

| Area | Implementation evidence | Decision |
| --- | --- | --- |
| Authentication and role routing | `src/features/auth/`, `src/proxy.ts`, role layouts, sign-in form | KEEP. P01 DONE: migration applied, application checks passed, and nine hosted SQL checks passed according to the user. |
| Admin dashboard | `src/features/attendance/dashboard.ts`, `src/app/(portal)/admin/dashboard/` | KEEP. Excused removed under R01; the documented Program field and remaining calculation work stay separate. |
| Manage teachers | `src/features/teachers/`, `src/services/teachers/`, admin teacher forms | KEEP add/edit/archive/view and multiple assignments. Repair save integrity and pilot validation. |
| Manage students | `src/features/students/`, `src/services/students/`, admin student forms | KEEP identity, academics, guardian information, accounts, archive, and RFID assignment. |
| Manage RFID cards | `src/features/rfid/`, `src/services/rfid/cards.ts`, admin card screens | KEEP register/assign/status/view. Unify the two assignment implementations. |
| Admin attendance | `src/features/attendance/panel.ts`, `src/services/attendance/panel.ts` | KEEP search, filters, times, and records. Excused choices removed under R01; finish the remaining absence-policy work. |
| Admin schedules | `src/features/schedules/`, `src/services/schedules/`, `/admin/schedules` | KEEP. ADMIN and LATE explicitly document this module. Preserve status-based retirement. |
| Admin reports | `src/features/reports/panel.ts`, `src/services/reports/snapshot.ts` | KEEP. Finish correct totals, required report records, and complete PDF output. |
| Admin settings | `src/features/profiles/actions.ts`, `/admin/settings` | KEEP profile/photo reference, email, phone, and password changes. |
| Teacher dashboard/attendance/students | Teacher attendance feature/service files and `/teacher/` pages | KEEP assigned-student visibility, filters, date selection, read-only details, and attendance history access. |
| Teacher reports/settings | `src/features/reports/teacher-panel.ts`, `src/features/profiles/teacher-profile.ts` | KEEP class reports/PDF, profile, assignments, and password changes. |
| Student dashboard/history/profile | Student attendance feature/service files and `/student/` pages | KEEP personal data, time-in/out, required history KPIs, RFID/SMS status, and password changes. |
| Realtime | `src/components/live-refresh.tsx`, publication migration | KEEP and finish reliability verification. A working live update is a core requirement. |
| Device ingestion | `src/app/api/rfid/tap/README.md` | PROCEED. This folder has no `route.ts`; the required receiver is not implemented. |
| SMS sending | `src/services/sms/README.md`, `src/features/sms/README.md` | PROCEED. Database/display support exists; sending is not implemented here. |
| Firmware and physical feedback | No firmware/build files found in the source inventory | PROCEED for the complete system. Confirm separately if firmware is maintained in another repository. |
| Database/migrations | Six migrations, seed, and maintenance SQL in `supabase/` | KEEP the schema foundations and migration history. Correct active scope through deliberate migrations. |
| Shared UI and configuration | `src/components/`, `src/lib/`, styles, navigation, package/config files | KEEP supporting UI and infrastructure. These are not extra business features just because the docs do not name each helper. |
| Existing tests | `tests/` | KEEP useful regression coverage. R01 removed active Excused expectations; retained mentions test legacy compatibility or rejection only. |
| Old implementation roadmaps | Root Markdown files | RECONCILE. They contain stale findings and additions that should not control this release. |

The current navigation already matches ADMIN, TEACHER, and STUDENT: eight admin, five teacher, and three student destinations in `src/config/navigation.ts`. No new sidebar module is needed.

## 3. What to remove or stop pursuing

### R01 — Remove Excused support from current business behavior — DONE

- [x] **Completed in the codebase on 2026-09-05.** Removed Excused from the active status contract, filters/URL choices, badges, sort maps, dashboard fields, chart slices, report tallies, and user-facing copy.
- [x] Preserved Present, Late, Absent, and the existing no-tap display. Shared `status.ts` maps unsupported stored values to a display-only `LegacyRecord` marker, shown as **Historical record**. It is not a selectable, writable, or charted business status. Existing rows, times, and linked SMS remain available without reclassification.
- [x] Excluded historical values from active attendance counts, rates, scan counters, and report session dates. Reports now count **explicit recorded absences**, matching current dashboards; this avoids converting legacy/missing rows into absences when removing Excused. The broader P05 school-policy/finalization decision remains open, as does P08's daily-row versus scan-event distinction.
- [x] Added `supabase/migrations/202609080001_restrict_attendance_status.sql`. The new guard rejects unsupported inserts/status changes while preserving existing historical rows and unchanged-status updates for the same record/student/day/card. The original enum/migration remains intact; no history is deleted or converted.
- [x] Updated current-contract tests and removed active/future Excused requirements from the related planning files and the LATE future list. Remaining mentions identify an exclusion, historical evidence, or compatibility/rejection tests.
- [x] **Verification:** 50 local tests pass, including 7 application scope/compatibility tests and 9 database migration/preservation/rollback tests. TypeScript and the Next.js production build pass. ESLint reports 0 errors and the existing unused `children` warning in `src/components/ui/combobox.tsx:277`. A source search finds no Excused references under `src/`.
- [x] **Migration execution confirmed by the user on 2026-09-05:** `supabase/migrations/202609080001_restrict_attendance_status.sql` has been executed. This confirmation supersedes the previous pending-rollout note. The assistant has not independently verified the hosted trigger or counted historical rows; the earlier inventory query failed. See [migration rollout and rollback](supabase/migrations/README.md#r01-attendance-status-rollout).
- [x] **Downloaded cleanup table rechecked on 2026-09-05:** every active-code removal listed in `C:/Users/Jeremy/Downloads/table.md` is already implemented. The follow-up ran the four focused attendance/migration suites: **36 passed, 0 failed**. Searching `src/` and the two current-contract test files found no Excused references. No further product-code edits were needed.

The outdated pending-cleanup table is replaced below with its verified completion record. No supported attendance function or historical migration was deleted.

**Basis:** your instruction; FR attendance/role requirements; LATE's distinction between v1 and future improvements.

| Layer from `table.md` | Result | Evidence |
| --- | --- | --- |
| Shared contract | DONE — active decisions are Present, Late, and Absent. | `src/features/attendance/status.ts`; `schema.ts`; service re-export and student history model. |
| Shared badge | DONE — removed the retired visual mapping. | `src/components/attendance-status-badge.tsx`; neutral historical display is compatibility only. |
| Admin dashboard | DONE — removed retired KPI field, count, and slice. | `src/features/attendance/dashboard.ts`; dashboard regression tests. |
| Teacher dashboard | DONE — removed retired count and slice. | `src/features/attendance/teacher-dashboard.ts`; dashboard regression tests. |
| Admin reports | DONE — removed retired tallies/branches/slices; counts recorded absences. | `src/features/reports/panel.ts`; report regression tests. P05's finalization policy remains separate. |
| Teacher reports | DONE — same approved counting behavior. | `src/features/reports/teacher-panel.ts`; report regression tests. |
| Filters | DONE — removed shared and hard-coded choices; retired URL status falls back to All. | Shared schema, admin dashboard filter, and query regression test. |
| Sorting | DONE — no retired-status entries remain. | Source search across admin, teacher, and student table components. |
| Chart configuration | DONE — no retired labels, colors, legends, or descriptions remain. | Source search across dashboard/report charts. |
| User-facing copy | DONE — no retired-status headlines or denominator explanations remain. | No Excused matches under `src/`. |
| Tests/comments | DONE — current-contract tests use approved values. | Student and role dashboard suites pass; separate compatibility tests preserve/reject historical values deliberately. |
| Database compatibility | DONE — additive guard prepared/tested; execution confirmed by user. | `202609080001_restrict_attendance_status.sql`; 9 local migration tests. Original enum/history preserved; hosted row inventory remains unverified. |

**Preservation boundary:** migration execution does not establish that historical rows are absent. Keep their original values and linked records. Do not drop the old enum, delete records, or convert them to Present/Absent without a separate record-disposition decision. Historical migrations, compatibility tests, and this audit may still mention the retired value intentionally.

### R02 — Remove unsupported tasks from the release backlog — DONE

- [x] **Completed on 2026-09-05.** Checked the current Markdown inventory and removed unsupported implementation mandates from the attendance, RFID, SMS, reports, and tap-endpoint READMEs.
- [x] Confirmed `ROADMAP-WEB-NOW.md`, `ROADMAP-HARDWARE-LATER.md`, and `RFID-CODEBASE-TODO.md` are already absent. They were not recreated; their task references below record historical origins only.
- [x] Split LATE's mixed future list into **Current pilot completion** and **Deferred ideas — outside the current release (R02)**. Preserved v1 rules, admin schedules, Late UI, the subject catalog, and required tap-route/backfill work.
- [x] Made this audit the active backlog and the UI/UX plan a supporting review. Removed its dependency on the missing TODO file and its mandates for new recovery/reporting tooling; R03 remains separate.
- [x] Preserved required RFID validation, secure first/second-tap handling, duplicate-request correctness, arrival SMS/status persistence, role restrictions, and complete PDF report output.
- [x] **Verification:** reviewed all R02 categories against remaining Markdown instructions; checked edited-document links and whitespace; confirmed changes are documentation only. No application tests were rerun because no executable code, schema, or dependencies changed.

The table below records **completed scope exclusions**, not future implementation
tasks and not a claim that these features previously existed in application code.

| Proposed task | Where it came from | Decision |
| --- | --- | --- |
| Standalone Programs and Courses CRUD screens | Removed web roadmap, item 6 | REMOVED from current deliverables. Keep required catalog tables and form selections. |
| Standalone teacher assignment matrix | Removed web roadmap, item 7 | REMOVED. Keep repeatable assignments within teacher management as ADMIN specifies. |
| Automatic nightly absence job | Removed web roadmap, item 8; attendance READMEs | REMOVED from the implementation instructions. Absent remains required; resolve P05 before selecting a finalization/storage/job mechanism. |
| Teacher schedule page | LATE deferred ideas | DEFERRED outside this release. Keep the admin schedules screen and existing access foundations. |
| Per-subject timetable/period attendance | LATE deferred ideas | DEFERRED outside this release. Keep the eight-subject catalog and section-based v1 start times. |
| Holiday/exam override management | LATE deferred ideas | DEFERRED outside this release. Do not turn a missing policy into a new calendar module. |
| Additional program/year onboarding | LATE deferred ideas | DEFERRED outside this release. Preserve historical data and current BSIT 2nd Year restrictions. |
| Early-departure classification | LATE Class Schedule | EXCLUDED. Class end stays informational in v1. |
| Teacher access to guardian SMS records | Removed hardware roadmap, S4 | REMOVED as an automatic access expansion. SMS/report READMEs preserve current permissions pending a defined report-visibility rule. |
| Mandatory new PDF library | Removed web roadmap, item 5; reports service README | REMOVED, including the server-side-generation mandate. Complete PDF output is required; verified browser printing remains an available implementation. |
| Reader-assisted enrollment, general admin audit subsystem, offline device queue, provider retry console | Former TODO and module READMEs | REMOVED as separate release tasks. The READMEs retain only required registration, transaction correctness, notifications, and report records. |

A retry must not accidentally create a second attendance event, and a failed SMS send must have a truthful status. Those are correctness requirements for the existing flow; they do not require adding new management screens or choosing a large queue architecture in advance.

### R03 — Complete the user-approved email-code password recovery — DONE

The login link to `/forgot-password` is preserved. Its former placeholder form now implements the three-step recovery flow using Supabase Auth.

**Scope correction on 2026-09-05:** the user explicitly requested keeping the login link and completing recovery for Admin, Teacher, and Student. This instruction supersedes the earlier removal recommendation; recovery is now an approved requirement.

- [x] Record the approved flow and provide the Supabase configuration checklist before completing the form. The separate setup document has since been removed from the workspace.
- [x] User confirmed completing Supabase email configuration on 2026-09-05. Hosted delivery and exact setting values have not been independently verified.
- [x] Keep **Forgot password?** on the login form and implement `/forgot-password`: **email → one six-digit email code → new password and confirm password → login form**.
- [x] Support existing accounts across all three roles through the same recovery flow. Preserve roles, account statuses, and existing access restrictions; recovery does not create accounts or reactivate disabled accounts.
- [x] Require successful Supabase recovery-code verification before updating the password. Reuse the existing password validation, handle invalid/expired codes and resend limits, and keep account-existence feedback neutral.
- [x] After a successful password update, end the recovery session and return to `/sign-in`. Preserve all three existing signed-in password-change actions.
- [x] **Local verification:** 18 recovery tests pass using the real Supabase SDK with a fake Auth transport, including all three roles, step guards, OTP formatting/rejection, password validation, resend limits, session isolation, cancellation, and sign-out retry without repeating the password update. All 14 existing profile-lifecycle tests also pass. TypeScript and the production build pass; lint has zero errors and one existing combobox warning.
- [x] **User acceptance on 2026-09-05:** the user confirmed recovery is working and requested marking R03 done. Role coverage and failure cases are supported by the local tests above; this does not claim separate hosted tests for every role and edge case.

**Implementation done on 2026-09-05:** [recovery form](<src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx>), [recovery workflow](src/features/auth/password-recovery.ts), [isolated Supabase client](src/services/supabase/recovery.ts), and [regression tests](tests/password-recovery.test.mjs). Recovery credentials stay in memory and never enter portal cookies or browser storage. Returning to login closes only that recovery session. Reloading/leaving requires starting recovery again. No schema, role, or attendance changes were needed.

**Completion basis:** implemented flow, passing local checks, and the user's confirmation that live recovery works after SMTP troubleshooting. R03 is closed. No real account password was changed by this assistant.

**Resolved issue history (2026-09-05):** the supplied `supabase_logs.json` contained six `/recover` responses with HTTP 504, `request_timeout`, and `context deadline exceeded`, each after approximately 10 seconds. Investigation identified the SMTP port discrepancy below. The user's subsequent working-flow confirmation closes this issue.

**SMTP resolution guidance:** the screenshot showed `smtp.gmail.com` with port **463**. The user was instructed to use **465** and a Gmail App Password without formatting spaces, then save and retest. Supabase's [Google SMTP guide](https://supabase.com/docs/guides/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y) supports **465 or 587**. Recovery is now working according to the user; hosted settings were managed by the user.

### R04 — Retire destructive pilot cleanup scripts from normal setup instructions — DONE

- [x] **Completed on 2026-09-05.** Labeled `supabase/cleanup_bshm.sql` and `supabase/cleanup_old_sections.sql` as retired historical maintenance scripts, excluded from normal setup, deployment, and pilot cleanup.
- [x] Replaced execution instructions and advice to remove surviving Auth accounts with historical descriptions and the documented archive/preservation rule. Retained the original SQL as reference; it remains executable and destructive.
- [x] Updated [Supabase setup guidance](supabase/README.md) to use versioned migration rollout instructions and explicitly exclude these scripts. Clarified that local demo reset discards local data and is not an existing-data cleanup step.
- [x] Kept demo seed alignment under P10. No database records were deleted, converted, or archived by this task; neither retired script was executed.
- [x] **Verification:** compared both scripts against HEAD with comments removed; executable SQL is unchanged. Confirmed retirement labels, resolved setup-document links, reviewed script references, and passed `git diff --check`. No application tests were rerun because this change affects documentation and SQL comments only.

**Basis:** documented teacher/student archive actions and LATE's preservation of non-pilot attendance behavior. Pilot scope does not authorize deleting historical records. Future setup instructions must preserve this exclusion.

### R05 — Small, optional source cleanup after business alignment

These have no consumers in the searched application/test source:

- `src/components/refresh-button.tsx` — unused component; optional deletion. Realtime requirements do not prohibit a useful manual retry control elsewhere.
- `src/components/module-placeholder.tsx` — unused placeholder component; optional deletion.
- `components/motion-primitives/sliding-number.tsx` — unused root-level version. Current imports use `@/components/motion-primitives/sliding-number`, which resolves to the **used** `src/components/motion-primitives/sliding-number.tsx`; keep that implementation.

Do not mass-delete shadcn components or libraries because a business document does not list them. Verify imports before removing dependencies. This cleanup is lower priority than the required RFID path.

## 4. What must remain

1. **Three roles and their existing menus.** Preserve `requireRole`, server mutation checks, session handling, and RLS. Do not add a parent portal or new user role.
2. **Student and teacher management.** Preserve the documented personal/account fields, guardian information, academic placement, archive behavior, and teacher assignments.
3. **RFID lifecycle.** Preserve registration, assignment, the four documented card statuses, card-to-student validation, and the database constraint allowing one active card per student.
4. **Attendance records and read-only role boundaries.** Keep time-in/time-out, search/filter/history, admin visibility, teacher assignment scoping, and personal-only student visibility. No manual correction/approval screen is required by the current docs.
5. **Late and section schedules.** Keep BSIT, 2nd Year, sections 21001–21010, Asia/Manila, 15-minute default grace, and the existing admin controls. Keep the catalog of eight pilot subjects. No timetable is needed.
6. **Realtime and SMS status display.** Keep the existing subscriptions, SMS table, and student SMS cards/history while finishing the missing sender and live-update verification.
7. **Reports and PDF export.** Keep the reports pages, date filters, summaries, section tables, charts, export buttons, and print styling while correcting their output.
8. **Profiles and password changes.** Keep existing photo references and profile fields. The docs require profile pictures but do not mandate a Storage uploader; URL-based storage is an implementation choice, not proof of a missing business feature.
9. **Data integrity foundations.** Preserve card ownership and course/program foreign keys, one attendance row per student/day, lifecycle triggers, Auth-managed passwords, and retained history. The old DB document's conceptual password field does not override DEV's instruction to use Supabase Auth and never store plain passwords.
10. **Working supporting code.** Keep reused badges, date pickers, forms, pagination, loading/error states, responsive layouts, theme support, and tests. None requires a rewrite for this scope audit.

## 5. What to proceed with: required completion and repairs

Priorities: **P0** = security/correctness prerequisite; **P1** = required before calling the pilot complete; **P2** = smaller requirement or maintenance correction. These priorities describe the source findings, not a tested production deployment.

### P01 — Enforce disabled-account access in the database (P0) — DONE

**Basis:** FR Security; ARCH role-based security; documented archive actions.

**Reproduced before the change:** the original role and student helpers ignored account status. With retained inactive identities, local database requests still returned business records for Admin, Teacher, and Student. Owner and catalog policies allowed additional reads. Application redirects alone did not protect direct database requests.

- [x] Added [202609090001_enforce_active_account_access.sql](supabase/migrations/202609090001_enforce_active_account_access.sql). Authorization helpers read current account status; student/teacher helper access also requires the appropriate active role.
- [x] Added restrictive policies to all nine business tables, preventing owner/catalog policies from bypassing the active-account requirement. Existing active-admin, assigned-teacher, and personal-student permissions remain intact.
- [x] Preserved read-only access to the caller's own `public.users` row for login/status feedback. Disabled accounts cannot reactivate themselves, change roles, or read other users. Auth recovery and privileged service-role operations retain their existing behavior.
- [x] Preserved all records, account statuses, card states, historical links, and lifecycle triggers. The migration contains no data updates/deletes and can be reapplied atomically.
- [x] **Verification completed on 2026-09-06:** 42 database tests pass: 19 access tests, 14 profile-lifecycle tests, and 9 attendance-status migration tests. Coverage includes the original leak, active access boundaries, all six disabled-role/status combinations, self-elevation denial, archive/restore, reapplication, row preservation, and the actual documented rollback SQL.
- [x] Added [rollout, hosted verification, and rollback instructions](supabase/migrations/README.md#p01-active-account-access-rollout). No frontend changes were needed.
- [x] **Hosted migration execution confirmed by the user on 2026-09-06:** `202609090001_enforce_active_account_access.sql` has been run in Supabase.
- [x] **Application deactivation check reported on 2026-09-06:** following the test steps, the user reported an "Error 401 / Sign-in required" page. This confirms the application denied access in that test; it does not independently prove direct database enforcement. The tested role was not specified.
- [x] **Application reactivation check confirmed on 2026-09-06:** the user reactivated the test account and confirmed access returned.
- [x] Prepared [verify_active_account_access.sql](supabase/verify_active_account_access.sql) for a hosted SQL-level check. It tests one existing active account per role with simulated authenticated claims, rolls back temporary status changes/write probes, and returns nine PASS rows. All 21 access tests pass locally, including successful script execution, rejection of the old policies, and preservation of every stored row. This is a verification script, not a migration or cleanup operation.
- [x] **Hosted SQL verification confirmed by the user on 2026-09-06:** all nine rows from `verify_active_account_access.sql` are marked PASS. This covers active, inactive, and archived states for Admin, Teacher, and Student, blocked business-table reads/updates, rejected inserts/self-reactivation, and restored access after reactivation. Temporary writes are rolled back by the script.
- [x] **P01 completion:** passing local regression tests, user-confirmed migration execution and application checks, and user-confirmed hosted RLS checks establish the implemented database boundary. The SQL checks use simulated authenticated claims; a separate real HTTP request with a retained JWT was not tested or claimed.

**Current status: DONE on 2026-09-06.** The user confirmed all nine hosted SQL checks passed after migration execution and successful application deactivation/reactivation checks. No hosted migration or account mutation was performed by this assistant. Local tests use PGlite with an Auth identity stub; hosted SQL checks simulate authenticated claims. Revocation applies to subsequent statements observing the committed status change and cannot retract already downloaded data or cancel earlier transaction snapshots.

### P02 — Finish safe management writes and pilot validation (P1)

**Basis:** ADMIN management/assignments; LATE Scope and Form Locks; DEV validation.

**Evidence:**

- `updateTeacherAction` deletes existing assignments before inserting replacements in `src/features/teachers/actions.ts`. A failed insert can leave no assignments.
- Student/teacher edits update profile and public account information before changing the Auth email; errors can leave different displayed/login emails.
- `src/features/students/actions.ts` and `src/features/teachers/actions.ts` do not verify that a submitted program ID actually identifies BSIT. `assertPilotProgram` already does this in schedules.
- `src/features/teachers/schema.ts` permits blank assignment year/section/campus, and `assignmentRows` turns these into SQL nulls. Teacher access helpers interpret null dimensions as wildcards.
- Schedule writes update, insert, and retire weekdays in separate requests. Its server schema accepts days 0–6 even though the pilot UI offers Monday–Friday.

**Proceed:** preserve existing actions/forms, validate catalog identity and intended pilot dimensions on the server, and ensure failed related writes do not erase valid state. Keep SQL changes atomic where they form one operation; handle Auth API failure explicitly. Make schedule validation agree with the current pilot scope.

**Done when:** invalid program/assignment/day inputs are rejected; a failed replacement leaves the previous assignments/card/week intact; account email changes cannot silently diverge. No new CRUD screen or wildcard-permission feature is needed.

### P03 — Unify RFID registration and assignment correctness (P1)

**Basis:** FR Manage RFID/RFID validation; DB one active card and card ownership; ARCH reader UID flow.

**Evidence:** `assignRfidCardAction` in `src/features/students/actions.ts` reads only student ID/name, while RFID module actions use `readHolder`/`rejectInactiveHolder` to check status. Both paths can retire a previous active card before a later replacement write fails. `rfidNumberField` in `src/features/shared/schema.ts` uppercases text but accepts arbitrary A–Z characters and multiple separator styles.

**Proceed:** reuse one assignment operation and one normalized UID contract across both admin screens and the device receiver. Validate holder/card eligibility and make replacement atomic. Check existing UID collisions before changing uniqueness behavior.

**Done when:** both screens accept/reject the same assignments, one physical UID resolves consistently, one active card remains enforced, and failure preserves the old valid assignment. No reader-enrollment screen is required.

### P04 — Implement the actual RFID time-in/time-out path (P1)

**Basis:** FR RFID and Time-In/Time-Out; ARCH Attendance Process; LATE v1 and Data Model Direction.

**Evidence:** `src/app/api/rfid/tap/` contains only a README. No API route handler or device-driven attendance writer was found. Existing Late badges, schedule controls, and backfill SQL do not implement live tap classification.

**Proceed:** implement the documented device receiver with server-side validation, card/student lookup, safe time-in/time-out recording, persisted first-tap classification, and the student/year/date/time/result response needed by the display. Authenticate the device as a technical consequence of preventing unauthorized attendance writes; keep privileged keys on the server.

**Done when:**

- First accepted tap creates time-in and leaves time-out empty; second distinct accepted tap fills time-out and retains the first status.
- With default schedules, morning 06:15:00 is Present and 06:15:01 is Late; afternoon 13:15:00 is Present and 13:15:01 is Late.
- No applicable active weekday schedule means Present. Out-of-pilot placement is not classified Late. Stored status is read consistently rather than recalculated by each screen.
- Invalid/ineligible cards do not create attendance. Repeated delivery of the same request does not accidentally become time-out or send duplicate arrival notifications.
- All dates/cutoffs use Asia/Manila. Define unresolved third-tap/day-boundary behavior in the requirements before implementing a new attendance rule.

Do not mandate a particular scan-log table name, queue system, or additional device administration page. Choose the smallest storage design that satisfies the required records and transaction correctness.

### P05 — Resolve absence and unify attendance totals (P0 decision, P1 implementation)

**Basis:** FR dashboard/report totals; ADMIN and STUDENT KPI requirements; LATE "Late counts as attended."

**Evidence:** `buildAdminDashboardData`, `buildTeacherDashboardData`, attendance panels, and `countPersonalAbsentDays` now count explicit stored Absent records. `buildReportsData` and `buildTeacherReportsData` instead derive absence from current roster size multiplied by dates with records, minus attended/Excused totals.

**Local reproduction using the actual aggregation functions:**

| Same input: two students, one Present row with time-in and time-out | Dashboard | Admin report |
| --- | --- | --- |
| Present | 1 | 1 |
| Absent | 0 | 1 |
| Tap/scan count | 2 | 1 |
| Untapped student's state | `NoRecord` | Included in derived absence |

The dashboard rate is 100% in that example because it excludes the untapped student. The docs require a rate but do not supply its denominator/finalization policy. Neither existing calculation should be treated as the approved school rule just because it is implemented.

**Proceed:** record a single definition of expected attendance, when absence becomes final, and the denominator. Apply it to dashboards, panels, histories, charts, and PDFs. Remove Excused from that decision. Keep no-tap display truthful while the policy is unresolved.

The existing attendance table requires both `rfid_card_id` and `time_in`, so a stored absence for a student who never tapped cannot be added honestly without resolving the representation. Choose between a derived presentation and compatible storage once the policy is defined. Do not invent a midnight tap, assign a fake card, or automatically schedule a nightly job.

**Done when:** identical students/dates yield identical totals across roles and exports; Late counts as attended; no records fabricate a tap. Include no-tap days, a day with zero taps anywhere, weekends, pre-class time, and historical/archived students in the agreed acceptance examples.

### P06 — Implement guardian SMS sending and persisted results (P1)

**Basis:** FR SMS; ARCH Time-In; OVERVIEW arrival notification; STUDENT SMS status.

**Evidence:** `sms_notifications` and student read/display services exist. `src/services/sms/` and `src/features/sms/` contain only READMEs; no sender was found.

**Proceed:** after successful arrival recording, retrieve the guardian contact, send the documented student/campus arrival message, and persist Pending/Sent/Failed plus the sent time. Validate the contact format required by the selected provider. Keep attendance recorded if sending fails, and avoid duplicate messages for a retried arrival transaction.

**Done when:** the student sees the actual notification status for the correct attendance record; provider success/failure maps truthfully; all three campuses use the correct message identity. Do not add guardian accounts, campaigns, manual resend screens, or a notification analytics module.

FR says SMS follows successful attendance recording broadly; ARCH explicitly places SMS under Time-In and omits it from Time-Out. Treat arrival notification as clearly required and resolve departure SMS before adding it.

### P07 — Finish Realtime behavior and the remaining time-zone inconsistencies (P1)

**Basis:** FR Real-Time Updates; LATE Rule 7.

**Evidence:** `LiveRefresh` exists and is mounted across the portal pages. Its timer resets on every event and subscription status is ignored. The publication migration lists attendance, RFID cards, SMS, and students; the schedules page subscribes to `class_schedules`, which that migration does not publish. Teacher management uses defaults that omit teacher/assignment changes.

`src/lib/school-time.ts` and current dashboard/query entry points already use Asia/Manila for today's date. However, report defaults/generated timestamps in `src/features/reports/panel.ts` and `formatTimestamp` in `src/lib/format.ts` still use host/local time.

**Proceed:** finish refresh behavior under continuous events/reconnection and align subscriptions with supported page data. Reuse the school-time helper where appropriate. Check deployed publications rather than assuming migration files have been applied.

**Done when:** accepted attendance and SMS changes appear automatically in all authorized role views; a continuous stream does not postpone refresh indefinitely; midnight Manila produces consistent dates and timestamps in reports and dashboards. No new connection-monitoring module is required.

### P08 — Make reports complete, consistent, and historically accurate (P1)

**Basis:** FR Report Requirements, ADMIN Reports, TEACHER Reports, and FR admin visibility of all attendance records.

**Evidence and narrow work:**

- **SMS report content:** admin report snapshots never read `sms_notifications`; report models have no SMS notification records. Add the required records within authorized reports. Do not automatically grant teachers guardian phone/message access.
- **RFID count/content:** admin `rfidScans` is `scoped.length`, counting daily attendance rows; dashboard tap totals also count time-out. Recent logs are described as taps but show one daily row per student. Make the metric and report agree with what was actually captured. The docs require RFID logs, not a particular event-storage architecture.
- **Historical card identity:** admin reports select card status by the student's current cards instead of the attendance record's card. Preserve the relationship needed to describe the recorded transaction accurately; do not present today's card state as a historical scan result.
- **PDF completeness:** both export buttons call `window.print()`. Print CSS exists at `src/app/globals.css:175`, but report tables render only their current page with `slice(...)`; admin recent logs are capped at 50 upstream. Printing cannot recover rows absent from the rendered document. Export the intended report scope independently of visible pagination and identify any deliberately limited recent-log section.
- **Archived records:** admin report/attendance reads start from active students and then scope attendance through that roster. Archiving can remove historical records from the displayed report despite their retention in SQL. Separate today's active roster from the students represented by a historical report.
- **Campus:** section report keys are `program|year|section`; campus is omitted, including from the admin report student snapshot. The same pilot section exists across supported campuses. Preserve campus identity so distinct classes do not silently merge.
- **Read completeness:** `fetchAllRows` stops at 25 pages and returns without a truncation signal; student history/SMS queries use a single response. Make required histories/totals complete or explicitly bounded, with stable paging. Do not claim the deployed response cap was measured here.

**Done when:** report totals match P05, required attendance/RFID/SMS content is available under the correct roles, historical records remain accessible to the admin, and a saved PDF contains the stated date scope regardless of which UI page is open. Preserve teacher assignment restrictions.

### P09 — Finish the explicit presentation gaps without adding screens (P2)

**Basis:** ADMIN Dashboard table; FR Teacher Students/attendance history.

The admin dashboard `StudentAttendanceRow` and table lack the documented Program column, even though other attendance screens have it. Add Program to that existing projection/table.

The teacher student dialog's "View attendance history" link passes a student search to the existing single-date attendance panel. Historical dates are accessible through its date filter, so history is **not entirely absent**. Verify that this route supports the documented task and make its wording/navigation accurately describe the existing behavior. A new student-history module is not automatically required.

**Done when:** documented identity fields are visible and an assigned student's past attendance can be inspected without weakening teacher access restrictions.

### P10 — Align pilot seed, schedule lookup, and backfill assumptions (P1)

**Basis:** LATE Scope, Data Model Direction, and Form Locks; DEV preservation/validation.

`supabase/seed.sql` still inserts a 1st Year `BSIT-1A` student/assignment, BSHM, and older example subjects, while current forms lock to the BSIT 2nd Year pilot and migration `202609060001` seeds eight canonical subjects. Align local demonstration fixtures with the current pilot; retain migration/history compatibility for real records.

Schedule migration `202609050001` seeds null-campus rows applying across campuses. The schema also permits campus-specific rows, so both can match. Neither the current v1 rule nor admin screen specification defines precedence. Resolve it before sharing lookup logic between ingestion and `supabase/backfill_late_status.sql`.

The backfill already exists and only changes matching Present rows to Late. It uses current student placement and current schedules; it is not proof of the schedule/placement that existed on the historical date. Do not run it automatically after every schedule edit or describe it as a complete historical recomputation.

**Done when:** a fresh pilot fixture matches the form restrictions; schedule lookup has one documented result; any authorized historical backfill has a reviewed affected-row list and preserves unrelated statuses/history. No non-pilot student deletion is needed.

### P11 — Complete and verify the documented physical device (P1 for the full project)

**Basis:** OVERVIEW hardware; ARCH Device Layer; FR successful/failed taps.

The inventory found no `.ino`, C++ firmware, PlatformIO configuration, or physical wiring artifact. This establishes a repository gap, not that the physical device does not exist.

Proceed with the specified ESP32, RC522, MIFARE Classic 1K card, TFT, green/red LEDs, and buzzer integration after the server contract is testable. Verify UID capture, Wi-Fi request, displayed name/year/date/time, successful recording feedback, and rejected-card feedback. Do not signal success for a request the server has not confirmed.

**Done when:** a real first and second tap produce the documented records, role dashboards update, arrival SMS status is stored, and LCD/LED/buzzer behavior matches the result. No biometric, GPS, mobile app, or other attendance mechanism is part of this scope.

## 6. Decisions the docs do not settle

These are gaps to resolve before implementing dependent behavior, not invitations to add features. Other work can proceed independently.

| Decision | Why it matters | Current boundary |
| --- | --- | --- |
| When does no tap become Absent, which days/students are expected, and what is the rate denominator? | Dashboard/report disagreement; no-tap storage requires a deliberate model. | Keep Absent as required; do not invent a cron, school calendar, or cutoff. |
| What happens on a third tap, rapid repeated physical tap, or cross-day departure? | FR defines first/second taps only; current table permits one row per student/day. | Keep first/second rule. Distinguish retransmission from a new physical tap. |
| Does time-out send SMS? | FR is broad; ARCH explicitly shows arrival SMS only. | Arrival is required. Departure messages need a clarified rule. |
| Which schedule wins when campus-specific and null-campus rows both match? | Current schema/backfill can match both. | Do not choose precedence implicitly in one screen or query. |
| Which roles receive SMS report details? | Generic report content includes SMS, but TEACHER does not specify guardian-message access. | Preserve owner/admin SMS policy until visibility is defined. |
| What should happen to existing Excused records, if any? | Removing a type/UI option does not resolve historical data. | Preserve evidence; do not silently convert or delete. |

## 7. Planning-document status after R01 and R02

This audit is the active scope checklist. The following status prevents removed
roadmaps or deferred suggestions from being treated as current release tasks:

| File | Current status |
| --- | --- |
| `ROADMAP-WEB-NOW.md` | Already absent when R02 began. Its catalog/matrix/cron/PDF-library mandates are not active. |
| `ROADMAP-HARDWARE-LATER.md` | Already absent when R02 began. P04/P06/P11 retain required receiver, SMS, and hardware completion without its extra access/tooling mandates. |
| `RFID-CODEBASE-TODO.md` | Already absent when R02 began. Historical W-number references do not authorize work. Use the current P01–P11 acceptance conditions instead. |
| [UI-UX-IMPROVEMENT-PLAN.md](UI-UX-IMPROVEMENT-PLAN.md) | Supporting review only; follows this audit and references current tasks. Optional proposals do not create release requirements. R03 recovery is DONE, with passing local checks and user-confirmed live operation. |
| Feature/service and tap-endpoint READMEs | R02 removed absence-job, audit/retry-tooling, immutable-event-subsystem, and server-side-PDF mandates. Required transaction, notification, reporting, and permission behavior remains explicit. |
| LATE planning sections | Required pilot completion is separate from deferred teacher schedules, timetables, overrides, and onboarding. The v1 rules remain unchanged; Excused stays excluded. |

R02 changes documentation only. It does not implement the required receiver/SMS
flow, finalize the absence policy, alter permissions, or complete R03–R05.

## 8. Recommended implementation order and stop condition

| Stage | Work | Exit condition |
| --- | --- | --- |
| 1. Lock scope | R01–R04; resolve the necessary policy decisions in section 6 | Current status contract and backlog exclude Excused/unsupported expansion; existing records have a preservation plan. |
| 2. Protect existing management | P01–P03, relevant P10 validation | Role restrictions and failed-save behavior are proven; registration uses one UID contract. |
| 3. Complete the core flow | P04, P06, P07, P10 lookup | A test request records valid time-in/out, persists Late/Present correctly, updates dashboards, and records SMS outcome. |
| 4. Make information agree | P05, P08, P09 | Attendance/scan totals agree; required reports and complete PDFs reflect the same records. |
| 5. Prove the full system | P11 and role-based acceptance checks | A physical card completes the documented device-to-web-to-SMS flow. |
| 6. Close the work | Optional R05; update the single active checklist | No unapproved feature was introduced; relevant checks pass; remaining deployment limitations are recorded. |

**Stop when the documented pilot works.** Do not continue into catalog administration pages, Excused, holiday management, per-subject attendance, new programs, or a visual redesign simply because the critical tasks are finished.

### Acceptance checklist

- [x] R02 unsupported tasks are removed from the active backlog; deferred ideas are explicitly outside this release. Required pilot work remains tracked under P01–P11.
- [ ] Active attendance decisions are Present, Late, and Absent; missing data is displayed honestly and never stored as a made-up tap/status.
- [x] Excused is absent from current feature controls, business calculations, and current-contract tests; legacy values are preserved through tested compatibility handling. The user confirmed executing the write-guard migration under R01.
- [ ] Existing admin/teacher/student menus and documented permissions remain intact.
- [ ] Create/edit/archive/assign actions preserve valid state on failure and enforce the pilot on server inputs.
- [ ] First/second RFID taps and Late boundary examples pass using Asia/Manila.
- [ ] All authorized dashboards update automatically after accepted attendance changes.
- [ ] Guardian arrival messages store truthful Pending/Sent/Failed results and correct student/campus identity.
- [ ] Dashboard, history, attendance panel, and report totals follow one documented rule.
- [ ] Admin reports include the required attendance, RFID, and SMS records; PDF output matches its stated scope.
- [ ] Archived history is retained and remains available through the appropriate admin report/read path.
- [ ] Device display/LED/buzzer behavior is verified with real accepted and rejected cards.
- [ ] No standalone extra feature was added to satisfy an old generated roadmap.

## 9. Original audit coverage and checks (before R01 implementation)

The review inventoried application routes, feature/service modules, shared components, configuration, migrations, seed/maintenance SQL, tests, and all nine RFID Markdown documents. Targeted reads and searches traced status handling, mutations, authorization, scheduling, data retrieval, Realtime, and report rendering. This is a whole-system scope audit, not a claim that every generic UI component received an exhaustive defect review.

Source inventory under `src`, `components`, `tests`, `supabase`, and `rfid-docs`: **255 TypeScript/TSX files, 4 JavaScript test/helper files, 10 SQL files, and 29 Markdown files**. Root plans/configuration were considered separately. Dependencies, generated `.next` output, and Obsidian workspace settings were excluded from business-scope analysis. Environment secrets were not read.

| Check | Result |
| --- | --- |
| `node --test tests/student-dashboard.test.mjs tests/role-dashboards.test.mjs tests/profile-lifecycle.test.mjs` | 35 passed, 0 failed. These include current Excused expectations and therefore do not prove the requested scope is correct. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Passed. |
| `node node_modules/eslint/bin/eslint.js .` | 0 errors, 1 warning: unused `children` in `src/components/ui/combobox.tsx:277`. |
| Actual aggregation-function probe | Confirmed the two-student dashboard/report absence and scan-count discrepancy described in P05. |
| Source search for Excused, API route handlers, SMS sender, and firmware | Confirmed status support across layers; no implemented tap handler/SMS sender/firmware found in the inspected repository. |
| Working-tree review | Existing application edits and `tests/role-dashboards.test.mjs` were present before this audit and were preserved. Only this report was created. |

No production build, hosted database/RLS test, migration deployment, browser PDF inspection, real SMS transmission, or physical-device test was performed for this report. A passing local check proves only the behavior covered by that check; deployment and complete requirements acceptance remain separate.

## 10. Instruction to use with future coding requests

> Use `RFID-DOCS-SCOPE-AUDIT.md` and the current requirements under `rfid-docs/rfid-docs` to constrain this change. Implement only the named task. Cite its requirement and acceptance condition before editing. Excused is excluded from the current feature scope. Keep the documented Late rule and admin schedules. Future improvements and generated roadmaps do not authorize new features. Preserve existing records and working role restrictions. If a school rule is missing, identify that specific decision and continue only the independent work; do not invent the rule or build a new module around it. Finish the relevant checks and stop when the task's acceptance conditions pass.
