begin;

-- Callers hold calendar-entry-save before checking or changing published scope.
create or replace function public.calendar_entry_conflict(p_id bigint, p_starts_on date, p_ends_on date, p_campuses text[])
returns table(id bigint, title text) language sql stable security definer set search_path = '' as $$
  select e.id, e.title from public.calendar_entries e
  where e.id <> coalesce(p_id, 0) and e.status = 'published' and e.attendance_impact <> 'normal'
    and e.starts_on <= p_ends_on and e.ends_on >= p_starts_on
    and (cardinality(e.campuses) = 0 or cardinality(p_campuses) = 0 or e.campuses && p_campuses)
  order by e.id limit 1;
$$;
revoke all on function public.calendar_entry_conflict(bigint,date,date,text[]) from public, anon, authenticated;

create or replace function public.save_calendar_entry(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  payload jsonb := p_payload;
  field_name text;
  entry_id bigint;
  previous public.calendar_entries;
  values_to_save public.calendar_entries;
  conflict record;
  today date := (now() at time zone 'Asia/Manila')::date;
begin
  if public.current_user_role() is distinct from 'admin' or not public.has_verified_email_session() then
    raise exception 'Verified administrator access required' using errcode = '42501';
  end if;
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Calendar entry must be an object' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_object_keys(payload) as supplied(key) where key <> all(array[
    'id','title','description','reason','tags','attendanceImpact','audience','campuses',
    'startsOn','endsOn','startTime','endTime','location','isPinned'
  ])) then
    raise exception 'Calendar payload contains unsupported fields' using errcode = '22023';
  end if;
  foreach field_name in array array['title','attendanceImpact','audience','startsOn','endsOn'] loop
    if jsonb_typeof(payload -> field_name) is distinct from 'string' then
      raise exception '% must be text', field_name using errcode = '22023';
    end if;
  end loop;
  foreach field_name in array array['title','description','reason','location','startsOn','endsOn','startTime','endTime'] loop
    if payload ? field_name and payload -> field_name <> 'null'::jsonb then
      if jsonb_typeof(payload -> field_name) <> 'string' then
        raise exception '% must be text', field_name using errcode = '22023';
      end if;
      payload := jsonb_set(payload, array[field_name], to_jsonb(regexp_replace(payload ->> field_name, '^[[:space:]]+|[[:space:]]+$', '', 'g')));
    end if;
  end loop;
  foreach field_name in array array['tags','campuses'] loop
    if jsonb_typeof(payload -> field_name) is distinct from 'array' then
      raise exception '% must be an array', field_name using errcode = '22023';
    end if;
    if exists (select 1 from jsonb_array_elements(payload -> field_name) item where jsonb_typeof(item) <> 'string') then
      raise exception '% must contain only text', field_name using errcode = '22023';
    end if;
  end loop;
  if payload ? 'isPinned' and jsonb_typeof(payload -> 'isPinned') <> 'boolean' then
    raise exception 'isPinned must be a boolean' using errcode = '22023';
  end if;
  if payload ? 'id' and payload -> 'id' <> 'null'::jsonb then
    if jsonb_typeof(payload -> 'id') <> 'number' or payload ->> 'id' !~ '^[1-9][0-9]*$' then
      raise exception 'Entry id must be a positive integer' using errcode = '22023';
    end if;
    entry_id := (payload ->> 'id')::bigint;
  end if;
  foreach field_name in array array['startsOn','endsOn'] loop
    if payload ->> field_name !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
      raise exception '% must use YYYY-MM-DD', field_name using errcode = '22023';
    end if;
  end loop;
  foreach field_name in array array['startTime','endTime'] loop
    if nullif(payload ->> field_name, '') is not null
      and payload ->> field_name !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' then
      raise exception '% must use a 24-hour HH:mm time', field_name using errcode = '22023';
    end if;
  end loop;

  select * into values_to_save from jsonb_populate_record(null::public.calendar_entries, jsonb_build_object(
    'title', payload ->> 'title', 'description', nullif(payload ->> 'description', ''),
    'reason', nullif(payload ->> 'reason', ''), 'location', nullif(payload ->> 'location', ''),
    'attendance_impact', payload ->> 'attendanceImpact', 'audience', payload ->> 'audience',
    'starts_on', payload ->> 'startsOn', 'ends_on', payload ->> 'endsOn',
    'start_time', nullif(payload ->> 'startTime', ''), 'end_time', nullif(payload ->> 'endTime', ''),
    'is_pinned', coalesce(payload -> 'isPinned', 'false'::jsonb),
    'tags', (select coalesce(jsonb_agg(distinct item order by item), '[]'::jsonb) from jsonb_array_elements(payload -> 'tags') item),
    'campuses', (select coalesce(jsonb_agg(distinct campus order by campus), '[]'::jsonb) from (
      select regexp_replace(item, '^[[:space:]]+|[[:space:]]+$', '', 'g') as campus
      from jsonb_array_elements_text(payload -> 'campuses') item
    ) normalized)
  ));

  perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));
  if entry_id is not null then
    select * into previous from public.calendar_entries where id = entry_id for update;
    if not found then
      return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'message', 'Calendar entry no longer exists.');
    end if;
    if previous.status <> 'draft' and previous.attendance_impact <> 'normal' and previous.starts_on < today then
      if (previous.starts_on, previous.ends_on, previous.attendance_impact, previous.audience)
          is distinct from (values_to_save.starts_on, values_to_save.ends_on, values_to_save.attendance_impact, values_to_save.audience)
        or not (previous.tags @> values_to_save.tags and values_to_save.tags @> previous.tags)
        or not (previous.campuses @> values_to_save.campuses and values_to_save.campuses @> previous.campuses) then
        return jsonb_build_object('ok', false, 'code', 'HISTORICAL_SCOPE',
          'message', 'Past attendance scope is locked. Cancel the remaining dates and create a new entry.');
      end if;
    end if;
    if previous.status <> 'draft' and values_to_save.attendance_impact <> 'normal' and values_to_save.starts_on < today
      and (previous.attendance_impact = 'normal' or previous.starts_on >= today) then
      return jsonb_build_object('ok', false, 'code', 'PAST_ATTENDANCE_DATE',
        'message', 'Attendance-impacting entries cannot be backdated.');
    end if;
    if previous.status = 'published' and values_to_save.attendance_impact <> 'normal' then
      select * into conflict from public.calendar_entry_conflict(entry_id, values_to_save.starts_on, values_to_save.ends_on, values_to_save.campuses);
      if found then
        return jsonb_build_object('ok', false, 'code', 'CALENDAR_CONFLICT',
          'message', format('Attendance is already set by "%s" for one of these campuses/dates.', conflict.title));
      end if;
    end if;
  end if;

  if entry_id is null then
    insert into public.calendar_entries(title, description, reason, tags, attendance_impact, audience,
      campuses, starts_on, ends_on, start_time, end_time, location, is_pinned, created_by, updated_by)
    values (values_to_save.title, values_to_save.description, values_to_save.reason, values_to_save.tags,
      values_to_save.attendance_impact, values_to_save.audience, values_to_save.campuses, values_to_save.starts_on,
      values_to_save.ends_on, values_to_save.start_time, values_to_save.end_time, values_to_save.location,
      values_to_save.is_pinned, auth.uid(), auth.uid()) returning id into entry_id;
  else
    update public.calendar_entries set title = values_to_save.title, description = values_to_save.description,
      reason = values_to_save.reason, tags = values_to_save.tags, attendance_impact = values_to_save.attendance_impact,
      audience = values_to_save.audience, campuses = values_to_save.campuses, starts_on = values_to_save.starts_on,
      ends_on = values_to_save.ends_on, start_time = values_to_save.start_time, end_time = values_to_save.end_time,
      location = values_to_save.location, is_pinned = values_to_save.is_pinned, updated_by = auth.uid()
    where id = entry_id;
    if previous.status = 'published' then
      perform public.reconcile_calendar_marks(least(previous.starts_on, values_to_save.starts_on), greatest(previous.ends_on, values_to_save.ends_on));
    end if;
  end if;
  return jsonb_build_object('ok', true, 'id', entry_id);
end;
$$;
revoke all on function public.save_calendar_entry(jsonb) from public, anon, authenticated;
grant execute on function public.save_calendar_entry(jsonb) to authenticated;

commit;
