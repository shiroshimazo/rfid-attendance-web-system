# Automatic teaching-assignment schedule updates

Implemented; hosted migration and app verification pending.

1. Run `supabase/migrations/202609170001_link_assignment_schedules.sql` in Supabase SQL Editor after the earlier migrations. This requires the existing schedule overlap constraint.
2. Run `supabase/verify_assignment_schedule_sync.sql`: expect two PASS rows and no unmatched schedules in the final result. If unmatched rows appear, correct their placement or retire them before editing that teacher. Do not delete attendance history.
3. Reload Manage Teachers to load assignment IDs. Edit the existing assignment's section, campus or subject, then click **Save changes**. Its active schedules update automatically; weekday and time stay the same. The schedule table refreshes through the existing Realtime subscription (P07 setup).
4. Check a permitted placement change in the app. Verify its active schedules change, unrelated/archived schedules stay unchanged, and previous attendance confirmations retain their original details. Changes remain drafts until Save changes.
5. Try a conflicting placement: the save must fail with the occupied-schedule message and preserve the teacher and schedules.

Existing schedules are linked by exact teacher, subject, program, year, section and campus. New schedules get their assignment link automatically. Removing an assignment archives its active schedules and retains their attendance history. Add/remove is different from editing an existing assignment. An old open form cannot silently replace a scheduled assignment: reload if prompted.

Deployment order: run the additive migration, then use the updated app. Older clients can save unchanged assignments; changing an assignment linked to active schedules requires the updated form. No RFID/SMS rules change.

Emergency stop: pause teacher edits and revoke the save RPC until the issue is corrected:

```sql
revoke execute on function public.save_teacher_profile(jsonb,jsonb,uuid,bigint) from authenticated;
```

Keep the link column and existing data. This does not undo successfully saved placement changes; restore those through reviewed assignment edits after repair. Do not restore the old delete-and-reinsert function. Resume with:

```sql
grant execute on function public.save_teacher_profile(jsonb,jsonb,uuid,bigint) to authenticated;
```
