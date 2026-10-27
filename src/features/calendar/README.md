# School Calendar and Announcements

Admin: `/admin/schedules/calendar`. Teacher/student: `/teacher/calendar` and
`/student/calendar`. The module includes entry lifecycle controls, scoped readers,
header notifications, dashboard posts, email dispatch/retries, and shared
attendance exceptions used by dashboards, Daily Attendance, history, and reports/PDF.
Daily Attendance is read-only; Subject Attendance remains independently editable.

Apply all nine [calendar migrations](../../../supabase/migrations/README.md)
before deploying the matching app. The original seven were verified on preview;
the email/RFID extensions are local-only. [Calendar-TODO.md](../../../Calendar-TODO.md)
tracks approvals, local browser results, and remaining rollout checks. Physical-reader testing is
deferred by request. Local tests never prove hosted realtime or actual delivery.

The feature layer owns validation, role guards, audit, RPC mutations, and UI
composition. [Calendar services](../../services/calendar/README.md) own persistence
and authenticated reads. The attendance resolver is shared by all consumers;
it never rewrites raw RFID, SMS, or Subject Attendance evidence.

## Email setup

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

Portal navigation and calendar tab links preload full route data on hover or
keyboard focus, rather than eagerly loading every visible panel. Current pages
and admin reports are excluded; report reads synchronize marks and must wait for
actual navigation. Authentication still validates the user first, then performs
email verification and the scoped account read concurrently. Existing session,
role, and active-account guards remain enforced.

Calendar mode skips hidden list/delivery queries. List delivery reads overlap the
independent overview/campus reads, while preserving page clamping and errors.
Calendar realtime subscriptions include delivery changes so email totals stay
fresh. Deferred-read tests verify concurrent execution without timing thresholds;
browser tests cover intent preloading and keyboard/tab behavior. Hosted latency
has not been benchmarked, and development mode still incurs first-route compilation.

Open `/admin/schedules/calendar` as a verified active administrator. This task
provides Calendar, All announcements, and Email deliveries tabs. Sidebar navigation is complete in Task 21;
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

New announcement creation uses four steps: Announcement, Audience, Schedule, and
Review. Each step validates its own fields; Back preserves the draft. Optional
supporting details stay collapsed, and attendance impact follows tags rather than
presenting redundant choices. The final review shows normalized values and is the
only step that saves. Enter advances earlier steps without writing. Save errors
return to the relevant step; navigation stays visible while the body scrolls on
mobile. Existing edit controls retain their full-form workflow and historical locks.

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
existing calendar migration test. Notification integration is complete below;
full hosted role sessions remain operational checks. No hosted writes or real
sends are performed by the local checks.

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

## Dashboard announcements (Task 23)

Teacher and student dashboards render shared announcement posts above the RFID
heading and KPI cards. The server component uses the current verified account,
excludes administrators, and reads through authenticated campus/audience RLS.
Empty or failed announcement reads return no posts. A separate Suspense boundary
keeps announcement reads independent of attendance content.

Posts include tags, attendance impact, campus scope, inclusive dates, a reason
or description excerpt, and a role-specific View calendar link. Reading a post
or opening its calendar link does not create a read receipt. Bell selection
remains the read surface.

The query includes only published entries newer than exactly seven days before
now and no later than now. Pinned entries sort first, followed by publication
time and ID descending, with a three-item limit. Pins and ordinary edits do not
extend expiry. Republishing changes published_at and restarts the seven-day
window. An open dashboard removes expired posts at their deadline and refreshes
for replacements; visibility recovery handles a delayed background timer.
Existing calendar realtime subscriptions handle publication and cancellation.

`tests/calendar-posts.test.mjs` covers strict query bounds, ordering/limit,
republish visibility, role guards, empty/failure fallback, safe rendering, role
links, and placement above KPIs. The isolated browser harness checks mobile and
desktop layout, expiry at the exact boundary, republish visibility, empty posts,
and absence of read-action calls. Hosted role/realtime sessions remain rollout
checks; no hosted writes or real sends are performed.

## Shared attendance state and calculations (Task 24)

`src/services/calendar/attendance-state.ts` reads the inputs for an inclusive
range with the authenticated Supabase client. Today is the Asia/Manila date.
Today/future inputs come from the security-invoker calendar_attendance_days
view; earlier inputs come only from attendance_day_marks. Both reads paginate
past response caps with stable ordering. Invalid/reversed ranges and read
failures propagate; a failed read must never be treated as normal attendance.
Historical ranges may exceed the entry form's 366-day limit. This service never
synchronizes or writes marks.

