# Feature modules

Business logic belongs in the domain folders below. Route pages should compose these features rather than contain database queries or duplicate role-specific implementations.

The active release backlog is [RFID-DOCS-SCOPE-AUDIT.md](../../RFID-DOCS-SCOPE-AUDIT.md).
Module responsibilities do not authorize new screens or workflows. R02's excluded
and deferred tasks are outside this release; preserve the documented role menus,
pilot schedules, catalog selections, and assignments within teacher management.

R06 explicitly adds the planned [School Calendar & Announcements](../../Calendar.md)
scope, superseding only its holiday-management deferral. The calendar module is
not implemented yet. Follow [Calendar-TODO.md](../../Calendar-TODO.md) with
confirmation before each task. Reuse existing shadcn/ui and feature/service
patterns; keep Daily Attendance read-only and Subject Attendance editable.
