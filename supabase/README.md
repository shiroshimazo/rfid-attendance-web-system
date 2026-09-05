# Supabase project

The database implementation follows `rfid-docs/rfid-docs/Database Design/Database Design.md`.

## Included schema

- `users` for application roles and status (passwords stay in Supabase Auth)
- `teachers` and `students` for role-specific profiles
- `programs` for degree programs such as BSIT and BSHM
- `courses` for subjects such as IPT, ITE, and MS101
- `teacher_assignments` for program, subject, year-level, section, and campus assignments
- `rfid_cards`, `attendance_records`, and `sms_notifications` for the attendance workflow
- Constraints, indexes, automatic `updated_at` triggers, Auth synchronization, and Row Level Security policies

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

These files are retained as historical maintenance references. They are excluded
from normal setup, deployment, and pilot cleanup:

| File | Historical behavior |
| --- | --- |
| [cleanup_bshm.sql](cleanup_bshm.sql) | Deletes BSHM students, courses, and assignments; sets the program inactive. |
| [cleanup_old_sections.sql](cleanup_old_sections.sql) | Deletes students and assignments outside sections 21001–21010. |

Their SQL remains executable and destructive. Student deletion cascades to RFID,
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
