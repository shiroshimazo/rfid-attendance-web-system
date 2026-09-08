-- Add an admin-only time editor; attendance snapshots remain unchanged.
begin;
create or replace function public.edit_subject_schedule_time(
  p_id bigint, p_start time, p_end time, p_expected_start time, p_expected_end time
) returns void language plpgsql security definer set search_path = '' as $$
declare sch public.subject_schedules;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only an active administrator can edit subject schedules.' using errcode = '42501';
  end if;
  if p_start is null or p_end is null or p_end <= p_start then
    raise exception 'Choose an end time after the start time.';
  end if;
  select * into sch from public.subject_schedules where id = p_id for update;
  if not found or sch.status <> 'active' then
    raise exception 'Select an active subject schedule.';
  end if;
  if sch.time_start is distinct from p_expected_start or sch.time_end is distinct from p_expected_end then
    raise exception 'This schedule changed. Refresh before editing again.' using errcode = '40001';
  end if;
  -- The exclusion constraint also protects against concurrent overlapping saves.
  if not exists (select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.subject_schedules'::regclass and conname = 'subject_schedules_no_overlap') then
    raise exception 'Apply the subject schedule overlap migration before editing times.';
  end if;
  update public.subject_schedules set time_start = p_start, time_end = p_end where id = p_id;
end $$;
revoke all on function public.edit_subject_schedule_time(bigint,time,time,time,time) from public;
grant execute on function public.edit_subject_schedule_time(bigint,time,time,time,time) to authenticated;
commit;
