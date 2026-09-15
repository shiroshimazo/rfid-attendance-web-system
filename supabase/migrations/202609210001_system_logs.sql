-- Additive audit trail. Apply before deploying the System Logs page.
begin;
create table if not exists public.system_logs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default clock_timestamp(),
  actor_id uuid,
  actor_name text not null default 'System',
  actor_role text not null default 'system',
  source text not null check (source in ('database','application','authentication')),
  event text not null,
  entity text not null,
  record_id text,
  outcome text not null default 'success' check (outcome in ('success','failed','denied')),
  details jsonb not null default '{}'::jsonb
);
create index if not exists system_logs_recent_idx on public.system_logs(created_at desc,id desc);
create index if not exists system_logs_entity_idx on public.system_logs(entity,created_at desc,id desc);
create index if not exists system_logs_outcome_idx on public.system_logs(outcome,created_at desc,id desc);
alter table public.system_logs enable row level security;
revoke all on public.system_logs from public,anon,authenticated;
grant select on public.system_logs to authenticated;
drop policy if exists system_logs_admin_read on public.system_logs;
create policy system_logs_admin_read on public.system_logs for select to authenticated
  using (public.current_user_role()='admin');
-- Only trusted server code may append application results; browsers cannot forge them.
do $$ begin
  if exists(select 1 from pg_roles where rolname='service_role') then
    grant select,insert on public.system_logs to service_role;
    grant usage,select on sequence public.system_logs_id_seq to service_role;
  end if;
end $$;

create or replace function public.prevent_system_log_changes()
returns trigger language plpgsql set search_path='' as $$
begin raise exception 'System logs are append-only.' using errcode='42501'; end $$;
revoke all on function public.prevent_system_log_changes() from public;
drop trigger if exists system_logs_immutable on public.system_logs;
create trigger system_logs_immutable before update or delete or truncate on public.system_logs
  for each statement execute function public.prevent_system_log_changes();

create or replace function public.audit_record_change()
returns trigger language plpgsql security definer set search_path='' as $$
declare previous jsonb := '{}'::jsonb; current_row jsonb := '{}'::jsonb;
  changed text[]; safe_keys text[] := array['id','user_id','student_id','teacher_id','assignment_id','schedule_id',
    'program_id','course_id','attendance_id','day_of_week','year_level','section','campus','status','role',
    'card_status','attendance_status','sms_status','active','attendance_date','time_start','time_end',
    'time_in','time_out','grace_minutes'];
  before_values jsonb; after_values jsonb; who uuid := auth.uid(); who_name text; who_role text;
  action text := lower(tg_op); reference text;
begin
  if tg_op <> 'INSERT' then previous := to_jsonb(old); end if;
  if tg_op <> 'DELETE' then current_row := to_jsonb(new); end if;
  select array_agg(key order by key) into changed from (
    select key from jsonb_object_keys(previous || current_row) key
    where key not in ('updated_at','created_at','roster_version')
      and previous->key is distinct from current_row->key
  ) fields;
  if changed is null then return null; end if;
  select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into before_values
    from jsonb_each(previous) where key=any(safe_keys) and key=any(changed);
  select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into after_values
    from jsonb_each(current_row) where key=any(safe_keys) and key=any(changed);
  if current_row->>'status'='archived' and previous->>'status' is distinct from 'archived' then action:='archived';
  elsif previous->>'status'='archived' and current_row->>'status'='active' then action:='restored';
  elsif tg_op='INSERT' then action:='created';
  elsif tg_op='UPDATE' then action:='updated';
  else action:='deleted'; end if;
  reference := coalesce(current_row->>'id',previous->>'id',current_row->>'request_id',previous->>'request_id',
    concat_ws(':',coalesce(current_row->>'schedule_id',previous->>'schedule_id'),coalesce(current_row->>'student_id',previous->>'student_id')));
  select email,role::text into who_name,who_role from public.users where id=who;
  insert into public.system_logs(actor_id,actor_name,actor_role,source,event,entity,record_id,details)
    values(who,coalesce(who_name,'System'),coalesce(who_role,'system'),'database',action,tg_table_name,reference,
      jsonb_build_object('changed_fields',changed,'before',before_values,'after',after_values));
  return null;
