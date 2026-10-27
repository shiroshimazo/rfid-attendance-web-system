# Attendance

Daily time-in/time-out rules, recorded attendance totals, filters, realtime
updates, and role-scoped attendance views. Late counts as attended.

Absence finalization is an unresolved school-policy decision under P05 in the
scope audit. Do not assume automatic absence generation or a nightly job. Keep
missing records provisional until that rule is defined.


## Dashboard calendar integration (Task 25)

Admin, teacher, and student dashboard entry points load calendar state through
the authenticated calendar read service using the same Manila date as their
attendance snapshot. Admin roster reads now include campus. Calendar read errors
propagate to the existing dashboard error state; they never silently produce
normal attendance. These reads do not synchronize or write snapshots.

Admin and teacher dashboards share `calendar-dashboard.ts`, which uses the
Task 24 resolver, counts, and weighted trends. Today includes every scoped roster
student. Historical trend samples come from recorded current statuses plus
immutable exception snapshots for those students; missing past normal days are
not invented. Current student campuses never reconstruct past exceptions.

Calendar exceptions override dashboard row status and are counted separately in
the distribution. Recorded tap times remain visible. Eligible student counts,
present/late/absent totals, group breakdowns, and daily/weekly/monthly trends
exclude affected student-days. Rates preserve the recorded-decision denominator;
missing taps remain provisional. Empty denominators render as a dash in KPIs and
distribution readouts, suppress rate deltas, and become chart gaps. An entirely
unrated trend displays an explicit empty state. Campus status strips identify
only affected campuses in the dashboard's roster, with scoped student counts.
Legacy rows remain visible without becoming attendance decisions or chart slices.

Student dashboards display No classes or Online / manual guidance on today's
card, including the Subject Attendance reminder. Retained tap times and the
existing SMS result stay visible. Personal present/late/absent totals exclude
current effective and historical snapshot exceptions. Total RFID taps remains
a count of retained evidence through today; future records do not enter totals.

Daily Attendance pages, student history panels, and report/PDF integration remain
Tasks 26 and 27. Dashboard links can therefore lead to evidence views whose
calendar display integration is still pending. Writable attendance statuses,
Subject Attendance, RFID/SMS persistence, and database migrations are unchanged.


## Daily Attendance and student history (Task 26)

Admin and teacher Daily Attendance reads combine their existing scoped snapshot
with read-only calendar inputs for the selected date. The admin roster includes
campus. The resolver applies current effective campus state today/future and
immutable per-student snapshots for past dates, including the snapshot's campus.
Calendar failures propagate instead of assuming normal attendance.

NoClasses and OnlineManual are display/filter states only. The writable status
array remains Present, Late, and Absent. Existing NoRecord and legacy behavior is
preserved. Normal eligible students enter present/late/absent/no-record totals;
calendar exceptions have separate counts and are excluded from eligible shares.
Non-status cohort filters apply before counts; status filters change displayed
rows without changing the cohort totals. Both daily tables remain read-only and
retain stored tap times alongside the resolved badge/campus.

Student history also includes exception dates without a recorded tap. Historical
dates come only from that student's snapshots; today's exception comes from the
effective view. Calendar-only rows use a prefixed display ID and `hasTap: false`;
they do not create database records, tap times, card assignments, or SMS evidence.
Actual tap rows retain their numeric ID, original status, tap campus, card, times,
and SMS fields. Where the exception campus differs, details label both campuses.
Cancellation removes the current virtual exception, while past snapshots remain.

Student totals and rate exclude exception decisions and future rows. Zero
recorded-decision denominators render as a dash. Exception counts appear in the
history chart and have role-local filter links. Looking at a calendar-only detail
shows calendar guidance and no RFID assignment badge. Retained evidence remains
visible separately from the calendar display status.

Subject Attendance remains editable for Present, Late, and Absent independently
of calendar exceptions. No subject production code, writable enums, daily write
endpoint, migration, or RFID/SMS mutation is added. Report/PDF integration remains
Task 27. The Subject History regression fixture was updated from string searches
to the existing tag-array contract; its production behavior is unchanged.
