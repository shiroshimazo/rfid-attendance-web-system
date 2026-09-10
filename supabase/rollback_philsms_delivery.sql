-- Disable the sender before rollback (PHILSMS_ENABLED=false). No data is deleted.
do $$ begin
  if exists(select 1 from pg_roles where rolname='service_role') then
    revoke execute on function public.claim_arrival_sms(bigint,uuid) from service_role;
    revoke execute on function public.finish_arrival_sms(bigint,uuid,text,text) from service_role;
  end if;
end $$;
