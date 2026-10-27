# School Calendar & Announcements — Implementation Plan

**Project:** RFID Attendance Web System  
**Execution checklist:** [Calendar-TODO.md](Calendar-TODO.md) — separate confirmation before each task
**Prepared:** 2026-10-25  
**Status:** Tasks 01–16 and 18–29 complete (Task 17 deferred by request): scope/rules, validation, core database workflows, audit/realtime registration, verification SQL, rollback SQL, local recovery tests, preview database verification (48/48 PASS), calendar read queries (9 tests), calendar mutation actions (6 RPC wrappers, 12 tests), and read receipt actions (2 actions, 6 tests). Email templates and the Resend batch adapter are complete with mocked delivery tests. Dispatch/retry is implemented with persisted payloads, after-response batches, and admin retries. The new email migration remains unapplied to hosted databases. RFID integration is implemented and locally tested. The admin calendar/list and entry/lifecycle dialogs are implemented, including recipient previews and mocked keyboard/mobile browser checks. Delivery log, retry, recipient preview, and attendance sync controls are implemented with mocked checks. Shared read-only teacher/student calendars and navigation are implemented with local visibility and browser checks. Header bell, read actions, session toast, and realtime subscriptions are integrated with mocked checks and resilient portal rendering. Teacher/student dashboard posts are implemented with pinned ordering, three-item limits, strict seven-day expiry, and failure fallback. Shared attendance state, eligible student-day counts, explicit-decision rates, and weighted trend functions are implemented and locally tested. All three dashboards now honor calendar exceptions in status, counts, rates, and historical trends while retaining raw tap/SMS evidence. Daily Attendance and student history now show calendar exceptions with read-only filters, consistent counts, and retained evidence. Reports/PDF now exclude calendar exceptions, retain historical and subject evidence, and reconcile marks only on authorized admin report/export paths. Documentation/regression reporting is complete; 572/593 tests pass, 21 older account-access tests and lint remain blockers. Local browser/accessibility verification is complete: two keyboard/semantics fixes, 32 automated scans with zero violations, and 130 focused regressions pass. Manual/hosted accessibility, deferred physical-reader verification, and deployment remain pending; existing release blockers still apply. See the execution checklist.
**Scope change:** **R06 — School Calendar & Announcements** (supersedes the holiday-management deferral only for this feature; existing R05 cleanup remains separate)

---

## 1. One-line summary

Add an admin-managed school calendar whose published entries:

- appear on teacher and student calendars,
- notify teachers and students in-app and by email,
- can automatically mark a campus/day as **No classes**,
- can mark a campus/day as **Online / manual** so attendance is confirmed through the existing Subject Attendance page,
- and never change the existing RFID attendance table into a fake-status table.

---

## 2. Confirmed product decisions

| Area | Decision |
|---|---|
| Feature name | **School Calendar & Announcements** |
| Admin entry point | **Schedules → Calendar** at `/admin/schedules/calendar` |
| Teacher entry point | Top-level **Calendar** at `/teacher/calendar` |
| Student entry point | Top-level **Calendar** at `/student/calendar` |
| Admin dashboard post | **No** |
| Teacher/student dashboard post | **Yes**, only while the entry is within **7 days after publish** |
| Who can write | **Admin only** |
| Teacher/student access | Read-only calendar, bell, toast, dashboard post |
| Tags | Event, No classes, Online class, Holiday, Exam, Deadline, Meeting, Other |
| Reason | Free text, required for attendance-impacting entries |
| Dates | Single day or inclusive multi-day range |
| Audience | Everyone, Teachers, Students |
| Campus targeting | All campuses or selected campuses |
| Admins in audience/email | **Excluded** |
| Attendance impact | Explicit field: `Normal`, `No classes`, `Online / manual` |
| No-class-only day | Automatic per-student `NoClasses` marks, taps rejected |
| Online / no-class + online day | No automatic `NoClasses`; taps rejected; teacher confirms in Subject Attendance |
| Teacher make-up/override | Existing **Subject Attendance** only; Daily Attendance stays read-only |
| Lifecycle | Draft → Published → Cancelled → Republished |
| Delete rule | Drafts may be deleted; published/cancelled entries are never hard-deleted |
| System notification | Header bell + login toast + teacher/student dashboard post |
| Email provider | Resend |
| Email triggers | Publish, cancellation, and important edits when **Notify recipients** is checked |
| Email log | Sent / Failed, attempt count, safe error, retry |
| Email audience size | Tiny; send after the response with Resend batch, no queue |

---

## 3. Scope and boundaries

### 3.1 In scope

- Admin calendar CRUD, publish, cancel, republish.
- Campus-aware audience visibility.
- Automatic `NoClasses` marks for no-class-only days.
- Online/manual attendance state.
- RFID tap rejection for no-class and online days.
- Daily attendance and report exclusions for affected student-days.
- In-app bell, login toast, dashboard post.
- Resend email notifications, delivery log, retry.
- System logs and audit entries.
- Tests, verification SQL, rollback SQL, documentation.

### 3.2 Out of scope

- Editing **Daily Attendance** by teachers. It remains read-only.
- Replacing or disabling **Subject Attendance**.
- Adding `NoClasses` to the PostgreSQL `attendance_status` enum.
- Creating fake `attendance_records` rows.
- Recurring weekly/yearly events.
- Per-program, per-year-level, or per-section targeting. Campus targeting only.
- SMS for calendar announcements.
- Admin dashboard announcement posts.
- Admin email recipients.
- Automatic cancellation of subject sessions.
- A queue/worker. The audience is tiny; Resend batch plus after-response sending is sufficient.

### 3.3 Scope change note

`RFID-DOCS-SCOPE-AUDIT.md` records this user-requested expansion under **R06**. Its older holiday/exam-management deferral is superseded only within this plan. This plan changes attendance behavior, so it cannot be treated as display-only. R05 remains the original optional source-cleanup task.

The audit's **R06** entry:

- records the user-approved scope change,
- states that no-class/online days affect attendance,
- states that Daily Attendance remains read-only,
- states that Subject Attendance is the manual override,
- replaces the old “holiday management deferred” line.

---

## 4. Roles and permissions

| Capability | Admin | Teacher | Student |
|---|---|---|---|
| Create/edit draft | Yes | No | No |
| Publish/cancel/republish | Yes | No | No |
| Delete draft | Yes | No | No |
| View all drafts | Yes | No | No |
| View published/cancelled calendar | Yes | Yes, audience/campus match | Yes, audience/campus match |
| Receive bell/toast | No | Yes | Yes |
| Receive dashboard post | No | Yes | Yes |
| Receive email | No | Yes, audience/campus match | Yes, audience/campus match |
| Mark calendar item read | N/A | Own rows only | Own rows only |
| View email delivery log | Yes | No | No |
| Retry failed email | Yes | No | No |

Admins see the calendar management screen. They do not receive the announcement bell, login toast, dashboard post, or email.

---

## 5. Attendance model

This is the most important part of the plan. The existing `attendance_records` table is RFID evidence and must stay that way.

### 5.1 State matrix

| Entry state | Attendance effect | RFID tap | Daily Attendance | Reports / exports |
|---|---|---|---|---|
| `Normal` impact (event, holiday, exam, deadline, meeting, other) | None | Normal | Normal | Normal |
| `No classes` only | Per-student `NoClasses` marks | Rejected: `NO_CLASSES` | Shows No classes | Includes `NoClasses`; excluded from rate |
| `Online / manual` (online-only or no classes + online) | No automatic `NoClasses`; manual Subject Attendance | Rejected: `ONLINE_CLASS` | Shows Online / manual | Daily RFID excluded; Subject Attendance included |
| `No classes` + `Online class` tags | Treated as `Online / manual` | Rejected: `ONLINE_CLASS` | Shows Online / manual | Same as online |

