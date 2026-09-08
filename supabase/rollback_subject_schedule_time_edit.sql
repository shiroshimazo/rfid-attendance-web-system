-- Optional rollback; preserves all schedules and attendance history.
drop function if exists public.edit_subject_schedule_time(bigint,time,time,time,time);
