# RFID service

ESP32 request validation, device authentication, duplicate-request protection,
UID normalization, and the attendance data needed for the documented RFID flow
and reports. The device receiver remains to be implemented.

Use the smallest persistence design that meets transaction and reporting needs;
an immutable event subsystem or particular scan-log table is not mandated by the
current requirements. Reader-assisted enrollment and an offline queue are outside
the release backlog.
