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
