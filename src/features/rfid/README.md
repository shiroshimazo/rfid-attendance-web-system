# RFID

Documented card registration, assignment, status management, record viewing, and
consistent UID handling. Required RFID report content belongs in the existing
reports workflow. No separate raw-event screen or reader-assisted enrollment
workflow is required for this release.

P03 routes both UID-entry screens and explicit reassignment/status actions through
`write.ts` and the `save_rfid_card` RPC. Replacement, holder validation, and card
history checks run in the same transaction. Registration reuses a same-holder
UID on retry. Existing cards with attendance cannot move to another student.

`src/lib/rfid-uid.ts` is the shared UID parser: full hexadecimal bytes, uppercase,
no separators, leading zeros intact. Existing valid stored formats are matched
using `public.normalize_rfid_uid`; malformed legacy records stay readable.
Apply the [P03 rollout](../../../supabase/migrations/README.md#p03-uid-registration-and-assignment-rollout)
before using these actions. It includes the user's five temporary test UIDs and
the required read-only collision inventory. They are not automatically assigned
to real students, and physical reader validation remains pending.
