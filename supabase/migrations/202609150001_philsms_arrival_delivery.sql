-- P06: retain historical notifications; only new arrivals are eligible to send.
begin;
alter table public.sms_notifications add column if not exists delivery_enabled boolean not null default false;
alter table public.sms_notifications alter column delivery_enabled set default true;
alter table public.sms_notifications add column if not exists delivery_attempt uuid;
alter table public.sms_notifications add column if not exists delivery_started_at timestamptz;
alter table public.sms_notifications add column if not exists delivery_result text;
alter table public.sms_notifications add column if not exists provider_message_id text;

create or replace function public.claim_arrival_sms(p_attendance_id bigint, p_attempt uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare notification public.sms_notifications;
begin
  if p_attempt is null then return null; end if;
  perform pg_catalog.pg_advisory_xact_lock(hashtextextended('arrival-sms:' || p_attendance_id::text,0));
  -- Do not send historical backlogs, ambiguous duplicate rows, or old arrivals.
  if (select count(*) from public.sms_notifications where attendance_id=p_attendance_id) <> 1 then return null; end if;
  update public.sms_notifications set delivery_attempt=p_attempt, delivery_started_at=clock_timestamp(), delivery_result='attempt_started'
    where attendance_id=p_attendance_id and sms_status='Pending' and delivery_enabled
      and delivery_attempt is null and created_at >= clock_timestamp() - interval '10 minutes'
      and exists(select 1 from public.rfid_tap_requests r where r.attendance_id=p_attendance_id and r.response->>'action'='time_in')
    returning * into notification;
  if not found then return null; end if;
  return jsonb_build_object('id',notification.id,'recipient',notification.parent_contact_number,'message',notification.message);
end $$;

create or replace function public.finish_arrival_sms(p_id bigint,p_attempt uuid,p_result text,p_provider_id text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_result not in ('accepted','rejected','invalid_recipient','unknown') or p_result is null then
    raise exception 'Invalid delivery result.';
  end if;
  update public.sms_notifications set
    sms_status=case when p_result='accepted' then 'Sent'::public.sms_status
      when p_result in ('rejected','invalid_recipient') then 'Failed'::public.sms_status else 'Pending'::public.sms_status end,
    sent_at=case when p_result='accepted' then clock_timestamp() else null end,
    delivery_result=p_result,provider_message_id=left(p_provider_id,200)
    where id=p_id and delivery_attempt=p_attempt and delivery_result='attempt_started';
end $$;

revoke all on function public.claim_arrival_sms(bigint,uuid) from public,authenticated;
revoke all on function public.finish_arrival_sms(bigint,uuid,text,text) from public,authenticated;
do $$ begin
  if exists(select 1 from pg_roles where rolname='anon') then
    revoke all on function public.claim_arrival_sms(bigint,uuid) from anon;
    revoke all on function public.finish_arrival_sms(bigint,uuid,text,text) from anon;
  end if;
  if exists(select 1 from pg_roles where rolname='service_role') then
    grant execute on function public.claim_arrival_sms(bigint,uuid) to service_role;
    grant execute on function public.finish_arrival_sms(bigint,uuid,text,text) to service_role;
  end if;
end $$;
commit;
