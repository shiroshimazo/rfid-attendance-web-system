# rfid-docs vs. Codebase — Gap Analysis

What the documentation in `rfid-docs/` promises, and what the code in this
repository actually contains. Every row was verified by reading the source, not
by trusting the existing roadmap files.

- Docs read: `Project Overview`, `System Architecture`, `Functional Requirement`,
  `Late Attendance Ruling`, `Database Design`, `Admin/Teacher/Student User
  Interaction`, `Development Guidelines`.
- Code read: `src/app`, `src/features`, `src/services`, `src/lib`, `src/proxy.ts`,
  `supabase/migrations`, `supabase/seed.sql`, `tests/`.

Legend: **MISSING** = nothing in the codebase does this. **PARTIAL** = built, but
not the way the doc describes.

---

## The headline

The **read side is essentially complete**. All three portals, every panel, every
KPI card, chart, table, filter, and modal described in the User Interaction docs
exists and is wired to Supabase with RLS.

The **write side of the attendance pipeline does not exist at all.** Nothing in
this repository ever inserts or updates a row in `attendance_records` or
`sms_notifications`:

```
grep -rn "attendance_records" src/ | grep -i "insert|update|upsert"   → 0 hits
grep -rn "sms_notifications" src/ | grep -i "insert|update|upsert"    → 0 hits
find src -name "route.ts"                                             → 0 files
src/features/attendance/                                              → no actions.ts
```

Every attendance number in the system today comes from `supabase/seed.sql` or
from manual SQL. The dashboards are a viewer for data that no code path can
produce.

---

## Part A — Documented, but MISSING from the codebase

### A1. RFID tap ingestion endpoint — MISSING

| | |
|---|---|
| Doc | `Functional Requirement` → "RFID Attendance Requirements": receive RFID data from ESP32, validate registration, identify the student, create attendance records. `System Architecture` → "Attendance Process / Time-In". `Project Overview` objective 5. |
| Code | `src/app/api/rfid/tap/README.md` is a placeholder that says *"This folder is reserved for the future `route.ts`"*. There is no `route.ts` anywhere in `src/`. |

Nothing accepts a request from the ESP32. Consequences that cascade from this
one gap:

- **Time-In / Time-Out rule — MISSING.** `Functional Requirement` → "Time-In and
  Time-Out Requirements" ("first successful tap creates Time In, second creates
  Time Out"). No code implements this. The `time_out` column is read everywhere
  (`src/features/attendance/panel.ts`, `student-attendance.ts`, …) and written
  nowhere.
- **Device authentication — MISSING.** The tap README requires a device
  credential. `.env.example` has no device key, and no code reads one.
- **Replay protection / UID normalization — MISSING.** `src/services/rfid/README.md`
  promises "device authentication, replay protection, UID normalization". The
  directory contains only `cards.ts`, an admin-side directory reader. The only
  normalization in the repo is `rfidNumberField` in
  `src/features/shared/schema.ts:101` (trim + uppercase on the admin form) —
  nothing normalizes an inbound device UID.
- **Device response payload — MISSING.** No code returns the LCD / LED / buzzer
  outcome the `System Architecture` "LED and Buzzer Feedback" section describes.

### A2. SMS notification sending — MISSING

| | |
|---|---|
| Doc | `Functional Requirement` → "SMS Notification Requirements": retrieve parent contact, send SMS, save status. `Project Overview` objective 10 and the sample message. `Database Design` table 6. |
| Code | `src/services/sms/README.md` and `src/features/sms/README.md` are one-line placeholder files. **Both directories contain nothing else.** |

The `sms_notifications` table exists and is read in three places
(`src/services/attendance/student-dashboard.ts:118`,
`src/services/attendance/student-attendance.ts:84`, and the badge component
`src/components/sms-status-badge.tsx`), but there is:

- no provider adapter (no Semaphore / Twilio / any HTTP client),
- no `SMS_API_KEY` / `SMS_SENDER` in `.env.example`,
- no code that composes the message body,
- no `Pending → Sent / Failed` transition, no `sent_at` stamp,
- no retry handling or delivery callback.

The student's "Parent SMS Status" card renders correctly and will read
"No notification yet" forever.

### A3. RFID scan-event log — MISSING

