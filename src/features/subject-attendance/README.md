# Subject attendance (P05)

The school confirmed attendance is per scheduled subject session. Only the assigned
teacher confirms Present/Absent. No confirmation is unconfirmed, not Absent.
Cardless students may be confirmed Present without producing a card, tap timestamp,
RFID scan or SMS. A daily campus tap does not confirm attendance in each subject.

## Data and access

`subject_schedules` adds weekday/start/end and an explicit teacher/subject/class
to the existing Admin Schedules page. Existing `class_schedules` remain the daily
RFID start/grace rules. Admins select an existing active pilot teaching assignment;
no invented subject times are seeded. To change a subject timetable, retire the
old row and add the correct schedule. Retired schedules and confirmations remain.

`subject_attendance` stores one student/schedule/date confirmation, the teacher,
confirmation timestamp and subject/placement snapshots. It has no RFID timestamp
or card fields. Scheduled times are not arrival times. Prior `attendance_records`
and SMS/card history are untouched and are not backfilled into subject results.

RPCs enforce active account/teacher, subject ownership, active matching student,
campus/section, scheduled weekday and non-future date. Direct authenticated table
writes are denied. Same-result retries are idempotent; corrections require the
previous confirmation timestamp, rejecting stale edits. A replacement schedule
cannot duplicate an already confirmed identical subject/time slot.

RLS permits admins retained history, students only their own results and teachers
only their own currently authorized subjects/students. Admins cannot impersonate
teacher confirmation. RPCs and Realtime use the existing authenticated session.

## Views and totals

The shared `subjectTotals` function counts confirmed student-sessions, with
Present / (Present + Absent). Unconfirmed sessions do not enter the denominator.
Dashboard summaries use today's Manila date; date panels/reports use their selected
range, and student history includes all visible confirmations. Rates agree for the
same records and scope; different teacher/role/date scopes can differ.

The subject section is separate from daily RFID evidence, including in complete
pdfcn PDF exports. Existing daily RFID charts/counts and Late rules retain their
original meaning; no daily Late record is relabeled as proof of subject presence.
The teacher console lists unconfirmed students for the chosen active session.
Historical absent confirmations remain after archiving; arbitrary old missing
sessions are never inferred from today's roster/timetable.

## Rollout

1. Apply `supabase/migrations/202609120001_subject_attendance.sql` after the existing
   migrations and before using the updated app. It adds tables/functions/policies;
   no existing attendance, card, SMS or profile rows are changed or deleted.
2. Optionally run the read-only `supabase/verify_subject_attendance.sql`: six PASS
   rows check installation, RLS, write restrictions and Realtime publication.
3. Restart/deploy the app. Admin > Schedules > Subject Session Schedules: add real
   weekdays/times using existing assignments. Do not run rollback during setup.
4. Teacher > Attendance: select that weekday/date and subject, then confirm a
   cardless student Present in one subject and Absent in another with its assigned
   teacher. An unconfirmed subject stays unconfirmed. Check student/admin views,
   PDFs, and unchanged daily RFID scan counts/timestamps.

Optional rollback is `supabase/rollback_subject_attendance.sql`: it revokes write
RPC access and preserves all new and old data. Revert P05 application code as well
if withdrawing the feature. Reapplying the migration restores write access.

Local checks: real migrations/RLS in `tests/subject-attendance.test.mjs`, actions
and PDF in `tests/subject-attendance-actions.test.mjs`, Chromium controls in
`tests/subject-attendance.browser.mjs`. No hosted credentials or SMS are used.
