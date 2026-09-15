# System Logs

## Coverage

- `/admin/system-logs`: verified active administrators only; server-side search, category,
  result, date range and 25-row pagination. Default range is the last seven school dates.
- Database triggers capture INSERT, UPDATE and DELETE on users, students, teachers,
  teacher assignments, programs, courses, class and subject schedules, enrollments,
  RFID cards/tap receipts, attendance and SMS notifications. Archive/restore events
  are labeled explicitly. No-op timestamp changes are skipped.
- Server actions record their results for account management, profile/password changes,
  schedules, subject attendance/enrollment, RFID management, archives and email login.
- Route handlers record report download, profile image upload and RFID request results,
  including unauthorized requests and validation failures.
- Auth triggers record password/profile changes and session verification. Native Auth
  audit events and verified session endings are captured when the corresponding Auth
  tables exist; the native payload is never copied.

An action result and its individual database row changes are separate events. A failed
multi-step action can have successful earlier writes; the log preserves both facts.
Read-only page navigation, keystrokes and filter changes do not create audit events.
Direct SQL changes get database events; failed SQL outside the application requires the
database provider's own server logs. Logs cannot reconstruct activity before installation.

## Privacy and integrity

Only column names and an allowlist of operational values are retained in row changes.
Passwords/hashes, OTPs, tokens, request bodies, image contents, RFID UIDs, SMS bodies,
contact details and raw errors are excluded. Actor IDs/names and record IDs remain to
identify responsibility. Unauthenticated/service operations may have no identified actor;
Auth event subjects are retained as record IDs rather than inferred to be the initiator.

Browser sessions cannot insert, update, delete or truncate logs. Service code can append
results. A trigger rejects log mutation, including accidental changes by privileged SQL;
a database owner can still deliberately disable it. No automatic purge is configured.
Monitor table growth and choose a retention policy before introducing deletion.

Successful database changes and their logs commit atomically. Application result logging
uses a separate append: outages are reported by a fixed server-console error and do not
turn an already successful operation into a claimed failure. These console errors must be
monitored; no claim of gap-free auditing during database/network outages is made.

## Rollout and rollback

Apply `supabase/migrations/202609210001_system_logs.sql` after the existing migrations,
then deploy the application. This additive, transactional migration is safe to reapply.
It enables Realtime for the log table when the publication exists; RLS limits subscribers.

To withdraw the UI, roll back application changes and retain the table and audit records.
If database-trigger logging must also be paused, explicitly drop only the audit triggers
on the source tables. Keep `system_logs` and its immutability trigger; no data deletion is
needed. Existing readers/writers remain compatible with the expanded schema.

## Checks

- `node --test tests/profile-lifecycle.test.mjs tests/system-logs.test.mjs`
- Existing management, login, RFID, subject action, upload and report route tests
- `node tests/system-logs.browser.mjs` (existing optional browser tooling)
- TypeScript, focused ESLint and production build
