# Database migrations

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
- W01 database access revocation and W03 atomic profile/email/assignment saves
  remain separate tasks. This migration synchronizes lifecycle state; it does not
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
