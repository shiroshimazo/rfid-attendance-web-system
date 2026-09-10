-- Read-only: expect eleven PASS rows after P07 migration.
select name as table_name,
  case when exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
    and schemaname='public' and tablename=name)
    and exists(select 1 from pg_class where oid=to_regclass('public.' || name) and relrowsecurity)
    then 'PASS' else 'FAIL' end as result
from unnest(array['attendance_records','subject_attendance','subject_schedules','rfid_cards',
  'sms_notifications','students','teachers','teacher_assignments','class_schedules','programs','courses']) as t(name);
