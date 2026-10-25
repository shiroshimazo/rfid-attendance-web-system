begin;

create or replace function public.guard_calendar_entry_lifecycle()
returns trigger language plpgsql set search_path = '' as $$
declare
  conflict record;
  today date := (now() at time zone 'Asia/Manila')::date;
begin
  if tg_op = 'DELETE' then
    if old.status <> 'draft' or old.published_at is not null then
      raise exception 'Published or cancelled entries cannot be deleted' using errcode = '23514';
    end if;
    return old;
  end if;
  if tg_op = 'INSERT' then
    if new.status <> 'draft' or new.published_at is not null or new.cancelled_at is not null then
      raise exception 'New calendar entries must start as drafts' using errcode = '23514';
    end if;
    return new;
  end if;
  if new.status = old.status then
    if (new.published_at, new.cancelled_at) is distinct from (old.published_at, old.cancelled_at) then
      raise exception 'Lifecycle timestamps cannot change without a transition' using errcode = '23514';
    end if;
  elsif not ((old.status in ('draft', 'cancelled') and new.status = 'published')
    or (old.status = 'published' and new.status = 'cancelled')) then
    raise exception 'Invalid calendar lifecycle transition' using errcode = '23514';
  elsif new.status = 'published' then
    new.published_at := clock_timestamp();
    new.cancelled_at := null;
  else
    new.published_at := old.published_at;
    new.cancelled_at := clock_timestamp();
  end if;

  if old.status <> 'draft' and old.attendance_impact <> 'normal' and old.starts_on < today then
    if (old.starts_on, old.ends_on, old.attendance_impact, old.audience)
        is distinct from (new.starts_on, new.ends_on, new.attendance_impact, new.audience)
      or not (old.tags @> new.tags and new.tags @> old.tags)
      or not (old.campuses @> new.campuses and new.campuses @> old.campuses) then
      raise exception 'Past attendance scope is locked' using errcode = '23514';
    end if;
  end if;
  if new.attendance_impact <> 'normal' and new.starts_on < today and (
    (new.status = 'published' and old.status <> 'published')
    or (old.status <> 'draft' and (old.attendance_impact = 'normal' or old.starts_on >= today))
  ) then
    raise exception 'Attendance-impacting entries cannot be backdated' using errcode = '23514';
  end if;
  if new.status = 'published' and new.attendance_impact <> 'normal' then
    select * into conflict from public.calendar_entry_conflict(new.id, new.starts_on, new.ends_on, new.campuses);
    if found then
      raise exception 'Attendance is already set by "%" for one of these campuses/dates.', conflict.title using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_calendar_entry_lifecycle() from public, anon, authenticated;

-- The existing lock trigger is table-independent; share its lock order with roster writes.
drop trigger if exists calendar_entries_lock on public.calendar_entries;
create trigger calendar_entries_lock before insert or update or delete on public.calendar_entries
for each statement execute function public.lock_calendar_roster_change();
drop trigger if exists calendar_entries_lifecycle on public.calendar_entries;
create trigger calendar_entries_lifecycle before insert or update or delete on public.calendar_entries
for each row execute function public.guard_calendar_entry_lifecycle();

create or replace function public.cancel_calendar_entry(p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare entry public.calendar_entries;
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
  if entry.status <> 'published' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_TRANSITION', 'message', 'Only published entries can be cancelled.');
  end if;
  update public.calendar_entries set status = 'cancelled', cancelled_at = clock_timestamp(),
    updated_by = auth.uid() where id = entry.id;
  if entry.attendance_impact <> 'normal' then
    perform public.reconcile_calendar_marks(entry.starts_on, entry.ends_on);
  end if;
  return jsonb_build_object('ok', true, 'id', entry.id);
end;
$$;

create or replace function public.delete_calendar_draft(p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare entry public.calendar_entries;
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
  if entry.status <> 'draft' or entry.published_at is not null then
    return jsonb_build_object('ok', false, 'code', 'INVALID_TRANSITION', 'message', 'Only never-published drafts can be deleted.');
  end if;
  delete from public.calendar_entries where id = entry.id;
  return jsonb_build_object('ok', true, 'id', entry.id);
end;
$$;
revoke all on function public.cancel_calendar_entry(bigint), public.delete_calendar_draft(bigint) from public, anon, authenticated;
grant execute on function public.cancel_calendar_entry(bigint), public.delete_calendar_draft(bigint) to authenticated;

commit;
