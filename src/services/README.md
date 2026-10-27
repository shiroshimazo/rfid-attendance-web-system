# Services

External integrations and persistence adapters belong here. Feature modules depend on these services through small typed functions.

Follow the current requirements and [release scope](../../RFID-DOCS-SCOPE-AUDIT.md).
Choose the smallest implementation that satisfies them. A README does not mandate
a new database table, provider, queue, or PDF library. Preserve authorization and
transaction correctness without adding the user-facing modules excluded by R02.

[Calendar services](calendar/README.md) provide authenticated RLS reads and
server-only email persistence/dispatch. Calendar mutations stay at the guarded
feature boundary and use validated transactional RPCs. Attendance/report services
retain their existing role scope and raw evidence.
