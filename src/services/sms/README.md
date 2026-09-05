# SMS service

Send the documented guardian arrival message after attendance is recorded and
persist its Pending/Sent/Failed result and sent time. Sending remains pending.
SMS failure must not undo attendance, and duplicate requests must not send
duplicate arrival messages.

Provider selection and any delivery callback/retry mechanism are implementation
choices, not separate release features. Do not mandate a provider, offline queue,
or retry console. Preserve existing SMS read permissions until report visibility
is explicitly defined under P06/P08 in the scope audit.
