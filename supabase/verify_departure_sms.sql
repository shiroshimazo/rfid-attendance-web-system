-- Read-only departure SMS checks; never sends a message.
select 'Notification type column' as check_name,
  case when exists(select 1 from information_schema.columns where table_schema='public' and table_name='sms_notifications'
      and column_name='notification_type' and is_nullable='NO')
    and exists(select 1 from pg_constraint where conname='sms_notification_type_valid'
      and conrelid='public.sms_notifications'::regclass) then 'PASS' else 'FAIL' end as result
union all
select 'Time Out queues departure SMS',case when position('''departure''' in
  coalesce((select prosrc from pg_proc where oid=to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)')),''))>0
  then 'PASS' else 'FAIL' end
union all
select 'Departure claim function installed',case when to_regprocedure('public.claim_departure_sms(bigint,uuid)') is not null
  and to_regprocedure('public.claim_tap_sms(bigint,uuid,text)') is not null then 'PASS' else 'FAIL' end
union all
select 'Service-role departure access',case when
  has_function_privilege('service_role',to_regprocedure('public.claim_departure_sms(bigint,uuid)'),'EXECUTE')
  and has_function_privilege('service_role',to_regprocedure('public.claim_arrival_sms(bigint,uuid)'),'EXECUTE')
  and has_function_privilege('service_role',to_regprocedure('public.finish_arrival_sms(bigint,uuid,text,text)'),'EXECUTE')
  then 'PASS' else 'FAIL' end
union all
select 'Portal, anonymous and direct claim denied',case when
  not has_function_privilege('authenticated',to_regprocedure('public.claim_departure_sms(bigint,uuid)'),'EXECUTE')
  and not has_function_privilege('anon',to_regprocedure('public.claim_departure_sms(bigint,uuid)'),'EXECUTE')
  and not has_function_privilege('authenticated',to_regprocedure('public.claim_tap_sms(bigint,uuid,text)'),'EXECUTE')
  and not has_function_privilege('anon',to_regprocedure('public.claim_tap_sms(bigint,uuid,text)'),'EXECUTE')
  and not has_function_privilege('service_role',to_regprocedure('public.claim_tap_sms(bigint,uuid,text)'),'EXECUTE')
  then 'PASS' else 'FAIL' end;
