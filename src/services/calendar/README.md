# Calendar service

- `query.ts`: authenticated, paginated calendar, bell, receipt, and dashboard-post
  reads under RLS. Drafts are admin-only; recipient reads preserve campus/audience
  boundaries. Bell results are capped at 20; mark-all actions use the same window
  without that display cap. Posts use an exact seven-day publication window.
- `admin.ts`: admin calendar/list filters, KPIs, recipient previews, and delivery
  history. Feature entry points require a verified active administrator.
- `attendance-state.ts`: read-only inputs for an inclusive date range. Past dates
  use immutable student snapshots; today/future use the security-invoker effective
  view, based on Asia/Manila. Reads paginate, allow long historical ranges, and
  propagate errors instead of assuming normal attendance. No reconciliation occurs.
- `email.ts`: server-only service-role delivery persistence and atomic claims.
  Sends private messages through Gmail SMTP, with individual delivery results. Only definite
  failures are retryable; uncertain acceptance and interrupted claims require
  operator review. Stored recipient/content snapshots survive later roster edits.

Authorization, validation, audit results, transactional mutations, and after-response
scheduling belong to [calendar features](../../features/calendar/README.md).
Admin reports explicitly synchronize through their guarded feature boundary before
reading; teacher reports never sync. All other attendance views only read state.

Apply all nine migrations before the matching application. See
[migration and recovery instructions](../../../supabase/migrations/README.md) and
[environment/operational limits](../../features/calendar/README.md). Local PGlite
and mocked tests do not prove hosted RLS sessions, realtime delivery, provider
delivery, or simultaneous PostgreSQL connections.