**Precedence:** `Online / manual` wins over `No classes` when both tags are present. The explicit `attendance_impact` field removes ambiguity.

### 5.2 No-class-only day

When a published entry has `attendance_impact = 'no_classes'`:

1. For every date in `[starts_on, ends_on]` and every active student whose `students.campus` matches the entry’s campus scope, insert or keep one `attendance_day_marks` row with status `NoClasses`.
2. The mark is per student per date, unique on `(student_id, attendance_date)`.
3. The mark stores the student’s campus at mark time and the source `calendar_entry_id`.
4. No `attendance_records` row is created.
5. No SMS is created.
6. RFID taps are rejected before any attendance insert.

The mark exists for reports and exports. It is not a new `attendance_status` value.

### 5.3 Online / manual day

When a published entry has `attendance_impact = 'online_manual'`:

1. No `NoClasses` marks are created. An `OnlineManual` calendar-exception snapshot is stored in `attendance_day_marks` for historical reporting; it is not a student attendance confirmation.
2. RFID taps are rejected because there is no face-to-face campus attendance to capture.
3. Teachers continue to use **Subject Attendance** exactly as today.
4. The teacher can mark Present, Late, or Absent even if the day is also tagged No classes.
5. Daily Attendance shows an `Online / manual` state instead of a Present/Absent rate.
6. Subject Attendance is not hidden, disabled, or gated.

### 5.4 Teacher make-up/override

No new workflow is needed.

- **Daily Attendance** remains read-only.
- **Subject Attendance** remains the editable surface.
- A teacher can confirm attendance for a subject session on a no-class or online day.
- Those confirmations live in `subject_attendance` and already appear in subject reports.
- The calendar feature does not add, remove, or block subject sessions.

### 5.5 RFID tap flow

The tap flow in `record_rfid_tap` becomes:

1. Validate request and replay.
2. Resolve card and active student, as today.
3. Compute `local_time` in `Asia/Manila`.
4. Check published calendar entries for the student’s campus and date.
   - If an `online_manual` entry matches → return terminal failure:
     ```json
     {
       "ok": false,
       "code": "ONLINE_CLASS",
       "message": "Online class today. Attendance is per subject.",
       "feedback": { "led": "red", "buzzer": "warning" }
     }
     ```
   - Else if a `no_classes` entry matches → return terminal failure:
     ```json
     {
       "ok": false,
       "code": "NO_CLASSES",
       "message": "No classes today.",
       "feedback": { "led": "red", "buzzer": "warning" }
     }
     ```
5. Only after those checks, run the existing attendance lookup/insert.

Rules:

- Do **not** insert an `attendance_records` row for a rejected tap.
- Do **not** insert an `sms_notifications` row.
- Do **not** write a fake tap request row.
- The route’s existing `auditRoute` logs the rejection outcome and HTTP status.
- Map `NO_CLASSES` and `ONLINE_CLASS` to HTTP **422** in `src/services/rfid/tap.ts`.
- The firmware already treats 409/422 as terminal and displays `TAP REJECTED` plus the server message for 409/422. No firmware change is planned, but the exact messages must be checked on the physical display for truncation.

**Why query the calendar directly instead of the marks table for taps:** a student added or transferred after publish must be handled correctly. `calendar_entries` is authoritative; marks are the reporting snapshot.

### 5.6 Daily attendance and dashboards

Add a shared calendar state resolver:

- Effective state for a student/date today or later:
  - `NoClasses` if a published no-class entry covers the student’s campus on that date.
  - `OnlineManual` if a published online/manual entry covers the student’s campus on that date.
  - `Normal` otherwise.
- For dates before today, use immutable `attendance_day_marks` snapshots for both `NoClasses` and `OnlineManual`, including their stored campus. Never reconstruct historical exceptions from today's published entries or the student's current campus.
- The resolver must be campus-aware. A Main Campus no-class entry must not affect MV Campus students on the same date.

Dashboard behavior:

- **Admin dashboard:** no announcement post, but attendance KPIs/trend must honor calendar states. If Main is no-class and MV has classes, compute the rate over the students who are expected face-to-face, and show a visible “No classes: Main Campus” / “Online/manual: MV Campus” status strip.
- **Teacher dashboard:** same, scoped to assigned students. A teacher assigned to both campuses sees Main students as No classes and MV students as normal on the same date.
- **Student dashboard:** today’s card shows `No classes today` or `Online class today — attendance is per subject` instead of an empty/Present/Absent state.
- **Teacher Daily Attendance:** rows show a `No classes` or `Online / manual` badge. No edit controls are added.
- **Attendance rate:** denominator excludes affected student-days. If no student is expected, show `—`, not `0%`.
- **Trend:** affected student-days are skipped. A bucket with zero expected student-days renders as `—`.

### 5.7 Reports and exports

- The report detail adds display-only statuses:
  - `NoClasses`
  - `OnlineManual`
- These are **not** added to `attendance_status` and are **not** written to `attendance_records`.
- The report rate excludes no-class and online/manual student-days from the RFID denominator.
- `NoClasses` counts appear separately, not as absences.
- Online/manual days link the reader to the subject attendance section.
- The PDF adds a “Calendar exceptions” section listing:
  - no-class dates and campuses,
  - online/manual dates and campuses,
  - affected student counts,
  - a note that these days are excluded from the daily RFID rate.
- The existing subject attendance PDF section remains the source for online/manual confirmations.
- Admin report/export runs `sync_attendance_day_marks` before reading marks. Teacher reports use the effective calendar view and existing marks; they do not trigger writes.

### 5.8 Why both a view and a marks table

- **Effective view** (`calendar_attendance_days`): current truth for today/future behavior and calculations. It expands published entries to campus/date rows, so late roster changes are handled immediately. It is not authoritative for historical dates after edits or cancellation.
- **Marks table** (`attendance_day_marks`): durable per-student exception snapshots for both `NoClasses` and `OnlineManual`. Past snapshots are authoritative for historical report exclusions and campus labels. Online snapshots never claim Present, Late, or Absent; those confirmations remain in Subject Attendance.

Snapshots are materialized on publication and reconciled on entry changes and student roster changes (insert, campus transfer, activation/deactivation). Roster reconciliation must run transactionally at the database boundary, including changes made without the app. It uses the same lock as calendar writes, updates today/future dates, and never backfills past dates for newly added students. This prevents a transfer from leaving missing/stale history when no admin report is opened before midnight; no scheduled worker is required.

The view is not a replacement for the marks table. The marks table is not used on the tap hot path.

---

## 6. Data model

### 6.1 New enums

```sql
create type public.calendar_tag as enum (
  'event', 'no_classes', 'online_class', 'holiday',
  'exam', 'deadline', 'meeting', 'other'
);

create type public.calendar_attendance_impact as enum (
  'normal', 'no_classes', 'online_manual'
);

create type public.calendar_status as enum (
  'draft', 'published', 'cancelled'
);

create type public.calendar_audience as enum (
  'everyone', 'teachers', 'students'
);

create type public.attendance_day_status as enum ('NoClasses', 'OnlineManual');

create type public.calendar_email_type as enum (
  'published', 'updated', 'cancelled'
);

create type public.calendar_email_status as enum (
  'Pending', 'Sent', 'Failed'
);
```

