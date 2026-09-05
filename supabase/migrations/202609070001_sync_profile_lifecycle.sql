-- The profile owns lifecycle status. Every create/edit/status action writes
-- that row; these dependent writes share the same transaction and caller RLS.
create function public.sync_profile_lifecycle()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.users
  set status = new.status
  where id = new.user_id;

  if not found then
    raise exception 'The linked account status could not be synchronized.'
      using errcode = '23514';
  end if;

  if tg_table_name = 'students' then
    -- Temporary inactivity preserves card state. Archiving retires only the
    -- active card; restoring never revives lost or previously retired cards.
    if new.status = 'archived' then
      update public.rfid_cards
      set card_status = 'Deactivated'
      where student_id = new.id and card_status = 'Active';
    end if;
  elsif tg_table_name = 'teachers' then
    update public.teacher_assignments
    set status = new.status
    where teacher_id = new.id and status is distinct from new.status;
  end if;

  return new;
end;
$$;

create trigger students_sync_lifecycle
after insert or update of status on public.students
for each row execute function public.sync_profile_lifecycle();

create trigger teachers_sync_lifecycle
after insert or update of status on public.teachers
for each row execute function public.sync_profile_lifecycle();

-- Create/edit adds assignments after writing the teacher profile. Inherit the
-- stored status instead of the table's active default. Lock the parent so a
-- simultaneous lifecycle change cannot leave a newly inserted assignment stale.
create function public.inherit_teacher_assignment_status()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  select teacher.status into new.status
  from public.teachers as teacher
  where teacher.id = new.teacher_id
  for share;

  if not found then
    raise exception 'The teacher for this assignment could not be read.'
      using errcode = '23503';
  end if;

  return new;
end;
$$;

create trigger teacher_assignments_inherit_status
before insert or update of teacher_id on public.teacher_assignments
for each row execute function public.inherit_teacher_assignment_status();

revoke all on function public.sync_profile_lifecycle() from public;
revoke all on function public.inherit_teacher_assignment_status() from public;
