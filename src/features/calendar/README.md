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
creation/editing/lifecycle controls are complete in Task 19, and the delivery log and sync
controls are complete in Task 20.

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

## Entry forms and lifecycle dialogs (Task 19)

New announcements save as drafts. Edit controls preserve status. Tags determine
attendance impact; exceptions require a reason, everyone audience, and all-day
dates. Campus scope supports all campuses or explicit selections. Historical
attendance scope is locked; cancel and create a new entry to replace its remaining
schedule. Published edits send updates only when Notify recipients is checked
and important fields change.

Publication and republication require a successful recipient-count preview.
Counts are informational; the mutation resolves recipients again. Confirmation
dialogs describe notification and attendance effects. Failed mutations stay open
with errors; pending mutations prevent repeated submission or dismissal.
The shared DateRangePicker opts into future dates and one month here; reporting
callers retain their existing defaults.

Run form/action checks with `node --test tests/calendar-form.test.mjs`.
Run `node tests/calendar-dialogs.browser.mjs` for isolated, mocked browser checks.
Install optional `esbuild` and `playwright` outside the repository in the temporary
`rfid-browser-tools` directory, or set `CALENDAR_BROWSER_TOOLS` to their package
root. Set `CALENDAR_CHROMIUM` to an existing Chromium executable if needed.
The harness compiles the real UI and styles, mocks server actions, writes temporary
screenshots, and never writes hosted data or sends notifications. It checks
validation, lifecycle choices, recipient preview retries, keyboard focus/Escape,
and mobile form/date-picker bounds. Full role workflows remain Task 29.

## Delivery log and maintenance (Task 20)

Open the Email deliveries tab at `/admin/schedules/calendar?tab=deliveries`.
Verified administrators can filter by entry ID, notification type, delivery
status, and inclusive creation dates in Asia/Manila. Results paginate 25 rows,
ordered by creation time and ID. Stored HTML and plain-text payloads are not
sent to this view. Sent means provider acceptance, not confirmed inbox delivery.
The existing LiveRefresh component refreshes delivery changes; Refresh also
reloads the current view manually.

Retry email targets one eligible failed row. Retry batch targets all eligible
failures in that batch, including rows outside the displayed filters. Both
require an explicit dialog submission and reuse stored payloads. Pending, sent,
and uncertain attempts have no retry control. Check provider records before
manual recovery of uncertain attempts; pending rows may require scheduling
investigation. A successful retry response means queued, not delivered.

Preview recipients is available alongside entry actions and never sends email.
Sync attendance marks accepts an inclusive range of up to 366 days and displays
created/removed counts. The database preserves dates before today in Manila,
RFID evidence, and SMS records. It reconciles all campuses, independently of
current delivery filters.

`tests/calendar-delivery.test.mjs` covers access, filters, pagination, selected
columns, sync validation, retry visibility, and escaped rendering. The isolated
`tests/calendar-dialogs.browser.mjs` harness also covers preview, sync, row and
batch retry, errors, and duplicate-submit prevention with mocked actions. Hosted
realtime, actual retries, and real sends were not exercised.

## Teacher/student calendars and navigation (Task 21)

Open `/teacher/calendar` or `/student/calendar` through the role's Calendar
navigation item. Administrators have Calendar after Class Schedules in the
Schedules submenu. Routes and the reader feature require the exact role before
reading data. All reader queries use the authenticated Supabase client and the
existing campus/audience RLS policies; drafts are excluded explicitly as well.

The two reader routes share a read-only month grid, day details, and a mobile
agenda. Published normal events, no-class/online exceptions, and cancelled
announcements appear on every overlapping date. Every item includes campus
scope; cancelled entries have a text badge and no current/future attendance
guidance. Admins reuse the same month-grid component, including accessible day
labels and capped status dots. Reader views expose no mutation controls.

`date=YYYY-MM-DD` selects a day and infers its month. `month=YYYY-MM` selects a
month; a mismatched or invalid date falls back to today in that month or its
first day. Month/day controls and upcoming links preserve date/month parameters.
Dates use the existing Manila calendar parser. Upcoming entries include ongoing
published announcements and dates through today plus 29 days, with a 50-entry
cap. Cancelled entries remain visible in the calendar but never in upcoming.

`tests/calendar-reader.test.mjs` covers scoped query construction, reads beyond
server caps, upcoming bounds, role guards, deep links, safe failure handling,
read-only rendering, campus/cancellation labels, escaping, and navigation order.
The isolated browser harness checks reader mobile layout, date/month/upcoming
links, and desktop keyboard selection. Database RLS visibility is covered by the
existing calendar migration test. Full hosted role sessions and notification
integration remain later tasks; no hosted writes or real sends are performed.

## Header notifications and session toast (Task 22)

The portal header shows the notification bell for active teacher/student
accounts. Notification reads stream inside their own Suspense boundary; failed
reads hide the bell without failing portal content. A layout-level LiveRefresh
subscription remains mounted independently, so subsequent changes or recovery
can refresh the data. Admins have neither the bell nor the session toast.

The bell displays up to 20 published entries in the approved ends-on/seven-day
window. Campus/audience restrictions remain enforced by authenticated RLS. Its
unread count covers displayed entries; no receipt or a receipt older than the
entry's latest update means unread. Selecting an item awaits the existing read
action before navigating to that role's date link. Failed reads stay in the bell
with a retryable message. Mark all read uses the existing uncapped action,
including unread entries beyond the display limit.

The latest unread bell item produces an existing gooeyToast with a calendar
action. No-class/online states lead the message; tags, impact, dates, and campuses
appear in the description. sessionStorage uses `calendar-login-toast:<user-id>`
to suppress further toasts for that user in the browser tab session. An empty or
fully read bell does not consume the session marker. Blocked storage skips the
optional toast; the bell remains available. The toast's calendar action does not
mark an announcement read; bell selection is the read surface.

Default LiveRefresh tables now include calendar entries and attendance marks.
Reader layouts use a distinct user channel for entries, own receipts, and marks.
The admin calendar subscribes to entries/marks; delivery rows retain their own
existing subscription. Existing debounce, dialog preservation, reconnect,
visibility, offline, and Manila-midnight recovery behavior is reused.

`tests/calendar-bell.test.mjs` verifies scope, receipt mapping, latest unread,
session storage, role exclusion, defensive reads, and layout independence.
`tests/live-refresh.test.mjs` covers subscriptions and recovery. The isolated
browser harness mocks actions/toasts and checks bell errors, read navigation,
mark-all, mobile bounds, session reload suppression, user changes, and empty
state. Hosted realtime and actual multi-tab sessions remain rollout checks;
these checks make no hosted writes and send no email.
