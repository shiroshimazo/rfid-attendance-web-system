-- P07: publish supported page dependencies. RLS and existing data are unchanged.
begin;
do $$
declare table_name text;
begin
  if not exists(select 1 from pg_publication where pubname='supabase_realtime') then
    raise exception 'Supabase Realtime publication is missing.';
  end if;
  foreach table_name in array array['attendance_records','subject_attendance','subject_schedules',
    'rfid_cards','sms_notifications','students','teachers','teacher_assignments','class_schedules','programs','courses'] loop
    if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
      and schemaname='public' and tablename=table_name) then
      execute format('alter publication supabase_realtime add table public.%I',table_name);
    end if;
  end loop;
end $$;
commit;
