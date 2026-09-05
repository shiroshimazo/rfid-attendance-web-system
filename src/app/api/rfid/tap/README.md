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
