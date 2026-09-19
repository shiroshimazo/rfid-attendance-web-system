# RFID

Documented card registration, status management, record viewing, and consistent
UID handling. This directory stores the card inventory; Manage Students gives a
stored card to a student and returns it to the list. Required RFID report content
belongs in the existing reports workflow. No separate raw-event screen is
required for this release.

Registration supports manual UID entry and USB scanning from the ESP32 using
Web Serial in desktop Chrome or Edge on HTTPS or localhost. Close Arduino Serial
Monitor, click **Scan card via USB**, select the ESP32 port, and tap a card. The
existing test sketch works unchanged: the app reads `Card detected! UID: ...`
or `UID: ...` lines at 115200 baud and ignores boot/status output. Scanning fills
the UID only; the administrator still submits registration, and the card reaches
a student through Manage Students. Each scan releases the port after capture,
cancellation, error, or a 30-second
read timeout. Closing the dialog cancels the scan. Unsupported browsers retain
manual entry. Hardware scanning still requires validation on the physical reader.

Registration, UID correction, status changes, assignment, and release all route
through `write.ts` and the `save_rfid_card` RPC. A stored card has no holder and
cannot be active until Manage Students assigns it; editing here never changes the
holder. Replacement, holder validation, and card history checks run in the same
transaction. Registering the same UID again updates that stored card, and a UID
another student holds is refused. Cards with attendance cannot move to another
student, change UID, or be released; see the
[card inventory rollout](../../../supabase/migrations/README.md#rfid-card-inventory-and-student-assignment).

`src/lib/rfid-uid.ts` is the shared UID parser: full hexadecimal bytes, uppercase,
no separators, leading zeros intact. Existing valid stored formats are matched
using `public.normalize_rfid_uid`; malformed legacy records stay readable.
Apply the [P03 rollout](../../../supabase/migrations/README.md#p03-uid-registration-and-assignment-rollout)
before using these actions. It includes the user's five temporary test UIDs and
the required read-only collision inventory. They are not automatically assigned
to real students, and physical reader validation remains pending.
