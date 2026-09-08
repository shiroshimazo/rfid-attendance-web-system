-- Read-only P05 installation checks. Does not create confirmations or send SMS.
select 'Subject schedules table and RLS' as check_name,
  case when exists(select 1 from pg_class where oid = to_regclass('public.subject_schedules') and relrowsecurity)
    then 'PASS' else 'FAIL' end as result
union all
select 'Subject attendance table and RLS',
  case when exists(select 1 from pg_class where oid = to_regclass('public.subject_attendance') and relrowsecurity)
    then 'PASS' else 'FAIL' end
union all
select 'Teacher confirmation RPC',
  case when to_regprocedure('public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz)') is not null
    then 'PASS' else 'FAIL' end
union all
select 'Authenticated callers have no direct subject-attendance writes',
  case when to_regclass('public.subject_attendance') is not null
    and not has_table_privilege('authenticated', to_regclass('public.subject_attendance'), 'INSERT')
    and not has_table_privilege('authenticated', to_regclass('public.subject_attendance'), 'UPDATE')
    and not has_table_privilege('authenticated', to_regclass('public.subject_attendance'), 'DELETE')
    then 'PASS' else 'FAIL' end
union all
select 'Subject attendance Realtime publication',
  case when exists(select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'subject_attendance')
    then 'PASS' else 'FAIL' end
union all
select 'Subject schedule Realtime publication',
  case when exists(select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'subject_schedules')
    then 'PASS' else 'FAIL' end;
