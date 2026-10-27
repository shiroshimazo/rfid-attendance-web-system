# Feature modules

Business logic belongs in the domain folders below. Route pages should compose these features rather than contain database queries or duplicate role-specific implementations.

The active release backlog is [RFID-DOCS-SCOPE-AUDIT.md](../../RFID-DOCS-SCOPE-AUDIT.md).
Module responsibilities do not authorize new screens or workflows. R02's excluded
and deferred tasks are outside this release; preserve the documented role menus,
pilot schedules, catalog selections, and assignments within teacher management.

R06 adds [School Calendar & Announcements](../../Calendar.md), superseding only
its holiday-management deferral. The [calendar module](calendar/README.md) supplies
role calendars, lifecycle actions, email, notifications, and shared attendance
exceptions. Dashboards, Daily Attendance, history, reports, and PDFs consume the
shared resolver while retaining RFID/SMS evidence. Daily Attendance stays read-only;
Subject Attendance remains editable. Hosted rollout and physical verification are
tracked separately in [Calendar-TODO.md](../../Calendar-TODO.md); each task
requires confirmation.
