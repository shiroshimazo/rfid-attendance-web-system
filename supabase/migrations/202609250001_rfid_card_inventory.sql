-- Manage RFID Cards stores the card inventory; Manage Students assigns a stored
-- card to a student. A card may now exist without a holder. No existing card,
-- attendance, or SMS row is rewritten or deleted by this migration.
begin;

alter table public.rfid_cards alter column student_id drop not null;

-- A card only leaves the shelf through an assignment, so it cannot be active
-- without a holder. Existing rows all have one, so nothing is rewritten.
alter table public.rfid_cards drop constraint if exists rfid_cards_active_requires_holder;
alter table public.rfid_cards add constraint rfid_cards_active_requires_holder
  check (card_status <> 'Active' or student_id is not null);

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
    if new.student_id is null then
      raise exception 'Assign this card to a student before activating it.' using errcode = '23514';
    end if;
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

-- Operations: `save` writes inventory details (UID, status, date) and never
-- changes the holder; `assign` and `release` move a stored card between the
-- shelf and a student; `status` retires or restores one in place.
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
  if p_operation is null or p_operation not in ('save', 'assign', 'release', 'status') or p_status is null
    or (p_operation = 'save' and (p_uid is null or p_student_id is not null))
    or (p_operation = 'assign' and (p_card_id is null or p_student_id is null or p_uid is not null))
    or (p_operation = 'release' and (p_card_id is null or p_student_id is not null or p_uid is not null or p_assigned_date is not null))
    or (p_operation = 'status' and (p_card_id is null or p_student_id is not null or p_uid is not null or p_assigned_date is not null))
    or (p_operation in ('save', 'assign') and p_assigned_date is null) then
    raise exception 'Invalid card assignment request.' using errcode = '23514';
  end if;
  -- Card administration is infrequent in this pilot. One transaction lock also
  -- serializes brand-new UIDs, opposing moves and status changes without retry loops.
  perform pg_catalog.pg_advisory_xact_lock(20260911, 3);
  if p_card_id is not null then
    select * into card from public.rfid_cards where id = p_card_id;
    if not found then raise exception 'That card is no longer registered.' using errcode = '23503'; end if;
  end if;
  if p_operation = 'save' then
    uid := public.normalize_rfid_uid(p_uid);
    if uid is null then raise exception 'Enter a 4, 7, or 10-byte hexadecimal reader UID.' using errcode = '23514'; end if;
    if card.id is null then
      -- Registering the same UID twice updates the stored card instead of
      -- failing, so an uncertain retry stays safe.
      select * into card from public.rfid_cards where public.normalize_rfid_uid(rfid_number) = uid;
      if found and card.student_id is not null then
        raise exception 'That UID belongs to a card already assigned to a student.' using errcode = '23505';
      end if;
    else
      if exists (select 1 from public.rfid_cards
        where public.normalize_rfid_uid(rfid_number) = uid and id <> card.id) then
        raise exception 'That UID belongs to another card. Edit that card instead.' using errcode = '23505';
      end if;
      if uid is distinct from public.normalize_rfid_uid(card.rfid_number)
        and exists (select 1 from public.attendance_records where rfid_card_id = card.id) then
        raise exception 'Attendance history prevents replacing this card UID. Register a new card.' using errcode = '23503';
      end if;
    end if;
  end if;
  if p_operation = 'release' then
    if card.student_id is null then
      raise exception 'That card is already unassigned.' using errcode = '23514';
    end if;
    if exists (select 1 from public.attendance_records where rfid_card_id = card.id) then
      raise exception 'Attendance history keeps this card with its student. Deactivate it instead.' using errcode = '23503';
    end if;
  end if;
  -- Only an assignment changes the holder; editing inventory details keeps it.
  target_id := case when p_operation = 'assign' then p_student_id
    when p_operation = 'release' then null else card.student_id end;
  -- Lock the holders before retiring cards, coordinating with profile archival.
  perform id from public.students where id in (target_id, card.student_id) order by id for update;
  if target_id is not null then
    select * into holder from public.students where id = target_id;
    if not found then raise exception 'That student record no longer exists.' using errcode = '23503'; end if;
  end if;
  if card.id is not null then
    -- Re-read after locking: a legacy client might have moved this card meanwhile.
    perform 1 from public.rfid_cards where id = card.id
      and student_id is not distinct from card.student_id for update;
    if not found then raise exception 'The card changed. Reload before retrying.' using errcode = '40001'; end if;
    if card.student_id is distinct from target_id and card.student_id is not null
      and exists (select 1 from public.attendance_records where rfid_card_id = card.id) then
      raise exception 'Attendance history prevents moving this card to another student.' using errcode = '23503';
    end if;
  end if;
  if p_status = 'Active' then
    if target_id is null then
      raise exception 'Assign this card to a student before activating it.' using errcode = '23514';
    end if;
    if holder.status <> 'active' or not exists (select 1 from public.users
      where id = holder.user_id and role = 'student' and status = 'active') then
      raise exception 'The student and linked account must be active before activating a card.' using errcode = '23514';
    end if;
    if public.normalize_rfid_uid(coalesce(uid, card.rfid_number)) is null then
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
      rfid_number = case when p_operation = 'save' then uid else rfid_number end,
      assigned_date = case when p_operation in ('save', 'assign') then p_assigned_date else assigned_date end
    where id = card.id returning id into saved_id;
  end if;
  return saved_id;
end;
$$;

revoke all on function public.guard_rfid_card_write() from public;
revoke all on function public.save_rfid_card(text, public.rfid_card_status, bigint, text, bigint, date) from public;
grant execute on function public.save_rfid_card(text, public.rfid_card_status, bigint, text, bigint, date) to authenticated;
commit;
