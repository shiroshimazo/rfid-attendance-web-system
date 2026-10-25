begin;

create or replace function public.publish_calendar_entry(p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  entry public.calendar_entries;
  conflict record;
begin
  if public.current_user_role() is distinct from 'admin' or not public.has_verified_email_session() then
    raise exception 'Verified administrator access required' using errcode = '42501';
  end if;
  if p_id is null or p_id <= 0 then
    raise exception 'Entry id must be a positive integer' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));
  select * into entry from public.calendar_entries where id = p_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'message', 'Calendar entry no longer exists.');
  end if;
  if entry.status not in ('draft', 'cancelled') then
    return jsonb_build_object('ok', false, 'code', 'INVALID_TRANSITION', 'message', 'Only draft or cancelled entries can be published.');
  end if;
  if entry.attendance_impact <> 'normal' then
    if entry.starts_on < (now() at time zone 'Asia/Manila')::date then
      return jsonb_build_object('ok', false, 'code', 'PAST_ATTENDANCE_DATE', 'message', 'Attendance-impacting entries cannot be published before today.');
    end if;
    select * into conflict from public.calendar_entry_conflict(entry.id, entry.starts_on, entry.ends_on, entry.campuses);
    if found then
      return jsonb_build_object('ok', false, 'code', 'CALENDAR_CONFLICT',
        'message', format('Attendance is already set by "%s" for one of these campuses/dates.', conflict.title));
    end if;
  end if;

  update public.calendar_entries set status = 'published', published_at = clock_timestamp(),
    cancelled_at = null, updated_by = auth.uid() where id = entry.id;
  if entry.attendance_impact <> 'normal' then
    perform public.reconcile_calendar_marks(entry.starts_on, entry.ends_on);
  end if;
  return jsonb_build_object('ok', true, 'id', entry.id);
end;
$$;
revoke all on function public.publish_calendar_entry(bigint) from public, anon, authenticated;
grant execute on function public.publish_calendar_entry(bigint) to authenticated;

commit;