end $$;
revoke all on function public.audit_record_change() from public;
do $$ declare target text; begin
  foreach target in array array['users','students','teachers','teacher_assignments','programs','courses',
    'class_schedules','subject_schedules','subject_enrollments','attendance_records','subject_attendance',
    'rfid_cards','rfid_tap_requests','sms_notifications'] loop
    execute format('drop trigger if exists audit_record_change on public.%I',target);
    execute format('create trigger audit_record_change after insert or update or delete on public.%I for each row execute function public.audit_record_change()',target);
  end loop;
end $$;

-- Auth updates cover password recovery too; never retain password hashes or tokens.
create or replace function public.audit_auth_change()
returns trigger language plpgsql security definer set search_path='' as $$
declare old_row jsonb := to_jsonb(old); new_row jsonb := to_jsonb(new); action text; target uuid;
  who_name text; who_role text;
begin
  if tg_table_schema='auth' and tg_table_name='users' then
    if old_row->'encrypted_password' is distinct from new_row->'encrypted_password' then action:='password_changed';
    elsif old_row->'raw_user_meta_data' is distinct from new_row->'raw_user_meta_data' then action:='profile_updated';
    else return null; end if;
    target := (new_row->>'id')::uuid;
  elsif tg_table_name='email_verified_sessions' and tg_op='INSERT' then
    action:='session_verified'; target := (new_row->>'user_id')::uuid;
  elsif tg_table_schema='auth' and tg_table_name='sessions' and tg_op='DELETE' then
    if not exists(select 1 from public.email_verified_sessions where session_id=(old_row->>'id')::uuid) then return null; end if;
    action:='session_ended'; target := (old_row->>'user_id')::uuid;
  else return null; end if;
  select email,role::text into who_name,who_role from public.users where id=auth.uid();
  insert into public.system_logs(actor_id,actor_name,actor_role,source,event,entity,record_id)
    values(auth.uid(),coalesce(who_name,'Auth service'),coalesce(who_role,'system'),'authentication',action,'authentication',target::text);
  return null;
end $$;
revoke all on function public.audit_auth_change() from public;
drop trigger if exists audit_auth_change on auth.users;
create trigger audit_auth_change after update on auth.users for each row execute function public.audit_auth_change();
drop trigger if exists audit_verified_session on public.email_verified_sessions;
create trigger audit_verified_session after insert on public.email_verified_sessions for each row execute function public.audit_auth_change();
do $$ begin
  if to_regclass('auth.sessions') is not null then
    execute 'drop trigger if exists audit_session_end on auth.sessions';
    execute 'create trigger audit_session_end after delete on auth.sessions for each row execute function public.audit_auth_change()';
  end if;
end $$;
-- Mirror Auth's native audit events (including recovery requests) when available.
-- No raw payload, tokens, IP addresses or submitted credentials are copied.
create or replace function public.audit_auth_event()
returns trigger language plpgsql security definer set search_path='' as $$
declare payload jsonb := to_jsonb(new)->'payload'; action text; target uuid; who_name text; who_role text;
begin
  action := payload->>'action';
  if action is null or action !~ '^[a-z_]{1,80}$' then return null; end if;
  if payload->>'actor_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    target := (payload->>'actor_id')::uuid;
  end if;
  select email,role::text into who_name,who_role from public.users where id=target;
  insert into public.system_logs(actor_id,actor_name,actor_role,source,event,entity,record_id)
    values(target,coalesce(who_name,'Auth service'),coalesce(who_role,'system'),'authentication',action,'authentication',target::text);
  return null;
end $$;
revoke all on function public.audit_auth_event() from public;
do $$ begin
  if to_regclass('auth.audit_log_entries') is not null then
    execute 'drop trigger if exists audit_auth_event on auth.audit_log_entries';
    execute 'create trigger audit_auth_event after insert on auth.audit_log_entries for each row execute function public.audit_auth_event()';
  end if;
  if exists(select 1 from pg_publication where pubname='supabase_realtime')
    and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='system_logs') then
    alter publication supabase_realtime add table public.system_logs;
  end if;
end $$;
commit;
