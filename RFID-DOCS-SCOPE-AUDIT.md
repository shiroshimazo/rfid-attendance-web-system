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
| Admin reports | `src/features/reports/panel.ts`, `src/services/reports/snapshot.ts` | KEEP. P08 DONE: recorded totals, retained history, RFID/SMS records and complete pdfcn exports. User confirmed live testing passed; P05 policy remains separate. |
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
- [x] Excluded historical values from active attendance counts, rates, scan counters, and report session dates. Reports now count **explicit recorded absences**, matching current dashboards; this avoids converting legacy/missing rows into absences when removing Excused. P05 subsequently resolved and implemented teacher-confirmed subject-session attendance; user acceptance is recorded below. P08 now counts captured time-in/time-out fields consistently with the dashboard.
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

### P02 — Finish safe management writes and pilot validation (P1) — DONE

**Basis:** ADMIN management/assignments; LATE Scope and Form Locks; DEV validation.

**Evidence:**

- The original teacher action deleted assignments before a separate replacement insert, risking assignment loss.
- Original student/teacher edits wrote displayed emails before Auth acceptance, risking different displayed/login emails.
- Student/teacher actions originally trusted program IDs without checking that they identified BSIT.
- Blank teacher assignment year/section/campus originally became SQL nulls, which access helpers treat as wildcards.
- Original schedule saves split day updates, insertions, and retirement into separate requests and accepted days 0–6.

**Proceed:** preserve existing actions/forms, validate catalog identity and intended pilot dimensions on the server, and ensure failed related writes do not erase valid state. Keep SQL changes atomic where they form one operation; handle Auth API failure explicitly. Make schedule validation agree with the current pilot scope.

**Done when:** invalid program/assignment/day inputs are rejected; a failed replacement leaves the previous assignments/card/week intact; account email changes cannot silently diverge. No new CRUD screen or wildcard-permission feature is needed.

**Implementation completed on 2026-09-06:**

