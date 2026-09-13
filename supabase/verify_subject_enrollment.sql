-- Read-only checks after installing the enrollment migration.
select 'enrollment RLS' as check_name,
  case when exists(select 1 from pg_class where oid='public.subject_enrollments'::regclass and relrowsecurity) then 'PASS' else 'FAIL' end as result
union all
select 'checked roster RPC', case when has_function_privilege('authenticated','public.save_subject_enrollment(bigint,bigint[],integer)','EXECUTE') then 'PASS' else 'FAIL' end
union all
select 'no direct roster writes', case when not has_table_privilege('authenticated','public.subject_enrollments','INSERT,UPDATE,DELETE') then 'PASS' else 'FAIL' end
union all
select 'confirmation requires enrollment', case when pg_get_functiondef('public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz)'::regprocedure) like '%public.subject_enrollments%' then 'PASS' else 'FAIL' end
union all
select 'roster versions initialized', case when not exists(select 1 from public.subject_schedules where roster_version<1) then 'PASS' else 'FAIL' end
union all
select 'enrollment realtime', case when exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='subject_enrollments') then 'PASS' else 'FAIL' end;
