-- Read-only verification after 202609170001_link_assignment_schedules.sql.
select 'Active schedules linked to their exact assignment' as check_name,
  case when not exists (
    select 1 from public.subject_schedules s left join public.teacher_assignments a on a.id=s.assignment_id
    where s.status='active' and (a.id is null or
      (s.teacher_id,s.program_id,s.course_id,s.year_level,s.section,s.campus) is distinct from
      (a.teacher_id,a.program_id,a.course_id,a.year_level,a.section,a.campus))
  ) then 'PASS' else 'FAIL' end as result
union all
select 'Assignment sync triggers installed', case when count(*)=3 then 'PASS' else 'FAIL' end
from pg_trigger where not tgisinternal and tgenabled <> 'D' and
  (tgrelid='public.teacher_assignments'::regclass and tgname in ('assignment_sync_subject_schedules','assignment_retire_subject_schedules')
   or tgrelid='public.subject_schedules'::regclass and tgname='subject_schedule_link_assignment');

-- Any rows below need explicit correction; the migration never guesses their assignment.
select s.id, t.full_name, s.course_id, s.section, s.campus
from public.subject_schedules s join public.teachers t on t.id=s.teacher_id
where s.status='active' and s.assignment_id is null;
