-- Read-only checks after all seven calendar migrations, run as the database owner.
-- Behavioral authorization/rollback tests also run in tests/calendar-migration.test.mjs.
-- Missing prerequisite tables are an installation error; do not deploy on errors or FAIL.
with calendar_tables(name) as (values
  ('calendar_entries'), ('calendar_entry_reads'), ('attendance_day_marks'), ('calendar_email_deliveries')
), public_rpcs(signature) as (values
  ('public.calendar_entry_recipients(bigint)'), ('public.sync_attendance_day_marks(date,date)'),
  ('public.save_calendar_entry(jsonb)'), ('public.publish_calendar_entry(bigint)'),
  ('public.cancel_calendar_entry(bigint)'), ('public.delete_calendar_draft(bigint)')
), private_functions(signature) as (values
  ('public.reconcile_calendar_marks(date,date,bigint)'), ('public.reconcile_student_calendar_marks()'),
  ('public.calendar_entry_conflict(bigint,date,date,text[])'), ('public.guard_calendar_read()'),
  ('public.guard_historical_calendar_mark()'), ('public.lock_calendar_roster_change()'),
  ('public.guard_calendar_entry_lifecycle()')
), expected_marks as (
  select s.id as student_id, d.attendance_date, d.entry_id, s.campus,
    case d.attendance_impact when 'online_manual' then 'OnlineManual'::public.attendance_day_status
      else 'NoClasses'::public.attendance_day_status end as status
  from public.calendar_attendance_days d join public.students s on s.campus=d.campus and s.status='active'
  where d.attendance_date >= (now() at time zone 'Asia/Manila')::date
), checks(check_name, passed) as (
  select 'RLS: ' || name, coalesce((select relrowsecurity from pg_class where oid=to_regclass('public.' || name)), false)
  from calendar_tables
  union all
  select 'Active/verified gates: ' || name,
    (select count(*)=2 from pg_policies where schemaname='public' and tablename=name
      and policyname in ('active_account_required','email_verification_required') and permissive='RESTRICTIVE')
  from calendar_tables
  union all
  select 'Anonymous isolation: ' || name, not has_table_privilege('anon','public.' || name,'SELECT,INSERT,UPDATE,DELETE')
  from calendar_tables
  union all
  select 'No direct client writes: ' || name, not has_table_privilege('authenticated','public.' || name,'INSERT,UPDATE,DELETE')
  from calendar_tables where name <> 'calendar_entry_reads'
  union all
  select 'RPC security: ' || signature,
    exists(select 1 from pg_proc where oid=to_regprocedure(signature) and prosecdef
      and proconfig @> array['search_path=""'])
    and has_function_privilege('authenticated',to_regprocedure(signature),'EXECUTE')
    and not has_function_privilege('anon',to_regprocedure(signature),'EXECUTE')
  from public_rpcs
  union all
  select 'Private helper: ' || signature, to_regprocedure(signature) is not null
    and not has_function_privilege('authenticated',to_regprocedure(signature),'EXECUTE')
    and not has_function_privilege('anon',to_regprocedure(signature),'EXECUTE')
  from private_functions
  union all
  select 'Receipt permissions', has_table_privilege('authenticated','public.calendar_entry_reads','INSERT')
    and has_table_privilege('authenticated','public.calendar_entry_reads','UPDATE')
    and not has_table_privilege('authenticated','public.calendar_entry_reads','DELETE')
    and (select count(*)=3 from pg_policies where schemaname='public' and tablename='calendar_entry_reads'
      and policyname in ('calendar_reads_select','calendar_reads_insert','calendar_reads_update'))
  union all
  select 'Invoker calendar view', coalesce((select reloptions @> array['security_invoker=true']
    from pg_class where oid=to_regclass('public.calendar_attendance_days')), false)
  union all
  select 'Calendar statuses remain separate from RFID',
    enum_range(null::public.attendance_day_status)::text='{NoClasses,OnlineManual}'
    and not ('NoClasses'=any(enum_range(null::public.attendance_status)::text[]))
    and not ('OnlineManual'=any(enum_range(null::public.attendance_status)::text[]))
  union all
  select 'Entry constraints', not exists (
    select 1 from unnest(array['calendar_entries_title_check','calendar_entries_description_check',
      'calendar_entries_reason_length_check','calendar_entries_location_check','calendar_entries_dates_check',
      'calendar_entries_tags_check','calendar_entries_campuses_check','calendar_entries_times_check',
      'calendar_entries_impact_tags_check','calendar_entries_impact_scope_check','calendar_entries_lifecycle_dates_check']) required(name)
    where not exists(select 1 from pg_constraint where conrelid='public.calendar_entries'::regclass
      and conname=required.name and contype='c' and convalidated))
  union all
  select 'No published attendance overlap', not exists (
    select 1 from public.calendar_entries a join public.calendar_entries b on a.id<b.id
      and a.starts_on<=b.ends_on and b.starts_on<=a.ends_on
      and (cardinality(a.campuses)=0 or cardinality(b.campuses)=0 or a.campuses && b.campuses)
    where a.status='published' and b.status='published'
      and a.attendance_impact<>'normal' and b.attendance_impact<>'normal')
  union all
  select 'Today/future marks match effective calendar', not exists (
    select 1 from expected_marks e full join (
      select * from public.attendance_day_marks where attendance_date >= (now() at time zone 'Asia/Manila')::date
    ) m on m.student_id=e.student_id and m.attendance_date=e.attendance_date
    where (m.student_id,m.calendar_entry_id,m.campus,m.status) is distinct from (e.student_id,e.entry_id,e.campus,e.status))
  union all
  select 'No admin email recipients', not exists(select 1 from public.calendar_email_deliveries where recipient_role='admin')
  union all
  select 'Realtime: ' || name, exists(select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename=name)
  from calendar_tables
  union all
  select 'Audit trigger: ' || name, exists(select 1 from pg_trigger
    where tgrelid=to_regclass('public.' || name) and tgname='audit_record_change' and tgenabled='O')
  from calendar_tables where name <> 'calendar_entry_reads'
  union all
  select 'Guard/hook: ' || target || '.' || trigger_name, exists(select 1 from pg_trigger
    where tgrelid=to_regclass('public.' || target) and tgname=trigger_name and tgenabled='O')
  from (values ('calendar_entries','calendar_entries_lifecycle'), ('calendar_entries','calendar_entries_lock'),
    ('calendar_entry_reads','calendar_reads_guard'), ('attendance_day_marks','calendar_marks_preserve_history'),
    ('students','calendar_roster_lock'), ('students','zz_calendar_student_marks')) hooks(target,trigger_name)
)
select check_name, case when coalesce(passed,false) then 'PASS' else 'FAIL' end as result
from checks order by check_name;
