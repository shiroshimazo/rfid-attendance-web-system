# School Calendar preview verification

**Status:** Awaiting preview target identification and database access. Task 10 is authorized but incomplete.

No hosted SQL was executed. DATABASE_URL and DIRECT_URL in the local environment contain placeholder hosts. No preview branch is linked in the repository. The Supabase integration is available but is not confirmed installed or connected.

## Execution record

- Target project/branch: pending user identification.
- Connection: pending Supabase integration or valid preview database credentials configured locally; never paste credentials into this document.
- Execution time: not executed.
- Verification results: not executed. Local test results do not substitute for preview verification.

## Prepared migration manifest

Apply after existing prerequisites through `202609270001_enrollment_teacher_names.sql`. Confirm the preview migration history before applying anything. Checksums pin the files reviewed for this task.

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

Run [verify_school_calendar.sql](verify_school_calendar.sql) as the preview database owner after migrations. Record every PASS/FAIL result here; any FAIL or SQL error leaves Task 10 incomplete. Follow [migration guidance](migrations/README.md) for prerequisites and rollback.

The [rollback script](rollback_school_calendar.sql) removes calendar history and requires an export first. Do not execute it merely to verify the preview installation.

No deployment, announcement publication, email send, or later checklist task is authorized by this verification step.