### 6.2 `calendar_entries`

```sql
create table public.calendar_entries (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  reason text,
  tags public.calendar_tag[] not null,
  attendance_impact public.calendar_attendance_impact not null default 'normal',
  audience public.calendar_audience not null default 'everyone',
  campuses text[] not null default '{}', -- empty array = all campuses
  starts_on date not null,
  ends_on date not null,
  start_time time,
  end_time time,
  location text,
  is_pinned boolean not null default false,
  status public.calendar_status not null default 'draft',
  published_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Required checks:

- Title not blank, max 160 characters.
- Description max 5,000; reason max 500; location max 200.
- `ends_on >= starts_on`.
- Range max 366 days.
- `cardinality(tags) > 0`.
- Times are both null or both set.
- Timed entries must be single-day and `end_time > start_time`.
- Attendance-impacting entries (`impact <> 'normal'`) must be all-day: both times null.
- `impact = 'no_classes'` requires the `no_classes` tag and forbids the `online_class` tag.
- `impact = 'online_manual'` requires the `online_class` tag. It may also carry `no_classes`.
- If tags include `no_classes`, impact must be `no_classes` or `online_manual`.
- If tags include `online_class`, impact must be `online_manual`.
- Attendance-impacting entries require `audience = 'everyone'`.
- Attendance-impacting entries require a non-blank `reason`.
- Status/date consistency:
  - `draft`: `published_at is null and cancelled_at is null`
  - `published`: `published_at is not null and cancelled_at is null`
  - `cancelled`: `published_at is not null and cancelled_at is not null`
- `campuses` must not contain blank values. Normalize/trim and dedupe in the RPC.
- `published_at` is set on first publish and reset on republish.
- `updated_at` is maintained by the existing updated-at trigger pattern.

Indexes:

```sql
create index calendar_entries_status_dates_idx
  on public.calendar_entries (status, starts_on, ends_on);
create index calendar_entries_published_at_idx
  on public.calendar_entries (published_at desc)
  where status = 'published';
create index calendar_entries_tags_idx
  on public.calendar_entries using gin (tags);
create index calendar_entries_campuses_idx
  on public.calendar_entries using gin (campuses);
```

### 6.3 `calendar_entry_reads`

```sql
create table public.calendar_entry_reads (
  entry_id bigint not null
    references public.calendar_entries (id) on delete cascade,
  user_id uuid not null
    references public.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (entry_id, user_id)
);

create index calendar_entry_reads_user_idx
  on public.calendar_entry_reads (user_id);
```

Unread rule:

```text
no read row OR read_at < calendar_entries.updated_at
```

A published edit makes the item unread again. A cancelled entry is never unread.

### 6.4 `attendance_day_marks`

```sql
create table public.attendance_day_marks (
  id bigint generated always as identity primary key,
  student_id bigint not null
    references public.students (id) on delete cascade,
  attendance_date date not null,
  status public.attendance_day_status not null default 'NoClasses',
  calendar_entry_id bigint not null
    references public.calendar_entries (id),
  campus text not null,
  created_at timestamptz not null default now(),
  constraint attendance_day_marks_student_date_unique
    unique (student_id, attendance_date)
);

create index attendance_day_marks_date_idx
  on public.attendance_day_marks (attendance_date);
create index attendance_day_marks_entry_idx
  on public.attendance_day_marks (calendar_entry_id);
create index attendance_day_marks_campus_date_idx
  on public.attendance_day_marks (campus, attendance_date);
```

Notes:

- One calendar-exception snapshot per student per date: `NoClasses` or `OnlineManual`. Set status explicitly when inserting; online snapshots are not manual attendance confirmations.
- `campus` is the student’s campus at mark time.
- Past marks are immutable.
- Reconcile today/future snapshots when roster or entry state changes; historical reports use stored status/campus even if the source is later cancelled or republished.
- No direct user writes. The sync/publish RPCs write this table with security-definer privileges.

### 6.5 `calendar_email_deliveries`

```sql
create table public.calendar_email_deliveries (
  id bigint generated always as identity primary key,
  calendar_entry_id bigint not null
    references public.calendar_entries (id) on delete cascade,
  batch_id uuid not null,
  notification_type public.calendar_email_type not null,
  recipient_user_id uuid references public.users (id) on delete set null,
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
  constraint calendar_email_deliveries_batch_recipient_unique
    unique (batch_id, recipient_user_id)
);

create index calendar_email_deliveries_entry_idx
  on public.calendar_email_deliveries (calendar_entry_id, created_at desc);
create index calendar_email_deliveries_status_idx
  on public.calendar_email_deliveries (status, created_at desc);
create index calendar_email_deliveries_batch_idx
  on public.calendar_email_deliveries (batch_id);
```

Why payload columns live here:

- Retry must send exactly what was intended, even if the entry was later edited or cancelled.
- The audience is tiny, so duplicated HTML/text is acceptable.

### 6.6 Effective calendar view

```sql
create view public.calendar_attendance_days
with (security_invoker = true)
as
select
  e.id as entry_id,
  d.attendance_date,
  c.campus,
  e.attendance_impact,
  e.title,
  e.tags,
  e.starts_on,
  e.ends_on
from public.calendar_entries e
cross join lateral
  generate_series(0, e.ends_on - e.starts_on) as off
cross join lateral
  (select e.starts_on + off as attendance_date) d
cross join lateral (
  select unnest(e.campuses) as campus
  where cardinality(e.campuses) > 0
  union
  select distinct s.campus
  from public.students s
  where cardinality(e.campuses) = 0
    and s.status = 'active'
    and btrim(s.campus) <> ''
) c
where e.status = 'published'
  and e.attendance_impact <> 'normal';
```

- `security_invoker = true` makes existing RLS apply to the caller.
- For an all-campus entry, the view expands to the campuses of the students the caller can see. For a student, that is their own campus; for a teacher, their accessible campuses; for an admin, all campuses.
- If the Supabase Postgres version rejects `security_invoker`, use a `stable security invoker` SQL function with the same shape and call it via RPC. The behavior must stay the same.

### 6.7 Campus helper

```sql
create or replace function public.current_user_campuses()
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.current_user_role() = 'student' then (
      select array[s.campus]
      from public.students s
      where s.user_id = auth.uid()
      limit 1
    )
    when public.current_user_role() = 'teacher' then coalesce((
      select array_agg(distinct a.campus)
      from public.teacher_assignments a
      join public.teachers t on t.id = a.teacher_id
      where t.user_id = auth.uid()
        and a.status = 'active'
        and a.campus is not null
        and btrim(a.campus) <> ''
    ), '{}'::text[])
    else '{}'::text[]
  end
