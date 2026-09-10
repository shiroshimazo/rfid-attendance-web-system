# RFID tap endpoint (P04)

`POST /api/rfid/tap` receives authenticated campus taps. The device sends only
`requestId` (UUID) and `uid` (4, 7 or 10 reader bytes in hexadecimal). The server
uses the existing UID normalizer and database time in Asia/Manila; device-supplied
student, attendance status, date or time fields are rejected.

## School rules

- First accepted tap on a calendar day records Time In; Time Out stays blank.
- A second distinct accepted tap fills Time Out without changing Present/Late.
- A third tap is rejected, preserving both saved times.
- A new day's tap creates that day's Time In. Previous days' missing times stay
  missing; no synthetic attendance or departure is written.
- Late uses the documented BSIT 2nd Year pilot class schedule and strict
  `time > start + grace` comparison. At default cutoffs, 06:15:00/13:15:00 is
  Present; one second later is Late. No matching active schedule means Present.
- An active all-campus schedule takes priority over a matching campus-specific
  row, as the user confirmed. The specific row is a fallback when no active
  all-campus row matches. Subject schedules do not control campus Late status.
- Every scheduled subject roster remains **Not confirmed yet** until its teacher
  confirms Present, Late or Absent. Campus arrival does not confirm subjects.
  Cardless students remain on these rosters and can also be confirmed.

## Request and retry contract

Use HTTPS outside localhost and send `Authorization: Bearer <RFID_DEVICE_API_KEY>`
and `Content-Type: application/json`:

```json
{"requestId":"10000000-0000-4000-8000-000000000001","uid":"00:00:00:11"}
```

Generate one UUID for each distinct physical tap. Reuse that exact UUID and UID
when retrying a timeout/503 response. Keep the same ID until the outcome is known;
do not generate a new ID for a network retry or every poll while the card remains
on the reader. Device card-removal detection and physical tests remain P11.

The success JSON includes `action` (`time_in`/`time_out`), `attendanceId`,
`attendanceStatus`, student `name`/`yearLevel`, `date`, `time`, `timezone`, `message`,
`replayed`, and green/success LED/buzzer instructions. Hardware must interpret the
feedback; returning it does not prove the LCD, LED or buzzer has operated.

Authenticated retries return the saved response with `replayed: true`, including
across midnight. Reusing a completed request ID for another UID returns 409.
Invalid/ineligible cards return 422, completed-day or review conflicts 409,
malformed input 400/413/415, invalid device authorization 401, and configuration
or database failure 503. Error JSON has `ok: false`, a code/message and red/warning
feedback. Only transport errors and 503 should be retried with the same request ID.

## Storage and notifications

The service-role-only `record_rfid_tap` RPC atomically validates card/account/student,
serializes the student's writes, updates existing `attendance_records`, stores a
retry receipt in `rfid_tap_requests`, and inserts one **Pending** arrival SMS in
`sms_notifications`. The guardian number, student name and campus are captured
at arrival. Time Out and retries create no extra SMS. A Pending row is not proof
of delivery: **P06 now supplies the PhilSMS sender and Sent/Failed updates; configure it using PHILSMS-SETUP.md**.

The receipt table is private, RLS-enabled and has no portal access. The RPC is
unavailable to anonymous or signed-in portal roles. It uses the database clock by
default. Its optional timestamp argument is only for trusted server/database tests;
the HTTP route never accepts or forwards a timestamp from a device.

Existing attendance, card and SMS data remain intact. Legacy non-attended daily
rows or out-of-order timestamps are rejected for review, never silently rewritten.
Subject confirmation snapshots are independent. Realtime uses the existing
attendance/SMS publication and dashboard subscriptions; broader reconnect fixes
remain P07.

## Install and test

1. Apply `supabase/migrations/202609140001_rfid_tap_processing.sql`, then
   `supabase/migrations/202609140002_teacher_confirmed_late.sql`, after the existing
   migrations. These add the writer/receipts and teacher Late support; they do not
   create test students, seed taps, send messages or rewrite attendance history.
2. Run read-only `supabase/verify_rfid_tap.sql`: expect **seven PASS** rows.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` on the server. Generate a separate device secret
   locally with `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))"`.
   Add the generated value as `RFID_DEVICE_API_KEY` to your server `.env` (and hosting
   environment if deployed). Never use a Supabase key as the device secret, prefix
   it with NEXT_PUBLIC_, commit it, or share it in chat. Restart the app.
4. For a local test, set the same device secret as `RFID_DEVICE_API_KEY` in your
   PowerShell session. From the project root run:

   ```powershell
   .\scripts\test-rfid-tap.ps1 -Uid '00:00:00:11'
   ```

   The UID must be assigned to an active student/account. This writes real test
   attendance and a Pending notification to the configured database. The script
   prints the request ID before sending. Retry with that ID to verify no Time Out
   is added by a retry:

   ```powershell
   .\scripts\test-rfid-tap.ps1 -Uid '00:00:00:11' -RequestId '<the printed UUID>'
   ```

5. Run with no `-RequestId` for the second distinct test tap: Time Out is saved.
   A third fresh ID is rejected. Verify only one Pending arrival notification and
   unchanged subject confirmations. Test teacher Present/Late/Absent separately.
   UIDs 00:00:00:11 through 00:00:00:55 are authorized temporary test values, not
   verified physical card identities. Avoid a student/day with existing tap data
   when checking the first-tap flow.

Optional rollback: `supabase/rollback_rfid_tap.sql` revokes the service-role writer
and preserves all rows/receipts; reapplying the migration restores it.
`supabase/rollback_teacher_confirmed_late.sql` disables subject confirmation writes
without removing any Late history. Neither rollback script is a setup step.

Local proof uses PGlite migrations/transactions, actual route code with boundary
mocks, subject action/PDF tests and Chromium fixtures. Hosted deployment, multiple
PostgreSQL connections, provider delivery and physical hardware need live checks.
