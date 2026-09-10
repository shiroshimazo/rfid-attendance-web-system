-- Read-only P06 checks; never sends a message.
select 'Delivery tracking columns' as check_name,
  case when (select count(*) from information_schema.columns where table_schema='public' and table_name='sms_notifications'
    and column_name in ('delivery_enabled','delivery_attempt','delivery_started_at','delivery_result','provider_message_id'))=5 then 'PASS' else 'FAIL' end as result
union all
select 'SMS claim function installed',case when to_regprocedure('public.claim_arrival_sms(bigint,uuid)') is not null then 'PASS' else 'FAIL' end
union all
select 'SMS completion function installed',case when to_regprocedure('public.finish_arrival_sms(bigint,uuid,text,text)') is not null then 'PASS' else 'FAIL' end
union all
select 'Service-role delivery access',case when
  has_function_privilege('service_role',to_regprocedure('public.claim_arrival_sms(bigint,uuid)'),'EXECUTE')
  and has_function_privilege('service_role',to_regprocedure('public.finish_arrival_sms(bigint,uuid,text,text)'),'EXECUTE') then 'PASS' else 'FAIL' end
union all
select 'Portal and anonymous delivery denied',case when
  not has_function_privilege('authenticated',to_regprocedure('public.claim_arrival_sms(bigint,uuid)'),'EXECUTE')
  and not has_function_privilege('anon',to_regprocedure('public.claim_arrival_sms(bigint,uuid)'),'EXECUTE')
  and not has_function_privilege('authenticated',to_regprocedure('public.finish_arrival_sms(bigint,uuid,text,text)'),'EXECUTE')
  and not has_function_privilege('anon',to_regprocedure('public.finish_arrival_sms(bigint,uuid,text,text)'),'EXECUTE') then 'PASS' else 'FAIL' end;