- [x] Student profile/lifecycle and teacher profile/assignment writes now use atomic database functions. A failed assignment replacement rolls back the old profile, account status, and assignments together.
- [x] Auth owns accepted emails and synchronizes account/profile fields in its transaction. Other profile details save first; rejected email changes return an explicit partial-save error. Network uncertainty asks for a reload. Existing email mismatches are preserved for review, not silently rewritten.
- [x] Failed new-account creation only cleans up a newly issued unused login after a definite database rejection and a successful privileged check for an absent profile. Ambiguous outcomes retain the account for inspection.
- [x] Shared server validation checks actual BSIT program identity and subject membership before account creation. RPCs repeat these checks. Teacher assignments require explicit pilot year, section, and campus; existing wildcard/non-pilot records are not automatically converted.
- [x] Schedule saves and status toggles use atomic functions with the same per-week transaction lock. Unique Monday–Friday days are enforced. Omitted days remain archived; existing all-campus schedules remain supported.
- [x] Local regression verification: **104 passed, 0 failed** across management SQL/action tests, profile lifecycle, and active-account access. Includes injected failures, Auth rejection/uncertainty, safe cleanup, preservation on migration/reapplication, and documented rollback/reapplication.
- [x] `npm run build` passed, including TypeScript checks. `npm run lint` passed with 0 errors and the existing unused `children` warning in `src/components/ui/combobox.tsx:277`. `git diff --check` passed.
- [x] User confirmed executing [202609100001_atomic_management_saves.sql](supabase/migrations/202609100001_atomic_management_saves.sql) in hosted Supabase on 2026-09-06, following the previously applied P01 migration.
- [x] User confirmed on 2026-09-06 that the requested student, teacher assignment, email, and schedule application checks all function correctly after migration execution. See the [P02 rollout instructions](supabase/migrations/README.md#p02-safe-management-saves-rollout). This is user-reported hosted verification; the assistant did not independently run the hosted forms or concurrent-session tests.

**Current status: DONE on 2026-09-06.** Local checks passed, and the user confirmed hosted migration execution and successful application verification. No hosted migration or account mutation was performed by the assistant. RFID replacement/UID behavior remains P03; this change preserves the existing card lifecycle and adds no screens or business features.

### P03 — Unify RFID registration and assignment correctness (P1) — DONE (software; temporary UIDs)

**Basis:** FR Manage RFID/RFID validation; DB one active card and card ownership; ARCH reader UID flow.

**Original evidence:** the student assignment action omitted holder status checks present in the RFID module. Both paths could retire an active card before a later replacement failed. The UID field uppercased text but accepted arbitrary A–Z characters and inconsistent separator styles.

**Proceed:** reuse one assignment operation and one normalized UID contract across both admin screens and the device receiver. Validate holder/card eligibility and make replacement atomic. Check existing UID collisions before changing uniqueness behavior.

**Done when:** both screens accept/reject the same assignments, one physical UID resolves consistently, one active card remains enforced, and failure preserves the old valid assignment. No reader-enrollment screen is required.

**Implementation completed on 2026-09-06:**

- [x] Both UID-entry actions share `src/features/rfid/write.ts` and the `save_rfid_card` RPC. Registration/reissue, explicit reassignment, and status activation use one transaction for old-card retirement and the final write. Repeated same-holder UID requests reuse the card ID.
- [x] Student profile and linked account must be active before activation through either screen. Both UID-entry screens reject another holder's UID; the existing explicit reassignment action allows movement only without attendance history. Existing card statuses and one-active-card/history constraints remain.
- [x] Shared TypeScript/SQL normalization accepts complete 4-, 7-, or 10-byte hexadecimal UIDs, preserves byte order and leading zeros, and normalizes case/separators. Existing valid stored variants resolve to the same identity; new writes are canonical. Both existing directory searches also recognize equivalent full UID formats. Form text now requests the reader UID instead of assuming a printed number is its UID.
- [x] Added a read-only UID inventory and a migration collision check before creating normalized uniqueness. Existing invalid/legacy cards, valid formatted cards, attendance/SMS history, account status, and student ownership are preserved. Invalid legacy UIDs can be retired but not newly activated; no automatic decimal conversion or collision cleanup occurs.
- [x] Used the user's temporary `00:00:00:11`, `00:00:00:22`, `00:00:00:33`, `00:00:00:44`, and `00:00:00:55` values in regression tests and documented manual registration. These normalize to `00000011` through `00000055`. No hosted fixtures or guessed student assignments were inserted.
- [x] Local tests: **188 passed, 0 failed**, including **30 P03 tests** covering the actual SQL/RLS and both actual server action modules, injected failures after retirement, role/holder restrictions, equivalent UID lookup, inventory collision detection, and preservation through migration/reapplication and documented rollback.
- [x] Production build and TypeScript checks passed. Full lint reported 0 errors and the existing unused `children` warning in `src/components/ui/combobox.tsx:277`; final focused lint passed without warnings. `git diff --check` passed.
- Inventory evidence: the standalone [verify_rfid_uid_inventory.sql](supabase/verify_rfid_uid_inventory.sql) output was not supplied. Successful migration execution includes its blocking normalization-collision check. Legacy invalid values are preserved; no claim is made that the hosted legacy inventory is empty.
- [x] User confirmed completing the migrations, including [202609110001_atomic_rfid_assignment.sql](supabase/migrations/202609110001_atomic_rfid_assignment.sql), on 2026-09-06. This migration includes a blocking collision check; the separate inventory output was not provided.
- [x] User confirmed successful assignment after the student-picker fix, then confirmed completing the requested equivalent-UID, active-card replacement, other-holder rejection, and inactive-student rejection checks on 2026-09-06. These are user-reported hosted results using temporary UIDs; see the [P03 rollout instructions](supabase/migrations/README.md#p03-uid-registration-and-assignment-rollout).

**P03 form fix on 2026-09-06:** the user reported that Register RFID Card could not
select a student. A local Chromium reproduction showed the Base UI dropdown
portaled outside the Radix modal and inheriting `pointer-events: none`. The
student picker now portals its dropdown into the enclosing dialog; the shared
combobox accepts an optional portal container. Modal focus protection remains
enabled. `node tests/student-picker.browser.mjs` passed actual registration and
reassignment form interactions with fixture students and mocked save boundaries:
mouse selection/submitted student ID, search by student ID/program, keyboard
selection, clear, Escape dismissal, scrolling at a 390px viewport, and background
focus containment. Production build and TypeScript passed; focused lint reported 0 errors and the
existing unused `children` warning in `src/components/ui/combobox.tsx:278`.
No database migration is required for this form fix. The user subsequently
confirmed successful assignment and completion of the requested P03 checks.

**Current status: DONE for software on 2026-09-06.** Local checks passed, and the user confirmed hosted migration execution, assignment, and completion of the requested P03 tests with authorized temporary UIDs. Hosted results are user-reported; automated SQL tests use PGlite, and local browser tests use fixture students and mocked saves. Multi-session concurrency and physical UID/reader confirmation were not verified. Physical confirmation remains a P11 integration check. P04 will reuse the shared UID contract; no attendance receiver, enrollment screen, or hardware feature was added here.

### P04 — Implement the actual RFID time-in/time-out path (P1) — DONE (software; temporary UIDs)

**Implementation and user-reported app acceptance complete on 2026-09-09.** The user resolved the school rules: reject the third tap; start a new Asia/Manila day without filling yesterday's missing times; prefer the active all-campus schedule over a matching campus-specific row. The user also authorized teacher-confirmed subject Late. These decisions are recorded in FR and LATE.

- [x] Authenticated `POST /api/rfid/tap` validates a UUID request ID and shared normalized UID. It accepts no device-supplied student, date/time or status. The separate device secret is server-configured; Supabase service-role credentials remain on the server.
- [x] Migration `202609140001_rfid_tap_processing.sql` adds a service-role-only atomic writer and private RLS-protected retry receipts. It records first Time In, second Time Out, rejects a third tap and retains the first Present/Late result. Successful retries, including across midnight, return the stored response without recording another tap.
- [x] Eligible active cards, students and linked accounts are required. Pilot Late cutoffs use Asia/Manila and active `class_schedules`, prioritizing all-campus rows. Unscheduled/out-of-pilot arrivals remain Present. Existing daily records, RFID associations and subject confirmations are preserved; conflicting legacy records are rejected for review.
- [x] One Pending guardian arrival notification is saved atomically with Time In. Departure and retry create no additional notification. **Actual SMS delivery and Sent/Failed handling remain P06; Pending is not Sent.**
- [x] Existing scheduled subject rosters display **Not confirmed yet** until each assigned teacher confirms Present, Late or Absent. Campus arrival never writes or resets a subject confirmation. `202609140002_teacher_confirmed_late.sql` adds the explicit teacher Late choice, preserving authorization, history and stale-edit checks. Shared summaries and PDF rates count Present + Late as attended.
- [x] Local verification: **257 tests passed, 0 failed**, targeted ESLint, TypeScript and production build passed. Chromium subject flow passed including Late confirmation. SQL checks cover cutoff seconds, retries, third tap, Manila midnight, all-campus priority, rejected cards/accounts, atomic rollback, permissions and migration reapplication. The read-only installer probe returns seven PASS locally.
- [x] User reported seven PASS installation checks, configured device authentication and supplied successful tap responses with temporary UID 00:00:00:11. Evidence includes replay of attendance #4, next-day Time In for #5, Time Out retaining Late, and a third request returning HTTP 409. The 409 output did not expose the response code/body. No hosted writes or SMS sends were performed by the assistant.
- [x] User confirmed completion of the remaining app verification: saved times/status, one Pending arrival notification, unconfirmed subject rosters and independent teacher decisions reflected in student history. This is user-reported acceptance, not an independent inspection of hosted data. Database tests use PGlite; simultaneous independent PostgreSQL connections and physical reader behavior remain unverified. Hardware remains P11; actual SMS delivery remains P06.

Optional rollback scripts disable the new writers while retaining all data. Do not run rollback scripts during setup.

**Basis:** FR RFID and Time-In/Time-Out; ARCH Attendance Process; LATE v1 and Data Model Direction.

**Original audit evidence:** the tap folder initially contained only a README. The implementation above now supplies the receiver; hosted deployment and physical device operation still require verification.

**Proceed:** implement the documented device receiver with server-side validation, card/student lookup, safe time-in/time-out recording, persisted first-tap classification, and the student/year/date/time/result response needed by the display. Authenticate the device as a technical consequence of preventing unauthorized attendance writes; keep privileged keys on the server.

**Done when:**

- First accepted tap creates time-in and leaves time-out empty; second distinct accepted tap fills time-out and retains the first status.
- With default schedules, morning 06:15:00 is Present and 06:15:01 is Late; afternoon 13:15:00 is Present and 13:15:01 is Late.
- No applicable active weekday schedule means Present. Out-of-pilot placement is not classified Late. Stored status is read consistently rather than recalculated by each screen.
- Invalid/ineligible cards do not create attendance. Repeated delivery of the same request does not accidentally become time-out or send duplicate arrival notifications.
- All dates/cutoffs use Asia/Manila. The confirmed third-tap rejection and new-calendar-day rules above apply; previous missing times remain blank.

Do not mandate a particular scan-log table name, queue system, or additional device administration page. Choose the smallest storage design that satisfies the required records and transaction correctness.

### P05 — Resolve absence and unify attendance totals (P0 decision, P1 implementation) - DONE

**Schedule time editing — implementation DONE; hosted rollout pending:** active schedule rows now offer Edit alongside Retire. The dialog edits only start/end times and saves explicitly with Save changes. Admin-only RPC `edit_subject_schedule_time` rejects invalid times, retired rows, stale edits and overlapping section slots; it preserves attendance snapshots and schedule identity. Apply `supabase/migrations/202609130002_edit_subject_schedule_time.sql` after the overlap guard migration. Local verification: 62 focused database/action/access/lifecycle tests, Chromium edit/save flow and targeted ESLint passed. Hosted acceptance: edit a time, confirm persistence after refresh, and verify an overlapping edit is rejected.

**Subject schedule table — DONE:** replaced schedule cards with the requested Name (teacher), Subject Code (stored catalog code), Section, Campus, Day, Time (PHT), Status and Actions columns. The table scrolls horizontally on narrow screens, shows an empty state and preserves the existing create/retire actions. Targeted ESLint and the existing subject-attendance Chromium flow passed.

**Schedule overlap follow-up — implementation DONE; hosted installation/testing pending:** the user requires occupied section times to be rejected. Active subject schedules now reject exact, partial and enclosing overlaps within the same program/year/section/campus/weekday, across subjects and teachers. Back-to-back sessions are allowed. Database migration `supabase/migrations/202609130001_prevent_subject_schedule_overlap.sql` enforces the rule, including concurrent writes; the save action displays a clear occupied-time error.

- [x] Local verification: 61 tests passed across subject attendance, actions, account access and profile lifecycle; targeted ESLint passed. Checks cover overlap boundaries, campus/day separation, conflicting updates, retirement, migration reapplication and preservation of existing records.
- [ ] Hosted rollout: run read-only `supabase/check_subject_schedule_overlaps.sql`, retire incorrect conflicting schedules in Admin > Schedules, then apply the new overlap migration and enter correct times. Existing conflicts stop installation with schedule IDs; no records or attendance history are deleted. Verify a conflicting save is rejected and a back-to-back save succeeds.

**Basis:** FR dashboard/report totals; ADMIN and STUDENT KPI requirements; LATE "Late counts as attended."

**User-confirmed school rule:** the teacher checks the students in their class before teaching. A student becomes Absent only when the teacher confirms that the student is not in that class. No RFID tap by itself is not an absence.

| Situation | Required behavior |
| --- | --- |
| Teacher confirms student is not in class | Record teacher-confirmed Absent; do not fabricate RFID times or a card. |
| Teacher confirms student is in class but has no RFID card | Record teacher-confirmed presence. Keep time-in/time-out empty and RFID scan count zero. |
| No RFID tap and teacher has not confirmed attendance | Keep the state unconfirmed; do not automatically mark Absent. |
| Existing RFID attendance | Preserve recorded card identity, time-in/time-out and applicable Present/Late rules. |

**Decision status:** the user confirmed both the absence trigger (teacher confirmation) and the attendance unit (each subject's scheduled session). A student can be Present in one subject and Absent in another on the same day. Implementation and user acceptance are complete. The user reported six PASS installation checks and subsequently confirmed completion of the requested functional testing. Confirmation must stay within the teacher's authorized classes; this does not authorize unrelated teacher writes or automatic absence jobs.

**Implemented storage:** additive migration `supabase/migrations/202609120001_subject_attendance.sql` creates `subject_schedules` and `subject_attendance`. Existing daily `attendance_records`, RFID cards, SMS and profiles are not rewritten or deleted. Subject confirmations store teacher/class/date and subject/placement snapshots with a confirmation timestamp; they have no RFID card or tap-time fields. Scheduled start/end times are explicitly labeled, never treated as physical time-in/time-out.

**Confirmed subject/session boundary:** store a separate attendance outcome for each student and scheduled subject session. Attendance in one subject does not mark the student present in a later subject. Missing a later subject becomes Absent only when that subject's teacher confirms it; the second subject is not automatically marked Absent from missing RFID data. One session's confirmation must not overwrite another session's outcome.

**Completed implementation:**

- [x] Admin Schedules has a Subject Session Schedules section: choose an existing active teacher/subject/class assignment and enter the real weekday/start/end. No subject timetable is invented or seeded. Retire and replace schedule rows without deleting confirmations.
- [x] Teacher Attendance has a date and scheduled-subject selector, the authorized roster, unconfirmed count, student search, and per-student Present/Late/Absent controls (Late added by the P04 school decision). Corrections affect only that session. Same-result retries are idempotent; stale corrections fail with a refresh message.
- [x] SQL checks the active account/teacher, actual subject assignment, student class/campus, scheduled weekday and non-future date. Direct authenticated table writes are denied. A teacher sharing a roster cannot confirm/read another teacher's subject. Student reads are personal; admins retain archived history. Admins do not impersonate teacher confirmations.
- [x] Shared subject totals and history appear in existing dashboards, attendance panels, student history and Admin/Teacher Reports. PDF exports include all visible subject confirmations for the date range. Rate = confirmed (Present + Late) / (Present + Late + Absent) student-sessions after the school-approved Late follow-up. No confirmations produce no rate; unconfirmed sessions are not inferred as absent.
- [x] Existing daily RFID counts/charts/history are labeled separately. Daily Present/Late/Absent evidence remains unchanged, and daily Late does not establish presence in every subject. A cardless subject confirmation produces zero new RFID scans, no tap times and no arrival SMS.
- [x] Subject/placement/teacher labels are stored at confirmation time. Retiring schedules, replacing assignments or archiving students does not delete confirmations. Current teacher assignment restrictions still govern teacher reads.
- [x] Subject tables join the existing Realtime publication/subscriptions and successful writes revalidate the affected existing pages. P07's broader refresh reliability work remains separate.

**Local verification:**

- Full regression suite: `node --test tests/*.test.mjs` **227/227 PASS** before adding the final installation-probe test. The expanded subject SQL suite then passed **16/16**, including that probe (228 tests now present overall).
- Actual migrations/RLS in isolated PostgreSQL: cardless Present in Subject A and Absent in Subject B; no inferred absence; wrong teacher/campus/student, disabled access, invalid weekday/future dates and retired statuses rejected; stale corrections, idempotent retries, preserved archived history, reapplication and non-destructive rollback verified.
- Six action/model/PDF tests passed: role checks before writes, no caller-supplied teacher or fabricated taps, failed writes do not claim success, separate subject results and a 50% two-session rate render in the PDF while RFID scans stay zero.
- `node tests/subject-attendance.browser.mjs`: **PASS** in Chromium for selecting subjects, cardless presence, second-subject absence, retained independent results, failed correction, schedule creation and retirement. Uses local fixtures, not hosted accounts.
- `pnpm.cmd build`: **PASS**, including TypeScript. `pnpm.cmd lint`: **0 errors**, one pre-existing unused-children warning in `src/components/ui/combobox.tsx`.

**User-reported installation and functional acceptance - DONE:** the user reported all six installation checks PASS, then confirmed "its done" after being asked to test subject schedules, cardless Present in Subject A, teacher-confirmed Absent in Subject B, student history/PDF results, and unchanged RFID scans/times. This records the user's acceptance; it is not an independent inspection of hosted data.

**User-approved edit navigation - implemented:** Edit Student and Edit Teacher allow direct navigation through the step buttons in any order, including 2/3/4/1, retaining unsaved values. Create mode keeps the guided order. Step navigation is disabled while saving; final save still validates all fields and returns to the first invalid step. Chromium verified both edit flows, retained input, invalid-save navigation, create-mode restrictions and the existing select/layout fixes. Production build and targeted ESLint passed. No database migration is needed.

**Explicit-save fix - locally verified:** Student and Teacher wizard Next and Save now have separate button identities. Save is an explicit button action; implicit form submissions and Enter in fields cannot save. Existing step-validation behavior is retained. Chromium verified both edit forms advance through the last two steps with zero save calls, ignore implicit submission, then save exactly once on Save changes. Final-save schema validation remains enforced. No SQL migration is needed.

**Profile form follow-up - fixed locally:** removed changing custom `SelectValue` children in student/teacher profile selectors to prevent React portal-container conflicts when selecting an initially blank value. Course/Subject now stays within its assignment column, truncates long selected text, and keeps the full label in the dropdown. Assignment fields align at the top. Chromium in React development mode passed teacher civil-status/gender and student gender transitions with no console errors, plus layout checks at 1200/768/390px. Production build and targeted ESLint passed. No database change is required for these form fixes.

**Rollout and acceptance completed (user-reported):**

- [x] Subject-attendance migration applied; six installation checks returned PASS.
- [x] Requested functional testing completed, including separate subject results and cardless attendance without fabricated RFID evidence.
- [x] P05 marked DONE following the user's confirmation. P04 software and user-reported app acceptance are complete; P06 is the next sender implementation. Physical hardware verification remains P11.

`supabase/rollback_subject_attendance.sql` is optional rollback only: it disables write RPC access without deleting any data. It is **not** a setup step. Full implementation/rollout notes: `src/features/subject-attendance/README.md`.

### P06 — Implement guardian SMS sending and persisted results (P1)

**Implementation complete; configuration and live acceptance pending.** PhilSMS was selected by the user. The tap route invokes the sender after committed Time In, including eligible retries. Migration `202609150001_philsms_arrival_delivery.sql` adds service-role-only claim/completion functions and tracking fields while preserving every original SMS/attendance field.

- [x] Normalize single Philippine mobile numbers to 639 format; preserve the captured student/campus message; send through the documented Bearer API with plain/Unicode types. Secrets remain server-only and endpoint URLs are restricted to the two PhilSMS hosts described in the setup guide.
- [x] One durable send attempt per new arrival. No sends for Time Out, third taps, historical messages, duplicate SMS rows or previously claimed attempts. Unclaimed arrival retries are limited to ten minutes; there is no backlog sender.
- [x] API acceptance becomes Sent with an acceptance timestamp; explicit rejection/invalid recipient becomes Failed. Uncertain outcomes remain Pending for provider-log reconciliation. Claims survive completion-save failures to prevent duplicate sends. SMS failure never rolls back attendance. Sent does not prove handset delivery; automatic delivery-receipt reconciliation is not implemented.
- [x] Configuration and testing guide: [PHILSMS-SETUP.md](PHILSMS-SETUP.md). Read-only installer: `supabase/verify_philsms_delivery.sql` (five checks). No real SMS was sent and no account settings/secrets were changed by the assistant.
- [x] Verification: all 268 automated tests passed; targeted ESLint and production build passed. Tests cover request formats, invalid contacts, provider acceptance/rejection/uncertainty, no send when disabled/already claimed, duplicate protection, historical field preservation, rollback and RPC permissions. Provider calls are mocked; actual network delivery and simultaneous independent PostgreSQL sessions still require live verification.
- [ ] Live acceptance: configure sender/token/credits and confirm five PASS checks; verify controlled Smart/Globe/DITO recipients, correct campus/student identity, status persistence, no duplicate on replay and attendance preservation on rejection. P06 is not fully DONE until these pass.

**Basis:** FR SMS; ARCH Time-In; OVERVIEW arrival notification; STUDENT SMS status.

**Original evidence:** P04 inserted Pending arrival records, but no provider sender existed. The implementation above now supplies PhilSMS sending for new arrivals; existing student and report displays remain in use.

**Proceed:** after successful arrival recording, retrieve the guardian contact, send the documented student/campus arrival message, and persist Pending/Sent/Failed plus the sent time. Validate the contact format required by the selected provider. Keep attendance recorded if sending fails, and avoid duplicate messages for a retried arrival transaction.

**Done when:** the student sees the actual notification status for the correct attendance record; provider success/failure maps truthfully; all three campuses use the correct message identity. Do not add guardian accounts, campaigns, manual resend screens, or a notification analytics module.

FR says SMS follows successful attendance recording broadly; ARCH explicitly places SMS under Time-In and omits it from Time-Out. Treat arrival notification as clearly required and resolve departure SMS before adding it.

### P07 — Finish Realtime behavior and the remaining time-zone inconsistencies (P1)

**Regane schedule placement correction prepared; SQL execution pending:** user confirmed all active BSIT 2nd Year CCS1201 schedules for Regane Macahibag belong to 21003, MV Campus, retaining days/times. `supabase/correct_regane_subject_schedules.sql` requires the matching active teaching assignment, checks unique teacher identity and the overlap guard, backs up changed placement, and updates only these active schedules in one transaction. Existing confirmation snapshots remain intact. Optional `supabase/rollback_regane_subject_schedules.sql` restores backed-up placement subject to overlap validation. All 22 subject-attendance tests passed, including correction reapplication, rollback and rejection without partial changes. This corrects stored schedule data; it does not introduce automatic reassignment of other teachers' schedules when management assignments change.

**Implemented; hosted publication and user acceptance pending.** The shared refresh timer now batches events without restarting its deadline. Successful subscription/reconnection, browser online and tab return trigger refresh. A visible-page 30-second check recovers disconnected views and detects Manila date rollover. Cleanup cancels timers/listeners/channels, and table-list identity no longer causes repeated subscriptions on refresh.

- [x] Added teacher, assignment, class schedule and academic catalog dependencies to existing live page subscriptions, including Admin Schedules. Additive migration `202609160001_complete_realtime_publication.sql` publishes the required eleven tables without changing RLS or data.
- [x] Shared `formatTimestamp` explicitly uses Asia/Manila. Existing date-only and local tap-time rendering remains unchanged.
- [x] Focused tests passed for continuous events, initial/reconnection refresh, online/tab return, disconnected recovery, date rollover, cleanup, timestamp boundaries and migration reapplication. Read-only publication/RLS probe returns eleven PASS locally. Targeted ESLint and TypeScript checks passed.
- [x] User reported all eleven `supabase/verify_realtime.sql` installation checks PASS on 2026-09-10 after the migration instructions. This records user-reported installation verification.
- [ ] Perform authorized-role live updates and reconnect checks in [P07-REALTIME-SETUP.md](P07-REALTIME-SETUP.md). Hosted subscription health has not been independently inspected. No new screens or attendance rules were added.

**Basis:** FR Real-Time Updates; LATE Rule 7.

**Evidence:** `LiveRefresh` exists and is mounted across the portal pages. Its timer resets on every event and subscription status is ignored. The publication migration lists attendance, RFID cards, SMS, and students; the schedules page subscribes to `class_schedules`, which that migration does not publish. Teacher management uses defaults that omit teacher/assignment changes.

`src/lib/school-time.ts` and current dashboard/query entry points already use Asia/Manila for today's date. P08 now also uses Asia/Manila for report defaults and generated/SMS timestamps. The shared `formatTimestamp` in `src/lib/format.ts` still uses host/local time outside those reports.

**Proceed:** finish refresh behavior under continuous events/reconnection and align subscriptions with supported page data. Reuse the school-time helper where appropriate. Check deployed publications rather than assuming migration files have been applied.

**Done when:** accepted attendance and SMS changes appear automatically in all authorized role views; a continuous stream does not postpone refresh indefinitely; midnight Manila produces consistent dates and timestamps in reports and dashboards. No new connection-monitoring module is required.

### P08 - Make reports complete, consistent, and historically accurate (P1) - DONE

**Basis:** FR Report Requirements, ADMIN Reports, TEACHER Reports, and FR admin visibility of all attendance records. The user explicitly selected [pdfcn](https://www.pdfcn.dev/) for PDF output.

**Implementation completed and locally verified: 2026-09-08. User acceptance: DONE.** The user confirmed testing was completed after being asked to test PDF exports from both Admin and Teacher Reports. Live acceptance is recorded from that confirmation, not an independent inspection of the hosted results. P05 has since resolved the policy as separate teacher-confirmed subject sessions and extended these PDFs accordingly. That additive rollout and live acceptance are tracked under P05; no automatic absence cutoff or job was introduced.

- [x] **Real PDF downloads:** both existing report buttons download a server-generated PDF through `/api/reports/pdf`, using a local adaptation of pdfcn's Forme DataTable and `@formepdf/react` / `@formepdf/core`. Upstream attribution/license and adaptations are documented in `src/components/pdf/README.md`. Rendering stays on the application server.
- [x] **Complete selected range:** PDF generation fetches the selected date range independently of UI pagination. It includes the summary, every section/campus group, every attendance/RFID record, and admin SMS records. UI attendance and SMS previews explicitly disclose their 50-record limit and full record count. Buttons show progress and report download failures.
- [x] **Recorded totals:** admin/teacher reports share aggregation. Present includes Late; Absent counts only stored Absent rows. Rates use attended / (attended + recorded absent). RFID scan totals count stored time-in plus time-out fields, matching the current dashboard convention. Historical status values remain visible but do not enter current totals. A scan count is not claimed to represent every physical device event.
- [x] **Historical records and RFID identity:** admin reports load retained student profiles, including inactive/archived students with records in range. Current active-roster totals are separate from students represented in history. Logs resolve the attendance record's `rfid_card_id`; replacement cards cannot overwrite old report identity. Current card status is explicitly labeled as its state now.
- [x] **Campus:** section keys include campus, and recorded attendance campus survives a subsequent profile transfer. Program/year/section and profile details are labeled as current information because historical placement snapshots are not stored. Section student counts can overlap after a transfer; the overall student count is distinct.
- [x] **SMS:** the admin report/export includes stored recipient, message, Pending/Sent/Failed status and timestamps, filtered by the linked attendance date. This includes later retries for that attendance range. Stored Sent is not presented as proof of handset delivery. This does not implement P06 sending.
- [x] **Role boundaries:** PDF authorization requires an active admin or teacher account; the role comes from the authenticated account, not a query parameter. Teachers retain current active assignment/active-student restrictions and RLS, and do not query or export SMS/guardian details. No service-role bypass or permission migration was added. Download responses are private/no-store.
- [x] **Read completeness:** pagination advances by the actual returned count until an empty page, supporting deployed response caps below 1,000. The former silent 25-page truncation is removed. A 1,000-page safety limit throws a visible failure instead of claiming a partial result is complete. Report and student-history/SMS queries have stable ID tie-breakers; student dashboard history/cards are also paged. The live server cap has not been measured here.
- [x] **School time:** report date defaults and generated/SMS timestamps use Asia/Manila (PHT); stored attendance clock times remain school-local.

**Verification:**

- `node --test tests/*.test.mjs`: **206/206 PASS**, including 18 new report/authorization/PDF tests and the updated time-in/time-out expectation in the existing attendance regression.
- Real Forme PDF rendering: 125 attendance records retained beyond the 50-row preview, repeated column headers, old card identity, archived rows, and a long SMS message across pages. Checked rendered text completeness, physical-page bounds, empty states, and absence of renderer warnings. Teacher PDF excludes guardian details.
- Paging fixture: **26,050 rows** with a simulated **37-row server cap**; errors and safety-limit exhaustion never return partial success.
- `node tests/report-export.browser.mjs`: **PASS** in Chromium for download bytes/filename, selected dates, pending state, retry, and error/non-PDF responses. Uses loopback fixtures; does not contact Supabase.
- `pnpm.cmd build`: **PASS**, including TypeScript and the new PDF route. `pnpm.cmd lint`: **0 errors**, one existing unused-`children` warning in `src/components/ui/combobox.tsx`.

**Live acceptance - user confirmed testing completed:**

- [x] Admin and Teacher report export acceptance recorded from the user's "done testing" confirmation.
- [x] No export error or mismatch was reported with that confirmation.

P08 is complete for the recorded-attendance contract. P05's subject-attendance extension is complete, with installation and functional testing confirmed by the user; P06 SMS sending and physical RFID verification remain separate tasks. No new SQL migration was required for P08.

### P09 — Finish the explicit presentation gaps without adding screens (P2)

**DONE 2026-09-11 — implementation checked locally; app verification confirmed by the user.**

- [x] Admin dashboard attendance projection and table now include the student's actual Program code, with `Unassigned` when unavailable. The column remains visible on small screens.
- [x] Teacher student dialog now labels the existing link “View daily RFID history” and explains selecting a past date. It retains the student-ID search; subject confirmations remain separate.
- [x] Verified selected-date/student filtering and existing teacher assignment access restrictions. All 40 focused attendance/dashboard/account-access tests, TypeScript and targeted lint passed. No schema, permission or attendance-rule changes.
- [x] User confirmed app verification on 2026-09-11: Program in Admin > Dashboard and the teacher student-history flow with a past date. Hosted results are user-reported.

**Basis:** ADMIN Dashboard table; FR Teacher Students/attendance history.

Original gap: the admin dashboard `StudentAttendanceRow` and table lacked the documented Program column. This is now included in the existing projection/table.

The teacher student dialog's "View attendance history" link passes a student search to the existing single-date attendance panel. Historical dates are accessible through its date filter, so history is **not entirely absent**. Verify that this route supports the documented task and make its wording/navigation accurately describe the existing behavior. A new student-history module is not automatically required.

**Done when:** documented identity fields are visible and an assigned student's past attendance can be inspected without weakening teacher access restrictions.

### P10 — Align pilot seed, schedule lookup, and backfill assumptions (P1) — DONE

**Basis:** LATE Scope, Data Model Direction, and Form Locks; DEV preservation/validation.

Completed 2026-09-11: `supabase/seed.sql` now uses BSIT 2nd Year, section 21001, Main Campus, canonical CCS2105 and temporary UID 00000011. It reuses the migrations' eight-subject catalog instead of adding BSHM or obsolete subjects. Existing rows are not overwritten. The seed no longer invents attendance or successful SMS delivery; explicit tap tests create that evidence. This is a local-development fixture, not a hosted cleanup script.

Schedule priority was already resolved in P04 and the Late Attendance Ruling: active all-campus rows take priority; campus-specific rows are fallback. The unchanged tap handler and updated historical candidate report follow that priority, pilot bounds and strictly-after cutoff. No matching schedule means no inferred Late.

`supabase/backfill_late_status.sql` is now entirely read-only. It lists candidate Present records with original status/update timestamp, recorded campus, current placement, selected schedule and proposed cutoff. Current placement/rules are not historical proof. No historical update has been requested or executed; any later correction requires a reviewed affected-row list, before-images and an explicit update scoped to those records. Never run automatic reclassification after schedule edits.

Validation: all 22 RFID/P10 database tests passed, including actual business-seed execution/reapplication, preservation of edited rows and RFID/SMS history, schedule priority/fallback, exact cutoff, out-of-pilot exclusion and read-only candidate report. Supabase Auth password hashing and a full local Supabase reset were not exercised. No new migration or hosted SQL execution is required. See [P10-PILOT-DATA.md](P10-PILOT-DATA.md).

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
| Subject-session attendance and teacher confirmation | RESOLVED by the user: each scheduled subject session has its own result; existing daily RFID storage requires compatible implementation. | Present in one subject and teacher-confirmed Absent in another are separate outcomes. No-card presence has empty tap times and zero scans; no automatic absence cutoff. |
| Third tap and cross-day departure | RESOLVED by user for P04: reject third tap; new day starts new Time In and retains missing previous times. | Same request ID is a retry; a distinct physical tap uses a new ID. Reader card-removal handling remains P11. |
| Does time-out send SMS? | FR is broad; ARCH explicitly shows arrival SMS only. | Arrival is required. Departure messages need a clarified rule. |
| Campus-specific versus all-campus schedule | RESOLVED by user: active all-campus row wins for new P04 taps; specific row is fallback. | Historical backfill remains a separate P10 review; no history is recomputed automatically. |
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
- [x] Admin reports include the required attendance, RFID, and SMS records; PDF output matches its stated scope in local P08 tests. User confirmed live export testing completed under P08.
- [x] Archived history is retained and available through the admin report/export path in local P08 tests. User acceptance is recorded under P08.
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

### Profile review summary contact clarification - DONE

Student Review Summary now shows separate Student contact and Guardian contact values from the unsaved form. Previously the ambiguous Contact row showed only the guardian number. Both student and teacher summaries already subscribe to form changes. Chromium verification confirms edited names and phone numbers appear before saving, with no automatic saves during step navigation. No database migration required.

Regane correction clarification: user confirmed MV Campus as the intended target. The previous Main Campus script failed its assignment precondition and made no schedule changes. Correction and optional rollback now target 21003 / MV Campus; execution remains pending.

### Automatic assignment-to-schedule updates (user requested)

- [x] Regane's correction to 21003 / MV Campus confirmed working by the user; supersedes earlier execution-pending notes.
- [x] Preserve assignment IDs in the edit form and atomic save; update linked active schedule subject/placement on Save changes. Reject overlaps atomically, preserve weekday/time and confirmation snapshots, and archive schedules when their assignment is removed.
- [x] Add exact-match backfill and read-only verification; no guessed mapping of unmatched schedules.
- [x] Apply `202609170001_link_assignment_schedules.sql`, run the verification and confirm automatic changes in the hosted app. User reported completion on 2026-09-10. See [ASSIGNMENT-SCHEDULE-SYNC.md](ASSIGNMENT-SCHEDULE-SYNC.md).
- Validation: all 276 automated tests PASS; TypeScript and targeted teacher form/schema/action lint PASS. Hosted completion is user-reported, not independently inspected.

### Student Subject Attendance UI � wireframe 1a

Implemented 2026-09-11 from the user's selected 1a layout in `Subject Attendance Wireframes.html`.

- [x] Student > My Attendance uses summary cards, search, inclusive date range, subject/result dropdowns, additional campus/teacher filters, removable filter chips, sortable columns and ten-row pagination.
- [x] Summary totals reflect filtered confirmations; empty results never imply absence. Historical placement stays as recorded. Student access remains enforced by the existing authenticated query/RLS. Dashboard summary and other roles retain their existing views.
- [x] Verification: 28 focused model/database tests, TypeScript, targeted lint and Chromium fixture checks passed. Browser checks cover search, result/campus filters, clearing, sorting, pagination, popovers, empty states and mobile page overflow. Desktop/mobile light and mobile dark screenshots reviewed; a text-encoding issue was corrected.
- [ ] User verification in the live Student > My Attendance page. No migration required.

UI review scope: new student history component only; React/Next.js, existing Tailwind/shadcn tokens. Typography: tabular totals, readable secondary metadata, existing fonts. Surfaces: summary cards, structural table border, stacked mobile controls and horizontal table scrolling. Icons: existing Lucide icons with labels. Animation: no custom animation added; inherited popovers used. Performance: client filtering of the existing authorized rows; no additional fetches or dependencies.

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | Student subject history | Dense summary sentence and unfilterable table | Four summary cards, filter toolbar and sorting | Makes specific subject/date results easier to find |
| MEDIUM | New history component source | Misencoded punctuation found in first screenshot | UTF-8 source verified in rerender | Restores readable labels and separators |

Considered but rejected: sketch fonts would conflict with the app's typography; an Unconfirmed filter would imply rows the confirmation-only dataset does not contain; export/bulk actions are outside selected layout 1a. Verdict: approve local implementation; live-account visual check and exhaustive keyboard/screen-reader verification remain unverified.