| | |
|---|---|
| Doc | `Functional Requirement` → "Report Requirements": reports shall contain **RFID logs**. `Admin User Interaction` → Reports Panel "RFID Scans" KPI. |
| Code | No `rfid_scan_logs` table in any migration. |

There is no table for raw taps. Consequences:

- The **RFID logs report is missing.** `src/features/reports/panel.ts` has no
  such structure; `src/services/reports/snapshot.ts:55-95` fetches only
  `students`, `attendance_records`, `programs`, `rfid_cards`.
- The **"RFID Scans" / "RFID Taps Today" KPI is inferred, not measured.**
  `src/features/reports/panel.ts:382` sets `rfidScans: scoped.length` (a count of
  attendance rows), and `src/features/attendance/dashboard.ts:34` documents it as
  "time-in taps plus time-out taps". A **failed** tap — rejected card, unknown
  UID — is invisible to both, even though `Functional Requirement` → "Failed RFID
  Tap" makes failed taps a first-class outcome.

### A4. SMS notification records in reports — MISSING

| | |
|---|---|
| Doc | `Functional Requirement` → "Report Requirements": reports shall contain **SMS notification records**. |
| Code | `src/services/reports/snapshot.ts` never queries `sms_notifications`. `AttendanceLog` in `src/features/reports/panel.ts:64-77` has `rfidStatus` but no `smsStatus`. The Recent Attendance Logs table (`admin/reports/components/recent-logs-table.tsx:121-172`) renders Time, Student Name, Program, Year Level, Section, Status, RFID Status — no SMS column. |

Neither the admin nor the teacher Reports panel contains any SMS section.

### A5. Absent and Excused records are never written — MISSING

| | |
|---|---|
| Doc | `Database Design` attendance_records has `attendance_status`; the migration enum is `('Present','Late','Absent','Excused')`. `Functional Requirement` reports "Absent Today". |
| Code | `src/features/attendance/` has **no `actions.ts`** — unlike `students`, `teachers`, `schedules`, `rfid`, `profiles`, which all have one. |

- **Absent** is always derived arithmetically (`expected - present - excused`,
  e.g. `src/features/reports/panel.ts:263`), never stored. There is no nightly
  job, cron, or `vercel.json` to materialize absence.
- **Excused** is displayed everywhere — badge (`attendance-status-badge.tsx:12`),
  distribution charts, the admin dashboard status filter
  (`student-attendance-table.tsx:43`) — but **no UI or server action can ever set
  it.** It is a status the system can show and cannot produce.

### A6. Late status is never written at tap time — MISSING

| | |
|---|---|
| Doc | `Late Attendance Ruling` → Data Model Direction: *"Status is written at tap time, never computed on read, so filters and reports always agree."* Future Improvement #2: "Tap-route enforcement: schedule lookup + Late assignment at write time." |
| Code | The `class_schedules` table, the admin Schedules panel, the cutoff arithmetic, and the Late display layer are all **built and correct**. The piece that consumes them at write time does not exist, because A1 does not exist. |

`supabase/backfill_late_status.sql` implements Future Improvement #3, but it is a
manual, run-it-in-the-SQL-editor script, not an automated path.

**Net effect:** the entire Late Attendance Ruling is currently inert. A schedule
row can be edited in the UI and it will change nothing about any record.

### A7. Password recovery — MISSING

| | |
|---|---|
| Doc | `src/features/auth/README.md` lists "password recovery". `Functional Requirement` → Security Requirements. |
| Code | `src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx:35` — the submit handler is: `setMessage("Supabase password recovery has not been connected yet.")` |

The form is a stub. `supabase.auth.resetPasswordForEmail` is never called, and
there is no `/reset-password` route to land on.

### A8. Firmware / hardware layer — MISSING (expected, but worth stating)

`Project Overview` → Technology Stack → Hardware, and the whole "RFID Attendance
Device Layer" of `System Architecture` (ESP32, RC522, 2.8" TFT LCD, green/red
LEDs, active buzzer, 240Ω resistors).

There is no firmware directory, no `.ino` / PlatformIO project, no wiring
diagram, and no hardware documentation of any kind in this repository. Objectives
1, 2, 3 and 4 of `Project Overview` are entirely unaddressed here.

---