`createCalendarAttendanceResolver` indexes these inputs once and resolves a
student ID, campus, and date. Today/future matches the campus exactly, with
OnlineManual taking precedence over NoClasses. All-campus entries are already
expanded into campus rows by the database view. Past dates use the student's
immutable snapshot, including its stored campus and source entry ID. They do
not depend on current entry visibility/status or the student's current campus.
Missing past snapshots are Normal; no historical exceptions are reconstructed.
Current/future snapshots are deliberately ignored in favor of the effective
view, so cancellation and transfers apply to the whole current Manila day.

`summarizeCalendarAttendance` accepts explicit scoped student/session-day rows
and the resolver. It counts eligible (Normal) student-days separately from
NoClasses and OnlineManual. Exception-day RFID records remain untouched but do
not enter present/late/absent totals or rates. Late counts as present. Missing
records remain provisional, and legacy statuses remain separate. Identical
student/date duplicates count once; conflicting duplicates fail explicitly.
Callers select the legitimate roster/session dates; these functions do not
invent school days, historical roster membership, or absences.

`expectedStudentDays` counts eligible supplied student-days.
`rateDenominator` preserves the existing recorded-decision policy: Present
(including Late) plus explicitly stored Absent. NoRecord and legacy records do
not enter that denominator. Rates are percentages and return null when the
denominator is zero, including when no student is expected. A recorded all-absent
normal day still has a real 0% rate. This distinction preserves the unresolved
absence-finalization policy documented in the attendance module.

`buildCalendarAttendanceTrend` uses the same exclusions and weighted counts.
It returns the latest 14 daily, 12 Monday-based weekly, and six calendar-month
buckets, matching existing dashboards. Entirely excluded dates remain as
null-rate points. Buckets add counts before calculating rates; they never
average daily percentages. No unprovided dates are added.

`tests/calendar-attendance-state.test.mjs` covers mixed campuses, online
precedence, historical transfers/cancellations, missing snapshots, stale current
marks, provisional/legacy records, duplicate handling, null rates, weighted
buckets, caps, Manila midnight, complete paging, invalid ranges, and read errors.
Dashboard, attendance, and report consumers use this foundation in Tasks 25–27.


## Dashboard consumers (Task 25)

All three dashboard features now consume the Task 24 state read service and
resolver. Admin and teacher aggregation uses one shared helper for eligible
student counts, exception distributions, current campus strips, and weighted
historical trends. Duplicate private trend calculations were removed. Nullable
rates render as a dash and never reach numeric animations or rate subtraction.
The admin dashboard still has no announcement post.

Student cards show the effective current exception while keeping recorded tap
and SMS evidence. Student historical totals respect stored exception snapshots.
Today/future cancellation restores normal decisions; historical exclusions
remain. No calendar integration writes or synchronizes marks on dashboard reads.

`tests/calendar-dashboard.test.mjs` covers mixed campuses, current cancellation,
all-exception null rates, retained taps/SMS, historical exclusions, state-load
failures, student guidance, and rendered KPI/distribution values. Normal dashboard,
legacy, report, and attendance regressions remain covered. The isolated browser
harness renders real KPI, NumberFlow, chart, strip, and student-card components
with mocked data, including mobile layout and mixed/all-exception rates.
Daily Attendance and report/PDF consumers are integrated in Tasks 26–27. Hosted database and
realtime observation remain rollout checks; no real hardware or sends are used.


## Daily Attendance consumers (Task 26)

Admin, teacher, and student attendance surfaces now consume the shared calendar
resolver. Daily tables display scoped exception badges and campuses while
retaining recorded times. Read-only exception filters and separate counts agree
with cohort and status filters; writable attendance decisions remain unchanged.

Student history merges retained tap records with calendar-only exception days.
Past exceptions use immutable snapshots without source-entry joins; today's
exception uses current campus state. No historical exceptions are reconstructed
from current publication or campus. Virtual rows have prefixed display IDs and
no tap evidence. Real rows retain original status and tap campus for details,
including card and SMS history. No calendar history view writes marks, daily
records, read receipts, or Subject Attendance.

