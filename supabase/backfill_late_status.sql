-- READ-ONLY candidate report; running this entire file does not change records.
-- Uses CURRENT placement and schedules, not evidence of historical placement/rules.
-- Before any correction, review specific IDs and verify the rule on the original date.
-- No automatic update is authorized by this report. Retain a before-image for rollback.
-- Same priority/pilot/strict cutoff as record_rfid_tap: all-campus first, specific fallback.
select
  record.id,
  student.full_name,
  student.program_id as current_program_id,
  student.year_level as current_year_level,
  student.section as current_section,
  student.campus as current_campus,
  record.campus as recorded_campus,
  record.attendance_date,
  record.time_in,
  record.attendance_status as original_status,
  record.updated_at as original_updated_at,
  schedule.id as schedule_id,
  schedule.campus as schedule_campus,
  schedule.time_start,
  schedule.grace_minutes,
  record.attendance_date + schedule.time_start + make_interval(mins => schedule.grace_minutes) as proposed_late_cutoff,
  'REVIEW REQUIRED: current placement/schedule may differ from historical facts' as review_note
from public.attendance_records record
join public.students student on student.id=record.student_id
join public.programs program on program.id=student.program_id
join lateral (
  select s.* from public.class_schedules s
  where s.program_id=student.program_id and s.year_level=student.year_level
    and s.section=student.section and (s.campus is null or s.campus=student.campus)
    and s.day_of_week=extract(dow from record.attendance_date)::integer and s.status='active'
  order by (s.campus is null) desc, s.id limit 1
) schedule on true
where record.attendance_status='Present'
  and upper(program.program_code)='BSIT' and program.status='active'
  and student.year_level='2nd Year'
  and student.section in ('21001','21002','21003','21004','21005','21006','21007','21008','21009','21010')
  and record.attendance_date + record.time_in > record.attendance_date + schedule.time_start + make_interval(mins => schedule.grace_minutes)
order by record.attendance_date desc, record.id;
