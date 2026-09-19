-- Use active catalog placements for student, teacher, and schedule saves.
-- Keep the existing function signature so deployed callers remain compatible.
begin;
create or replace function public.assert_pilot_placement(
  p_program_id bigint, p_year text, p_section text, p_campus text,
  p_allow_all_campuses boolean default false
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if public.current_user_role() is distinct from 'admin'::public.user_role then
    raise exception 'An active administrator account is required.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.programs where id = p_program_id and status = 'active') then
    raise exception 'Select an active program.' using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.academic_sections
    where program_id = p_program_id and year_level = p_year
      and section_code = p_section and status = 'active'
      and (campus = p_campus or (p_allow_all_campuses and p_campus is null))
  ) then
    raise exception 'Select an active class grouping for this program, year level, section, and campus.' using errcode = '23514';
  end if;
end;
$$;

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
    if not exists (select 1 from public.courses where id = a.course_id and program_id = a.program_id and status = 'active') then
      raise exception 'Select an active subject belonging to the selected program.' using errcode = '23514';
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

create or replace function public.create_subject_schedule(
  p_assignment_id bigint, p_day integer, p_start time, p_end time
) returns bigint language plpgsql security definer set search_path = '' as $$
declare a public.teacher_assignments; result bigint;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only an active administrator can configure subject schedules.' using errcode = '42501';
  end if;
  select * into a from public.teacher_assignments where id = p_assignment_id and status = 'active' for share;
  if not found or not exists (select 1 from public.teachers where id = a.teacher_id and status = 'active') then
    raise exception 'Select an active teaching assignment.';
  end if;
  perform public.assert_pilot_placement(a.program_id, a.year_level, a.section, a.campus);
  if not exists(select 1 from public.courses where id = a.course_id and program_id = a.program_id and status = 'active') then
    raise exception 'Select an active subject belonging to the selected program.';
  end if;
  if p_day is null or p_day not between 0 and 6 or p_start is null or p_end is null or p_end <= p_start then
    raise exception 'Choose a weekday and an end time after the start time.';
  end if;
  insert into public.subject_schedules(teacher_id, course_id, program_id, year_level, section, campus, day_of_week, time_start, time_end)
    values(a.teacher_id, a.course_id, a.program_id, a.year_level, a.section, a.campus, p_day, p_start, p_end)
    returning id into result;
  return result;
end $$;

notify pgrst, 'reload schema';
commit;
