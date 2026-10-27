# RFID service

ESP32 request validation, device authentication, duplicate-request protection,
UID normalization, and the attendance data needed for the documented RFID flow
and reports. The receiver is implemented at `POST /api/rfid/tap`; signed-in admin
USB ingestion shares the same service-only writer and SMS dispatcher.

The calendar-aware writer checks current published exceptions after identity and
successful-replay checks. No classes and Online / manual reject new taps before
attendance or SMS writes. Existing evidence is retained. Apply all nine calendar
migrations before the matching app; see the
[endpoint contract](../../app/api/rfid/tap/README.md) and
[migration/recovery guide](../../../supabase/migrations/README.md). Physical-reader
verification is deferred under Calendar Task 17.

Use the smallest persistence design that meets transaction and reporting needs;
an immutable event subsystem or particular scan-log table is not mandated by the
current requirements. Reader-assisted enrollment and an offline queue are outside
the release backlog.
