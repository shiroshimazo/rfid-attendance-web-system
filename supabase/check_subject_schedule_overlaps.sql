-- Read-only: identify active schedule conflicts before installing the guard.
select a.id as first_schedule_id, ca.course_code as first_subject,
  b.id as second_schedule_id, cb.course_code as second_subject,
  a.year_level, a.section, a.campus, a.day_of_week,
  a.time_start as first_start, a.time_end as first_end,
  b.time_start as second_start, b.time_end as second_end
from public.subject_schedules a join public.subject_schedules b
  on a.id < b.id and a.program_id = b.program_id and a.year_level = b.year_level
  and a.section = b.section and a.campus = b.campus and a.day_of_week = b.day_of_week
  and a.time_start < b.time_end and b.time_start < a.time_end
join public.courses ca on ca.id = a.course_id
join public.courses cb on cb.id = b.course_id
where a.status = 'active' and b.status = 'active'
order by a.section, a.campus, a.day_of_week, a.time_start;