$$;
```

### 6.8 Recipient resolver

```sql
create or replace function public.calendar_entry_recipients(p_entry_id bigint)
returns table (
  user_id uuid,
  email text,
  role public.user_role
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  entry public.calendar_entries;
begin
  if public.current_user_role() <> 'admin' then
    raise exception 'Administrator access required';
  end if;

  select * into entry
  from public.calendar_entries
  where id = p_entry_id;

  if not found then
    return;
  end if;

  return query
  with recipients as (
    -- Students in scope
    select distinct u.id, u.email, u.role
    from public.students s
    join public.users u on u.id = s.user_id
    where entry.audience in ('everyone', 'students')
      and s.status = 'active'
      and u.role = 'student'
      and u.status = 'active'
      and btrim(u.email) <> ''
      and (
        cardinality(entry.campuses) = 0
        or s.campus = any(entry.campuses)
      )

    union

    -- Teachers with at least one active assignment in a targeted campus.
    -- An all-campus entry reaches every active teacher.
    select distinct u.id, u.email, u.role
    from public.teachers t
    join public.users u on u.id = t.user_id
    where entry.audience in ('everyone', 'teachers')
      and t.status = 'active'
      and u.role = 'teacher'
      and u.status = 'active'
      and btrim(u.email) <> ''
      and (
        cardinality(entry.campuses) = 0
        or exists (
          select 1
          from public.teacher_assignments a
          where a.teacher_id = t.id
            and a.status = 'active'
            and a.campus = any(entry.campuses)
        )
      )
  )
  select r.id, r.email, r.role
  from recipients r
  order by r.role, r.email;
end
$$;
```

- Admins are never returned.
- Teachers with multiple targeted campuses are deduplicated by `union`.
- Empty `campuses` means all campuses.
- Inactive/archived accounts are excluded.

### 6.9 Overlap rule and save RPCs

**Rule:** at most one published attendance-impacting entry may cover the same campus on the same date.

- `campuses = '{}'` (all campuses) conflicts with every campus-specific entry on the same date.
- Main Campus no-class/online and MV Campus face-to-face on the same date is allowed.
- Normal events may overlap freely.
- Drafts may overlap; the conflict is checked on publish.
- The check runs inside the save/publish RPC under a single advisory lock, and the form shows a clear conflict error naming the existing entry.

Sketch:

```sql
perform pg_advisory_xact_lock(hashtextextended('calendar-entry-save', 0));

select e.id, e.title
into conflict
from public.calendar_entries e
where e.id <> coalesce(p_id, 0)
  and e.status = 'published'
  and e.attendance_impact <> 'normal'
  and daterange(e.starts_on, e.ends_on, '[]')
      && daterange(v_starts_on, v_ends_on, '[]')
  and (
    cardinality(e.campuses) = 0
    or cardinality(v_campuses) = 0
    or e.campuses && v_campuses
  )
limit 1;

if found then
  return jsonb_build_object(
    'ok', false,
    'code', 'CALENDAR_CONFLICT',
    'message', format('Attendance is already set by "%s" for one of these campuses/dates.', conflict.title)
  );
end if;
```

RPCs:

- `save_calendar_entry(p_payload jsonb)` — insert a draft or edit a draft/published/cancelled entry without changing its lifecycle state.
- `publish_calendar_entry(p_id bigint)` — validate, check overlap, set `published_at`, materialize marks.
- `cancel_calendar_entry(p_id bigint)` — set `cancelled_at`, remove today/future snapshots.
- `sync_attendance_day_marks(p_from date, p_to date)` — reconcile marks from today forward.
- `delete_calendar_draft(p_id bigint)` — delete only a never-published draft.

The save payload is a full editable entry using the camelCase fields from
`src/features/calendar/schema.ts`, plus an optional positive integer `id`.
Omitting `id` or sending null creates a draft. Required fields are title, tags,
attendanceImpact, audience, campuses, startsOn, and endsOn. Optional text/time
fields normalize blank values to null; omitted optional fields are cleared on
edit, and omitted isPinned defaults to false. Lifecycle/actor fields and unknown
keys are rejected. Success returns `{ ok: true, id }`; missing entries, overlaps,
and historical-scope violations return `{ ok: false, code, message }`. Invalid
types/constraints and authorization failures raise database errors. Save never
publishes, cancels, or republishes an entry.

Publish/republish accepts a positive integer id and returns `{ ok: true, id }`
on success. Missing entries, already-published entries, past attendance dates,
and overlaps return `{ ok: false, code, message }`. Invalid ids and unauthorized
calls raise database errors. Publication refreshes published_at, clears
cancelled_at, and reconciles attendance-impacting entries in the same transaction;
a reconciliation failure rolls back publication. Task 15 dispatches email after the response using the committed snapshot.

Cancellation and draft deletion use the same positive-id and result contract.
Cancellation accepts only published entries and preserves published_at while
setting cancelled_at; today/future snapshots are reconciled atomically. Deletion
accepts only never-published drafts. Database triggers also reject hard deletion
of published/cancelled entries, transitions back to draft, timestamp changes
without a transition, historical scope changes, and conflicting publication.
Cancelled entries retain their receipt and delivery history. Cancellation email
dispatch is connected by Task 15 through the application mutation wrapper.

All public mutation RPCs are security definer, require an active, verified admin, and grant execute only to authenticated (revoke the default PUBLIC grant). Role checks must fail closed for a null role. Internal reconciliation helpers have no client execute grant.

Authenticated users, including admins, have no direct entry INSERT/UPDATE/DELETE grants or policies. Mutations go through these RPCs; database guards also reject deletion of ever-published entries and invalid lifecycle changes. Save cannot modify lifecycle timestamps supplied by the caller. Publish accepts only draft/cancelled, cancel only published, and no transition returns an entry to draft. All calendar mutations and roster reconciliation share the advisory lock. Overlap validation applies to publish/republish and published edits, never merely to the form.

All boundaries use the transaction's date in `Asia/Manila`. Today is mutable; dates before today are immutable. New publication/republish of an attendance-impacting entry requires `starts_on >= today`. Once such an entry has started in the past, its dates, campuses, tags/impact, and audience are locked; descriptive fields may still be edited, and cancellation may end its effect today/future while preserving historical snapshots. To replace its remaining schedule, cancel it and create a new entry starting today or later. A normal entry cannot be changed into a backdated attendance-impacting entry.

### 6.10 Mark reconciliation

`sync_attendance_day_marks(p_from, p_to)`:

1. Clamp `p_from` to today in `Asia/Manila`. Never touch past dates.
2. Delete today/future snapshots whose source is no longer published/impacting, whose date/campus/status no longer matches, or whose student is no longer active or has changed campus. Reconcile both the old and new affected ranges on an edit.
3. Insert missing snapshots for every active student in a targeted campus/date: `no_classes` maps to `NoClasses`; `online_manual` maps to `OnlineManual`.
4. Never create a `NoClasses` snapshot for an online/manual date. `OnlineManual` records only the calendar exception, with no attendance confirmation or SMS.
5. Use `on conflict (student_id, attendance_date) do nothing`.
6. Return `{ inserted, deleted }`.

Called by:

- publish / save / cancel RPCs,
- Admin → Calendar → **Sync attendance marks** maintenance action,
- admin report/export before reading marks.
- database student-roster triggers on insert or campus/status changes (including changes propagated from account lifecycle actions), via an internal helper using the same reconciliation rules and lock.

Past marks are never deleted or rewritten.

Same-day publish/edit/cancel applies to the entire local calendar day for daily RFID calculations; it does not split the denominator by hour. Existing RFID evidence and already-sent SMS remain intact. Cancelling today removes today's exception and makes normal tap processing available again. Preserved historical snapshots remain accessible under student-scoped RLS even if current entry visibility changes. Reports never backfill historical exceptions from current roster membership.

### 6.11 RLS policies

**`calendar_entries`**

- Admin: select all; writes only through the validated RPCs in §6.9. Revoke direct authenticated INSERT/UPDATE/DELETE grants.
- Teacher/student select:

```sql
status in ('published', 'cancelled')
and (
  audience = 'everyone'
  or (audience = 'teachers' and public.current_user_role() = 'teacher')
  or (audience = 'students' and public.current_user_role() = 'student')
)
and (
  cardinality(campuses) = 0
  or campuses && public.current_user_campuses()
)
```

- No insert/update/delete policy for teachers/students.
- Add the same restrictive active-account and verified-email policies used by
  `202609220001_academic_catalog.sql`.

**`calendar_entry_reads`**

- Select/insert/update only own rows for a currently visible published entry, restricted to teacher/student recipients. UPDATE requires matching `USING` and `WITH CHECK`; protect both entry/user keys and use a database-generated read timestamp. This permits upsert after an edit makes an entry unread again.
- No delete policy. Admins cannot create announcement receipts.
- Restrictive active-account and verified-email policies.

**`attendance_day_marks`**

- Select:
  - admin: all,
  - teacher: `public.teacher_can_access_student(student_id)`,
  - student: own student row (`students.user_id = auth.uid()` or `current_student_id()`).
- No insert/update/delete policies.
- Revoke write grants from `authenticated`.

**`calendar_email_deliveries`**

- Select: admin only.
- No user writes.
- Restrictive active-account and verified-email policies.

### 6.12 Realtime, audit, and system logs

- Add `calendar_entries`, `calendar_entry_reads`, `attendance_day_marks`, and
  `calendar_email_deliveries` to the `supabase_realtime` publication (guarded
  like `202609160001_complete_realtime_publication.sql`).
- Attach the existing audit trigger to `calendar_entries` and add its columns to
  the audit safe-key allowlist.
- Add `calendar_entries`, `attendance_day_marks`, and
  `calendar_email_deliveries` to `logEntities` in
  `src/features/system-logs/query.ts`.
- Record application audit events for publish, cancel, republish, mark sync, and
  email retry.

### 6.13 Migration files

Create:

- `supabase/migrations/202610250001_school_calendar.sql`
- `supabase/verify_school_calendar.sql`
- `supabase/rollback_school_calendar.sql`

The migration is additive. It does not alter `attendance_records`,
`attendance_status`, `subject_attendance`, or `subject_schedules`.

---

## 7. Campus and audience resolution

### 7.1 Campus scope

- Admin selects **All campuses** (empty array) or one or more campus values.
- Campus values come from the existing text columns:
  - `students.campus`
  - `teacher_assignments.campus`
  - `academic_sections.campus`
- Trim values; reject blanks; dedupe.
- Matching is exact (case-sensitive) to stay consistent with existing campus handling.
- A student sees an entry only when their `students.campus` matches, unless the entry is all-campus.
- A teacher sees an entry when they have at least one active `teacher_assignments.campus` match, unless the entry is all-campus.
- A teacher assigned to multiple targeted campuses is counted once for email and sees one calendar item.
- Attendance-impacting entries require `audience = 'everyone'`, so students and teachers see the same day state.
- Normal events may target Everyone, Teachers, or Students.

### 7.2 Displaying scope

Every calendar item, dashboard post, and email must show the campus scope when it is not all-campus:

- “Main Campus”
- “Main Campus, MV Campus”
- “All campuses”

This prevents a teacher assigned to both campuses from thinking MV is also no-class.

---

## 8. Notifications

### 8.1 Header bell

- Visible for teachers and students only.
- Hidden for admins.
- Lists published entries matching audience/campus where:
  - `ends_on >= today`, or
  - `published_at >= now() - interval '7 days'`.
- Cap at 20 items.
- Unread = no read row or `read_at < updated_at`.
- Cancelled entries are excluded.
- Drafts are excluded.
- Item click:
  1. upsert a read row,
  2. navigate to `/teacher/calendar?date=YYYY-MM-DD` or
     `/student/calendar?date=YYYY-MM-DD`.
- “Mark all read” upserts read rows for all currently unread visible items.
- Realtime refresh through the existing `LiveRefresh` pattern.

### 8.2 Login toast

- A client component in the portal layout.
- Receives the latest unread bell item.
- Shows once per browser session using `sessionStorage` keyed by user id.
- Uses the existing `gooeyToast`.
- Message includes the item title, tag/impact, date, and a “View calendar” action
  if the toast library supports actions; otherwise a short description and the
  bell remains the action.
- If the latest item is no-class or online, the message leads with that state.
- No toast for admins, drafts, cancelled items, or empty unread state.

### 8.3 Teacher/student dashboard post

- Shared server component rendered above the KPI cards on:
  - `src/app/(portal)/teacher/dashboard/page.tsx`
  - `src/app/(portal)/student/dashboard/page.tsx`
- Query: published entries matching audience/campus with
  `published_at > now() - interval '7 days'`.
- Order: pinned first, then `published_at desc`.
- Limit 3.
- Hidden if none.
- No admin dashboard version.
- The post shows:
  - tag badges,
  - title,
  - date range,
  - campus scope,
  - reason/description excerpt,
  - “View calendar” link.
- Cancelled entries are excluded.
- The 7-day window uses `published_at` exactly. Republishing resets
  `published_at`, so the window restarts.
- Viewing the post does not mark it read. The bell is the read surface.

### 8.4 Realtime behavior

- Add `calendar_entries` and `attendance_day_marks` to
  `src/components/live-refresh.tsx` default tables so dashboards and attendance
  pages refresh when a calendar state changes.
- Add a layout-level `LiveRefresh` for `calendar_entry_reads` with a distinct
  channel so the bell unread count updates when another tab marks items read.
- Add `calendar_email_deliveries` to the admin delivery-log tab refresh.
- Keep the bell query defensive: if the migration is missing or the query fails,
  return `null` and render the portal without the bell.

### 8.5 Email via Resend

Operational prerequisites:

- Resend account and verified sending domain.
- `RESEND_API_KEY`
- `CALENDAR_EMAIL_FROM` (for example `School Calendar <calendar@school.example>`)
- `CALENDAR_EMAIL_REPLY_TO` (optional)
- `NEXT_PUBLIC_APP_URL` for links in email

Add these to `.env.example` and the README.

Triggers:

| Event | Email |
|---|---|
| Draft saved | None |
| First publish | Yes, to resolved recipients |
| Publish after cancel | Yes, treated as a new publish |
| Edit of published entry with **Notify recipients** checked and an important field changed | Yes, “Updated” |
| Cancellation | Yes, “Cancelled” |
| Edit with checkbox unchecked | No email; in-app calendar still updates |

Important fields for the edit email:

- title
- description
- reason
- tags
- attendance impact
- audience
- campuses
- dates/times
- location

If none changed, skip the email even if the checkbox is checked.

Sending:

- Resolve recipients with `calendar_entry_recipients`.
- Build one email per recipient.
- Create delivery rows with a shared `batch_id` and the rendered
  subject/html/text snapshot.
- Commit the DB changes first.
- Send after the response using Next.js `after()` from `next/server`.
- Call the Resend batch endpoint via `fetch`, matching the existing PhilSMS
  service pattern. No new npm dependency.
- Chunk at 100 messages per batch.
- Update each delivery row to `Sent` with the Resend id, or `Failed` with a safe
  error message.
- Publishing must not fail if Resend is unconfigured or the API fails. Mark
  deliveries `Failed` and expose retry.
- If no recipients match, publish succeeds and the admin sees “No recipients
  matched.”

Email content:

- Subject:
  - `[No classes] <title> — <date range>`
  - `[Online class] <title> — <date range>`
  - `[Event] <title> — <date range>`
  - `Cancelled: <title>`
  - `Updated: <title>`
- Body:
  - school name,
  - tag badges as text,
  - title,
  - date range and campus scope,
  - reason and description,
  - “View calendar” link,
  - for cancellation: clear “This announcement has been cancelled.”
  - for no-class: “RFID taps are not expected. Attendance is marked No classes.”
  - for online/manual: “Attendance is confirmed by the teacher in Subject Attendance.”

### 8.6 Delivery log and retry

Admin → Calendar → **Email deliveries** tab:

- Columns: entry, type, recipient, role, status, attempts, last attempt, sent
  time, safe error, retry.
- Filters: entry, type, status, date range.
- Retry one failed row or all failed rows in a batch.
- Retry uses the stored subject/html/text payload, not the current entry state.
- Retry updates the same row: `attempt_count + 1`, `last_attempt_at`, status,
  Resend id or safe error.
- Only admins can retry.
- Record an audit event for each retry.
- Realtime refresh the table.

---

## 9. UI

### 9.1 Admin — `/admin/schedules/calendar`

**Header**

- Title: “Calendar & Announcements”
- Description: “Publish school events, no-class days, and online-class
  announcements.”
- Primary action: “New announcement”

**KPI cards**

- Upcoming entries (next 30 days)
- No-class days this month
- Published this month
- Failed emails

**Tabs**

1. **Calendar**
   - Month grid using `src/components/ui/calendar.tsx`.
   - Day cells show up to three status dots/badges and a `+N` indicator.
   - Multi-day entries mark every day in the range.
   - Clicking a day:
     - shows that day’s entries in a side panel,
     - pre-fills the new-entry form with that date.
   - Clicking an entry opens details with Edit / Publish / Cancel / Republish
     actions as allowed by status.
   - Mobile: agenda list grouped by date instead of the grid.

2. **All announcements**
   - Searchable/filterable table.
   - Columns: Title, Tags, Impact, Audience, Campuses, Dates, Status, Published,
     Email status, Actions.
   - Filters: search, status, tag, impact, campus, date range.
   - Pagination using the existing table/pagination patterns.
   - Row actions by status:
     - Draft: Edit, Publish, Delete
     - Published: Edit, Cancel
     - Cancelled: Edit, Republish
   - Published/cancelled rows have no Delete action.
   - Maintenance action: “Sync attendance marks” for a date range.

3. **Email deliveries**
   - The log described in §8.6.
   - Empty state: “No calendar emails have been sent.”

**Entry form**

Fields:

- Title (required, max 160)
- Tags (multi-select, at least one)
- Attendance impact (radio: Normal / No classes / Online / manual)
- Reason (free text, required when impact is not Normal; suggest Semestral break,
  Storm, Earthquake, Emergency, Other)
- Audience (Everyone / Teachers / Students)
- Campuses (All campuses or selected)
- Date range (single day or inclusive multi-day)
- Start/end time (only Normal, single-day)
- Location (optional)
- Description/announcement (rich enough for paragraphs; plain textarea is fine)
- Pin to top
- Notify recipients (edit only; unchecked by default)

Behavior:

- Tag changes auto-suggest impact:
  - `no_classes` only → No classes
  - `online_class` present → Online / manual
  - otherwise → Normal
- Admin can override only within the validation rules.
- Audience is forced to Everyone when impact is not Normal, with helper text:
  “No-class and online days apply to both teachers and students.”
- Campus selector defaults to All campuses.
- Date range defaults to the selected day.
- Times are disabled for attendance-impacting entries.
- The publish confirmation shows the recipient count and campus scope.
- The cancel confirmation warns when the entry is in the past:
  “Historical calendar exceptions will not be changed. Today's exception will be removed.”
- The form shows inline errors for conflicts and invalid combinations.
- Use existing `Dialog`, `DateRangePicker`, `Input`, `Textarea`, `Select`,
  `Checkbox`, `RadioGroup`, and `Button` components.

Accessibility and polish:

- Keyboard-operable calendar and dialogs.
- Visible focus states.
- Color is never the only status indicator; use labels/icons.
- Empty, loading, and error states.
- Mobile-safe dialogs and no horizontal overflow.

### 9.2 Teacher — `/teacher/calendar`

- Top-level nav item.
- Read-only month grid and selected-day details.
- Upcoming list below the grid.
- Tag/impact legend with text labels.
- Campus scope on every item.
- Cancelled items show a clear “Cancelled” badge; drafts never appear.
- No edit/publish/cancel controls.
- Query params: `?date=YYYY-MM-DD` and `?month=YYYY-MM` for bell/deep links.
- Mobile agenda view.

### 9.3 Student — `/student/calendar`

Same as teacher, with student-appropriate copy.

- No-class item: “No classes today. RFID taps are not expected.”
- Online item: “Online class. Attendance is confirmed in Subject Attendance.”
- The page does not expose other students, teacher notes, or admin controls.

### 9.4 Navigation

`src/config/navigation.ts`:

- **Admin:** add to the Schedules submenu:
  ```ts
  { title: "Calendar", url: "/admin/schedules/calendar" }
  ```
  Place it after Class Schedules.
- **Teacher:** add:
  ```ts
  { title: "Calendar", url: "/teacher/calendar", icon: CalendarIcon }
  ```
  Place it after My Schedule.
- **Student:** add:
  ```ts
  { title: "Calendar", url: "/student/calendar", icon: CalendarIcon }
  ```
  Place it after My Attendance.

Use `Calendar03Icon` if available in `@hugeicons/core-free-icons`;
otherwise reuse the already imported `CalendarClockIcon` or
`CalendarCheckIcon`.

### 9.5 Dashboard post placement

- Teacher dashboard: above the KPI cards.
- Student dashboard: above the KPI cards.
- Admin dashboard: no post. Attendance state strip only.
- If the calendar query fails, the dashboard still renders normally.

---

## 10. Implementation map

### 10.1 Database

| File | Work |
|---|---|
| `supabase/migrations/202610250001_school_calendar.sql` | Enums, tables, view, helpers, RPCs, RLS, indexes, triggers, realtime |
| `supabase/migrations/202610250002_school_calendar_access.sql` | Task 04: campus/recipient functions, read/receipt policies and grants, receipt guard, security-invoker view; later tasks add mutation and realtime behavior separately |
| `supabase/migrations/202610250003_calendar_attendance_marks.sql` | Task 05: admin sync RPC, private reconciliation helper, historical snapshot guard, student roster hooks, shared advisory lock |
| `supabase/migrations/202610250004_save_calendar_entry.sql` | Task 06: validated full-entry saves, lifecycle preservation, normalized campus/tag arrays, private overlap helper, published-edit reconciliation |
| `supabase/migrations/202610250005_publish_calendar_entry.sql` | Task 07: validated draft/cancelled publication, shared overlap lock, refreshed publish timestamp, atomic mark reconciliation |
| `supabase/migrations/202610250006_cancel_delete_calendar_entry.sql` | Task 08: cancellation, never-published draft deletion, lifecycle/history/overlap guards, shared statement lock |
| `supabase/migrations/202610250007_calendar_audit_realtime.sql` | Task 09: structural audit allowlist, audit triggers, guarded realtime publication registration |
| `supabase/verify_school_calendar.sql` | PASS/FAIL checks for schema, constraints, RLS, overlap, marks, recipients |
| `supabase/rollback_school_calendar.sql` | Restore pre-calendar RFID function/grants and any changed audit helper, remove roster hooks, then drop new objects in dependency order; preserve existing attendance data |
| `supabase/migrations/README.md` | Apply/verify/rollback instructions |
| `supabase/README.md` | New table summary |

### 10.2 Feature layer

| File | Work |
|---|---|
| `src/features/calendar/schema.ts` | Zod schemas, enums, date/campus helpers, tag/impact validation |
| `src/features/calendar/query.ts` | Admin list, month data, upcoming, bell, dashboard posts, delivery log, recipient count |
| `src/features/calendar/actions.ts` | Save draft, publish, cancel, republish, delete draft, mark read, retry email, sync marks |
| `src/features/calendar/attendance-state.ts` | Effective state map and rate/dashboard helpers |
| `src/features/calendar/email.ts` | Subject/body templates and Resend payload builder |
| `src/features/calendar/README.md` | Behavior, non-goals, attendance rules, email setup |
| `src/services/email/resend.ts` | Resend batch fetch adapter, configuration check |
| `src/services/calendar/query.ts` | Server-side Supabase queries for entries, bell, marks, delivery log |
| `src/features/system-logs/query.ts` | Add calendar entities to the filter list |

### 10.3 Admin UI

| File | Work |
|---|---|
| `src/app/(portal)/admin/schedules/calendar/page.tsx` | Page shell, tabs, KPI cards, data loading |
| `src/app/(portal)/admin/schedules/calendar/loading.tsx` | Skeleton |
| `src/app/(portal)/admin/schedules/calendar/error.tsx` | Error boundary |
| `src/app/(portal)/admin/schedules/calendar/components/calendar-panel.tsx` | Month grid, day selection, status dots |
| `src/app/(portal)/admin/schedules/calendar/components/entry-dialog.tsx` | Create/edit form |
| `src/app/(portal)/admin/schedules/calendar/components/entries-table.tsx` | All announcements table |
| `src/app/(portal)/admin/schedules/calendar/components/delivery-table.tsx` | Email delivery log and retry |
| `src/app/(portal)/admin/schedules/calendar/components/kpi-cards.tsx` | Admin KPIs |
| `src/app/(portal)/admin/schedules/calendar/components/panel-skeleton.tsx` | Panel skeleton |
| `src/app/(portal)/admin/schedules/calendar/components/confirm-dialogs.tsx` | Publish/cancel/delete/republish confirmations |

### 10.4 Teacher/student UI

| File | Work |
|---|---|
| `src/app/(portal)/teacher/calendar/page.tsx` | Read-only calendar page |
| `src/app/(portal)/student/calendar/page.tsx` | Read-only calendar page |
| `src/features/calendar/read-only-panel.tsx` | Shared month grid, selected day, upcoming list |
| `src/components/calendar-bell.tsx` | Header bell, unread count, mark read |
| `src/components/calendar-login-toast.tsx` | Once-per-session login toast |
| `src/components/dashboard-announcement-post.tsx` | Shared teacher/student dashboard post |
| `src/app/(portal)/teacher/dashboard/page.tsx` | Fetch and render the post |
| `src/app/(portal)/student/dashboard/page.tsx` | Fetch and render the post |
| `src/app/(portal)/layout.tsx` | Fetch bell data, render bell/toast, layout refresh |
| `src/components/site-header.tsx` | Render the bell |
| `src/components/live-refresh.tsx` | Add calendar tables |

### 10.5 Attendance integration

| File | Work |
|---|---|
| `supabase/migrations/202609140001_rfid_tap_processing.sql` | Do not edit the old migration; add a new migration that replaces `record_rfid_tap` with the calendar checks |
| `src/services/rfid/tap.ts` | Map `NO_CLASSES`/`ONLINE_CLASS` to 422 |
| `src/features/attendance/dashboard.ts` | Exclude affected student-days; add status counts |
| `src/services/attendance/dashboard.ts` | Fetch calendar state for the dashboard range |
| `src/features/attendance/teacher-dashboard.ts` | Same for teacher |
| `src/services/attendance/teacher-dashboard.ts` | Fetch calendar state |
| `src/features/attendance/teacher-attendance.ts` | Add No classes / Online display status |
| `src/services/attendance/teacher-attendance.ts` | Fetch marks/state |
| `src/features/attendance/student-dashboard.ts` | Add today’s day state |
| `src/services/attendance/student-dashboard.ts` | Fetch today’s state |
| `src/features/attendance/panel.ts` | Add state counts/badges |
| `src/services/attendance/panel.ts` | Fetch state |
| `src/components/attendance-status-badge.tsx` | Add display-only No classes / Online badges |
| `src/features/reports/panel.ts` | Exclude affected student-days; add exception data |
| `src/features/reports/teacher-panel.ts` | Same for teacher |
| `src/features/reports/pdf-document.tsx` | Add calendar exceptions section and notes |
| Dashboard/KPI/chart components | Handle `—` rates and new counts |

**Important:** do not add `NoClasses` to the `attendance_status` enum or insert
fake `attendance_records` rows.

### 10.6 Documentation and environment

| File | Work |
|---|---|
| `RFID-DOCS-SCOPE-AUDIT.md` | Add R06 and supersede the deferral |
| `README.md` | Feature list, deferred list, env vars, calendar behavior |
| `UI-UX-IMPROVEMENT-PLAN.md` | Update the holiday-management exclusion note |
| `.env.example` | Resend and app URL variables |
| `src/features/README.md` | Link the new module to R06 |

---

## 11. Build order

1. **Scope docs**
   - Add R06 to `RFID-DOCS-SCOPE-AUDIT.md`.
   - Update `README.md`, `supabase/README.md`, `supabase/migrations/README.md`.
2. **Migration and SQL helpers**
   - Enums, tables, indexes, view, `current_user_campuses`,
     `calendar_entry_recipients`, save/publish/cancel/sync RPCs, RLS, triggers,
     realtime.
   - `verify_school_calendar.sql` and `rollback_school_calendar.sql`.
3. **Apply and verify on a preview database**
   - All verification checks must return PASS before app deployment.
4. **Feature layer**
   - Schema, queries, actions, attendance-state helper, email templates,
     Resend adapter.
5. **Tap integration**
   - New migration replacing `record_rfid_tap` with the calendar checks.
   - Map rejection codes to 422.
   - Test with the physical reader.
6. **Admin UI**
   - Calendar tab, all-announcements tab, entry form, delivery log, KPIs.
7. **Teacher/student UI**
   - Read-only calendar pages, navigation, bell, login toast, dashboard post.
8. **Attendance/report integration**
   - Dashboards, daily attendance, reports, PDF.
9. **Tests and polish**
   - PGlite, server actions, browser tests, mobile, accessibility.
10. **Rollout**
    - Migration first, then app, then Resend configuration, then pilot
      announcement.

---

## 12. Tests

### 12.1 Database (PGlite)

- Apply all migrations plus the new one; stub Supabase Auth objects only.
- Constraints:
  - date range and max range,
  - times both/null and single-day rule,
  - tag/impact consistency,
  - audience/impact consistency,
  - status/published_at consistency.
- RLS:
  - admin sees drafts,
  - teacher/student see only published/cancelled matching audience/campus,
  - other-campus entries hidden,
  - admins excluded from recipients,
  - reads are own-only,
  - edited-entry receipt upserts succeed for the recipient; cross-user, hidden-entry, and admin writes fail,
  - direct authenticated entry mutations cannot bypass RPC validation,
  - marks are admin/teacher/student scoped.
- Overlap:
  - Main no-class + MV online allowed,
  - Main no-class + Main online rejected,
  - all-campus + campus-specific rejected,
  - normal events overlap allowed.
- Marks:
  - no-class publish creates marks for active students in scope,
  - online publish creates only OnlineManual exception snapshots, never NoClasses or attendance confirmations,
  - cancellation removes today/future snapshots and keeps both kinds of past snapshots,
  - edit reconciles old/new today/future ranges; started historical attendance scope is locked,
  - student insert/transfer/status changes reconcile today/future snapshots transactionally without changing past campus/status,
  - past report exclusions survive cancellation, republish, and campus transfer without requiring a previous report read,
  - sync is idempotent.
- Tap RPC:
  - no-class returns `NO_CLASSES`, no attendance row, no SMS,
  - online returns `ONLINE_CLASS`, no attendance row, no SMS,
  - normal day still records and classifies Late as before.
- Recipients:
  - audience/campus matching,
  - teacher dedupe across campuses,
  - inactive accounts excluded,
  - admins excluded.
- Email deliveries:
  - batch rows,
  - status transitions,
  - retry uses the stored payload,
  - unique batch/recipient.
- Rollback restores the pre-calendar tap function/grants and shared audit behavior before dropping dependencies; existing attendance/SMS rows survive.

### 12.2 Server actions

- Admin-only enforcement.
- Save draft, publish, cancel, republish.
- Invalid transitions rejected.
- Published/cancelled entries cannot be hard-deleted.
- Edit with and without “Notify recipients.”
- No email when important fields are unchanged.
- Retry failed email.
- Mark one/all read.
- Sync marks.
- Audit events recorded.

### 12.3 Browser

- Admin month navigation, day click, create draft, publish, cancel, republish.
- Tag/impact auto-suggest and validation.
- Campus selection and conflict error.
- Teacher/student visibility by audience/campus.
- Bell unread count, item click, mark all read.
- Login toast appears once per browser session.
- Dashboard post appears and disappears exactly 7 days after publish (seed
  `published_at` values).
- No admin dashboard post.
- Delivery log with a mocked Resend adapter.
- Mobile layout and keyboard accessibility.

### 12.4 Regression

- Existing attendance, RFID, SMS, subject attendance, reports, archives,
  lifecycle, and live-refresh tests still pass.
- `pnpm lint`
- `pnpm build`
- The repo’s full test commands.

### 12.5 Manual hardware

- No-class day: tap shows `TAP REJECTED` + “No classes today.”
- Online day: tap shows `TAP REJECTED` + “Online class today. Attendance is per
  subject.”
- Normal day: time-in/time-out still work.
- Message truncation checked on the physical display.

---

## 13. Rollout and rollback

### 13.1 Rollout

1. Apply the migration on a Supabase preview/branch.
2. Run `supabase/verify_school_calendar.sql`; all checks PASS.
3. Deploy the app.
4. Configure Resend and verify the sending domain.
5. Publish a test event to a small test audience.
6. Verify:
   - bell,
   - login toast,
   - dashboard post,
   - email delivery log,
   - realtime,
   - tap rejection on a test no-class day.
7. Publish the first real announcement.

Deployment order matters: **migration before app**. The bell query is defensive,
but the admin page requires the tables.

### 13.2 Rollback

1. Roll back the app deployment first.
2. Export calendar snapshots and delivery history before dropping the new tables.
3. Run `supabase/rollback_school_calendar.sql`: restore the pre-calendar
   `record_rfid_tap` implementation and grants, restore any modified shared audit
   helper, remove calendar roster triggers, then drop new objects in dependency order.
4. Verify normal tap processing and existing attendance, subject attendance,
   SMS, and reports against their pre-calendar behavior.

Rollback removes the calendar feature and its stored history; retain the export
if needed. It does not modify existing RFID attendance or subject attendance/SMS
data. Restoring the tap function before dropping its calendar dependencies is required.

---

## 14. Task 01 rule decisions

Recorded on 2026-10-25 while executing the user-approved scope-resolution task. These rules govern subsequent tasks; their implementation still requires each task's separate confirmation.

1. **Overlap rule:** one published attendance-impacting entry per campus per
   date. All campuses conflicts with any campus-specific entry. Normal events
   may overlap. Retain this planned rule; enforce it under the shared database lock.
2. **Cancelled visibility:** cancelled entries remain visible in teacher/student
   calendars with a badge, but are excluded from the bell, toast, dashboard post,
   and ordinary announcement email selection. Cancellation itself sends one cancellation notification batch to the resolved audience; retry uses its stored payload.
3. **Past-date immutability:** attendance-impacting entries cannot be backdated
   or republished before today. Started historical attendance scope is locked as specified in §6.9. Cancellation affects today/future only; immutable NoClasses/OnlineManual snapshots protect historical reports. Normal events can be backdated.
4. **Attendance-impact audience:** must be Everyone. This ensures teachers and
   students see the same no-class/online state.
5. **Dashboard window:** exactly 7 days after `published_at`; republishing resets
   the window.
6. **Email sender:** a verified Resend domain is an operational prerequisite.
   The code ships with configuration checks and a Failed delivery state when
   Resend is not configured.
7. **Same-day behavior and transfers:** today is mutable as a whole day in Asia/Manila. Roster changes reconcile today/future snapshots transactionally; past snapshots keep their campus/status. Existing RFID evidence and SMS are never removed by calendar actions.
8. **UI reuse:** use existing shadcn/ui calendar, date range, dialog, form, table, badge, and loading components; no replacement UI library is needed.

---

## 15. Acceptance criteria

- Admin can create a draft, publish it, edit it, cancel it, and republish it.
- Drafts are invisible to teachers/students and blocked by RLS.
- Published/cancelled entries are never hard-deleted.
- Direct authenticated table writes cannot bypass lifecycle or overlap validation; receipt upserts remain own-only and visibility-scoped.
- Past NoClasses and OnlineManual exclusions survive cancellation, republish, and roster changes. Same-day reconciliation preserves existing RFID/SMS evidence.
- All eight tags are available; reason is free text.
- Single-day and multi-day semestral-break ranges work.
- Campus targeting works; Main no-class + MV face-to-face on the same date is
  supported.
- No-class-only day:
  - per-student `NoClasses` marks exist,
  - RFID taps are rejected and the device shows the no-class message,
  - no attendance row or SMS is created,
  - daily rate/trend excludes the affected student-days,
  - reports/PDF include `NoClasses`, not Absent.
- Online-only or no-class + online day:
  - no automatic `NoClasses` marks,
  - `OnlineManual` exception snapshots preserve historical exclusions without creating attendance confirmations,
  - RFID taps are rejected with the online message,
  - Subject Attendance remains available and editable,
  - daily rate/trend excludes the affected student-days,
  - subject reports include the manual confirmations.
- Teacher can mark Present/Late/Absent via Subject Attendance on any day.
- Daily Attendance remains read-only.
- Bell, login toast, and dashboard post work for teachers/students.
- Dashboard post disappears exactly 7 days after publish.
- No admin dashboard post; no admin email.
- Email sends on publish, cancellation, and checked important edits.
- Delivery log shows Sent/Failed and supports retry.
- Realtime updates the bell, dashboard, and delivery log.
- Rollback restores the previous RFID function/grants and audit behavior before dropping calendar dependencies; existing attendance/SMS data is preserved.
- All existing tests pass.
- Scope audit, README, migration docs, verification, and rollback are updated.

---

## 16. Commit message suggestion

```text
docs(calendar): add school calendar and announcements implementation plan
```
