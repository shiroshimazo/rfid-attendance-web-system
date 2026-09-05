# Database migrations

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
