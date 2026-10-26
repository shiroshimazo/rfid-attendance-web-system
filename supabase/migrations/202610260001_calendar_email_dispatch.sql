begin;

alter table public.calendar_email_deliveries add column if not exists retry_allowed boolean not null default true;
grant select, insert, update on public.calendar_email_deliveries to service_role;
grant usage, select on sequence public.calendar_email_deliveries_id_seq to service_role;

-- Capture recipients and content under the same lock as the calendar mutation.
create or replace function public.mutate_calendar_entry(
  p_operation text, p_id bigint default null, p_payload jsonb default null, p_notify boolean default false
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  previous public.calendar_entries;
  current_entry public.calendar_entries;
  result jsonb;
  notification_type text;
  recipients jsonb;
  important_fields text[] := array['title','description','reason','tags','attendance_impact','audience',
    'campuses','starts_on','ends_on','start_time','end_time','location'];
begin
  if public.current_user_role() is distinct from 'admin' or not public.has_verified_email_session() then
    raise exception 'Verified administrator access required' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));
  if p_id is not null then
    select * into previous from public.calendar_entries where id = p_id for update;
  end if;
  case p_operation
    when 'save' then
      result := public.save_calendar_entry(p_payload || jsonb_build_object('id', p_id));
    when 'publish' then
      result := public.publish_calendar_entry(p_id);
    when 'cancel' then
      result := public.cancel_calendar_entry(p_id);
    else raise exception 'Invalid calendar operation' using errcode = '22023';
  end case;
  if (result->>'ok')::boolean is distinct from true then return result; end if;
  select * into current_entry from public.calendar_entries where id = (result->>'id')::bigint;
  if p_operation = 'publish' then notification_type := 'published';
  elsif p_operation = 'cancel' then notification_type := 'cancelled';
  elsif p_notify and previous.status = 'published' and exists (
    select 1 from unnest(important_fields) f where
      case when f in ('tags','campuses') then
        not ((to_jsonb(previous)->f) @> (to_jsonb(current_entry)->f)
          and (to_jsonb(current_entry)->f) @> (to_jsonb(previous)->f))
      else (to_jsonb(previous)->f) is distinct from (to_jsonb(current_entry)->f) end
  ) then notification_type := 'updated';
  end if;
  if notification_type is null then return result; end if;
  select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) into recipients
    from public.calendar_entry_recipients(current_entry.id) r;
  return result || jsonb_build_object('notification', jsonb_build_object(
    'batch_id', gen_random_uuid(), 'type', notification_type,
    'entry', to_jsonb(current_entry), 'recipients', recipients));
end;
$$;
revoke all on function public.mutate_calendar_entry(text,bigint,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.mutate_calendar_entry(text,bigint,jsonb,boolean) to authenticated;

commit;
