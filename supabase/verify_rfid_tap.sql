-- Read-only installation checks. No attendance writes or SMS delivery.
select 'RFID tap RPC installed' as check_name,
  case when to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)') is not null
    then 'PASS' else 'FAIL' end as result
union all
select 'Tap receipt table has RLS',
  case when exists(select 1 from pg_class where oid = to_regclass('public.rfid_tap_requests') and relrowsecurity)
    then 'PASS' else 'FAIL' end
union all
select 'Anonymous and portal roles cannot invoke tap RPC',
  case when to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)') is not null
    and not has_function_privilege('anon',to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)'),'EXECUTE')
    and not has_function_privilege('authenticated',to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)'),'EXECUTE')
    then 'PASS' else 'FAIL' end
union all
select 'Service role can invoke tap RPC',
  case when to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)') is not null
    and has_function_privilege('service_role',to_regprocedure('public.record_rfid_tap(uuid,text,timestamptz)'),'EXECUTE')
    then 'PASS' else 'FAIL' end
union all
select 'Portal roles cannot read or write request receipts',
  case when to_regclass('public.rfid_tap_requests') is not null
    and not has_table_privilege('anon',to_regclass('public.rfid_tap_requests'),'SELECT,INSERT,UPDATE,DELETE')
    and not has_table_privilege('authenticated',to_regclass('public.rfid_tap_requests'),'SELECT,INSERT,UPDATE,DELETE')
    then 'PASS' else 'FAIL' end
union all
select 'Attendance and SMS are published for Realtime',
  case when (select count(*) from pg_publication_tables where pubname='supabase_realtime'
    and schemaname='public' and tablename in ('attendance_records','sms_notifications')) = 2
    then 'PASS' else 'FAIL' end
union all
select 'Teacher-confirmed Late constraint and RPC installed',
  case when exists(select 1 from pg_constraint where conrelid=to_regclass('public.subject_attendance')
    and conname='subject_attendance_attendance_status_check' and position('Late' in pg_get_constraintdef(oid)) > 0)
    and position('''Present'', ''Late'', ''Absent''' in pg_get_functiondef(
      to_regprocedure('public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz)'))) > 0
    then 'PASS' else 'FAIL' end;
