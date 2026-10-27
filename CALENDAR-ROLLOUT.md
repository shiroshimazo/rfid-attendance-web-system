# Calendar manual rollout handoff

The operator will upload/deploy manually, as requested on 2026-10-27. This document
does not record a hosted release. Calendar Task 30 stays unchecked until the
operator records the target, migration results, deployed version, and acceptance
evidence. Task 17 physical-reader testing remains deferred by request.

Local release checks on 2026-10-27: all 594 tests pass, TypeScript and production
build pass, and global ESLint passes with zero errors and one existing unused
`children` warning in `src/components/ui/combobox.tsx`. The earlier account-access
fixture failures and `fix-email.js` import lint error are resolved. Account checks
cover both the pre-email schema and current verified-session policies, including
rollback of temporary verification rows. Hosted checks below remain unperformed.

## Release record

Fill these in for the actual release; local `.env` settings do not select a target.

- Supabase project and branch/environment: pending operator selection.
- Vercel project and preview/production environment: pending operator selection.
- App HTTPS origin, matching `NEXT_PUBLIC_APP_URL`: pending.
- Source revision, release time, and operator: pending.
- Previous app deployment/version and database backup/export location: pending.
- Migration inventory and verification output: pending.
- Pilot title, dates, campus/audience, recipient preview/count, and approved real
  recipient list: pending separate explicit approval.

## 1. Prepare the target

1. Confirm that the app and database belong to the intended environment. Retain
   the previous app version and the target's normal database backup/recovery path.
2. Compare the target's migration history and objects with
   [the migration guide](supabase/migrations/README.md). The earlier
   [preview record](supabase/SCHOOL-CALENDAR-PREVIEW-VERIFICATION.md) covers only
   the original seven calendar migrations, with 48/48 checks at that time. The
   preview project was not identified in this session and had no migration-history
   schema. Its result does not prove the state of another target or today's script.
3. Apply only missing migrations, in filename order. A fresh target requires all
   earlier prerequisites through `202609270001_enrollment_teacher_names.sql`, then
   all nine calendar migrations. A target with the original seven already verified
   needs the two `20261026` migrations below. Stop on partial/drifted installation
   rather than assuming that every script can be safely reapplied.

The files are in [supabase/migrations](supabase/migrations). SHA-256 pins this handoff:

| Migration | SHA-256 |
| --- | --- |
| `202610250001_school_calendar.sql` | `8110734524dd2d63c3eba62abbd334d928beac612e1c0bfaaa1d3ccd28dcf0d2` |
| `202610250002_school_calendar_access.sql` | `5b8382be94f7a1d8e6fedba23ff27994692d8a503cb984f420970d774b453f36` |
| `202610250003_calendar_attendance_marks.sql` | `f97bcc3c06d520d277f367102af61b0715283cd93dd075ef60890e21918137a1` |
| `202610250004_save_calendar_entry.sql` | `e8b3cfe4118c79bf2a34d409e69ac25b07c392ed0ad68d2302ad45c8188696c3` |
| `202610250005_publish_calendar_entry.sql` | `6e58eb869d1b874f6e00bdad672dc08fe5a2b31223666ac0a09f41161c062a5d` |
| `202610250006_cancel_delete_calendar_entry.sql` | `6ca4d8bc2d5fad1c7c8070d594e4999969bdcd3471e7e75cf0ad2060ed2b8cf5` |
| `202610250007_calendar_audit_realtime.sql` | `0301b358805e1b60547160c88acaa05c95e22f8e76a58f043669a1b13e6057a9` |
| `202610260001_calendar_email_dispatch.sql` | `8ba800246bc46cbb82988335fb9fd0d0b049791963e17e1381c386386c53fd85` |
| `202610260002_calendar_rfid_tap.sql` | `d0a257784bf5e65f65a893582f89dc688d84a0e588c6b673489967cdae502237` |

## 2. Verify the database before uploading the app

Run [verify_school_calendar.sql](supabase/verify_school_calendar.sql) as the database
owner after all nine migrations. Keep the complete output. Every check must be
PASS; any SQL error or FAIL stops the release. This script is read-only.

For account-access checks, use
[verify_active_account_access.sql](supabase/verify_active_account_access.sql) as
`postgres`, with active admin, teacher, and student profiles available. It should
return nine PASS rows. This separate script makes temporary permission probes and
verified-session rows, then rolls them back; execute the entire file. On an error,
issue `ROLLBACK` if the editor still has an open/aborted transaction. Sequence gaps
may remain after rolled-back writes. This simulates RLS identities, not real sign-in.

## 3. Configure and upload the matching app

Use the current source and `pnpm-lock.yaml`; do not upload local `.env` secrets or
temporary test tools. Build with the selected environment's public variables.
Keep the previous app available until acceptance is complete.

Set the target's existing Supabase browser keys and server-only service-role key,
then configure calendar email using the [module guide](src/features/calendar/README.md):

- `RESEND_API_KEY`: server-only key for the intended Resend account.
- `CALENDAR_EMAIL_FROM`: address on a sender domain verified in that account.
- `CALENDAR_EMAIL_REPLY_TO`: optional valid reply address.
- `NEXT_PUBLIC_APP_URL`: the public HTTPS origin, without a path/query/fragment.

The local presence check found the calendar key, sender, and app URL unset. Hosted
environment values and sender verification were not inspected. Configure them
before publication; missing settings record failed delivery without undoing the
calendar mutation. Calendar email has no enable flag. `PHILSMS_ENABLED` controls
SMS only. Do not publish, cancel, republish, or opt into update emails as an
unapproved smoke test: these actions can contact real recipients.

## 4. Accept the release and approved pilot

1. Sign in with designated accounts. Verify admin controls; teacher/student
   calendars, campus/audience boundaries, and the absence of admin notifications.
2. In separate role sessions, verify updates/reconnect, read receipts, once-per-user
   session toasts, post ordering/expiry, and mobile/keyboard behavior. Local mocked
   tests do not prove hosted realtime or real browser session permissions.
3. Prepare a draft pilot and capture its exact content, date range, campus/audience,
   impact, and recipient preview. Obtain explicit approval for the concrete pilot
   and real recipients before publishing. Normal events do not block attendance;
   exception entries can affect a whole campus's current Manila day.
4. Verify provider acceptance IDs and intended inbox delivery separately. Inspect
   failures without exposing message bodies or addresses in audit logs. Never
   retry unknown acceptance or unlock interrupted attempts without provider review.
5. For approved exception checks, verify current/future effective state, immutable
   past snapshots, report exclusions, retained RFID/SMS evidence, and independent
   Subject Attendance. Admin report reads synchronize today/future marks. Real taps
   can create attendance and SMS; physical-reader verification remains deferred
   until separately arranged.
6. Record results and remaining operational limits. Mark Task 30 complete only
   after the selected release and approved pilot checks actually pass.

## Recovery

Stop new publication/sending and restore the recorded previous app deployment
first. Investigate uncertain email acceptance before any resend; there is no
durable worker or automatic recovery for interrupted dispatch.

Prefer retaining the additive calendar database while investigating. A full
[calendar rollback](supabase/rollback_school_calendar.sql) is destructive: export
all four calendar tables first and explicitly approve that recovery action. Check
shared RFID/audit functions against their documented baseline before running it
as the database owner. The transaction restores the pre-calendar writer/grants and
audit helpers, removes roster hooks, then drops calendar objects. Existing RFID,
Subject Attendance, SMS, and append-only audit evidence remain. Do not run rollback
merely to verify installation; deleted calendar history needs its export to recover.
