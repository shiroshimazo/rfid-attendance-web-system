-- Optional rollback only: disable ingestion, retaining attendance, SMS and receipts.
do $$ begin
  if exists(select 1 from pg_roles where rolname = 'service_role') then
    revoke execute on function public.record_rfid_tap(uuid,text,timestamptz) from service_role;
  end if;
end $$;
