# Database migrations

## P03 UID registration and assignment rollout

**P03 software is DONE:** the user confirmed migration execution, successful
assignment, and completion of the requested duplicate/replacement/rejection
checks on 2026-09-06 using temporary UIDs. Hosted results are user-reported.
Standalone inventory output was not supplied; the migration includes a blocking
collision check. Physical reader verification remains P11.
P03 uses the existing card/student forms. The user's five temporary UIDs are test
fixtures, not claims about the physical cards or automatic student assignments.

### Apply in this order

1. Run [verify_rfid_uid_inventory.sql](../verify_rfid_uid_inventory.sql) in the
   Supabase SQL editor. It is read-only and works before the migration. No rows
   means no normalization collisions or invalid legacy numbers were found.
   `collision` rows mean stop and review the listed cards/owners/history before
   migration. Do not delete, merge, or invent replacement UIDs. `legacy_invalid`
   rows are preserved and do not block migration; obtain verified reader UIDs
   before activating those cards again. This check is not physical verification.
2. Apply [202609110001_atomic_rfid_assignment.sql](202609110001_atomic_rfid_assignment.sql)
   after P02. It repeats the collision check under a table lock and aborts the
   transaction if collisions exist. It adds an expression index, a guard trigger,
   a UID normalizer, and one card management RPC. No existing data is rewritten,
   no students/cards are removed, and attendance/SMS links remain intact.
3. Deploy/use the updated application and reload both admin screens. Pause card
   edits while switching versions: older actions still retire cards in a separate
   request, so a later failure on an old client cannot restore that earlier write.
   Database guards protect UID uniqueness and new activation eligibility for
   direct writers, but atomic replacement requires the new RPC-based actions.
4. Verify both forms using the temporary values below and designated active test
   students. Registration and student UID entry now both save/reissue an existing
   same-holder UID rather than duplicate it. Taking a UID from another holder is
   rejected; use the existing explicit reassignment action, which permits a move
   only when the card has no attendance history. New activation also requires an
   active student profile and linked student account. Inactive/Lost/Deactivated
   states remain usable for retirement and record keeping.

| Temporary input | Normalized UID |
| --- | --- |
| `00:00:00:11` | `00000011` |
| `00:00:00:22` | `00000022` |
| `00:00:00:33` | `00000033` |
| `00:00:00:44` | `00000044` |
| `00:00:00:55` | `00000055` |

Use **Admin → RFID Cards → Register**, select the intended test student, enter a
UID, choose the card status and issue date, and save. The student screen's RFID
assignment form uses the same operation. Choose **Inactive** when merely storing
a test UID; selecting **Active** intentionally deactivates that student's prior
active card. No hosted fixtures are inserted by this change.

For acceptance, reopen both screens after saving; enter the same UID with colons,
hyphens, spaces, or no separators and confirm it resolves to the same card. Test
a replacement on a designated test student, confirm only one card stays active,
and confirm a rejected other-holder or inactive-holder request changes nothing.
Check Lost/Inactive/Deactivated status changes and explicit reassignment with and
without attendance history. Restore intended test assignments after testing.

### UID contract and preservation

