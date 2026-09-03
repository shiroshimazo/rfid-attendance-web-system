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

## Demo data

`seed.sql` creates one account for each supported role and a complete sample attendance flow.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@rfid.local` | `ChangeMe123!` |
| Teacher | `teacher@rfid.local` | `ChangeMe123!` |
| Student | `student@rfid.local` | `ChangeMe123!` |

These credentials are for local/demo use only. Replace them before using a hosted environment.

With the Supabase CLI installed and a local project initialized, apply everything with:

```sh
supabase db reset
```
