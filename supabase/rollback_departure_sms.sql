-- Optional rollback only: stop departure sending. No notification or attempt data is deleted.
-- Afterwards, reapply 202609140001_rfid_tap_processing.sql so Time Out stops queueing departure rows.
do $$ begin
  if exists(select 1 from pg_roles where rolname='service_role') then
    revoke execute on function public.claim_departure_sms(bigint,uuid) from service_role;
  end if;
end $$;
