-- P03: no existing card, attendance, or SMS rows are rewritten/deleted.
-- Check supabase/verify_rfid_uid_inventory.sql before applying; collisions abort.
begin;

create or replace function public.normalize_rfid_uid(p_uid text)
returns text language plpgsql immutable strict security invoker set search_path = '' as $$
declare v text := upper(btrim(p_uid, E' \t\r\n')); compact text;
begin
  if length(p_uid) > 64 or v !~ '^([0-9A-F]+|[0-9A-F]{2}(:[0-9A-F]{2})+|[0-9A-F]{2}(-[0-9A-F]{2})+|[0-9A-F]{2}( [0-9A-F]{2})+)$' then return null; end if;
  compact := translate(v, ': -', '');
  if length(compact) not in (8, 14, 20) then return null; end if;
  return compact;
end;
$$;

-- Serialize the inventory/index step against all card writers during rollout.
lock table public.rfid_cards in share row exclusive mode;
do $$
begin
  if exists (select public.normalize_rfid_uid(rfid_number) from public.rfid_cards
    where public.normalize_rfid_uid(rfid_number) is not null
    group by public.normalize_rfid_uid(rfid_number) having count(*) > 1) then
    raise exception 'Equivalent RFID UIDs already exist. Review verify_rfid_uid_inventory.sql; no records were changed.' using errcode = '23505';
  end if;
end;
$$;
create unique index if not exists rfid_cards_normalized_uid_unique
  on public.rfid_cards (public.normalize_rfid_uid(rfid_number))
  where public.normalize_rfid_uid(rfid_number) is not null;

create or replace function public.guard_rfid_card_write()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare uid text; holder public.students; needs_holder_check boolean;
begin
  if tg_op = 'INSERT' or new.rfid_number is distinct from old.rfid_number then
    uid := public.normalize_rfid_uid(new.rfid_number);
    if uid is null then raise exception 'Enter a 4, 7, or 10-byte hexadecimal reader UID.' using errcode = '23514'; end if;
    if tg_op = 'UPDATE' and uid is distinct from public.normalize_rfid_uid(old.rfid_number)
      and exists (select 1 from public.attendance_records where rfid_card_id = old.id) then
      raise exception 'Attendance history prevents replacing this card UID. Register a new card.' using errcode = '23503';
    end if;
    new.rfid_number := uid;
  end if;
  -- Unchanged legacy values remain readable and can still be retired.
  needs_holder_check := tg_op = 'INSERT';
  if tg_op = 'UPDATE' then
    needs_holder_check := new.student_id is distinct from old.student_id
      or new.card_status is distinct from old.card_status;
  end if;
  if new.card_status = 'Active' and needs_holder_check then
    if public.normalize_rfid_uid(new.rfid_number) is null then
      raise exception 'This legacy card has no valid reader UID. Register its verified UID before activation.' using errcode = '23514';
    end if;
    select * into holder from public.students where id = new.student_id for share;
    if not found then raise exception 'That student record no longer exists.' using errcode = '23503'; end if;
    if holder.status <> 'active' or not exists (select 1 from public.users
      where id = holder.user_id and role = 'student' and status = 'active') then
      raise exception 'The student and linked account must be active before activating a card.' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists rfid_cards_guard_write on public.rfid_cards;
create trigger rfid_cards_guard_write before insert or update on public.rfid_cards
for each row execute function public.guard_rfid_card_write();

