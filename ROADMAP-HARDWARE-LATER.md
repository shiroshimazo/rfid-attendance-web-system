# Hardware + SMS — Build Later

Parked until the web system (`ROADMAP-WEB-NOW.md`) is fully developed.
Covers the RFID Attendance Requirements, Time-In/Time-Out Requirements, and
SMS Notification Requirements from `rfid-docs`.

| # | Task | Need | Status |
|---|------|------|--------|
| S1 | ESP32 tap route `POST /api/rfid/tap` | Device secret header, UID normalize, card validation, time-in/out rule (1st tap = time-in, 2nd tap = time-out), LCD/LED/buzzer JSON response, replay guard | OPEN — only placeholder `src/app/api/rfid/tap/README.md` exists |
| S2 | Scan logs table `rfid_scan_logs` | Immutable per-tap log, feeds RFID logs report | OPEN — no table yet |
| S3 | SMS provider send | Semaphore/Twilio integration, env keys (`SMS_API_KEY`, `SMS_SENDER`), Pending → Sent/Failed transitions with `sent_at` stamp, triggered after tap commit | OPEN — SMS is display-only today, no sender, no env keys |
| S4 | SMS RLS fix | Allow teacher read via `teacher_can_access_student`; currently owner/admin only (`202609010001` sms policies) | OPEN |
| S5 | SMS in reports | SMS notification records section per Report Requirements | OPEN |
| S6 | Device hardening | Rate limit on tap route, idempotency key for ESP32 retries, API key rotation | OPEN |
