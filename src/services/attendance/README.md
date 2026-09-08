# Attendance service

Atomic time-in/time-out processing, duplicate-request handling, and authorized
attendance queries. Retrying the same request must not create another tap.

P04 campus taps use the service-role-only `record_rfid_tap` RPC through
`POST /api/rfid/tap`. See the route README for installation and retry rules.
One Pending arrival SMS is persisted atomically; provider delivery remains P06.

P05 subject attendance is teacher-confirmed as Present, Late or Absent. A campus
tap leaves subject rosters unconfirmed and cannot create a subject result.
No automatic absence job is part of the approved implementation plan.
