# Admin Archives

`/admin/archives` lists archived students, teachers, subject sessions, and individual
class weekdays in four searchable, paginated tabs. Each category can fail independently.
Restoration requires an active, verified administrator at both the server action and
PostgreSQL function boundaries. Existing profile lifecycle triggers remain authoritative.

## Database rollout

Apply `supabase/migrations/202609200001_admin_archives.sql` in the Supabase SQL editor
(or the project's migration runner) before deploying this UI. The migration is
transactional and safe to reapply. It adds nullable archive metadata columns and a
checked restoration function; existing clients remain compatible.

Existing archive dates and reasons stay null rather than being inferred from update
timestamps. Future transitions to archived capture the date automatically. The current
archive controls do not collect reasons; the page displays ?Not recorded? when absent.

Restoring a student does not reactivate RFID cards. Restoring a subject session retains
its enrollment and attendance records, requires its original active assignment to still
match, and uses the existing overlap constraint. Class restoration reactivates only the
selected weekday at its saved start time and grace period.

## Rollback

Roll back the application change first. Leave the additive columns, timestamp triggers,
and restore function installed: old clients still work and archive metadata is preserved.
No column or record deletion is needed to withdraw the UI. Removing the database
additions would discard collected metadata and is deliberately not part of this rollout.

## Verification

- `node --test tests/profile-lifecycle.test.mjs`
- `node tests/archives.browser.mjs` (uses the existing optional browser tools directory)
- `npx tsc --noEmit`

The browser fixture exercises the real component with mocked server actions; database
tests exercise real migrations, permissions, lifecycle triggers and schedule constraints
in PGlite. Production restore actions are not exercised against user records.
