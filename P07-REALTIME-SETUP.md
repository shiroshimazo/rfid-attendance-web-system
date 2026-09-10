# P07: Realtime and Philippine time

## Install

1. Run `supabase/migrations/202609160001_complete_realtime_publication.sql`
   in Supabase SQL Editor after the existing migrations.
2. Run `supabase/verify_realtime.sql`. Expect **11 PASS rows**. This checks actual
   publication membership and RLS without changing data.
3. Restart/redeploy the app.

The migration adds missing supported tables to Realtime. It does not rewrite
attendance, SMS or profiles, and does not change read/write permissions. Existing
RLS continues to restrict which changes each signed-in role receives.

## Verify in the app

- Open authorized Admin, Teacher and Student pages in separate sessions. Make a
  teacher confirmation; the appropriate attendance views should update without
  manual refresh. Verify a student cannot see another student's information.
- Check a normal new RFID arrival and its SMS status update. Live sending can use
  credits; use controlled test recipients and the currently supported sender.
- Edit an existing teacher assignment or schedule in another admin session and
  confirm the open management page updates. No attendance rule changes are needed.
- Disconnect/reconnect a browser, then confirm it catches up. Returning to a
  background tab also refreshes it. While visible and disconnected, refresh is
  attempted every 30 seconds; actual data retrieval still needs network access.
- Continuous events must still refresh at the configured interval (800 ms by
  default), rather than waiting for all taps to stop.
- Timestamp displays use Asia/Manila regardless of browser timezone. For example,
  `2026-09-09T16:01:00Z` displays September 10, 12:01 AM. Date-only values and stored
  local tap times are not shifted. Visible pages detect Manila date rollover within
  30 seconds; explicitly selected historical date filters remain selected.

## Implementation and limits

The shared component subscribes to attendance, subject schedules/confirmations,
cards, SMS, students, teachers, assignments, class schedules, programs and courses.
Subscription success refreshes missed data. Equal table lists do not cause new
subscriptions merely because a server refresh creates another array instance.
Unmount removes channels, timers and browser listeners.

Local tests mock subscription/browser events and exercise timer behavior; PGlite
tests run the publication migration and read-only probe. They do not prove the
hosted WebSocket connection. Record user acceptance after the live checks above.

Rollback: revert the application refresh/time-format changes if needed. The
additive publication entries may remain; they do not grant access beyond RLS.
Do not remove previously published tables or change policies as a rollback step.
