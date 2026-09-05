-- P01: consult current database account status even for retained Auth sessions.
-- Additive authorization change only; no account or historical data is rewritten.
begin;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select account.role
  from public.users as account
  where account.id = auth.uid() and account.status = 'active'
$$;

create or replace function public.current_student_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select student.id
  from public.students as student
  where student.user_id = auth.uid()
    and public.current_user_role() = 'student'
    and student.status = 'active'
$$;

create or replace function public.teacher_can_access_student(target_student_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'teacher', false) and exists (
    select 1
    from public.students as student
    join public.teacher_assignments as assignment
      on assignment.program_id = student.program_id
     and (assignment.year_level is null or assignment.year_level = student.year_level)
     and (assignment.section is null or assignment.section = student.section)
     and (assignment.campus is null or assignment.campus = student.campus)
    join public.teachers as teacher on teacher.id = assignment.teacher_id
    where student.id = target_student_id
      and teacher.user_id = auth.uid()
      and student.status = 'active'
      and teacher.status = 'active'
      and assignment.status = 'active'
  )
$$;

revoke all on function public.current_user_role() from public;
revoke all on function public.current_student_id() from public;
revoke all on function public.teacher_can_access_student(bigint) from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_student_id() to authenticated;
grant execute on function public.teacher_can_access_student(bigint) to authenticated;

-- A restrictive policy is ANDed with the existing role/owner policies. It never
-- grants new access, and prevents permissive owner/catalog paths bypassing status.
do $$
declare
  business_table text;
begin
  foreach business_table in array array[
    'students', 'teachers', 'programs', 'courses', 'teacher_assignments',
    'rfid_cards', 'attendance_records', 'sms_notifications', 'class_schedules'
  ]
  loop
    execute format('drop policy if exists active_account_required on public.%I', business_table);
    execute format(
      'create policy active_account_required on public.%I as restrictive
       for all to authenticated
       using ((select public.current_user_role()) is not null)
       with check ((select public.current_user_role()) is not null)',
      business_table
    );
  end loop;
end;
$$;

-- public.users intentionally keeps users_read_own for login/status feedback.
-- All account writes and other-account reads still require an active admin via
-- users_admin_all and the updated current_user_role(). Disabled users cannot
-- restore their own status or change roles. Service-role behavior is unchanged.
commit;
