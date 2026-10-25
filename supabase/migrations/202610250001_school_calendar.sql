-- Task 03 foundation only. Access policies and mutation RPCs follow in separately approved tasks.
begin;

do $$ begin
  create type public.calendar_tag as enum ('event', 'no_classes', 'online_class', 'holiday', 'exam', 'deadline', 'meeting', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.calendar_attendance_impact as enum ('normal', 'no_classes', 'online_manual');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.calendar_status as enum ('draft', 'published', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.calendar_audience as enum ('everyone', 'teachers', 'students');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.attendance_day_status as enum ('NoClasses', 'OnlineManual');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.calendar_email_type as enum ('published', 'updated', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.calendar_email_status as enum ('Pending', 'Sent', 'Failed');
exception when duplicate_object then null;
end $$;

create or replace function public.calendar_campuses_valid(values_to_check text[])
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(array_ndims(values_to_check), 1) = 1
    and not exists (
      select 1 from unnest(values_to_check) campus
      where campus is null or campus ~ '^[[:space:]]*$'
    );
$$;

create table if not exists public.calendar_entries (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  reason text,
  tags public.calendar_tag[] not null,
  attendance_impact public.calendar_attendance_impact not null default 'normal',
  audience public.calendar_audience not null default 'everyone',
  campuses text[] not null default '{}',
  starts_on date not null,
  ends_on date not null,
  start_time time,
  end_time time,
  location text,
  is_pinned boolean not null default false,
  status public.calendar_status not null default 'draft',
  published_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_entries_title_check check (title !~ '^[[:space:]]*$' and char_length(title) <= 160),
  constraint calendar_entries_description_check check (char_length(description) <= 5000),
  constraint calendar_entries_reason_length_check check (char_length(reason) <= 500),
  constraint calendar_entries_location_check check (char_length(location) <= 200),
  constraint calendar_entries_dates_check check (
    starts_on between date '0001-01-01' and date '9999-12-31'
    and ends_on between starts_on and date '9999-12-31'
    and ends_on - starts_on <= 365
  ),
  constraint calendar_entries_tags_check check (
    cardinality(tags) > 0 and array_ndims(tags) = 1 and array_position(tags, null) is null
  ),
  constraint calendar_entries_campuses_check check (public.calendar_campuses_valid(campuses)),
  constraint calendar_entries_times_check check (
    (start_time is null and end_time is null)
    or (start_time is not null and end_time is not null and starts_on = ends_on
      and end_time > start_time and end_time < time '24:00')
  ),
  constraint calendar_entries_impact_tags_check check (
    attendance_impact = case
      when 'online_class' = any(tags) then 'online_manual'::public.calendar_attendance_impact
      when 'no_classes' = any(tags) then 'no_classes'::public.calendar_attendance_impact
      else 'normal'::public.calendar_attendance_impact
    end
  ),
  constraint calendar_entries_impact_scope_check check (
    attendance_impact = 'normal' or (
      start_time is null and end_time is null and audience = 'everyone'
      and reason is not null and reason !~ '^[[:space:]]*$'
    )
  ),
  constraint calendar_entries_lifecycle_dates_check check (
    (status = 'draft' and published_at is null and cancelled_at is null)
    or (status = 'published' and published_at is not null and cancelled_at is null)
    or (status = 'cancelled' and published_at is not null and cancelled_at is not null)
  )
);

create index if not exists calendar_entries_status_dates_idx on public.calendar_entries(status, starts_on, ends_on);
create index if not exists calendar_entries_published_at_idx on public.calendar_entries(published_at desc) where status = 'published';
create index if not exists calendar_entries_tags_idx on public.calendar_entries using gin(tags);
create index if not exists calendar_entries_campuses_idx on public.calendar_entries using gin(campuses);

drop trigger if exists calendar_entries_set_updated_at on public.calendar_entries;
create trigger calendar_entries_set_updated_at before update on public.calendar_entries
for each row execute function public.set_updated_at();

create table if not exists public.calendar_entry_reads (
  entry_id bigint not null references public.calendar_entries(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (entry_id, user_id)
);
create index if not exists calendar_entry_reads_user_idx on public.calendar_entry_reads(user_id);

create table if not exists public.attendance_day_marks (
  id bigint generated always as identity primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status public.attendance_day_status not null default 'NoClasses',
  calendar_entry_id bigint not null references public.calendar_entries(id),
  campus text not null,
  created_at timestamptz not null default now(),
  constraint attendance_day_marks_student_date_unique unique(student_id, attendance_date),
  constraint attendance_day_marks_campus_check check (campus !~ '^[[:space:]]*$'),
  constraint attendance_day_marks_date_check check (attendance_date between date '0001-01-01' and date '9999-12-31')
);
create index if not exists attendance_day_marks_date_idx on public.attendance_day_marks(attendance_date);
create index if not exists attendance_day_marks_entry_idx on public.attendance_day_marks(calendar_entry_id);
create index if not exists attendance_day_marks_campus_date_idx on public.attendance_day_marks(campus, attendance_date);
comment on table public.attendance_day_marks is
  'Calendar exceptions only: OnlineManual is not a subject attendance confirmation. Past snapshots retain campus and status.';

create table if not exists public.calendar_email_deliveries (
  id bigint generated always as identity primary key,
  calendar_entry_id bigint not null references public.calendar_entries(id) on delete cascade,
  batch_id uuid not null,
  notification_type public.calendar_email_type not null,
  recipient_user_id uuid references public.users(id) on delete set null,
  recipient_email text not null,
  recipient_role public.user_role not null,
  subject text not null,
  html_body text not null,
  text_body text not null,
  status public.calendar_email_status not null default 'Pending',
  resend_email_id text,
  error_message text,
  attempt_count integer not null default 0,
  last_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint calendar_email_deliveries_batch_recipient_unique unique(batch_id, recipient_user_id),
  constraint calendar_email_deliveries_role_check check (recipient_role in ('teacher', 'student')),
  constraint calendar_email_deliveries_email_check check (recipient_email !~ '^[[:space:]]*$'),
  constraint calendar_email_deliveries_attempt_check check (attempt_count >= 0)
);
create index if not exists calendar_email_deliveries_entry_idx on public.calendar_email_deliveries(calendar_entry_id, created_at desc);
create index if not exists calendar_email_deliveries_status_idx on public.calendar_email_deliveries(status, created_at desc);
create index if not exists calendar_email_deliveries_batch_idx on public.calendar_email_deliveries(batch_id);

-- Default-deny until the separately reviewed role policies and RPCs are installed.
alter table public.calendar_entries enable row level security;
alter table public.calendar_entry_reads enable row level security;
alter table public.attendance_day_marks enable row level security;
alter table public.calendar_email_deliveries enable row level security;
revoke all on public.calendar_entries, public.calendar_entry_reads,
  public.attendance_day_marks, public.calendar_email_deliveries from public, anon, authenticated;
revoke all on sequence public.calendar_entries_id_seq, public.attendance_day_marks_id_seq,
  public.calendar_email_deliveries_id_seq from public, anon, authenticated;

commit;
