-- R01: new attendance decisions are Present, Late, or Absent only.
-- Keep the original enum and existing rows intact for historical compatibility.
-- In particular, this migration does not convert/delete old Excused records.
begin;

create or replace function public.enforce_current_attendance_status()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.attendance_status::text in ('Present', 'Late', 'Absent') then
    return new;
  end if;

  -- Mixed-version clients may still save an existing historical record.
  -- They cannot copy its retired decision onto another student/day/card.
  if tg_op = 'UPDATE' then
    if new.attendance_status is not distinct from old.attendance_status
       and new.id = old.id
       and new.student_id = old.student_id
       and new.attendance_date = old.attendance_date
       and new.rfid_card_id = old.rfid_card_id then
      return new;
    end if;
  end if;

  raise exception 'Attendance status must be Present, Late, or Absent.'
    using errcode = '23514';
end;
$$;

drop trigger if exists attendance_enforce_current_status on public.attendance_records;
create trigger attendance_enforce_current_status
before insert or update on public.attendance_records
for each row execute function public.enforce_current_attendance_status();

revoke all on function public.enforce_current_attendance_status() from public;

commit;
