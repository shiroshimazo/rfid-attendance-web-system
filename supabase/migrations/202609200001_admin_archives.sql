-- Archive metadata applies to future status changes; old dates stay unknown.
begin;
do $$
declare archive_table text;
begin
  foreach archive_table in array array['students','teachers','subject_schedules','class_schedules'] loop
    execute format('alter table public.%I add column if not exists archived_at timestamptz', archive_table);
    execute format('alter table public.%I add column if not exists archive_reason text', archive_table);
  end loop;
end $$;

create or replace function public.track_archive_status()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.status = 'archived' then
    if tg_op = 'INSERT' then
      new.archived_at := clock_timestamp();
    elsif old.status is distinct from new.status then
      new.archived_at := clock_timestamp();
      new.archive_reason := null;
    end if;
  else
    new.archived_at := null;
    new.archive_reason := null;
  end if;
  return new;
end $$;
revoke all on function public.track_archive_status() from public;
do $$
declare archive_table text;
begin
  foreach archive_table in array array['students','teachers','subject_schedules','class_schedules'] loop
    execute format('drop trigger if exists track_archive_status on public.%I', archive_table);
    execute format('create trigger track_archive_status before insert or update on public.%I for each row execute function public.track_archive_status()', archive_table);
  end loop;
end $$;

-- Existing lifecycle triggers keep account/assignment status synchronized.
-- No attendance, RFID card, or enrollment history is rewritten.
create or replace function public.restore_archived_record(p_kind text, p_id bigint)
returns void language plpgsql security definer set search_path='' as $$
declare sch public.subject_schedules; cls public.class_schedules;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only an active administrator can restore records.' using errcode='42501';
  end if;
  if p_kind = 'students' then
    update public.students set status='active' where id=p_id and status='archived';
  elsif p_kind = 'teachers' then
    update public.teachers set status='active' where id=p_id and status='archived';
  elsif p_kind = 'class_schedules' then
    select * into cls from public.class_schedules where id=p_id and status='archived' for update;
    if not found then raise exception 'This record is no longer archived. Refresh the page.'; end if;
    perform public.assert_pilot_placement(cls.program_id, cls.year_level, cls.section, cls.campus, true);
    update public.class_schedules set status='active' where id=cls.id;
  elsif p_kind = 'subject_schedules' then
    select * into sch from public.subject_schedules where id=p_id and status='archived' for update;
    if not found then raise exception 'This record is no longer archived. Refresh the page.'; end if;
    perform public.assert_pilot_placement(sch.program_id, sch.year_level, sch.section, sch.campus, false);
    perform 1 from public.programs where id=sch.program_id and status='active' for share;
    if not found then raise exception 'The schedule program must be active before restoring.'; end if;
    perform 1 from public.teachers where id=sch.teacher_id and status='active' for share;
    if not found then raise exception 'Restore the teacher before restoring this schedule.'; end if;
    perform 1 from public.teacher_assignments where id=sch.assignment_id and status='active'
      and teacher_id=sch.teacher_id and course_id=sch.course_id and program_id=sch.program_id
      and year_level=sch.year_level and section=sch.section and campus=sch.campus for share;
    if not found then raise exception 'The original teaching assignment is no longer active or has changed. Create a schedule from a current assignment instead.'; end if;
    update public.subject_schedules set status='active' where id=sch.id;
  else
    raise exception 'Choose a supported archive category.';
  end if;
  if not found then raise exception 'This record is no longer archived. Refresh the page.'; end if;
exception when exclusion_violation or unique_violation then
  raise exception 'An active schedule conflicts with this record. Adjust the timetable before restoring.' using errcode='23P01';
end $$;
revoke all on function public.restore_archived_record(text,bigint) from public;
grant execute on function public.restore_archived_record(text,bigint) to authenticated;
commit;