create or replace function public.save_rfid_card(
  p_operation text, p_status public.rfid_card_status,
  p_student_id bigint default null, p_uid text default null,
  p_card_id bigint default null, p_assigned_date date default null
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare card public.rfid_cards; holder public.students; uid text; target_id bigint; saved_id bigint;
begin
  if public.current_user_role() is distinct from 'admin'::public.user_role then
    raise exception 'An active administrator account is required.' using errcode = '42501';
  end if;
  if p_operation is null or p_operation not in ('save', 'assign', 'status') or p_status is null
    or (p_operation = 'save' and (p_uid is null or p_card_id is not null or p_student_id is null))
    or (p_operation = 'assign' and (p_card_id is null or p_student_id is null or p_uid is not null))
    or (p_operation = 'status' and (p_card_id is null or p_student_id is not null or p_uid is not null or p_assigned_date is not null))
    or (p_operation <> 'status' and p_assigned_date is null) then
    raise exception 'Invalid card assignment request.' using errcode = '23514';
  end if;
  -- Card administration is infrequent in this pilot. One transaction lock also
  -- serializes brand-new UIDs, opposing moves and status changes without retry loops.
  perform pg_catalog.pg_advisory_xact_lock(20260911, 3);
  if p_operation = 'save' then
    uid := public.normalize_rfid_uid(p_uid);
    if uid is null then raise exception 'Enter a 4, 7, or 10-byte hexadecimal reader UID.' using errcode = '23514'; end if;
    select * into card from public.rfid_cards where public.normalize_rfid_uid(rfid_number) = uid;
    if found and card.student_id <> p_student_id then
      raise exception 'That UID belongs to another student. Use the existing card reassignment action.' using errcode = '23505';
    end if;
  else
    select * into card from public.rfid_cards where id = p_card_id;
    if not found then raise exception 'That card is no longer registered.' using errcode = '23503'; end if;
  end if;
  target_id := case when p_operation = 'status' then card.student_id else p_student_id end;
  -- Lock the holder before retiring cards, coordinating with profile archival.
  perform id from public.students where id in (target_id, card.student_id) order by id for update;
  select * into holder from public.students where id = target_id;
  if not found then raise exception 'That student record no longer exists.' using errcode = '23503'; end if;
  if card.id is not null then
    -- Re-read after locking: a legacy client might have moved this card meanwhile.
    perform 1 from public.rfid_cards where id = card.id and student_id = card.student_id for update;
    if not found then raise exception 'The card changed. Reload before retrying.' using errcode = '40001'; end if;
    if card.student_id <> target_id and exists (select 1 from public.attendance_records where rfid_card_id = card.id) then
      raise exception 'Attendance history prevents moving this card to another student.' using errcode = '23503';
    end if;
  end if;
  if p_status = 'Active' then
    if holder.status <> 'active' or not exists (select 1 from public.users
      where id = holder.user_id and role = 'student' and status = 'active') then
      raise exception 'The student and linked account must be active before activating a card.' using errcode = '23514';
    end if;
    if public.normalize_rfid_uid(coalesce(card.rfid_number, uid)) is null then
      raise exception 'This legacy card has no valid reader UID. Register its verified UID before activation.' using errcode = '23514';
    end if;
    update public.rfid_cards set card_status = 'Deactivated'
    where student_id = target_id and card_status = 'Active' and id is distinct from card.id;
  end if;
  if card.id is null then
    insert into public.rfid_cards(student_id, rfid_number, card_status, assigned_date)
    values (target_id, uid, p_status, p_assigned_date) returning id into saved_id;
  else
    update public.rfid_cards set student_id = target_id, card_status = p_status,
      assigned_date = case when p_operation = 'status' then assigned_date else p_assigned_date end
    where id = card.id returning id into saved_id;
  end if;
  return saved_id;
end;
$$;

revoke all on function public.normalize_rfid_uid(text) from public;
-- The index expression is also evaluated by service-role maintenance writers.
grant execute on function public.normalize_rfid_uid(text) to authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.normalize_rfid_uid(text) to service_role;
  end if;
end $$;
revoke all on function public.guard_rfid_card_write() from public;
revoke all on function public.save_rfid_card(text, public.rfid_card_status, bigint, text, bigint, date) from public;
grant execute on function public.save_rfid_card(text, public.rfid_card_status, bigint, text, bigint, date) to authenticated;
commit;
