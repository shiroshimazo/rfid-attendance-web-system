-- Retain structural calendar audit data, never announcement text or email payloads.
begin;
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
  if tg_table_name in ('calendar_entries','attendance_day_marks','calendar_email_deliveries') then
    safe_keys := safe_keys || array['calendar_entry_id','tags','attendance_impact','audience','campuses',
      'starts_on','ends_on','start_time','end_time','is_pinned','published_at','cancelled_at',
      'notification_type','recipient_role','attempt_count','last_attempt_at','sent_at'];
  end if;
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
  foreach target in array array['calendar_entries','attendance_day_marks','calendar_email_deliveries'] loop
    execute format('drop trigger if exists audit_record_change on public.%I', target);
    execute format('create trigger audit_record_change after insert or update or delete on public.%I for each row execute function public.audit_record_change()', target);
  end loop;
  if not exists(select 1 from pg_publication where pubname='supabase_realtime') then
    raise exception 'Supabase Realtime publication is missing.';
  end if;
  foreach target in array array['calendar_entries','calendar_entry_reads','attendance_day_marks','calendar_email_deliveries'] loop
    if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
      and schemaname='public' and tablename=target) then
      execute format('alter publication supabase_realtime add table public.%I', target);
    end if;
  end loop;
end $$;
notify pgrst, 'reload schema';
commit;
