-- School-confirmed follow-up: teachers may confirm Late per subject.
-- This does not infer subject status from a campus tap or change stored history.
begin;
alter table public.subject_attendance drop constraint if exists subject_attendance_attendance_status_check;
alter table public.subject_attendance add constraint subject_attendance_attendance_status_check
  check (attendance_status in ('Present','Late','Absent'));

create or replace function public.confirm_subject_attendance(
  p_schedule_id bigint, p_date date, p_student_id bigint, p_status text,
  p_expected_confirmed_at timestamptz default null
) returns bigint language plpgsql security definer set search_path = '' as $$
declare sch public.subject_schedules; stu public.students; old public.subject_attendance; result bigint;
begin
  if public.current_user_role() is distinct from 'teacher' then
    raise exception 'Only the assigned active teacher can confirm subject attendance.' using errcode = '42501';
  end if;
  select * into sch from public.subject_schedules where id = p_schedule_id for share;
  if not found or sch.status <> 'active' or not public.teacher_owns_subject(
    sch.teacher_id, sch.course_id, sch.program_id, sch.year_level, sch.section, sch.campus) then
    raise exception 'This subject schedule is not an active assignment for your account.' using errcode = '42501';
  end if;
  if p_date is null or p_date > (now() at time zone 'Asia/Manila')::date
    or extract(dow from p_date)::integer <> sch.day_of_week then
    raise exception 'Choose a non-future date on this subject schedule''s weekday.';
  end if;
  if p_status is null or p_status not in ('Present', 'Late', 'Absent') then
    raise exception 'Confirm Present, Late or Absent.';
  end if;
  select * into stu from public.students where id = p_student_id for share;
  if not found or stu.status <> 'active' or not public.teacher_can_access_student(stu.id)
    or stu.program_id <> sch.program_id or stu.year_level <> sch.year_level
    or stu.section <> sch.section or stu.campus <> sch.campus then
    raise exception 'Student is outside this subject''s active class.' using errcode = '42501';
  end if;
  -- Serialize concurrent first confirmations and reject stale browser edits.
  perform pg_advisory_xact_lock(hashtextextended(p_schedule_id::text || ':' || p_date::text || ':' || p_student_id::text, 0));
  select * into old from public.subject_attendance
    where schedule_id = p_schedule_id and attendance_date = p_date and student_id = p_student_id for update;
  if found then
    if old.attendance_status = p_status then return old.id; end if;
    if p_expected_confirmed_at is distinct from old.confirmed_at then
      raise exception 'Attendance changed since this page was loaded. Refresh before correcting it.' using errcode = '40001';
    end if;
    update public.subject_attendance set attendance_status = p_status, confirmed_by = auth.uid(), confirmed_at = clock_timestamp()
      where id = old.id;
    return old.id;
  end if;
  if p_expected_confirmed_at is not null then raise exception 'Refresh this session before confirming attendance.'; end if;
  insert into public.subject_attendance(schedule_id, student_id, teacher_id, course_id, program_id,
    attendance_date, attendance_status, time_start, time_end, student_number, student_name, teacher_name,
    course_code, course_name, program_code, year_level, section, campus, confirmed_by)
  select sch.id, stu.id, sch.teacher_id, sch.course_id, sch.program_id, p_date, p_status,
    sch.time_start, sch.time_end, stu.student_id, stu.full_name, t.full_name, c.course_code, c.course_name,
    p.program_code, sch.year_level, sch.section, sch.campus, auth.uid()
  from public.teachers t, public.courses c, public.programs p
  where t.id = sch.teacher_id and c.id = sch.course_id and p.id = sch.program_id
  returning id into result;
  return result;
end $$;
revoke all on function public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz) from public;
grant execute on function public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz) to authenticated;
commit;
