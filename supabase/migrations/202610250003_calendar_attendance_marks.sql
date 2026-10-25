-- Calendar snapshots only; RFID evidence and subject confirmations are unchanged.
begin;

create or replace function public.reconcile_calendar_marks(p_from date, p_to date, p_student_id bigint default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  first_day date;
  inserted_count integer;
  deleted_count integer;
begin
  if p_from is null or p_to is null or not isfinite(p_from) or not isfinite(p_to)
    or p_from < date '0001-01-01' or p_to > date '9999-12-31' or p_to < p_from then
    raise exception 'Choose a valid date range' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));
  first_day := greatest(p_from, (now() at time zone 'Asia/Manila')::date);
  if p_to < first_day then return jsonb_build_object('inserted', 0, 'deleted', 0); end if;

  delete from public.attendance_day_marks m
  where m.attendance_date between first_day and p_to
    and (p_student_id is null or m.student_id = p_student_id)
    and not exists (
      select 1 from public.students s
      cross join lateral (
        select e.id, e.attendance_impact from public.calendar_entries e
        where e.status = 'published' and e.attendance_impact <> 'normal'
          and m.attendance_date between e.starts_on and e.ends_on
          and (cardinality(e.campuses) = 0 or s.campus = any(e.campuses))
        order by (e.attendance_impact = 'online_manual') desc, e.id limit 1
      ) effective
      where s.id = m.student_id and s.status = 'active' and s.campus = m.campus
        and effective.id = m.calendar_entry_id
        and m.status = case effective.attendance_impact
          when 'online_manual' then 'OnlineManual'::public.attendance_day_status
          else 'NoClasses'::public.attendance_day_status end
    );
  get diagnostics deleted_count = row_count;

  insert into public.attendance_day_marks(student_id, attendance_date, status, calendar_entry_id, campus)
  select distinct on (s.id, e.starts_on + days.day_offset)
    s.id, e.starts_on + days.day_offset,
    case e.attendance_impact when 'online_manual' then 'OnlineManual'::public.attendance_day_status
      else 'NoClasses'::public.attendance_day_status end,
    e.id, s.campus
  from public.calendar_entries e
  join public.students s on s.status = 'active'
    and (p_student_id is null or s.id = p_student_id)
    and (cardinality(e.campuses) = 0 or s.campus = any(e.campuses))
  cross join lateral generate_series(greatest(first_day, e.starts_on) - e.starts_on,
    least(p_to, e.ends_on) - e.starts_on) as days(day_offset)
  where e.status = 'published' and e.attendance_impact <> 'normal'
    and e.starts_on <= p_to and e.ends_on >= first_day
  order by s.id, e.starts_on + days.day_offset, (e.attendance_impact = 'online_manual') desc, e.id
  on conflict (student_id, attendance_date) do nothing;
  get diagnostics inserted_count = row_count;
  return jsonb_build_object('inserted', inserted_count, 'deleted', deleted_count);
end;
$$;
revoke all on function public.reconcile_calendar_marks(date,date,bigint) from public, anon, authenticated;

create or replace function public.sync_attendance_day_marks(p_from date, p_to date)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if public.current_user_role() is distinct from 'admin' or not public.has_verified_email_session() then
    raise exception 'Verified administrator access required' using errcode = '42501';
  end if;
  return public.reconcile_calendar_marks(p_from, p_to);
end;
$$;
revoke all on function public.sync_attendance_day_marks(date,date) from public, anon, authenticated;
grant execute on function public.sync_attendance_day_marks(date,date) to authenticated;

create or replace function public.guard_historical_calendar_mark()
returns trigger language plpgsql set search_path = '' as $$
declare today date := (now() at time zone 'Asia/Manila')::date;
begin
  if tg_op <> 'INSERT' and old.attendance_date < today then
    raise exception 'Historical calendar snapshots cannot be changed' using errcode = '23514';
  end if;
  if tg_op <> 'DELETE' and new.attendance_date < today then
    raise exception 'Calendar snapshots cannot be backdated' using errcode = '23514';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.guard_historical_calendar_mark() from public, anon, authenticated;
drop trigger if exists calendar_marks_preserve_history on public.attendance_day_marks;
create trigger calendar_marks_preserve_history before insert or update or delete on public.attendance_day_marks
for each row execute function public.guard_historical_calendar_mark();

create or replace function public.lock_calendar_roster_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- Acquire the shared calendar lock before student row locks to avoid inverted lock order.
  perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));
  return null;
end;
$$;
revoke all on function public.lock_calendar_roster_change() from public, anon, authenticated;
drop trigger if exists calendar_roster_lock on public.students;
create trigger calendar_roster_lock before insert or update of campus, status on public.students
for each statement execute function public.lock_calendar_roster_change();

create or replace function public.reconcile_student_calendar_marks()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'Asia/Manila')::date;
  last_day date;
begin
  if tg_op = 'UPDATE' and (new.campus, new.status) is not distinct from (old.campus, old.status) then
    return new;
  end if;
  select max(affected.day) into last_day from (
    select e.ends_on as day from public.calendar_entries e
    where e.status = 'published' and e.attendance_impact <> 'normal'
      and (cardinality(e.campuses) = 0 or new.campus = any(e.campuses))
    union all
    select m.attendance_date from public.attendance_day_marks m where m.student_id = new.id
  ) affected;
  if last_day >= today then
    perform public.reconcile_calendar_marks(today, last_day, new.id);
  end if;
  return new;
end;
$$;
revoke all on function public.reconcile_student_calendar_marks() from public, anon, authenticated;
-- Run after the existing profile lifecycle trigger has synchronized account status.
drop trigger if exists zz_calendar_student_marks on public.students;
create trigger zz_calendar_student_marks after insert or update of campus, status on public.students
for each row execute function public.reconcile_student_calendar_marks();

commit;
