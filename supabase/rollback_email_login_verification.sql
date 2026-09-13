-- Restore the previous application version together with this rollback.
begin;
do $$ declare p record; begin
  for p in select schemaname, tablename from pg_policies where policyname = 'email_verification_required'
  loop
    execute format('drop policy email_verification_required on %I.%I', p.schemaname, p.tablename);
  end loop;
  if exists (select 1 from pg_roles where rolname = 'authenticator') then
    execute 'alter role authenticator reset pgrst.db_pre_request';
  end if;
end $$;
notify pgrst, 'reload config';
commit;
