-- P04: atomic campus taps with durable request replay. Existing rows are preserved.
begin;
create table if not exists public.rfid_tap_requests (
  request_id uuid primary key,
  uid text not null,
  attendance_id bigint not null references public.attendance_records(id),
  response jsonb not null,
  received_at timestamptz not null
);
alter table public.rfid_tap_requests enable row level security;
revoke all on public.rfid_tap_requests from public, authenticated;

create or replace function public.record_rfid_tap(
  p_request_id uuid, p_uid text, p_received_at timestamptz default clock_timestamp()
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid text := public.normalize_rfid_uid(p_uid);
  receipt public.rfid_tap_requests;
  card public.rfid_cards;
  holder public.students;
  attendance public.attendance_records;
  schedule public.class_schedules;
  local_time timestamp := p_received_at at time zone 'Asia/Manila';
  decision public.attendance_status := 'Present';
  tap_action text;
  result jsonb;
  failure jsonb := '{"ok":false,"feedback":{"led":"red","buzzer":"warning"}}'::jsonb;
begin
  if p_request_id is null or uid is null or p_received_at is null or not isfinite(p_received_at) then
    return failure || jsonb_build_object('code','INVALID_REQUEST','message','Send a request ID and valid reader UID.');
  end if;
  -- Same request serializes even across midnight or different students.
  perform pg_catalog.pg_advisory_xact_lock(hashtextextended('rfid-request:' || p_request_id::text, 0));
  select * into receipt from public.rfid_tap_requests where request_id = p_request_id;
  if found then
    if receipt.uid <> uid then
      return failure || jsonb_build_object('code','REQUEST_ID_CONFLICT','message','This request ID belongs to another tap.');
    end if;
    return receipt.response || '{"replayed":true}'::jsonb;
  end if;
  -- Coordinate with P03 card reassignment, then profile lifecycle locks.
  perform pg_catalog.pg_advisory_xact_lock_shared(20260911, 3);
  select * into card from public.rfid_cards where public.normalize_rfid_uid(rfid_number) = uid;
  if found then
    select * into holder from public.students where id = card.student_id for update;
    select * into card from public.rfid_cards where id = card.id and student_id = holder.id for share;
  end if;
  if holder.id is null or holder.status <> 'active' or card.id is null or card.card_status <> 'Active' then
    return failure || jsonb_build_object('code','INVALID_CARD','message','Card is not assigned to an eligible active student.');
  end if;
  perform 1 from public.users where id = holder.user_id and role = 'student' and status = 'active' for share;
  if not found then
    return failure || jsonb_build_object('code','INVALID_CARD','message','Card is not assigned to an eligible active student.');
  end if;

  -- Calendar-day scope: never fill yesterday's missing times from today's tap.
  select * into attendance from public.attendance_records
    where student_id = holder.id and attendance_date = local_time::date for update;
  if found then
    if attendance.time_out is not null then
      return failure || jsonb_build_object('code','DAY_COMPLETE','message','Time In and Time Out are already recorded for today.');
    end if;
    if attendance.attendance_status not in ('Present','Late') or local_time::time < attendance.time_in then
      return failure || jsonb_build_object('code','RECORD_REVIEW_REQUIRED','message','The existing attendance record needs administrator review.');
    end if;
    update public.attendance_records set time_out = local_time::time where id = attendance.id returning * into attendance;
    tap_action := 'time_out';
  else
    if holder.year_level = '2nd Year' and holder.section in
      ('21001','21002','21003','21004','21005','21006','21007','21008','21009','21010')
      and exists(select 1 from public.programs where id = holder.program_id and upper(program_code) = 'BSIT' and status = 'active') then
      -- School decision: active all-campus row wins; campus-specific is fallback.
      select * into schedule from public.class_schedules
        where program_id = holder.program_id and year_level = holder.year_level and section = holder.section
          and (campus is null or campus = holder.campus)
          and day_of_week = extract(dow from local_time)::integer and status = 'active'
        order by (campus is null) desc, id limit 1;
      if found and local_time > local_time::date + schedule.time_start + make_interval(mins => schedule.grace_minutes) then
        decision := 'Late';
      end if;
    end if;
    insert into public.attendance_records(student_id,rfid_card_id,attendance_date,time_in,attendance_status,campus)
      values(holder.id,card.id,local_time::date,local_time::time,decision,holder.campus) returning * into attendance;
    -- Persist one arrival notification intent. P06 performs delivery and updates status.
    insert into public.sms_notifications(attendance_id,student_id,parent_contact_number,message,sms_status)
      values(attendance.id,holder.id,holder.parent_contact_number,
        format('%s has arrived at %s on %s at %s PHT.',holder.full_name,holder.campus,
          to_char(local_time,'YYYY-MM-DD'),to_char(local_time,'HH24:MI:SS')),'Pending');
    tap_action := 'time_in';
  end if;

  result := jsonb_build_object('ok',true,'action',tap_action,'attendanceId',attendance.id,
    'attendanceStatus',attendance.attendance_status,'date',to_char(local_time,'YYYY-MM-DD'),
    'time',to_char(local_time,'HH24:MI:SS'),'timezone','Asia/Manila',
    'student',jsonb_build_object('name',holder.full_name,'yearLevel',holder.year_level),
    'message',case when tap_action = 'time_in' then 'Time In recorded.' else 'Time Out recorded.' end,
    'feedback',jsonb_build_object('led','green','buzzer','success'),'replayed',false);
  insert into public.rfid_tap_requests(request_id,uid,attendance_id,response,received_at)
    values(p_request_id,uid,attendance.id,result,p_received_at);
  return result;
end $$;
revoke all on function public.record_rfid_tap(uuid,text,timestamptz) from public, authenticated;
-- Production Supabase has service_role; isolated migration tests may not.
do $$ begin
  if exists(select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.rfid_tap_requests from anon;
    revoke all on function public.record_rfid_tap(uuid,text,timestamptz) from anon;
  end if;
  if exists(select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.record_rfid_tap(uuid,text,timestamptz) to service_role;
  end if;
end $$;
commit;