## Part B — Implemented, but NOT the way the docs describe

### B1. PDF export is a browser print dialog — PARTIAL

`Functional Requirement`: *"Reports shall support PDF export."*
`Admin/Teacher User Interaction`: *"Export: PDF Report."*

`src/app/(portal)/admin/reports/components/export-pdf-button.tsx:13` (and the
teacher twin) is:

```tsx
onClick={() => window.print()}
```

No PDF is generated. There is no PDF library in `package.json`. Two further
problems:

- **No print stylesheet.** `data-print="hide"` / `data-print="region"` attributes
  are scattered through the report pages, but nothing in `src/app/globals.css`
  acts on them, so the printed output includes the sidebar and header.
- **It exports only what is on screen.** The Recent Logs table is capped at
  `RECENT_LOG_LIMIT = 50` (`src/features/reports/panel.ts:101`) and paginated in
  the client, so a "PDF report" silently omits everything past the visible page.

### B2. Schedules panel "Time End" is hard-coded, not stored — PARTIAL

`Admin User Interaction` → Schedules Panel lists **Time End** as a table column,
and the edit modal shows it.

`supabase/migrations/202609050001_class_schedules.sql` has `time_start` and
`grace_minutes` — **there is no `time_end` column.**
`src/features/schedules/directory.ts:25` resolves it from a static constant:

```ts
PILOT_SECTIONS.map((section) => [section.code, section.timeEnd])
```

So Time End is looked up by *section code* against the hard-coded
`src/features/academic/pilot.ts` table. If an administrator changes a section's
Time Start from 06:00 to 07:00, the panel keeps showing Time End 12:30. The
column is informational per the ruling, but it is now capable of being wrong.

### B3. `users.password` column — DELIBERATE deviation

`Database Design` → table 1 lists a `password` column on `users`.

`supabase/migrations/202609010001_create_rfid_attendance_schema.sql:10-18` has no
such column, and line 2 states why: *"Passwords intentionally live only in
Supabase Auth (auth.users)."* This is correct and matches `Development
Guidelines` → "Never store plain passwords." **The Database Design doc should be
corrected**, not the code.

### B4. Register vs. Assign an RFID card is one step, not two — PARTIAL

`Functional Requirement` → Manage RFID Cards lists "Register RFID cards" and
"Assign RFID cards to students" as separate capabilities.

`rfid_cards.student_id` is `not null`
(`202609010001_create_rfid_attendance_schema.sql:100`) and
`registerRfidCardSchema` (`src/features/rfid/schema.ts:28`) requires a
`studentId`. A card therefore cannot exist in stock, unassigned — registration
*is* assignment. Low impact; either the schema needs a nullable holder or the doc
needs to say the two happen together.

### B5. Profile pictures are URL text fields, no upload — PARTIAL

`Admin User Interaction` → Add Teacher/Student Modal: "Profile Picture".
Settings: "Change Photo".

Every one of these is a plain URL input — e.g.
`admin/students/components/student-form-dialog.tsx:513` labelled *"Profile
picture URL (optional)"*, and `admin/settings/components/profile-form.tsx:98`
"Change photo" with placeholder `https://example.com/photo.jpg`. There is no
Supabase Storage bucket, no storage policy in any migration, and no file input
anywhere. Users must host the image themselves.

### B6. Role gating happens per-page, not at the edge — PARTIAL

`Functional Requirement` → Security Requirements; `System Architecture` →
Security Architecture.

`src/proxy.ts` only refreshes the Supabase session — it has no role check and no
account-status check. The actual enforcement is `requireRole()` /
`requireCurrentAccount()` in `src/features/auth/server.ts:62-80`, called from each
layout. This works, but it means protection depends on every future page
remembering to call it; nothing fails closed at the edge.

### B7. Realtime is coded but needs a deploy step — PARTIAL

`Functional Requirement` → "Real-Time Update Requirements … without manual
refresh."

`src/components/live-refresh.tsx` subscribes to `postgres_changes` on
`attendance_records`, `rfid_cards`, `sms_notifications`, `students`, and is
mounted across the portal pages. This is correctly built. It is inert until
`supabase/migrations/202609040001_enable_realtime.sql` is actually applied to the
Supabase project — the subscription succeeds silently and simply never fires.

