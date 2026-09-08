-- Optional rollback only. Preserves schedules and all attendance history.
alter table public.subject_schedules drop constraint if exists subject_schedules_no_overlap;