`src/lib/rfid-uid.ts` and `public.normalize_rfid_uid(text)` normalize complete
4-, 7-, or 10-byte hexadecimal values to uppercase without separators, preserving
byte order and leading zeros. Accept a single consistent separator between full
bytes; reject incomplete bytes, mixed separators, non-hex characters, and other
lengths. Printed decimal identifiers are not converted or assumed to be reader
UIDs. UID byte sizes follow [NXP AN10927](https://www.nxp.com/docs/en/application-note/AN10927.pdf).
This parser does not add support for different attendance hardware or prove a
particular physical card's type. The pilot hardware scope is unchanged.

Old valid separator/case variants stay stored as-is and resolve through the
normalization index; new inserts/UID changes store canonical text. Old invalid
values remain readable and can be deactivated, but cannot be newly activated.
No automatic correction, history reassignment, or decimal/byte-order guessing
occurs. Existing one-active-card and card/student history constraints remain.
The existing demo seed uses its canonical UID for its insert and attendance lookup;
its academic fixture alignment remains P10. Do not run the seed on hosted data.

All card management RPC operations take one transaction-scoped advisory lock,
then lock affected students before cards, coordinating with profile archival.
Replacement retirement and the final insert/update commit together. An error
rolls both back. Retrying the same UID reuses its card ID. A transport error may
leave acceptance uncertain; reload before retrying. This is administration-only
serialization for the pilot, not a lock design for the future attendance receiver.

Local verification: `node --test tests/rfid-assignment.test.mjs` uses actual SQL,
RLS, and both actual server action modules with a database-backed RPC adapter.
It covers the five test UIDs, failures after retirement, migration preservation,
collision rejection, rollback/reapplication, eligibility, and history protection.
Hosted database deployment, multi-session concurrency, and real reader scans
require separate verification. P04 must reuse the normalizer for tap input and
SQL normalized lookup to include legacy valid formats; its route is not implemented
by P03. Hardware testing remains P11.

### P03 rollback only if needed

Stop card edits and restore the preceding application before running this as a
separate rollback migration. This removes P03 protections; prior split-save
risks return. It retains every card, canonical UID already saved, card status,
attendance/SMS link, and existing uniqueness/RLS/lifecycle constraint. Reapplying
the forward migration restores protection after a fresh collision check.

<!-- p03-rollback:start -->
```sql
begin;
drop trigger if exists rfid_cards_guard_write on public.rfid_cards;
drop function if exists public.save_rfid_card(text, public.rfid_card_status, bigint, text, bigint, date);
drop function if exists public.guard_rfid_card_write();
drop index if exists public.rfid_cards_normalized_uid_unique;
drop function if exists public.normalize_rfid_uid(text);
commit;
```
<!-- p03-rollback:end -->

## P02 safe management saves rollout

**P02 is DONE:** the user confirmed hosted migration execution and successful
student, teacher assignment, email, and schedule application checks on 2026-09-06.
These hosted results are user-reported; the assistant's automated checks ran locally.
For new environments, apply
[202609100001_atomic_management_saves.sql](202609100001_atomic_management_saves.sql)
after P01 and before using the updated student, teacher, and schedule actions.
Run this one migration in the Supabase SQL editor. It adds functions/triggers;
it does not delete or rewrite existing records or change RLS policies.

Student profile/lifecycle changes commit together. Teacher profiles and their
replacement assignments commit together, so a failed insert restores the old
assignments. Schedule day updates, additions, and retirements commit as one week;
edits and status toggles take the same transaction lock for that week. Omitted
days remain archived. The RPCs require an active admin and validate the actual
BSIT program, 2nd Year, sections 21001–21010, supported campuses, and subject
membership. Schedule days must be unique Monday–Friday values. Existing
all-campus schedules remain supported; teacher assignments require an explicit
campus. Existing non-pilot or wildcard records are preserved until explicitly edited.

Auth owns email. The existing Auth-to-account trigger runs before the new
Auth-to-profile trigger; both commit with the Auth email change. Old application
email writes retain the actual Auth email. The new actions save other profile
details first, then request the Auth email change. If Auth rejects it, the UI
reports that the details were saved but the email change failed. A network
failure asks for a reload because acceptance may be uncertain. This is not one
transaction across the Auth API and profile save. Existing email mismatches are
not silently backfilled. New-account cleanup only deletes the newly issued
unused login after a definite SQL rejection and a successful service-role read
confirming no profile exists; ambiguous saves retain the account for inspection.

After applying, verify with dedicated test accounts and the existing forms:

1. Create and edit a student and a teacher with valid pilot placement. Confirm
   teacher assignments persist after reopening and remain scoped to that teacher.
2. Change a test account's email to an unused address. Confirm Auth, `public.users`,
   and its profile agree and the account can sign in using that address. Then
   attempt an email already used by another account: confirm the explicit partial
   save message, matching original email fields, and retained assignments.
3. Save a test schedule week, reopen it, and toggle its status. Confirm selected
   days persist and omitted days are archived. Restore the intended test schedule.
4. Confirm ordinary teacher/student access still works and cannot call these admin
   saves. Inspect any pre-existing email mismatches without automatically repairing
   them using the read-only counts below.

```sql
select 'students' as profile, count(*) as mismatched_emails
from public.students p join public.users u on u.id = p.user_id
join auth.users a on a.id = u.id
where p.email is distinct from a.email or u.email is distinct from a.email
union all
select 'teachers', count(*)
from public.teachers p join public.users u on u.id = p.user_id
join auth.users a on a.id = u.id
where p.email is distinct from a.email or u.email is distinct from a.email;
```

Local proof: `node --test tests/management-saves.test.mjs tests/management-actions.test.mjs`.
These exercise actual SQL/RLS in PGlite and the actual server actions with mocked
Auth requests, including injected failure rollback, validation, and email failure.
They do not verify hosted Auth privileges or simultaneous database sessions.
Check concurrent edits in staging if multiple administrators edit the same week.

### P02 rollback only if deployment must be reverted

Restore the previous application first and allow in-flight saves to finish.
Leaving this additive migration installed is compatible with the earlier actions,
although those actions retain their old non-email partial-save risks. If removing
P02 is necessary, use the following as a separate, explicitly chosen rollback
migration. It removes P02 write protections and functions, preserves all records
and P01 access rules, and is not a normal setup step. Do not remove the earlier
Auth sync or profile lifecycle triggers. Reapplying the forward migration restores
P02 without rewriting data.

<!-- p02-rollback:start -->
```sql
begin;
drop trigger if exists p02_sync_auth_profile_email on auth.users;
drop trigger if exists users_keep_auth_email on public.users;
drop trigger if exists students_keep_account_email on public.students;
drop trigger if exists teachers_keep_account_email on public.teachers;
drop function if exists public.save_student_profile(jsonb, uuid, bigint);
drop function if exists public.save_teacher_profile(jsonb, jsonb, uuid, bigint);
drop function if exists public.save_schedule_week(bigint, text, text, text, integer[], time, integer, public.account_status);
drop function if exists public.set_schedule_week_status(bigint, text, text, text, public.account_status);
drop function if exists public.assert_pilot_placement(bigint, text, text, text, boolean);
drop function if exists public.sync_auth_profile_email();
drop function if exists public.keep_profile_account_email();
drop function if exists public.keep_account_auth_email();
commit;
```
<!-- p02-rollback:end -->

## P01 active-account access rollout

`202609090001_enforce_active_account_access.sql` is implemented and locally tested.
**The user confirmed executing this migration in hosted Supabase on 2026-09-06.**
The user reported the expected access-denied page after the application
deactivation test and confirmed access returned after reactivation on 2026-09-06.
**P01 is DONE:** the user also confirmed all nine hosted SQL verification rows
are PASS on 2026-09-06. These checks simulate authenticated claims; they do not
claim a separate HTTP request using a retained JWT. For new environments, apply it
after all earlier migrations, including `202609080001_restrict_attendance_status.sql`,
in the Supabase SQL editor or through your existing migration workflow.

The migration makes `current_user_role()` consult the current account status in
`public.users`. The student and teacher helpers also require the appropriate
active account role. Restrictive policies on all nine business tables combine
with existing owner/role policies, so an inactive or archived account cannot
read or write business data using a retained authenticated session. Existing
teacher assignment scoping, student ownership, and admin access to historical
records remain in place. See [PostgreSQL policy combination rules](https://www.postgresql.org/docs/current/sql-createpolicy.html).

`public.users` intentionally still permits reading one's own account row for
login/status feedback. This grants no account-write permission. Disabled admins
cannot reactivate themselves or change roles. Active admins can still manage
other accounts. Supabase Auth password recovery and privileged service-role
operations are not revoked by this migration.

No rows, roles, profile statuses, cards, or historical records are rewritten.
Existing application versions already read account status, so no coordinated
frontend deployment is required. The transaction is atomic and can be reapplied.
Revocation takes effect for subsequent database statements that observe the
committed status change; it cannot retract data already downloaded or cancel
statements running on an earlier transaction snapshot.

Before rollout, confirm that the administering account is active in `public.users`.
Existing profile/account mismatches are not silently repaired; reconcile them
through the documented lifecycle actions. After applying, this read-only query
should return nine restrictive policies with status checks:

```sql
select tablename, policyname, permissive, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and policyname = 'active_account_required'
order by tablename;
```

Run local proof with:

```sh
node --test tests/account-access.test.mjs tests/profile-lifecycle.test.mjs tests/attendance-status-migration.test.mjs
```

The access suite reproduces the old authorization gap before applying P01,
then tests retained inactive/archived identities for all three roles, active
role boundaries, self-reactivation denial, archive/restore, row preservation,
reapplication, and rollback. It executes real SQL/RLS in isolated PGlite with an
Auth identity stub; it does not use live credentials or change hosted accounts.

For hosted verification, use designated test accounts: retain a signed-in
session, deactivate/archive it from an active administrator, and repeat a direct
business-table request using that retained session. Reads should return no rows;
updates/deletes should affect none and inserts should be rejected. The own-account
status row remains readable. Check active admin, assigned-teacher, and personal
student access too. Supabase SQL editor queries run with elevated privileges;
an unrestricted editor read alone does not verify authenticated-user RLS.

For a SQL-level check, run the entire
[verify_active_account_access.sql](../verify_active_account_access.sql) file in
Supabase SQL Editor as `postgres`. It selects one existing active account of each
role, requiring active profiles for Teacher and Student. It assumes authenticated
identities, tests active/inactive/archived permissions and access restoration,
and should return nine rows marked `PASS`. No email, password, or token is needed.
If a required account is missing, it stops with a clear error.

The script deliberately rolls back all status changes and write probes inside a
subtransaction before returning results; its final `ROLLBACK` removes the temporary
results table. Run the whole file, keeping both rollback mechanisms intact.
On an error, run `ROLLBACK;` if the editor reports an open/aborted transaction and
share the error text. Do not remove a failing check to force a PASS. The script
was tested both with P01 and with the old policies, including data preservation.
It verifies hosted PostgreSQL RLS using simulated Auth claims; it does not test
HTTP/JWT transport or impersonate a real browser session.

### P01 rollback

Use this only to revert this migration, as a reviewed follow-up migration. It
restores the previous authorization gap for disabled accounts; prefer fixing
forward. It changes policies/functions only, preserving all records. Do not
replay the original schema migrations or reset the database.

<!-- p01-rollback:start -->
```sql
begin;

do $$
declare
  business_table text;
begin
  foreach business_table in array array[
    'students', 'teachers', 'programs', 'courses', 'teacher_assignments',
    'rfid_cards', 'attendance_records', 'sms_notifications', 'class_schedules'
  ] loop
    execute format('drop policy if exists active_account_required on public.%I', business_table);
  end loop;
end;
$$;

create or replace function public.current_user_role()
returns public.user_role language sql stable security definer
set search_path = public
as $$ select role from public.users where id = auth.uid() $$;

create or replace function public.current_student_id()
returns bigint language sql stable security definer
set search_path = public
as $$ select id from public.students where user_id = auth.uid() $$;

create or replace function public.teacher_can_access_student(target_student_id bigint)
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.students as student
    join public.teacher_assignments as assignment
      on assignment.program_id = student.program_id
     and (assignment.year_level is null or assignment.year_level = student.year_level)
     and (assignment.section is null or assignment.section = student.section)
     and (assignment.campus is null or assignment.campus = student.campus)
    join public.teachers as teacher on teacher.id = assignment.teacher_id
    where student.id = target_student_id
      and teacher.user_id = auth.uid()
      and student.status = 'active'
      and teacher.status = 'active'
      and assignment.status = 'active'
  )
$$;

commit;
```
<!-- p01-rollback:end -->

Existing helper execution grants are retained by `create or replace function`.

## R01 attendance status rollout

`202609080001_restrict_attendance_status.sql` allows new attendance decisions only
as Present, Late, or Absent. It leaves the original enum and all existing records
intact. Historical unsupported values are displayed as "Historical record" by
the application, excluded from current attendance totals, and never offered as
filter choices. This is display compatibility, not an additional business status.

Deploy the compatible application and apply this migration after the previous
migrations. Either order preserves reads; older clients attempting a new retired
status after the migration receive a validation error. Existing historical rows
may retain their original status during an update, but cannot move that status to
another student/day/card. No data conversion or deletion is performed.

Before and after rollout, inventory retained values with this read-only query:

```sql
select attendance_status, count(*)
from public.attendance_records
group by attendance_status;
```

The user confirmed executing this migration on 2026-09-05. The assistant's earlier
hosted inventory query failed; hosted trigger behavior and historical row counts
have not been independently verified. No records were converted or deleted by
the assistant. Run the local preservation and write guard tests with
`node --test tests/attendance-status-migration.test.mjs`.

Rollback, if required, is a follow-up migration containing only:

```sql
begin;
drop trigger if exists attendance_enforce_current_status on public.attendance_records;
drop function if exists public.enforce_current_attendance_status();
commit;
```

This removes write enforcement without rewriting attendance or SMS data. The
compatible application can stay deployed. Do not drop/recreate the enum or
reclassify historical records as part of either rollout or rollback.

## Migration history

`202609010001_create_rfid_attendance_schema.sql` creates the original RFID attendance schema, relationships, constraints, indexes, authentication synchronization, and role-based Row Level Security.

`202609030001_correct_academic_structure.sql` separates degree programs from courses/subjects, adds multi-class teacher assignments, migrates the original ambiguous columns, and limits teacher access to assigned students.

`202609040001_enable_realtime.sql` adds attendance, RFID card, SMS, and student tables to the Supabase Realtime publication for live dashboards.

`202609050001_class_schedules.sql` creates per-section class schedules with role-based Row Level Security and seeds the BSIT 2nd Year pilot (sections 21001-21010, morning 06:00 and afternoon 13:00 Philippines Time) per the Late Attendance Ruling.

`202609060001_bsit_pilot_courses.sql` seeds the eight BSIT 2nd Year pilot subjects as the course catalog (canonical codes only; aliases stay in the ruling).

`202609070001_sync_profile_lifecycle.sql` makes student/teacher profile status the
source for account lifecycle changes. Profile inserts and status updates also
update `public.users.status`; archiving students deactivates only their active
cards, and teacher assignments follow the teacher's status. Newly inserted or
reassigned teaching assignments inherit their teacher's stored status.

## W02 rollout and verification

Apply `202609070001_sync_profile_lifecycle.sql` after the earlier migrations and
before deploying the updated server actions. The triggers run with the caller's
permissions and preserve existing RLS. PostgreSQL runs a trigger in the same
transaction as its triggering statement, so a dependent-write failure rolls back
the profile, account, and dependent status changes together.
See [PostgreSQL trigger behavior](https://www.postgresql.org/docs/current/trigger-definition.html).

Lifecycle rules:

- Creating or editing a profile with any of the three statuses synchronizes the
  linked account. Dedicated archive/restore actions use the same triggers.
- Temporary student inactivity preserves card status. Archiving retires active
  cards. Restoring a student never reactivates a lost, inactive, or retired card;
  card reissuance remains an explicit administrator action.
- Teacher archive/inactivity/restoration updates existing assignments. Assignment
  rows inserted after the profile save inherit its status instead of defaulting
  to active.
- The migration does not rewrite existing profiles or infer which side of an
  existing account/profile mismatch is correct. Review old mismatches and save
  the intended profile status to reconcile them.
- Database access revocation is implemented separately under P01 above; atomic
  profile/email/assignment saves remain P02. This migration synchronizes lifecycle state; it does not
  ban Supabase Auth users or make external Auth API calls transactional.

Run the regression suite with `pnpm test:lifecycle`. It uses an isolated PGlite
database, the actual migrations and RLS, and a minimal Supabase Auth schema stub.
It needs no database credentials and never connects to a hosted project. The
tests cover disabled account creation, both profile update shapes, assignments
added after an inactive/archived teacher save, restore/card preservation, and
rollback after injected dependent-write failures. Multi-session locking and the
hosted Auth service still need staging verification.

If rolling back, restore the previous server actions before removing the three
new triggers and their two functions in a follow-up migration. Do not reactivate
cards as part of rollback: previous lost/retired states must remain intact.
