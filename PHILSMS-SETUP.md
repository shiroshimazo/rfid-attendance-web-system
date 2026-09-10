# P06: PhilSMS setup and acceptance

Implementation is ready for configuration and live testing. No SMS was sent by
the assistant. Use your own test recipient before testing guardian numbers.

## 1. Prepare your PhilSMS account

Sign in to your PhilSMS account. Obtain its API token, an authorized sender ID,
and sufficient SMS credits. Use the exact sender ID available/approved for your
account; an example school name in this guide does not register a sender.

PhilSMS's public [API documentation](https://app.philsms.com/developers/documentation)
specifies Bearer authentication, recipient numbers such as `639171234567`,
`sender_id`, `type` (`plain` or `unicode`) and `message`. Alphanumeric sender IDs
are limited to 11 characters. The public endpoint is
`https://app.philsms.com/api/v3/sms/send`.

Your supplied dashboard URL uses `dashboard.philsms.com`. Check the API example
inside that account: if it explicitly uses
`https://dashboard.philsms.com/api/v3/sms/send`, use that value instead. Both
exact URLs are allowed by this implementation. The dashboard documentation could
not be accessed during implementation, so its account-specific endpoint was not
independently confirmed. Do not change domains merely to work around a failed send.

## 2. Install the database changes

In Supabase SQL Editor, run:

1. [202609150001_philsms_arrival_delivery.sql](supabase/migrations/202609150001_philsms_arrival_delivery.sql)
2. [verify_philsms_delivery.sql](supabase/verify_philsms_delivery.sql) — expect **five PASS rows**.

The migration preserves all existing SMS/attendance records. Old notifications
are not eligible for automatic sending. Only new P04 arrivals can be claimed.
Do not run rollback scripts during setup.

## 3. Configure the web server

Add these to the project's `.env` file, replacing placeholders locally:

```dotenv
PHILSMS_ENABLED=true
PHILSMS_API_TOKEN="YOUR_PHILSMS_API_TOKEN"
PHILSMS_SENDER_ID="YOUR_SENDER"
PHILSMS_API_URL="https://app.philsms.com/api/v3/sms/send"
```

Keep your existing Supabase and `RFID_DEVICE_API_KEY` settings. The PhilSMS token
is separate from both. Do not paste secrets into chat, commit `.env`, or prefix
these settings with `NEXT_PUBLIC_`. No Supabase Auth SMS/phone-login configuration
is needed: this is an attendance notification, not an authentication OTP.

If deployed, add the same variables in the hosting provider's environment settings
and redeploy. Locally, stop and restart the development server with `pnpm.cmd dev`.
Set `PHILSMS_ENABLED=false` and restart whenever you need to stop new sends.

## 4. Set a test recipient

In Admin > Students, edit the test student's parent/guardian contact to a phone
you control. Accepted formats include `09171234567`, `639171234567` and
`+639171234567`; the sender normalizes them without assuming network from prefix.
Use one recipient per student. The number and campus message are captured at
Time In; editing the profile afterward does not change that stored notification.

## 5. Make a fresh arrival

Use an assigned temporary UID for a student who has no Time In today. In the same
PowerShell session used for P04 (with `RFID_DEVICE_API_KEY` already set), run:

```powershell
.\scripts\test-rfid-tap.ps1 -Uid '00:00:00:22'
```

Use a UID actually assigned to your test student. The command writes attendance
and, when configured, **sends a real SMS using your account credits**. Do not use
an old completed attendance request to test a new arrival.

The tap should return `ok: true` and `action: time_in`. SMS processing is awaited
with an eight-second provider timeout; failure does not turn the accepted tap
into a failed attendance record.

## 6. Verify the result

Open Admin > Reports, select today's date, then SMS Notification Records. Check
the test student's notification and inspect the recipient's phone and PhilSMS
message log. Existing student dashboard/history views read the same saved status.

| Status | Meaning in this integration |
|---|---|
| Sent | PhilSMS returned API success; `sent_at` records acceptance time. This is not handset delivery confirmation. |
| Failed | Invalid phone number or an explicit provider rejection. |
| Pending | Disabled/missing configuration, no attempt yet, an old ineligible record, or an uncertain/interrupted attempt. |

To inspect a record without sending anything, run in Supabase SQL Editor:

```sql
select id, attendance_id, sms_status, sent_at, delivery_enabled,
       delivery_started_at, delivery_result, provider_message_id
from public.sms_notifications
order by id desc
limit 20;
```

`accepted` means API acceptance; `rejected` means the provider rejected the request;
`invalid_recipient` means no send was attempted; `unknown` means delivery is
uncertain. `attempt_started` without a final result may mean the process stopped
or the database completion save failed. Check PhilSMS's log before any manual
correction; **do not clear the attempt marker to retry blindly**.

## 7. Check duplicate protection and networks

Repeat the successful arrival's original request ID as in the P04 test. It must
not send another SMS. A distinct second tap records Time Out without another
arrival message. Test Smart, Globe and DITO with recipients you control, and verify
the actual phone receives the message before marking live acceptance complete.

Also verify messages contain the correct student/campus for your three campuses.
Invalid contacts/provider rejection must leave attendance intact. PhilSMS advises
against repeated near-identical test messages to the same number; spread test
cases across your test recipients instead of repeatedly resending.

## Delivery limits and recovery

Each arrival has one durable send attempt. The documented API does not specify an
idempotency key, so a timeout or crash must not cause automatic resending. Such
records remain Pending for provider-log reconciliation; the application does not
claim guaranteed delivery. Sent records are not later reconciled with delivery
receipts in this implementation.

Unclaimed new arrivals can be attempted through a retry of their original Time In
request within ten minutes of creation. There is no backlog worker or automatic
historical send. If configuration was missing, fix it and test a new arrival.
Failed or uncertain attempts are not retried automatically. Duplicate notification
rows for an attendance ID are rejected for review rather than sending both.

Optional rollback: disable PHILSMS first, then run
`supabase/rollback_philsms_delivery.sql` to revoke the sender RPC access. It keeps
all data and attempt markers. Reapply the migration to restore access.
