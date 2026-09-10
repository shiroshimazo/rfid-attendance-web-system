-- One-time, user-authorized correction; run in Supabase SQL Editor.
-- Requires the teacher's current assignment to already be 21003 / MV Campus.
begin;
lock table public.subject_schedules in share row exclusive mode;
create table if not exists public.regane_schedule_correction_backup (
  schedule_id bigint primary key, original_section text not null, original_campus text not null
);
alter table public.regane_schedule_correction_backup enable row level security;
revoke all on public.regane_schedule_correction_backup from public, authenticated, anon;
do $$
declare teacher_key bigint; course_key bigint; program_key bigint;
begin
  if (select count(*) from public.teachers where lower(btrim(full_name))='regane macahibag' and status='active') <> 1 then
    raise exception 'Expected exactly one active Regane Macahibag. No schedules changed.';
  end if;
  select id into teacher_key from public.teachers where lower(btrim(full_name))='regane macahibag' and status='active' for share;
  select c.id,c.program_id into strict course_key,program_key from public.courses c
    join public.programs p on p.id=c.program_id where c.course_code='CCS1201' and p.program_code='BSIT';
  perform 1 from public.teacher_assignments where teacher_id=teacher_key and course_id=course_key
    and program_id=program_key and year_level='2nd Year' and section='21003' and campus='MV Campus' and status='active' for share;
  if not found then
    raise exception 'First save Regane''s CCS1201 assignment as 2nd Year, 21003, MV Campus in Manage Teachers. No schedules changed.';
  end if;
  if not exists(select 1 from pg_constraint where conrelid='public.subject_schedules'::regclass and conname='subject_schedules_no_overlap') then
    raise exception 'Install the subject schedule overlap guard first.';
  end if;
  insert into public.regane_schedule_correction_backup
    select id,section,campus from public.subject_schedules
    where teacher_id=teacher_key and course_id=course_key and program_id=program_key
      and year_level='2nd Year' and status='active' and (section<>'21003' or campus<>'MV Campus')
    on conflict do nothing;
  update public.subject_schedules set section='21003',campus='MV Campus'
    where teacher_id=teacher_key and course_id=course_key and program_id=program_key
      and year_level='2nd Year' and status='active' and (section<>'21003' or campus<>'MV Campus');
  -- Exclusion/unique constraints reject conflicts and roll back this entire script.
end $$;
commit;

select s.id,t.full_name,c.course_code,s.section,s.campus,s.day_of_week,s.time_start,s.time_end,s.status
from public.subject_schedules s join public.teachers t on t.id=s.teacher_id
join public.courses c on c.id=s.course_id
where lower(btrim(t.full_name))='regane macahibag' and c.course_code='CCS1201' and s.status='active'
order by s.day_of_week,s.time_start;
