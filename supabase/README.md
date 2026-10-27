# Supabase project

The database implementation follows `rfid-docs/rfid-docs/Database Design/Database Design.md`.

## Included schema

- `users` for application roles and status (passwords stay in Supabase Auth)
- `teachers` and `students` for role-specific profiles
- `programs` for degree programs such as BSIT and BSHM
- `courses` for subjects such as IPT, ITE, and MS101, archived rather than deleted
- `academic_sections` for the year level, section, and campus groupings that feed pickers
- `teacher_assignments` for program, subject, year-level, section, and campus assignments
- `rfid_cards`, `attendance_records`, and `sms_notifications` for the attendance workflow
- Constraints, indexes, automatic `updated_at` triggers, Auth synchronization, and Row Level Security policies

## Calendar extension (R06; locally implemented database)

[Calendar.md](../Calendar.md) defines the locally implemented calendar feature.
Nine calendar migrations now supply these tables:

- `calendar_entries`: scoped announcements and lifecycle state.
- `calendar_entry_reads`: protected own-user read receipts.
- `attendance_day_marks`: NoClasses/OnlineManual snapshots, separate from RFID evidence.
- `calendar_email_deliveries`: stored delivery payloads, attempt counts, and retry eligibility; server actions dispatch after the response.

The latest migration integrates calendar checks into the service-only RFID writer.
Calendar and student-roster changes reconcile today/future snapshots; past
snapshots remain immutable. Existing attendance_status and Subject Attendance
remain unchanged. Structural audit logs exclude announcement text and email
payloads; all four tables join the existing realtime publication.
See [migration, verification, and rollback guidance](migrations/README.md).
[Verification SQL](verify_school_calendar.sql) and [rollback SQL](rollback_school_calendar.sql)
are tested locally. The original seven migrations were manually object-verified
on preview (48/48 at Task 10); the email/RFID migrations remain local-only. The
current script verifies all nine and must run again on the exact rollout target.
Hosted execution and application rollout require separate confirmation under
[Calendar-TODO.md](../Calendar-TODO.md). See the
[preview execution record](SCHOOL-CALENDAR-PREVIEW-VERIFICATION.md) and
[calendar module](../src/features/calendar/README.md) for configuration and limits.

## Setup and existing data

Use the versioned migrations in [migrations/](migrations/README.md) for schema
changes, following their rollout instructions. Do not execute every SQL file
in this directory as a setup or deployment sequence.

Preserve existing students, assignments, RFID cards, attendance, and SMS history.
Use the documented student/teacher archive actions when retiring accounts.
Non-pilot programs or section formats are not grounds for deleting records.
Demo-data alignment remains a separate P10 task in the
[scope audit](../RFID-DOCS-SCOPE-AUDIT.md).

## Retired historical scripts (R04)

These retired scripts are absent from the current tree. Their historical behavior
is recorded below; they are excluded from setup, deployment, and pilot cleanup:

| File | Historical behavior |
| --- | --- |
| `cleanup_bshm.sql` | Deletes BSHM students, courses, and assignments; sets the program inactive. |
| `cleanup_old_sections.sql` | Deletes students and assignments outside sections 21001–21010. |

Copies of their SQL remain destructive. Student deletion cascades to RFID,
attendance, and SMS records while login accounts survive. Do not run these files
to enforce pilot scope or follow them with manual Auth-account deletion. Their
retention documents old behavior; it does not authorize that behavior for the
current release.

## Demo data

`seed.sql` creates one account for each supported role and a complete sample attendance flow.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@rfid.local` | `ChangeMe123!` |
| Teacher | `teacher@rfid.local` | `ChangeMe123!` |
| Student | `student@rfid.local` | `ChangeMe123!` |

These credentials are for local/demo use only. Replace them before using a hosted environment.

For a disposable local demo database only, with the Supabase CLI installed and a
local project initialized, rebuild from migrations and demo seed data with:

```sh
supabase db reset
```

This resets the local database and discards its existing data. It is not an
existing-data cleanup or hosted deployment step, and the retired scripts above
are not part of this workflow.
