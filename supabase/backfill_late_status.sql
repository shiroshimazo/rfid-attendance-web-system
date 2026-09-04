-- Backfill Late status for rows written before schedules existed.
-- Run in the Supabase SQL editor AFTER verifying class_schedules.
-- Safe to re-run: only flips Present -> Late, never touches Late, Absent,
-- Excused, or rows without a matching schedule.
--
-- STEP 1: run the preview SELECT, check the count looks sane.
-- STEP 2: run the whole transaction (BEGIN ... COMMIT).

-- STEP 1: preview rows that will flip to Late.
select
  record.id,
  student.full_name,
  student.section,
  record.attendance_date,
  record.time_in,
  schedule.time_start,
  schedule.grace_minutes,
  (schedule.time_start + (schedule.grace_minutes || ' minutes')::interval) as late_cutoff
from public.attendance_records as record
join public.students as student
  on student.id = record.student_id
join public.class_schedules as schedule
  on schedule.program_id = student.program_id
 and schedule.year_level = student.year_level
 and schedule.section = student.section
 and (schedule.campus is null or schedule.campus = student.campus)
 and schedule.day_of_week = extract(dow from record.attendance_date)::smallint
 and schedule.status = 'active'
where record.attendance_status = 'Present'
  and record.time_in > (schedule.time_start + (schedule.grace_minutes || ' minutes')::interval)
order by record.attendance_date desc, record.time_in desc;

-- STEP 2: flip them.
begin;

with late_rows as (
  select record.id
  from public.attendance_records as record
  join public.students as student
    on student.id = record.student_id
  join public.class_schedules as schedule
    on schedule.program_id = student.program_id
   and schedule.year_level = student.year_level
   and schedule.section = student.section
   and (schedule.campus is null or schedule.campus = student.campus)
   and schedule.day_of_week = extract(dow from record.attendance_date)::smallint
   and schedule.status = 'active'
  where record.attendance_status = 'Present'
    and record.time_in > (schedule.time_start + (schedule.grace_minutes || ' minutes')::interval)
)
update public.attendance_records as record
set attendance_status = 'Late',
    updated_at = now()
from late_rows
where record.id = late_rows.id;

commit;

-- STEP 3 (optional): confirm counts per status after the run.
select attendance_status, count(*)
from public.attendance_records
group by attendance_status
order by attendance_status;
