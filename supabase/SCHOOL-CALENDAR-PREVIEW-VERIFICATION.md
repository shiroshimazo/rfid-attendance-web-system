# School Calendar preview verification

**Status:** Complete. All seven migrations applied to the operator-identified preview database; final verification returned 48/48 PASS.

## Execution record

- Target project/branch: preview database identified by the operator. Project ref and branch name were withheld from this session; no production target was named.
- Connection: Supabase dashboard SQL editor, run as the database owner. No connection string was stored in this repository.
- Preflight: `users`, `students`, `teachers`, `teacher_assignments`, `attendance_records`, `system_logs`, `audit_record_change()`, `record_rfid_tap(uuid,text,timestamptz)`, `supabase_realtime`, and the three client roles were present. Required columns were present. All four calendar relations were absent, so there was no schema drift. The preview has no `supabase_migrations` schema, so version history could not be checked.
- Checksums: all seven files matched the manifest below before apply.
- Execution time: 2026-10-25.
- Apply result: seven files applied in order. `202610250004_save_calendar_entry.sql` did not take effect on the first pass. The unchanged file was re-applied successfully.
- Verification results: first run 46/48 PASS. Failures were `Private helper: public.calendar_entry_conflict(bigint,date,date,text[])` and `RPC security: public.save_calendar_entry(jsonb)`; both functions were absent. After re-applying migration `004`, the full run returned 48/48 PASS.
- Migration history: manual SQL editor applies are not recorded in migration history. Verification is object-based and does not prove version ordering.
- Not performed: no rollback, announcement publication, email send, RFID tap integration, or production deployment.

## Migration manifest

Applied after existing prerequisites through `202609270001_enrollment_teacher_names.sql`. The preview had no migration-history schema, so prerequisite tables, columns, functions, roles, and calendar-table absence were confirmed by object checks before applying. Checksums pinned the files reviewed for this task.

| Migration | SHA-256 |
| --- | --- |
| `202610250001_school_calendar.sql` | `8110734524dd2d63c3eba62abbd334d928beac612e1c0bfaaa1d3ccd28dcf0d2` |
| `202610250002_school_calendar_access.sql` | `5b8382be94f7a1d8e6fedba23ff27994692d8a503cb984f420970d774b453f36` |
| `202610250003_calendar_attendance_marks.sql` | `f97bcc3c06d520d277f367102af61b0715283cd93dd075ef60890e21918137a1` |
| `202610250004_save_calendar_entry.sql` | `e8b3cfe4118c79bf2a34d409e69ac25b07c392ed0ad68d2302ad45c8188696c3` |
| `202610250005_publish_calendar_entry.sql` | `6e58eb869d1b874f6e00bdad672dc08fe5a2b31223666ac0a09f41161c062a5d` |
| `202610250006_cancel_delete_calendar_entry.sql` | `6ca4d8bc2d5fad1c7c8070d594e4999969bdcd3471e7e75cf0ad2060ed2b8cf5` |
| `202610250007_calendar_audit_realtime.sql` | `0301b358805e1b60547160c88acaa05c95e22f8e76a58f043669a1b13e6057a9` |

## Verification and recovery

[verify_school_calendar.sql](verify_school_calendar.sql) was run as the preview database owner after the migrations. Result: 48/48 PASS. The first run had two failures caused by migration `004` not taking effect; re-applying the unchanged file resolved both. Follow [migration guidance](migrations/README.md) for prerequisites and rollback.

The [rollback script](rollback_school_calendar.sql) removes calendar history and requires an export first. Do not execute it merely to verify the preview installation.

No deployment, announcement publication, email send, or later checklist task is authorized by this verification step.