`tests/calendar-daily-attendance.test.mjs` covers filter/status contracts, mixed
campus rows and counts, historical campus identity, cohort filters, virtual
history, retained evidence, read failures, and read-only tables. Subject action
checks confirm the three real attendance decisions remain available on exception
dates and reject calendar display states as writes. Existing subject database,
report, dashboard, and attendance regressions pass. The isolated browser harness
checks actual filters, read-only tables, student details, and mobile/desktop
layouts with mocked data. Reports/PDF are integrated in Task 27. Hosted validation, real
sends, and physical reader testing are not performed here.


## Reports and PDF consumers (Task 27)

Admin and teacher reports now use the shared state resolver. Date/campus/state
exception summaries count affected student-days, including archived admin
snapshots without RFID rows. Historical source entries do not need to remain
visible or published. Current campus membership never backfills a past exception.

Only authorized admin report/export entry points run audited mark reconciliation,
before fetching report inputs. SQL preserves dates before today in Manila.
Teachers perform no mark sync. Sync/read failures stop report generation. Both
the report helper and existing calendar sync action use the actual RPC argument
names p_from and p_to. The report helper avoids render-time path revalidation.

Report/PDF rates exclude NoClasses and OnlineManual student-days, with null rates
for zero eligible recorded decisions. Tap times, scans, card identities, recorded
campuses, and admin SMS history remain retained evidence. PDFs include calendar
exceptions and preserve the independent Subject Attendance confirmations. No
calendar exception is counted as a manual confirmation. Local tests exercise
actual PDF layout/text, authorization, scope, and mocked responsive rendering;
no hosted synchronization or real sends occur during these checks.

## Regression verification (Task 28)

Verified locally on 2026-10-27. Documentation now covers implemented role routes,
feature/service ownership, environment behavior, nine-migration ordering, preview
limitations, recovery, attendance/history/report rules, and all four log entities.
The missing `calendar_entry_reads` filter is now selectable; its regression also
checks repeated search tags and category URLs. The old string-search assertion
was updated to the existing tag-array contract. ESLint excludes the generated
`.tmp-video-tools` tree, avoiding bundled third-party development artifacts.

| Command | Result |
| --- | --- |
| `node --test --test-concurrency=2 tests/*.test.mjs` | 593 tests: 572 pass, 21 fail, 0 skipped |
| `node node_modules/eslint/bin/eslint.js .` | Fails: 1 error and 1 warning, detailed below |
| `node node_modules/typescript/bin/tsc --noEmit` | PASS |
| `npm run build` | PASS, including all three calendar routes |
| `git diff --check` | PASS |

Passing suites include calendar database/RLS/lifecycle/recovery, queries/actions,
receipt/email/notification logic, attendance/dashboards/history, RFID route/USB/
serial/writer behavior, mocked SMS, Subject Attendance, reports/real PDF rendering,
profile lifecycle, and live refresh. Provider calls use mocks; database tests use
disposable PGlite instances. These results do not imply real provider delivery.

Remaining failures are release blockers, not passing acceptance:

- All 21 `tests/account-access.test.mjs` cases fail from a shared setup error:
  `role "service_role" does not exist` when applying later email migrations. A
  diagnostic addition of the missing fixture role exposed further assumptions
  about later schema fields and verified sessions; that temporary edit was reverted.
  The older account-access suite needs its own fixture/verification update. Its
  assertions have not proved access behavior in this run; calendar-specific RLS
  and lifecycle suites passed independently.
- `fix-email.js:1`: `@typescript-eslint/no-require-imports` error. This existing
  one-off script was not changed or run.
- `src/components/ui/combobox.tsx:279`: unused `children` warning. The component
  was not changed by this documentation/log-filter task.

Task 28 completes documentation and regression reporting; the repository is not
all green and is not approved for rollout. Task 29 owns the next browser/accessibility
checks. No hosted migrations, synchronization, deployment, email/SMS sends, or
physical-reader checks were performed. Task 17 remains deferred by request;
hosted realtime, true multi-session locks, sender delivery, and the two newer
migrations still require the separately approved rollout checks.

## Browser and accessibility verification (Task 29)

Verified locally on 2026-10-27 with Chromium and the isolated real-component
harness, `tests/calendar-dialogs.browser.mjs`. Server actions, navigation, toasts,
and realtime are mocked; this is not a hosted session or a real recipient send.

