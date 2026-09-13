-- Explicit student rosters, independent of campus RFID evidence.
begin;
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.subject_attendance'::regclass
    and contype='c' and pg_get_constraintdef(oid) like '%Late%') then
    raise exception 'Apply 202609140002_teacher_confirmed_late.sql before subject enrollment.';
  end if;
end $$;
alter table public.subject_schedules add column if not exists roster_version integer not null default 0;
create table if not exists public.subject_enrollments (
  schedule_id bigint not null references public.subject_schedules(id),
  student_id bigint not null references public.students(id),
  active boolean not null default true,
  primary key (schedule_id, student_id)
);
create index if not exists subject_enrollments_student_idx on public.subject_enrollments(student_id, schedule_id) where active;

-- Only bootstrap each existing schedule once. Reapplying cannot undo removals.
insert into public.subject_enrollments(schedule_id, student_id)
select sch.id, s.id from public.subject_schedules sch join public.students s
  on s.program_id=sch.program_id and s.year_level=sch.year_level
  and s.section=sch.section and s.campus=sch.campus
where sch.roster_version=0 and sch.status='active' and s.status='active'
on conflict do nothing;
update public.subject_schedules set roster_version=1 where roster_version=0;
-- New schedules start empty and require an administrator to assign students.
alter table public.subject_schedules alter column roster_version set default 1;

create or replace function public.teacher_has_enrolled_student(p_student bigint)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.subject_enrollments e
    join public.subject_schedules sch on sch.id=e.schedule_id
    join public.students s on s.id=e.student_id
    where e.student_id=p_student and e.active and s.status='active' and sch.status='active'
    and public.teacher_owns_subject(sch.teacher_id,sch.course_id,sch.program_id,sch.year_level,sch.section,sch.campus));
$$;
create or replace function public.student_enrolled_in_subject(p_schedule bigint)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.subject_enrollments e
    where e.schedule_id=p_schedule and e.student_id=public.current_student_id() and e.active);
$$;
revoke all on function public.teacher_has_enrolled_student(bigint), public.student_enrolled_in_subject(bigint) from public;
grant execute on function public.teacher_has_enrolled_student(bigint), public.student_enrolled_in_subject(bigint) to authenticated;

alter table public.subject_enrollments enable row level security;
revoke all on public.subject_enrollments from public, anon, authenticated;
grant select on public.subject_enrollments to authenticated;
drop policy if exists subject_enrollments_read on public.subject_enrollments;
create policy subject_enrollments_read on public.subject_enrollments for select to authenticated using (
  public.current_user_role()='admin' or student_id=public.current_student_id()
  or exists(select 1 from public.subject_schedules sch where sch.id=schedule_id
    and public.teacher_owns_subject(sch.teacher_id,sch.course_id,sch.program_id,sch.year_level,sch.section,sch.campus))
);
-- Honor the existing email verification gate when installed.
do $$ begin
  if to_regprocedure('public.has_verified_email_session()') is not null then
    execute 'drop policy if exists email_verification_required on public.subject_enrollments';
    execute 'create policy email_verification_required on public.subject_enrollments as restrictive for all to authenticated using ((select public.has_verified_email_session())) with check ((select public.has_verified_email_session()))';
  end if;
end $$;
drop policy if exists students_enrolled_teacher_read on public.students;
create policy students_enrolled_teacher_read on public.students for select to authenticated using (public.teacher_has_enrolled_student(id));
drop policy if exists attendance_enrolled_teacher_read on public.attendance_records;
create policy attendance_enrolled_teacher_read on public.attendance_records for select to authenticated using (public.teacher_has_enrolled_student(student_id));
drop policy if exists subject_schedules_read on public.subject_schedules;
create policy subject_schedules_read on public.subject_schedules for select to authenticated using (
  public.current_user_role()='admin'
  or public.teacher_owns_subject(teacher_id,course_id,program_id,year_level,section,campus)
  or public.student_enrolled_in_subject(id)
);
-- Saved snapshots remain readable after a student is removed from the roster.
drop policy if exists subject_attendance_read on public.subject_attendance;
create policy subject_attendance_read on public.subject_attendance for select to authenticated using (
  public.current_user_role()='admin' or student_id=public.current_student_id()
  or public.teacher_owns_subject(teacher_id,course_id,program_id,year_level,section,campus)
);

create or replace function public.save_subject_enrollment(p_schedule_id bigint, p_student_ids bigint[], p_expected_version integer)
returns void language plpgsql security definer set search_path='' as $$
declare sch public.subject_schedules;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only an active administrator can assign students.' using errcode='42501';
  end if;
  select * into sch from public.subject_schedules where id=p_schedule_id for update;
  if not found or sch.status<>'active' then raise exception 'Choose an active subject schedule.'; end if;
  if p_expected_version is distinct from sch.roster_version then
    raise exception 'Enrollment changed. Refresh before saving.' using errcode='40001';
  end if;
  if p_student_ids is null or exists(select 1 from unnest(p_student_ids) selected(id)
    where selected.id is null or not exists(select 1 from public.students s where s.id=selected.id and s.status='active')) then
    raise exception 'Choose active students only.';
  end if;
  -- The schedule row lock also serializes confirmations with roster changes.
  update public.subject_enrollments set active=false where schedule_id=sch.id and active and not(student_id=any(p_student_ids));
  insert into public.subject_enrollments(schedule_id,student_id,active)
    select sch.id,id,true from (select distinct unnest(p_student_ids) id) selected
    on conflict(schedule_id,student_id) do update set active=true;
  update public.subject_schedules set roster_version=roster_version+1 where id=sch.id;
end $$;
revoke all on function public.save_subject_enrollment(bigint,bigint[],integer) from public;
grant execute on function public.save_subject_enrollment(bigint,bigint[],integer) to authenticated;

do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(
    select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='subject_enrollments') then
    alter publication supabase_realtime add table public.subject_enrollments;
  end if;
end $$;
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
  if not found or stu.status <> 'active' or not exists (
    select 1 from public.subject_enrollments e where e.schedule_id=sch.id and e.student_id=stu.id and e.active) then
    raise exception 'Student is not enrolled in this subject. Ask an administrator to update enrollment.' using errcode = '42501';
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
