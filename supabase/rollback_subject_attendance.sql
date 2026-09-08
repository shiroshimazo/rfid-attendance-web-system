-- Optional P05 rollback: stop new writes without deleting schedules or history.
-- Revert the P05 application code as well if rolling back the feature.
begin;
revoke execute on function public.create_subject_schedule(bigint,integer,time,time) from authenticated;
revoke execute on function public.retire_subject_schedule(bigint) from authenticated;
revoke execute on function public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz) from authenticated;
commit;
-- Reapplying 202609120001_subject_attendance.sql restores the checked RPC grants.
