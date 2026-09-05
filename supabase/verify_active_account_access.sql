-- P01 verification only. Run this WHOLE file in Supabase SQL Editor as postgres.
-- Requires one active Admin, Teacher, and Student (with active role profiles).
-- No email/password/token is needed. No Auth accounts are created or modified.
-- Account-status changes and write probes run in a subtransaction deliberately
-- rolled back before results are returned. The final ROLLBACK removes temp data.
-- This tests database RLS with simulated Auth claims, not the HTTP/JWT transport.
begin;

create temporary table p01_verification_results (
  account_role text,
  tested_status text,
  result text
) on commit drop;

do $$
declare
  runner name := current_user;
  selected_account record;
  account_ids uuid[];
  account_id uuid;
  role_name text;
  tested_status text;
  business_table text;
  visible_count bigint;
  affected_count bigint;
  active_counts jsonb;
  restored_count bigint;
  results jsonb := '[]'::jsonb;
  tables text[] := array[
    'students', 'teachers', 'programs', 'courses', 'teacher_assignments',
    'rfid_cards', 'attendance_records', 'sms_notifications', 'class_schedules'
  ];
begin
  if runner <> 'postgres' then
    raise exception 'Run this verification as postgres in Supabase SQL Editor.';
  end if;

  -- Fail clearly if any role cannot be exercised; never return a partial PASS.
  foreach role_name in array array['admin', 'teacher', 'student'] loop
    select account.id into account_id
    from public.users account
    where account.role::text = role_name and account.status = 'active'
      and (role_name = 'admin'
        or (role_name = 'teacher' and exists (
          select 1 from public.teachers t where t.user_id = account.id and t.status = 'active'))
        or (role_name = 'student' and exists (
          select 1 from public.students s where s.user_id = account.id and s.status = 'active')))
    order by account.id limit 1;
    if account_id is null then
      raise exception 'An active % account with its active profile is required.', role_name;
    end if;
    account_ids := array_append(account_ids, account_id);
  end loop;

  -- Every persistent write below is undone by the intentional exception.
  begin
    for selected_account in
      select id, role from public.users where id = any(account_ids) order by role
    loop
      active_counts := '{}'::jsonb;
      perform set_config('request.jwt.claim.sub', selected_account.id::text, true);
      perform set_config('request.jwt.claims', jsonb_build_object(
        'sub', selected_account.id, 'role', 'authenticated',
        'app_metadata', jsonb_build_object('role', selected_account.role)
      )::text, true);

      foreach tested_status in array array['active', 'inactive', 'archived'] loop
        perform set_config('role', runner, true);
        update public.users set status = tested_status::public.account_status
        where id = selected_account.id;
        perform set_config('role', 'authenticated', true);

        if current_user <> 'authenticated' or auth.uid() is distinct from selected_account.id then
          raise exception 'Verification did not assume the authenticated identity.';
        end if;
        if tested_status = 'active' then
          if public.current_user_role() is distinct from selected_account.role then
            raise exception 'Active % role was not recognized.', selected_account.role;
          end if;
        else
          if public.current_user_role() is not null or public.current_student_id() is not null then
            raise exception 'Disabled % still has authorization helper access.', selected_account.role;
          end if;
        end if;

        foreach business_table in array tables loop
          execute format('select count(*) from public.%I', business_table) into visible_count;
          if tested_status = 'active' then
            active_counts := active_counts || jsonb_build_object(business_table, visible_count);
          else
            if visible_count <> 0 then
              raise exception 'Disabled % can read % rows from %.', selected_account.role, visible_count, business_table;
            end if;
            execute format('update public.%I set id = id', business_table);
            get diagnostics affected_count = row_count;
            if affected_count <> 0 then
              raise exception 'Disabled % can update %.', selected_account.role, business_table;
            end if;
          end if;
        end loop;

        select count(*) into visible_count from public.users;
        if tested_status <> 'active' then
          if visible_count <> 1 then
            raise exception 'Disabled account should read only its own status row.';
          end if;
          update public.users set status = 'active', role = 'admin' where id = selected_account.id;
          get diagnostics affected_count = row_count;
          if affected_count <> 0 then
            raise exception 'Disabled account can restore its own privileges.';
          end if;
          -- Explicit ID avoids consuming a sequence value (sequences do not roll back).
          begin
            insert into public.programs (id, program_code, program_name)
            values (-9223372036854775807, 'P01-VERIFY-ONLY', 'Rollback-only permission probe');
            raise exception 'Disabled account can insert a business record.';
          exception when insufficient_privilege then
            null; -- Expected RLS rejection.
          end;
        elsif (active_counts ->> 'programs')::bigint = 0
          or (selected_account.role = 'student' and (active_counts ->> 'students')::bigint <> 1)
          or (selected_account.role = 'teacher' and (active_counts ->> 'teachers')::bigint <> 1) then
          raise exception 'Active % lost expected catalog/profile access.', selected_account.role;
        end if;
        results := results || jsonb_build_array(jsonb_build_object(
          'account_role', selected_account.role, 'tested_status', tested_status, 'result', 'PASS'));
      end loop;

      perform set_config('role', runner, true);
      update public.users set status = 'active' where id = selected_account.id;
      perform set_config('role', 'authenticated', true);
      foreach business_table in array tables loop
        execute format('select count(*) from public.%I', business_table) into restored_count;
        if restored_count <> (active_counts ->> business_table)::bigint then
          raise exception 'Reactivated % did not regain its previous % access.', selected_account.role, business_table;
        end if;
      end loop;
      perform set_config('role', runner, true);
    end loop;
    raise exception using errcode = 'P0101', message = 'Undo verification writes';
  exception when sqlstate 'P0101' then
    null; -- All account/probe changes are rolled back; results variable survives.
  end;

  insert into p01_verification_results
  select * from jsonb_to_recordset(results)
    as result(account_role text, tested_status text, result text);
end;
$$;

select * from p01_verification_results order by account_role, tested_status;
rollback;
