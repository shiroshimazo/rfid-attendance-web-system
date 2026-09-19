-- Edit class groupings without orphaning their current text-based placements.
begin;

create or replace function public.update_academic_section(
  p_id bigint, p_program_id bigint, p_year_level text, p_section_code text,
  p_campus text, p_status public.account_status
) returns void language plpgsql security definer set search_path = '' as $$
declare
  old_group public.academic_sections;
  changed boolean;
begin
  if public.current_user_role() is distinct from 'admin'::public.user_role
    or public.has_verified_email_session() is distinct from true then
    raise exception 'An active, verified administrator account is required.' using errcode = '42501';
  end if;

  -- Group edits are infrequent. Serialize writers so a concurrent placement save
  -- cannot commit a new reference to the old text while it is being renamed.
  lock table public.academic_sections, public.students, public.teacher_assignments,
    public.subject_schedules, public.class_schedules in share row exclusive mode;
  select * into old_group from public.academic_sections where id = p_id for update;
  if not found then
    raise exception 'That class grouping no longer exists.' using errcode = '23503';
  end if;
  if old_group.status = 'archived' then
    raise exception 'Restore this class grouping before editing it.' using errcode = '23514';
  end if;
  if p_status is null or p_status not in ('active', 'inactive') then
    raise exception 'Choose active or inactive status.' using errcode = '23514';
  end if;
  perform 1 from public.programs where id = p_program_id and status <> 'archived' for share;
  if not found then
    raise exception 'Select a program that is not archived.' using errcode = '23514';
  end if;
  p_year_level := regexp_replace(btrim(p_year_level), '\s+', ' ', 'g');
  p_section_code := upper(btrim(p_section_code));
  p_campus := regexp_replace(btrim(p_campus), '\s+', ' ', 'g');
  if p_year_level is null or length(p_year_level) not between 2 and 40
    or p_section_code is null or length(p_section_code) not between 1 and 20
    or p_section_code !~ '^[A-Z0-9][A-Z0-9-]*$'
    or p_campus is null or length(p_campus) not between 2 and 80 then
    raise exception 'Enter a valid year level, section code, and campus.' using errcode = '23514';
  end if;
  -- Match the spelling used by the create action and existing pickers.
  select coalesce((select year_level from public.academic_sections
    where lower(year_level) = lower(p_year_level) order by id limit 1), p_year_level) into p_year_level;
  select coalesce((select campus from public.academic_sections
    where lower(campus) = lower(p_campus) order by id limit 1), p_campus) into p_campus;

  changed := (old_group.program_id, old_group.year_level, old_group.section_code, old_group.campus)
    is distinct from (p_program_id, p_year_level, p_section_code, p_campus);

  -- The unique catalog index rejects accidental merges before any related writes.
  update public.academic_sections set program_id = p_program_id, year_level = p_year_level,
    section_code = p_section_code, campus = p_campus, status = p_status where id = p_id;
  if not changed then return; end if;

  -- Course IDs belong to a program. Moving a class requires explicit matching
  -- subject codes, rather than silently assigning unrelated subjects.
  if old_group.program_id <> p_program_id and exists (
    select 1 from (
      select course_id from public.teacher_assignments
        where program_id = old_group.program_id and year_level = old_group.year_level
          and section = old_group.section_code and campus = old_group.campus and status <> 'archived'
      union
      select course_id from public.subject_schedules
        where program_id = old_group.program_id and year_level = old_group.year_level
          and section = old_group.section_code and campus = old_group.campus and status <> 'archived'
    ) used join public.courses source on source.id = used.course_id
    where not exists (select 1 from public.courses target where target.program_id = p_program_id
      and upper(target.course_code) = upper(source.course_code) and target.status = 'active')
  ) then
    raise exception 'Add matching active subject codes in the destination program before moving this grouping.' using errcode = '23514';
  end if;

  update public.students set program_id = p_program_id, year_level = p_year_level,
    section = p_section_code, campus = p_campus
    where program_id = old_group.program_id and year_level = old_group.year_level
      and section = old_group.section_code and campus = old_group.campus and status <> 'archived';

  -- Existing triggers propagate these stable assignment IDs to active schedules.
  update public.teacher_assignments a set program_id = p_program_id,
    course_id = case when old_group.program_id = p_program_id then a.course_id else
      (select target.id from public.courses source join public.courses target
        on upper(target.course_code) = upper(source.course_code)
        where source.id = a.course_id and target.program_id = p_program_id and target.status = 'active') end,
    year_level = p_year_level, section = p_section_code, campus = p_campus
    where a.program_id = old_group.program_id and a.year_level = old_group.year_level
      and a.section = old_group.section_code and a.campus = old_group.campus and a.status <> 'archived';

  -- Include inactive and legacy schedules not covered by the assignment trigger.
  update public.subject_schedules s set program_id = p_program_id,
    course_id = case when old_group.program_id = p_program_id then s.course_id else
      (select target.id from public.courses source join public.courses target
        on upper(target.course_code) = upper(source.course_code)
        where source.id = s.course_id and target.program_id = p_program_id and target.status = 'active') end,
    year_level = p_year_level, section = p_section_code, campus = p_campus
    where s.program_id = old_group.program_id and s.year_level = old_group.year_level
      and s.section = old_group.section_code and s.campus = old_group.campus and s.status <> 'archived';

  update public.class_schedules set program_id = p_program_id, year_level = p_year_level,
    section = p_section_code, campus = p_campus
    where program_id = old_group.program_id and year_level = old_group.year_level
      and section = old_group.section_code and campus = old_group.campus and status <> 'archived';

  -- All-campus schedules also serve other groupings. Preserve the shared row,
  -- carrying its default to the renamed grouping only where no specific row exists.
  if (old_group.program_id, old_group.year_level, old_group.section_code)
    is distinct from (p_program_id, p_year_level, p_section_code) then
    insert into public.class_schedules(program_id, year_level, section, campus,
      day_of_week, time_start, grace_minutes, status)
    select p_program_id, p_year_level, p_section_code, p_campus,
      shared.day_of_week, shared.time_start, shared.grace_minutes, shared.status
    from public.class_schedules shared
    where shared.program_id = old_group.program_id and shared.year_level = old_group.year_level
      and shared.section = old_group.section_code and shared.campus is null and shared.status <> 'archived'
      and not exists(select 1 from public.class_schedules specific
        where specific.program_id = p_program_id and specific.year_level = p_year_level
          and specific.section = p_section_code and specific.campus = p_campus
          and specific.day_of_week = shared.day_of_week);
  end if;
  -- Enrollment IDs and immutable attendance snapshots need no rewrite.
end;
$$;

revoke all on function public.update_academic_section(bigint, bigint, text, text, text, public.account_status) from public;
grant execute on function public.update_academic_section(bigint, bigint, text, text, text, public.account_status) to authenticated;
notify pgrst, 'reload schema';
commit;
