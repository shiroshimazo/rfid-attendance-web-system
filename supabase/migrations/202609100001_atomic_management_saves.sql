-- P02: atomic management RPCs and Auth-owned email synchronization.
-- Apply after P01, before deploying the actions that call these RPCs.
-- Existing data is not rewritten. All functions use fixed search paths.
begin;

create or replace function public.assert_pilot_placement(
  p_program_id bigint, p_year text, p_section text, p_campus text,
  p_allow_all_campuses boolean default false
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if public.current_user_role() is distinct from 'admin'::public.user_role then
    raise exception 'An active administrator account is required.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.programs where id = p_program_id and upper(btrim(program_code)) = 'BSIT') then
    raise exception 'Program must be BSIT during the pilot.' using errcode = '23514';
  end if;
  if p_year is distinct from '2nd Year'
    or p_section is null or p_section !~ '^210(0[1-9]|10)$'
    or (p_campus is null and not p_allow_all_campuses)
    or (p_campus is not null and p_campus not in ('Main Campus', 'MV Campus', 'Bulacan Campus')) then
    raise exception 'Select 2nd Year, a section from 21001-21010, and a pilot campus.' using errcode = '23514';
  end if;
end;
$$;

-- Auth is the sole email authority. Older clients' provisional email writes
-- retain the actual login email until Auth accepts the change.
create or replace function public.keep_account_auth_email()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select email into new.email from auth.users where id = new.id;
  if not found or new.email is null then
    raise exception 'The Auth account email could not be read.' using errcode = '23514';
  end if;
  return new;
end;
$$;

create or replace function public.keep_profile_account_email()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  select email into new.email from public.users where id = new.user_id;
  if not found then
    raise exception 'The linked account could not be read.' using errcode = '23514';
  end if;
  return new;
end;
$$;

create or replace function public.sync_auth_profile_email()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  -- Lock order agrees with management RPCs: account, then profile.
  perform 1 from public.users where id = new.id for update;
  update public.students set email = new.email where user_id = new.id;
  update public.teachers set email = new.email where user_id = new.id;
  return new;
end;
$$;

drop trigger if exists users_keep_auth_email on public.users;
create trigger users_keep_auth_email before insert or update of email on public.users
for each row execute function public.keep_account_auth_email();
drop trigger if exists students_keep_account_email on public.students;
create trigger students_keep_account_email before insert or update of email on public.students
for each row execute function public.keep_profile_account_email();
drop trigger if exists teachers_keep_account_email on public.teachers;
create trigger teachers_keep_account_email before insert or update of email on public.teachers
for each row execute function public.keep_profile_account_email();
-- Existing on_auth_user_change runs first and mirrors the accepted email into users.
drop trigger if exists p02_sync_auth_profile_email on auth.users;
create trigger p02_sync_auth_profile_email after update of email on auth.users
for each row when (old.email is distinct from new.email)
execute function public.sync_auth_profile_email();

create or replace function public.save_student_profile(
  p_profile jsonb, p_user_id uuid default null, p_id bigint default null
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare
  v public.students;
  owner_id uuid;
  saved_id bigint;
begin
  select * into v from jsonb_populate_record(null::public.students, p_profile);
  perform public.assert_pilot_placement(v.program_id, v.year_level, v.section, v.campus);
  if p_id is null then owner_id := p_user_id;
  else select user_id into owner_id from public.students where id = p_id;
  end if;
  perform 1 from public.users where id = owner_id and role = 'student' for update;
  if not found then raise exception 'That student account no longer exists.' using errcode = '23503'; end if;
  if p_id is null then
    insert into public.students (user_id, student_id, full_name, gender, date_of_birth,
      place_of_birth, address, contact_number, email, profile_picture, parent_name,
      parent_contact_number, program_id, year_level, section, campus, status)
    values (owner_id, v.student_id, v.full_name, v.gender, v.date_of_birth,
      v.place_of_birth, v.address, v.contact_number, v.email, v.profile_picture,
      v.parent_name, v.parent_contact_number, v.program_id, v.year_level, v.section, v.campus, v.status)
    returning id into saved_id;
  else
    update public.students set student_id = v.student_id, full_name = v.full_name,
      gender = v.gender, date_of_birth = v.date_of_birth, place_of_birth = v.place_of_birth,
      address = v.address, contact_number = v.contact_number, profile_picture = v.profile_picture,
      parent_name = v.parent_name, parent_contact_number = v.parent_contact_number,
      program_id = v.program_id, year_level = v.year_level, section = v.section,
      campus = v.campus, status = v.status
    where id = p_id and user_id = owner_id returning id into saved_id;
    if not found then raise exception 'That student record no longer exists.' using errcode = '23503'; end if;
  end if;
  return saved_id;
end;
$$;

create or replace function public.save_teacher_profile(
  p_profile jsonb, p_assignments jsonb, p_user_id uuid default null, p_id bigint default null
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare
  v public.teachers;
  a record;
  owner_id uuid;
  saved_id bigint;
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
  delete from public.teacher_assignments where teacher_id = saved_id;
  insert into public.teacher_assignments (teacher_id, program_id, course_id, year_level, section, campus)
  select distinct saved_id, x.program_id, x.course_id, x.year_level, x.section, x.campus
  from jsonb_to_recordset(p_assignments)
    as x(program_id bigint, course_id bigint, year_level text, section text, campus text);
  return saved_id;
end;
$$;

create or replace function public.save_schedule_week(
  p_program_id bigint, p_year text, p_section text, p_campus text,
  p_days integer[], p_time time, p_grace integer, p_status public.account_status
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform public.assert_pilot_placement(p_program_id, p_year, p_section, p_campus, true);
  if p_days is null or cardinality(p_days) not between 1 and 5
    or exists (select 1 from unnest(p_days) d where d is null or d not between 1 and 5)
    or (select count(distinct d) from unnest(p_days) d) <> cardinality(p_days)
    or p_time is null or p_grace is null or p_grace not between 0 and 240
    or p_status is null or p_status not in ('active', 'inactive') then
    raise exception 'Choose unique Monday-Friday days, a start time, valid grace, and active/inactive status.' using errcode = '23514';
  end if;
  -- Serializes edits and status toggles even when this week has no rows yet.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    jsonb_build_array(p_program_id, p_year, p_section, p_campus)::text, 0));
  insert into public.class_schedules
    (program_id, year_level, section, campus, day_of_week, time_start, grace_minutes, status)
  select p_program_id, p_year, p_section, p_campus, d, p_time, p_grace, p_status from unnest(p_days) d
  on conflict on constraint class_schedules_unique do update
    set time_start = excluded.time_start, grace_minutes = excluded.grace_minutes, status = excluded.status;
  update public.class_schedules set status = 'archived'
  where program_id = p_program_id and year_level = p_year and section = p_section
    and campus is not distinct from p_campus and not (day_of_week = any(p_days))
    and status <> 'archived';
end;
$$;

create or replace function public.set_schedule_week_status(
  p_program_id bigint, p_year text, p_section text, p_campus text, p_status public.account_status
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform public.assert_pilot_placement(p_program_id, p_year, p_section, p_campus, true);
  if p_status is null or p_status not in ('active', 'inactive') then
    raise exception 'Choose active or inactive status.' using errcode = '23514';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    jsonb_build_array(p_program_id, p_year, p_section, p_campus)::text, 0));
  update public.class_schedules set status = p_status
  where program_id = p_program_id and year_level = p_year and section = p_section
    and campus is not distinct from p_campus and status <> 'archived';
  if not found then raise exception 'Choose class days before changing schedule status.' using errcode = '23514'; end if;
end;
$$;

revoke all on function public.keep_account_auth_email() from public;
revoke all on function public.keep_profile_account_email() from public;
revoke all on function public.sync_auth_profile_email() from public;
revoke all on function public.assert_pilot_placement(bigint, text, text, text, boolean) from public;
revoke all on function public.save_student_profile(jsonb, uuid, bigint) from public;
revoke all on function public.save_teacher_profile(jsonb, jsonb, uuid, bigint) from public;
revoke all on function public.save_schedule_week(bigint, text, text, text, integer[], time, integer, public.account_status) from public;
revoke all on function public.set_schedule_week_status(bigint, text, text, text, public.account_status) from public;
grant execute on function public.assert_pilot_placement(bigint, text, text, text, boolean) to authenticated;
grant execute on function public.save_student_profile(jsonb, uuid, bigint) to authenticated;
grant execute on function public.save_teacher_profile(jsonb, jsonb, uuid, bigint) to authenticated;
grant execute on function public.save_schedule_week(bigint, text, text, text, integer[], time, integer, public.account_status) to authenticated;
grant execute on function public.set_schedule_week_status(bigint, text, text, text, public.account_status) to authenticated;

commit;
