# Services

External integrations and persistence adapters belong here. Feature modules depend on these services through small typed functions.

Follow the current requirements and [release scope](../../RFID-DOCS-SCOPE-AUDIT.md).
Choose the smallest implementation that satisfies them. A README does not mandate
a new database table, provider, queue, or PDF library. Preserve authorization and
transaction correctness without adding the user-facing modules excluded by R02.
