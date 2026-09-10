-- Automatic propagation of the specific assignment edited in Manage Teachers.
begin;
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.subject_schedules'::regclass and conname='subject_schedules_no_overlap') then
    raise exception 'Install the subject schedule overlap migration first.';
  end if;
end $$;
alter table public.subject_schedules add column if not exists assignment_id bigint
  references public.teacher_assignments(id) on delete set null;
-- Link only exact matches. Unmatched old schedules are retained for explicit correction.
update public.subject_schedules s set assignment_id=a.id
from public.teacher_assignments a where s.assignment_id is null and s.teacher_id=a.teacher_id
  and s.course_id=a.course_id and s.program_id=a.program_id and s.year_level=a.year_level
  and s.section=a.section and s.campus=a.campus;
create index if not exists subject_schedules_assignment_idx on public.subject_schedules(assignment_id);

create or replace function public.link_subject_schedule_assignment()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  select id into new.assignment_id from public.teacher_assignments where teacher_id=new.teacher_id
    and course_id=new.course_id and program_id=new.program_id and year_level=new.year_level
    and section=new.section and campus=new.campus and status='active' for share;
  if new.assignment_id is null then raise exception 'Select a matching active teaching assignment.'; end if;
  return new;
end $$;
drop trigger if exists subject_schedule_link_assignment on public.subject_schedules;
create trigger subject_schedule_link_assignment before insert on public.subject_schedules
for each row execute function public.link_subject_schedule_assignment();

create or replace function public.sync_assignment_subject_schedules()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='DELETE' then
    update public.subject_schedules set status='archived' where assignment_id=old.id and status='active';
    return old;
  end if;
  if (new.teacher_id,new.program_id,new.course_id,new.year_level,new.section,new.campus) is distinct from
    (old.teacher_id,old.program_id,old.course_id,old.year_level,old.section,old.campus) then
    update public.subject_schedules set teacher_id=new.teacher_id,program_id=new.program_id,course_id=new.course_id,
      year_level=new.year_level,section=new.section,campus=new.campus
      where assignment_id=new.id and status='active';
  end if;
  return new;
exception when exclusion_violation or unique_violation then
  raise exception 'Assignment change conflicts with an occupied subject schedule. Adjust the timetable first. No teacher changes were saved.' using errcode='23P01';
end $$;
drop trigger if exists assignment_sync_subject_schedules on public.teacher_assignments;
create trigger assignment_sync_subject_schedules after update on public.teacher_assignments
for each row execute function public.sync_assignment_subject_schedules();
drop trigger if exists assignment_retire_subject_schedules on public.teacher_assignments;
create trigger assignment_retire_subject_schedules before delete on public.teacher_assignments
for each row execute function public.sync_assignment_subject_schedules();
revoke all on function public.link_subject_schedule_assignment() from public;
revoke all on function public.sync_assignment_subject_schedules() from public;

create or replace function public.save_teacher_profile(
  p_profile jsonb, p_assignments jsonb, p_user_id uuid default null, p_id bigint default null
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare
  v public.teachers;
  a record;
  owner_id uuid;
  saved_id bigint; assignment_key bigint; kept bigint[] := array[]::bigint[];
begin
  if public.current_user_role() is distinct from 'admin'::public.user_role then
    raise exception 'An active administrator account is required.' using errcode = '42501';
  end if;
  if p_assignments is null or jsonb_typeof(p_assignments) <> 'array' then
    raise exception 'Add at least one teaching assignment.' using errcode = '23514';
  end if;
  if jsonb_array_length(p_assignments) = 0 then
    raise exception 'Add at least one teaching assignment.' using errcode = '23514';
  end if;
  for a in select * from jsonb_to_recordset(p_assignments)
    as x(program_id bigint, course_id bigint, year_level text, section text, campus text)
  loop
    perform public.assert_pilot_placement(a.program_id, a.year_level, a.section, a.campus);
    if not exists (select 1 from public.courses where id = a.course_id and program_id = a.program_id) then
      raise exception 'The selected subject does not belong to BSIT.' using errcode = '23514';
    end if;
  end loop;
  select * into v from jsonb_populate_record(null::public.teachers, p_profile);
  if p_id is null then owner_id := p_user_id;
  else select user_id into owner_id from public.teachers where id = p_id;
  end if;
  perform 1 from public.users where id = owner_id and role = 'teacher' for update;
  if not found then raise exception 'That teacher account no longer exists.' using errcode = '23503'; end if;
  if p_id is null then
    insert into public.teachers (user_id, teacher_id, full_name, gender, date_of_birth,
      civil_status, email, phone_number, profile_picture, department, date_hired, status)
    values (owner_id, v.teacher_id, v.full_name, v.gender, v.date_of_birth,
      v.civil_status, v.email, v.phone_number, v.profile_picture, v.department, v.date_hired, v.status)
    returning id into saved_id;
  else
    update public.teachers set teacher_id = v.teacher_id, full_name = v.full_name,
      gender = v.gender, date_of_birth = v.date_of_birth, civil_status = v.civil_status,
      phone_number = v.phone_number, profile_picture = v.profile_picture,
      department = v.department, date_hired = v.date_hired, status = v.status
    where id = p_id and user_id = owner_id returning id into saved_id;
    if not found then raise exception 'That teacher record no longer exists.' using errcode = '23503'; end if;
  end if;
  -- Linked schedules require stable assignment identity; never guess by row position.
  if exists(select 1 from public.subject_schedules s where s.teacher_id=saved_id and s.status='active' and s.assignment_id is null) then
    raise exception 'An active subject schedule has no matching teaching assignment. Correct or retire that schedule before editing assignments.';
  end if;
  for a in select * from jsonb_to_recordset(p_assignments)
    as x(id bigint,program_id bigint,course_id bigint,year_level text,section text,campus text)
  loop
    assignment_key := a.id;
    if assignment_key is not null then
      perform 1 from public.teacher_assignments where id=assignment_key and teacher_id=saved_id for update;
      if not found or assignment_key=any(kept) then raise exception 'Teaching assignment changed. Reload the teacher form.'; end if;
      update public.teacher_assignments set program_id=a.program_id,course_id=a.course_id,
        year_level=a.year_level,section=a.section,campus=a.campus where id=assignment_key;
    else
      select id into assignment_key from public.teacher_assignments where teacher_id=saved_id
        and program_id=a.program_id and course_id=a.course_id and year_level=a.year_level
        and section=a.section and campus=a.campus;
      if assignment_key is null then
        insert into public.teacher_assignments(teacher_id,program_id,course_id,year_level,section,campus)
          values(saved_id,a.program_id,a.course_id,a.year_level,a.section,a.campus) returning id into assignment_key;
      end if;
    end if;
    kept := array_append(kept,assignment_key);
  end loop;
  if not exists(select 1 from jsonb_array_elements(p_assignments) x where x->>'id' is not null)
    and exists(select 1 from public.subject_schedules s join public.teacher_assignments existing_assignment on existing_assignment.id=s.assignment_id
      where existing_assignment.teacher_id=saved_id and not existing_assignment.id=any(kept) and s.status='active') then
    raise exception 'Reload the teacher form before changing a scheduled assignment.';
  end if;
  delete from public.teacher_assignments where teacher_id=saved_id and not id=any(kept);
  return saved_id;
end;
$$;

commit;
