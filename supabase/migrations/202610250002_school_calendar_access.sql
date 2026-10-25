-- Calendar reads and recipient resolution only; entry mutations remain RPC-only.
begin;

create or replace function public.current_user_campuses()
returns text[] language sql stable security definer set search_path = '' as $$
  select case
    when not public.has_verified_email_session() then '{}'::text[]
    when public.current_user_role() = 'student' then coalesce((
      select array[s.campus] from public.students s
      where s.user_id = auth.uid() and s.status = 'active'
    ), '{}'::text[])
    when public.current_user_role() = 'teacher' then coalesce((
      select array_agg(distinct a.campus order by a.campus)
      from public.teacher_assignments a join public.teachers t on t.id = a.teacher_id
      where t.user_id = auth.uid() and t.status = 'active' and a.status = 'active'
        and a.campus is not null and btrim(a.campus) <> ''
    ), '{}'::text[])
    else '{}'::text[]
  end;
$$;

create or replace function public.calendar_entry_recipients(p_entry_id bigint)
returns table(user_id uuid, email text, role public.user_role)
language plpgsql stable security definer set search_path = '' as $$
declare
  entry public.calendar_entries;
begin
  if public.current_user_role() is distinct from 'admin'
    or not public.has_verified_email_session() then
    raise exception 'Verified administrator access required' using errcode = '42501';
  end if;
  select * into entry from public.calendar_entries where id = p_entry_id;
  if not found then return; end if;

  return query
  select u.id, u.email, u.role
  from public.users u
  where u.status = 'active' and btrim(u.email) <> '' and (
    (u.role = 'student' and entry.audience in ('everyone', 'students') and exists (
      select 1 from public.students s
      where s.user_id = u.id and s.status = 'active'
        and (cardinality(entry.campuses) = 0 or s.campus = any(entry.campuses))
    ))
    or (u.role = 'teacher' and entry.audience in ('everyone', 'teachers') and exists (
      select 1 from public.teachers t
      where t.user_id = u.id and t.status = 'active'
        and (cardinality(entry.campuses) = 0 or exists (
          select 1 from public.teacher_assignments a
          where a.teacher_id = t.id and a.status = 'active' and a.campus = any(entry.campuses)
        ))
    ))
  ) order by u.role, u.email;
end;
$$;

revoke all on function public.current_user_campuses(), public.calendar_entry_recipients(bigint) from public, anon, authenticated;
grant execute on function public.current_user_campuses(), public.calendar_entry_recipients(bigint) to authenticated;

drop policy if exists calendar_entries_read on public.calendar_entries;
create policy calendar_entries_read on public.calendar_entries for select to authenticated using (
  public.current_user_role() = 'admin' or (
    public.current_user_role() in ('teacher', 'student') and status in ('published', 'cancelled')
    and (audience = 'everyone'
      or (audience = 'teachers' and public.current_user_role() = 'teacher')
      or (audience = 'students' and public.current_user_role() = 'student'))
    and (cardinality(campuses) = 0 or campuses && public.current_user_campuses())
  )
);

drop policy if exists calendar_reads_select on public.calendar_entry_reads;
create policy calendar_reads_select on public.calendar_entry_reads for select to authenticated
using (
  user_id = auth.uid() and public.current_user_role() in ('teacher', 'student')
  and exists (select 1 from public.calendar_entries e where e.id = entry_id and e.status = 'published')
);
drop policy if exists calendar_reads_insert on public.calendar_entry_reads;
create policy calendar_reads_insert on public.calendar_entry_reads for insert to authenticated
with check (
  user_id = auth.uid() and public.current_user_role() in ('teacher', 'student')
  and exists (select 1 from public.calendar_entries e where e.id = entry_id and e.status = 'published')
);
drop policy if exists calendar_reads_update on public.calendar_entry_reads;
create policy calendar_reads_update on public.calendar_entry_reads for update to authenticated
using (
  user_id = auth.uid() and public.current_user_role() in ('teacher', 'student')
  and exists (select 1 from public.calendar_entries e where e.id = entry_id and e.status = 'published')
)
with check (
  user_id = auth.uid() and public.current_user_role() in ('teacher', 'student')
  and exists (select 1 from public.calendar_entries e where e.id = entry_id and e.status = 'published')
);

create or replace function public.guard_calendar_read()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and (new.entry_id, new.user_id) is distinct from (old.entry_id, old.user_id) then
    raise exception 'Read receipt identity cannot change' using errcode = '23514';
  end if;
  new.read_at = clock_timestamp();
  return new;
end;
$$;
revoke all on function public.guard_calendar_read() from public, anon, authenticated;
drop trigger if exists calendar_reads_guard on public.calendar_entry_reads;
create trigger calendar_reads_guard before insert or update on public.calendar_entry_reads
for each row execute function public.guard_calendar_read();

drop policy if exists calendar_marks_read on public.attendance_day_marks;
create policy calendar_marks_read on public.attendance_day_marks for select to authenticated using (
  public.current_user_role() = 'admin'
  or public.teacher_can_access_student(student_id)
  or student_id = public.current_student_id()
);

drop policy if exists calendar_deliveries_read on public.calendar_email_deliveries;
create policy calendar_deliveries_read on public.calendar_email_deliveries for select to authenticated
using (public.current_user_role() = 'admin');

do $$ declare calendar_table text; begin
  foreach calendar_table in array array['calendar_entries', 'calendar_entry_reads', 'attendance_day_marks', 'calendar_email_deliveries'] loop
    execute format('drop policy if exists active_account_required on public.%I', calendar_table);
    execute format('create policy active_account_required on public.%I as restrictive for all to authenticated
      using ((select public.current_user_role()) is not null)
      with check ((select public.current_user_role()) is not null)', calendar_table);
    execute format('drop policy if exists email_verification_required on public.%I', calendar_table);
    execute format('create policy email_verification_required on public.%I as restrictive for all to authenticated
      using ((select public.has_verified_email_session()))
      with check ((select public.has_verified_email_session()))', calendar_table);
  end loop;
end $$;

grant select on public.calendar_entries, public.calendar_entry_reads,
  public.attendance_day_marks, public.calendar_email_deliveries to authenticated;
grant insert, update on public.calendar_entry_reads to authenticated;
revoke delete on public.calendar_entry_reads from authenticated;

create or replace view public.calendar_attendance_days with (security_invoker = true) as
select e.id as entry_id, e.starts_on + days.day_offset as attendance_date,
  c.campus, e.attendance_impact, e.title, e.tags, e.starts_on, e.ends_on
from public.calendar_entries e
cross join lateral generate_series(0, e.ends_on - e.starts_on) as days(day_offset)
cross join lateral (
  select unnest(e.campuses) as campus where cardinality(e.campuses) > 0
  union
  select distinct s.campus from public.students s
  where cardinality(e.campuses) = 0 and s.status = 'active' and btrim(s.campus) <> ''
) c
where e.status = 'published' and e.attendance_impact <> 'normal';
revoke all on public.calendar_attendance_days from public, anon, authenticated;
grant select on public.calendar_attendance_days to authenticated;

commit;
