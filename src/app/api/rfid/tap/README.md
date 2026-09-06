# RFID tap endpoint

This folder is reserved for the authenticated ESP32 ingestion route. Implement
the documented UID/card/student validation, first-tap time-in, second-tap
time-out, stored Late/Present decision, and device display/LED/buzzer response.
Repeated delivery of the same request must not create another tap or duplicate
arrival SMS. Keep the records needed for the documented RFID reports.

R02 does not mandate an immutable event subsystem, a particular scan-log table,
an offline queue, or a device administration screen. Choose the smallest storage
and request-handling design that preserves transaction correctness. Resolve
third-tap and cross-day behavior before inventing additional attendance rules.

Do not expose a Supabase service-role key to ESP32 firmware.

P03 provides `src/lib/rfid-uid.ts` for input normalization and
`public.normalize_rfid_uid(text)` for matching stored cards, including valid
legacy separator/case variants. Reuse that byte-order/leading-zero contract in
P04. Do not query only raw `rfid_number` equality or treat printed decimal numbers
as hexadecimal UIDs. The user's temporary `00:00:00:11` through `00:00:00:55`
values test registration only; they do not demonstrate actual hardware taps.