### B8. Campus is stored but absent from admin reporting — PARTIAL

`Project Overview` objective 11 ("Support multiple campus identification") and
the three campuses are correctly modelled in
`src/features/academic/pilot.ts:42` and stored on `students` and
`attendance_records`.

But campus appears in **no** admin or teacher view: it is not a filter on the
Attendance panel, and `SectionBreakdown` (`src/features/reports/panel.ts:51-62`)
groups by program / year level / section only. A three-campus deployment cannot
produce a per-campus report. Campus surfaces only in the student's own
dashboard, profile, and attendance detail.

---

## Part C — In the codebase, NOT in any doc

These are the reverse direction — things that exist without documentation
backing. Not bugs, but they are drift.

1. **`Excused` attendance status.** In the DB enum, in the badge component, in
   the charts, and in the admin dashboard status filter. **No doc mentions it.**
   `Functional Requirement` and `Database Design` describe only Present/Absent;
   `Late Attendance Ruling` adds Late. Combined with A5 (nothing can set it),
   this is an undocumented, unreachable state.
2. **No admin UI for Programs or Courses.** `Database Design` defines both tables
   (7 and 8) as first-class catalogs, but the `Admin User Interaction` sidebar
   omits them and no `admin/programs` or `admin/courses` route exists. New
   programs and subjects can only be added by SQL migration
   (`202609060001_bsit_pilot_courses.sql`). This is the inverse gap: the data
   model is documented, the way to maintain it is not.
3. **Course code aliases are unimplemented by design.**
   `Late Attendance Ruling` says the courses table *"must store one canonical
   `course_code` plus aliases."* `202609060001_bsit_pilot_courses.sql` stores only
   the canonical code and states in a comment that aliases (CPE211, CC104, ADV02)
   *"stay documented in the ruling until a future migration adds an alias
   column."* Honest, but the requirement is open.
4. **Error pages** — `(auth)/errors/{unauthorized,forbidden,not-found,
   internal-server-error,under-maintenance}` exist and are undocumented. Harmless.
5. **Dead code.** `src/components/refresh-button.tsx` has **zero mounts**
   remaining in `src/app` (replaced by `LiveRefresh`) and can be deleted.
6. **Folder-structure drift.** `Development Guidelines` specifies everything under
   `src/`. There is a stray top-level `components/motion-primitives/sliding-number.tsx`
   that differs from `src/components/motion-primitives/sliding-number.tsx` — two
   divergent copies of the same component.
7. **`lib/` holds helpers, not configuration.** `Development Guidelines` defines
   `lib/` as "configurations", but `src/lib/` holds `utils`, `format`,
   `school-time`, `fonts`, while the real config lives in
   `src/services/supabase/config.ts`. Cosmetic; the doc is the thing that is off.

---

## Priority order

If the goal is to make the documented system actually run end to end:

| # | Gap | Why first |
|---|-----|-----------|
| 1 | **A1** — `POST /api/rfid/tap` | Everything else in Part A is blocked behind it. Time-in/out, Late-at-write-time, and the SMS trigger all hang off this one route. |
| 2 | **A3** — `rfid_scan_logs` table | Needed by the tap route anyway (replay guard, failed-tap record), and unblocks the RFID logs report and honest tap KPIs. |
| 3 | **A6** — Late assignment inside the tap route | The schedules feature is fully built and currently does nothing. Small change, large payoff. |
| 4 | **A2** — SMS provider send | Second-largest documented feature with zero implementation. |
| 5 | **A4** — SMS + RFID sections in reports | Completes the Report Requirements once 2 and 4 land. |
| 6 | **A5** — absence/Excused writer | Makes "Absent Today" a fact rather than subtraction, and makes Excused reachable. |
| 7 | **A7** — password recovery | Small, self-contained, currently a visible dead end for users. |
| 8 | **B1** — real PDF export | Visible in every demo; today it prints the sidebar. |
| 9 | **B2, B5, B6, B8** | Correctness and completeness polish. |
| 10 | **B3, C1-C7** | Fix the *docs* to match deliberate, correct code decisions. |

Three of these (B3, C2, C7) are cases where the **documentation is wrong and the
code is right** — worth correcting in `rfid-docs/` so the next audit does not
re-flag them.
