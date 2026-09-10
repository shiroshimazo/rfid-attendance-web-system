# Guardian arrival SMS (P06)

PhilSMS delivery is implemented in `philsms.ts`. See
[PHILSMS-SETUP.md](../../../PHILSMS-SETUP.md) for configuration, migration order,
status meanings and live testing.

After a committed Time In (including an eligible retry), the route awaits the
sender. A service-role-only SQL claim guarantees one send attempt per arrival.
Only new P04 notifications within ten minutes are eligible; historical records
are preserved and never automatically sent. Time Out and teacher confirmations
do not invoke sending. Guardian contact and campus message come from the saved
arrival snapshot, not caller input.

Sent means PhilSMS API acceptance, not confirmed handset delivery. Failed means
invalid recipient or explicit rejection. Network/response uncertainty stays
Pending with an attempt marker and is not automatically retried. A crash or
completion-save failure also retains its claim; inspect provider logs before any
manual reconciliation. No provider calls are made in automated tests.
