-- Optional rollback only. Restores backed-up placement; no attendance is changed.
begin;
lock table public.subject_schedules in share row exclusive mode;
update public.subject_schedules s set section=b.original_section,campus=b.original_campus
from public.regane_schedule_correction_backup b
where s.id=b.schedule_id and s.status='active' and s.section='21003' and s.campus='MV Campus';
-- A conflicting restored slot aborts the transaction instead of deleting data.
commit;
