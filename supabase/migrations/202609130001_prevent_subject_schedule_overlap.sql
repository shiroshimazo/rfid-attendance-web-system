-- Reject overlapping active subjects for the same class/day, including races.
-- Retire incorrect existing schedules before applying; never delete history.
begin;
create extension if not exists btree_gist;
-- Supabase may already have this extension installed in its extensions schema.
set local search_path = public, extensions;

do $$
declare conflict record;
begin
  select a.id as first_id, b.id as second_id, a.section, a.campus into conflict
  from public.subject_schedules a join public.subject_schedules b
    on a.id < b.id and a.program_id = b.program_id and a.year_level = b.year_level
    and a.section = b.section and a.campus = b.campus and a.day_of_week = b.day_of_week
    and a.time_start < b.time_end and b.time_start < a.time_end
  where a.status = 'active' and b.status = 'active'
  order by a.id, b.id limit 1;
  if found then
    raise exception 'Existing schedules #% and #% overlap for section %, %. Retire the incorrect schedule in Admin > Schedules, then run this migration again.',
      conflict.first_id, conflict.second_id, conflict.section, conflict.campus;
  end if;
  if not exists(select 1 from pg_constraint where conrelid = 'public.subject_schedules'::regclass and conname = 'subject_schedules_no_overlap') then
    alter table public.subject_schedules add constraint subject_schedules_no_overlap
    exclude using gist (
      program_id with =, year_level with =, section with =, campus with =, day_of_week with =,
      (tsrange(date '2000-01-01' + time_start, date '2000-01-01' + time_end, '[)')) with &&
    ) where (status = 'active');
  end if;
end $$;
commit;
