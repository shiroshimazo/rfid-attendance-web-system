# Calendar email

Tasks 14 and 15 provide templates, the batch adapter, persisted delivery payloads,
after-response sending, and admin retries. Apply
`202610260001_calendar_email_dispatch.sql` before deploying the updated actions.
The migration has only been exercised locally; it has not been applied to preview
or production in this task.

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
acceptance. The dispatcher blocks retries for unknown acceptance.

Verified against [Resend batch API documentation](https://resend.com/docs/api-reference/emails/send-batch-emails)
on 2026-10-26: batch limit 100, ordered `data[].id`, and `Idempotency-Key` (maximum
256 characters, expires after 24 hours). Reusing a key after expiry does not
prevent duplicate sends. The adapter restricts keys to letters, digits, `_`, `/`,
and `-` so they are safe as headers.

Run mocked checks with `node --test tests/calendar-email.test.mjs`. These tests
never send email. Real delivery requires a verified sender and explicit pilot approval.

## Dispatch and retry

`mutate_calendar_entry` calls the existing validated lifecycle RPCs under their
shared advisory lock and returns the committed entry/recipient snapshot. Publish
and republish notify; cancellation notifies the resolved audience even though the
entry is now cancelled. Only published edits with `notifyRecipients: true` and
changed important fields notify. Pin-only edits, reordered tags/campuses, unchanged
edits, unchecked edits, and drafts do not notify. Admins are excluded in both SQL
and the application layer.

The action stores immutable subject/HTML/text and recipient values with a shared
batch UUID before scheduling `after()`. Duplicate persistence ignores existing
batch/user pairs. Dispatch claims rows using status, attempt count, and
`retry_allowed`, then sends at most 100 per request. Claims increment attempts and
record the attempt time before contacting Resend. Accepted rows become Sent with
provider IDs; rejected rows become Failed and remain retryable. No provider error
body, credential, or recipient address is copied into error messages.

`retryCalendarEmailAction({ id })` retries one failed delivery;
`retryCalendarEmailAction({ batchId })` retries eligible failures in a batch.
Both require a verified active admin and record an application audit event. They
reuse stored content and addresses, not the current entry or roster. Sender/reply
to credentials use current server configuration. Concurrent retry callbacks cannot
claim the same attempt. Each new definite-rejection retry gets a fresh provider
idempotency key; unknown attempts are never automatically resent.

Missing Resend configuration records failed deliveries without undoing the
calendar mutation. If the app URL is missing or invalid, the stored template omits
the calendar link. A later retry preserves that original content, including the
omission. Configure the app URL before publication to include calendar links.

## Operational limits

This uses no durable worker. A process failure between the committed mutation and
payload persistence can leave no delivery rows; a scheduling failure can leave
Pending rows. The action reports scheduling failures without claiming that the
calendar mutation failed. Investigate these cases before sending again.

A timeout, malformed success, server failure, or failure storing provider results
may mean Resend accepted the email. Such attempts have `retry_allowed=false`;
interrupted claims may remain Pending. Check provider records before any manual
recovery. Never unlock an uncertain attempt merely because it is old. Reconcile
confirmed accepted IDs as Sent; only reset confirmed unsent rows to retryable
Failed. This conservative rule also prevents resends after the provider's 24-hour
idempotency window expires.

Next.js [`after()` documentation](https://nextjs.org/docs/app/api-reference/functions/after)
confirms callbacks run after the response and remain subject to the host's route
duration limit. Hosted execution, true multi-session concurrency, sender
verification, and inbox delivery remain rollout checks.

Run focused dispatch checks with
`node --test tests/calendar-notifications.test.mjs tests/calendar-actions.test.mjs tests/calendar-migration.test.mjs`.
All delivery tests are mocked; database tests use disposable PGlite.

## Admin calendar browsing (Task 18)

Open `/admin/schedules/calendar` as a verified active administrator. This task
provides Calendar and All announcements tabs. Sidebar navigation is Task 21;
creation/editing/lifecycle controls are Task 19, and the delivery log and sync
controls are Task 20.

The calendar includes drafts, published entries, cancelled entries, normal events,
and every overlapping day of a multi-day entry. Desktop day cells show up to three
status dots with an overflow count and accessible announcement labels. Mobile uses
an agenda grouped by date. Selecting a date displays complete entry details.
`month`, `date`, and `tab` query parameters preserve the selected view.

KPIs cover all campuses: published entries active during the next 30 days
(including today), distinct dates with at least one published no-class entry in
the selected month, currently published entries published during that month in
Asia/Manila, and all failed delivery rows. Campus overlaps do not multiply the
no-class day count. The published count uses timestamp boundaries, not UTC dates.

List filters are independent of the calendar month and KPIs: literal title search,
status, tag, attendance impact, audience, campus, and inclusive overlap dates.
Campus filters include all-campus entries. Reversed date bounds are normalized;
invalid filters fall back to defaults. Lists paginate 20 rows with stable ordering
and clamp out-of-range pages. Calendar, campus, and delivery-summary reads page
past server response caps. Delivery counts describe stored status, not confirmed
inbox delivery. Read failures display a retry panel instead of fabricated zeros.

`tests/calendar-admin.test.mjs` covers query normalization, leap years, month
clipping, filters, pagination/caps, authorization, KPIs, component rendering,
escaping, empty states, and read errors. Production compilation is verified;
interactive browser, mobile layout, and keyboard observations remain Task 29.
