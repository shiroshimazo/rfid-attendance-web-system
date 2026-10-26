# Calendar email

Task 14 provides HTML/plain-text templates and a Resend batch adapter. Delivery
storage, triggers, after-response sending, chunking, and retries belong to Task 15.
Nothing currently calls the adapter from a calendar action.

Configure `RESEND_API_KEY`, `CALENDAR_EMAIL_FROM` (a bare email address or
`School Calendar <calendar@school.example>`), and `NEXT_PUBLIC_APP_URL` (the public
HTTPS origin, without credentials, path, query, or fragment). Optionally set
`CALENDAR_EMAIL_REPLY_TO`. Keep the Resend key server-only. The sender domain must
be verified in Resend; local configuration checks cannot verify domain ownership.

`renderCalendarEmail` requires the recipient's teacher/student role, including
for everyone-audience entries. It renders campus scope, dates, optional times,
location, reason, description, impact guidance, and a role-specific date link.
HTML fields are escaped; plain text and subjects remain readable.

`sendResendBatch` accepts 1–100 individually addressed messages and a stable
idempotency key. It sends one request, with a 10-second timeout and no redirects
or automatic retries. Successful IDs correspond to input order. Acceptance is
not proof of inbox delivery. HTTP failures return safe status-only errors;
network failures, server errors, and malformed success responses return unknown
acceptance. Callers must preserve that distinction when implementing retries.

Verified against [Resend batch API documentation](https://resend.com/docs/api-reference/emails/send-batch-emails)
on 2026-10-26: batch limit 100, ordered `data[].id`, and `Idempotency-Key` (maximum
256 characters, expires after 24 hours). Reusing a key after expiry does not
prevent duplicate sends. The adapter restricts keys to letters, digits, `_`, `/`,
and `-` so they are safe as headers.

Run mocked checks with `node --test tests/calendar-email.test.mjs`. These tests
never send email. Real delivery requires a verified sender and explicit pilot approval.
