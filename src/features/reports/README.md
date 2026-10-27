# Reports

Attendance summaries, section reports, RFID logs, SMS delivery logs, date ranges, and PDF export.


## Calendar exceptions (Task 27)

Reports use the shared calendar resolver with authenticated effective-day and
historical-mark reads. Historical exclusions use per-student snapshot status and
campus, independent of current entry publication or roster campus. Admin scope
includes archived students represented by exception snapshots even without RFID
evidence. Teacher scope retains the existing active-assignment boundary.

Today/future exceptions use effective campus state and the active scoped roster.
Retained tap records can also establish a represented exception day. Exception
rows are deduplicated by student/date, then grouped by date, campus, and state.
The report table and PDF list affected students per date and separate totals for
NoClasses and OnlineManual student-days. Current membership never reconstructs
missing historical exceptions.

Present, late, absent, summary, group, and section calculations exclude affected
student-days. Rates retain the recorded-decision denominator; missing records
remain provisional. Empty denominators are null, display as a dash or no eligible
decisions, and create gaps in summary charts. Raw RFID scans, full attendance
logs, card identity, stored tap campus/times, and authorized SMS history remain
intact. A log's calendar display state is shown alongside its original recorded
RFID status and exception campus where relevant.

Admin report loading and PDF export call an audited, verified-admin sync before
reading calendar/report inputs. The RPC itself clamps reconciliation to today
in Manila and preserves past marks. Invalid ranges, sync failures, and read
failures abort the report rather than creating a partial export. Teacher paths
never call sync. Report rendering uses the RPC directly through its guarded
report helper, avoiding revalidatePath during server-component rendering.

The PDF adds a complete Calendar exceptions section. Subject Attendance remains
a separate section with retained teacher confirmations; online/manual snapshots
never become confirmations or scans. Teacher exports exclude guardian/SMS data.
The shared UI sync action's argument names were corrected to the SQL contract,
p_from and p_to; no migration change was required.

`tests/calendar-reports.test.mjs` covers historical and archived exceptions,
missing-snapshot preservation, mixed denominators, raw evidence, role scope,
admin-only sync/order/failure, and real PDF text/layout. Access tests also verify
admin export synchronization and that a forged admin role cannot make teacher
exports sync. Existing full-range PDF pagination and subject tests remain active.
The isolated browser harness checks exception tables, nullable KPI/section rates,
and desktop/mobile rendering with mocked inputs. No hosted sync, real send, or
physical reader check was performed.