Coverage includes draft/edit/publish/cancel/republish/delete workflows, validation
and historical scope, recipient-preview failure/recovery, sync/retry controls,
admin calendar/list/delivery tabs and filters, definite versus uncertain delivery
retry visibility, teacher/student links, read receipts and failure recovery,
once-per-user session toasts, pinned posts, exact expiry, and republish visibility.
Attendance/history/report checks preserve raw evidence and null rates. Reader
views expose no mutation controls; separate real-SQL tests verify draft, audience,
campus, own-receipt, delivery, inactive-account, and unverified-session boundaries.

Keyboard checks cover Enter activation, calendar arrow navigation, 48 consecutive
Tab presses within the entry dialog, Escape/focus restoration, and horizontal
exception-table scrolling. Two defects were corrected: action containers now use
a named `group` role, and the exception table is named, focusable, and visibly
outlined for keyboard scrolling. Existing table structure and business rules stay
unchanged.

The harness performs 32 axe-core 4.14.0 component scans across light/dark themes,
using WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags. Zero automated violations remain.
Scans run after functional timing checks with transitions disabled; intermediate
animation opacity is not treated as final text contrast. Reader layouts are checked
at 320, 375, 768, and 1280 pixels without page overflow. Screenshots include mobile
forms, date pickers, bells, readers, delivery logs, dashboards, history, and reports;
light/dark mobile reader and delivery views were reviewed.

`accessibility.json` retains incomplete checks. These concern unmounted popup
references, a third-party empty ARIA attribute, short text, or overlapping/clipped
content whose contrast the scanner cannot resolve. Popup activation, naming,
focus restoration, and the visible layouts were checked separately. Screen-reader
testing and full portal landmark/navigation behavior remain manual checks; zero
automated violations is not accessibility certification.

Validation: 113 role/database/email/notification/live-refresh checks and 21
admin/form/delivery/report checks pass (130 distinct tests; four delivery checks
occur in both commands). Focused ESLint, project TypeScript, production build,
and whitespace checks pass. The Task 28 full-suite account-fixture failures and
global lint error/warning remain unresolved release blockers; they were not
reclassified as passing or changed by this task.

Optional tooling stays outside the app dependency tree. Install `playwright`,
`esbuild`, and `axe-core` together in the directory selected by
`CALENDAR_BROWSER_TOOLS` (default: `%TEMP%/rfid-browser-tools`). For an existing
Chromium install, run in PowerShell:

```powershell
$env:CALENDAR_CHROMIUM = "$env:LOCALAPPDATA/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
node tests/calendar-dialogs.browser.mjs
```

The command prints a temporary artifact directory containing screenshots,
`accessibility.json`, and `result.txt`. No browser tools were added to package.json.
Hosted role sessions/realtime, real provider delivery, simultaneous PostgreSQL
connections, hosted email/RFID migrations, deployment, and deferred hardware
verification remain operational checks. Task 30 requires the exact target and
release actions to be confirmed; real pilot recipients need explicit approval.

## Manual rollout (Task 30; operator-confirmed completion)

On 2026-10-27 the operator chose to upload manually. The
[manual rollout handoff](../../../CALENDAR-ROLLOUT.md) provides a target/version
record, nine migration checksums, missing-migration ordering, read-only calendar
verification, role-access verification, environment setup, pilot approval and
acceptance, and recovery. No deployment target is linked locally, and the local
Resend key, sender, and app URL are unset. Hosted values were not inspected.

The Task 28 account-suite failures are resolved without changing production
authorization. The fixture now supplies the existing service role, verified
session claims, and documented defaults from later additive migrations. It checks
the original P01 policy tables independently of newer tables, expects disabled
accounts to be hidden by the later email gate, and proves that a P01-only rollback
does not remove that gate. The owner-run account verification script now creates
rollback-only session rows when email verification is installed and remains
compatible with the earlier schema. Tests verify both stages and session-row
preservation. The existing `fix-email.js` helper uses a standard ESM import; it
was linted but was not run against source files.

Current local results supersede the earlier Task 28/29 gate failures: all 594
tests pass with no skips; project TypeScript and production build pass. Global
ESLint passes with zero errors and one existing unused-children warning in
`combobox.tsx`. No unrelated component behavior was changed to remove that warning.

After choosing manual upload, the operator reported "all are passed". Task 30 is
complete based on that confirmation. The target/version, migration output, and
pilot/provider evidence were not supplied; hosted results were not independently
verified by the assistant. The assistant performed no hosted SQL, deployment,
publication, real send, or physical-reader test. Task 17 remains deferred. Future
pilot sends still require explicit approval for the concrete recipients/content.
