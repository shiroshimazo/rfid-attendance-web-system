# Attendance service

Atomic time-in/time-out processing, duplicate-request handling, and authorized
attendance queries. Retrying the same request must not create another tap.

No absence job is part of the approved implementation plan. Resolve P05's
finalization and representation rules before choosing how absence is produced.
