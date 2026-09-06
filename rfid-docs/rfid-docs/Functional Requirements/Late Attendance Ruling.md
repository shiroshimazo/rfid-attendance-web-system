# Late Attendance Ruling

Ruling for late detection, per-section schedule scope, and the BSIT 2nd Year
pilot data. This document is the basis for all future late-related
improvements (schedules UI, tap-route enforcement, backfill, reports).

## Scope

- Program: BS Information Technology (BSIT) only.
- Year Level: 2nd Year only.
- Sections: 10 sections, codes 21001-21010.
- All other programs, year levels, and sections are out of scope: their taps
  are always recorded as Present until onboarded here.

## Class Schedule (Philippines Time, Asia/Manila)

Morning class, 6:00 AM - 12:30 PM:

- 21001
- 21002
- 21003
- 21004
- 21005

Afternoon class, 1:00 PM - 7:30 PM:

- 21006
- 21007
- 21008
- 21009
- 21010

Class start = the late reference point. Class end is informational only in v1
(early departure is not flagged).

## Late Rule (v1)

1. A tap is Late when `time_in` is strictly after
   `class start + grace_minutes`.
2. Default `grace_minutes = 15` for all 10 sections. Adjustable per section
   later; the default stays 15 until an administrator changes it.
3. Effective cutoffs with the default grace:
   - Morning sections (21001-21005): Late after 6:15 AM.
   - Afternoon sections (21006-21010): Late after 1:15 PM.
4. Late counts as attended (same as Present) in all KPIs and rates.
5. No schedule row for the student's section on that weekday = Present.
   Never flag Late without a schedule row (no false lates on weekends,
   holidays, or out-of-scope sections).
6. Only the first tap of the day decides Late vs Present. The second tap only
   fills `time_out` and never changes the status.
7. All schedule and cutoff comparisons use Philippines Time (Asia/Manila).

## BSIT 2nd Year Subjects (8)

These are the subjects attached to the 10 pilot sections. No per-subject
periods in v1; subjects exist here as catalog data for the future timetable.

| Subject Code | Subject |
|---|---|
| CCS2207 | Quantitative Methods with Modelling Simulation |
| CCS1204 / CPE211 / CC104 | Data Structures And Algorithms |
| CCS1201 / ADV02 | Introduction To Human Computer Interaction |
| CCS2105 | Integrative Programming And Technologies 1 |
| CCS2107 | Networking 1 |
| ITE1 | IT ELECTIVE 1 (Web Fundamental) |
| SOSLIT | Sosyedad at Literatura |
| PE3 | Individual and Dual Sports |

Note: slashed codes (e.g. CCS1204 / CPE211 / CC104) are one subject with
aliases. The future courses table must store one canonical `course_code` plus
aliases, not one row per alias.

## Data Model Direction (for implementers)

- New table `class_schedules`: `program_id FK`, `year_level`, `section`,
  `campus`, `day_of_week 0-6`, `time_start`, `grace_minutes default 15`,
  `status`. Unique on `(program_id, year_level, section, campus, day_of_week)`.
- Seed: one row per pilot section per weekday (Monday-Friday, no weekend
  rows) with the starts above and grace 15. Non-pilot sections get no rows
  (rule 5 covers them).
- Status is written at tap time, never computed on read, so filters and
  reports always agree. Existing pre-schedule rows stay Present until the
  one-off backfill recomputes them against this table.
- RLS mirrors the students pattern: admin write, teachers read assigned
  sections only.

## Form Locks (implemented)

- Student Add/Edit (admin): Program auto-set to BSIT and read-only, Year
  Level read-only 2nd Year, Section dropdown of the 10 pilot sections with
  Morning/Afternoon labels, Campus dropdown of the 3 campuses. Zod refine
  enforces the same values server-side (`src/features/students/schema.ts`,
  options from `src/features/academic/pilot.ts`).
- Teacher Add/Edit assignments (admin): Program auto-set to BSIT and
  read-only, Course/Subject dropdown lists the seeded BSIT catalog,
  Year/Section/Campus dropdowns limited to pilot values, new assignment rows
  prefilled with BSIT + 2nd Year.
- Edit-legacy caveat: records created before the pilot with non-pilot
  academic values fail edit validation until an administrator migrates them
  to pilot values.
- P02 implements the server program-id check for students, teachers, and
  schedules, verifying the actual BSIT catalog entry. Database save functions
  repeat the checks; teacher subjects must belong to that program and assignment
  dimensions cannot be blank. Schedule saves accept unique Monday–Friday days.
  Hosted enforcement requires migration `202609100001_atomic_management_saves.sql`;
  rollout status is tracked in `RFID-DOCS-SCOPE-AUDIT.md`.
- Schedules Panel (admin): `/admin/schedules` edits Time Start, Grace, Status,
  and Class Days per section. Program and Year Level are read-only BSIT /
  2nd Year. Rows are never deleted: unchecking a day archives that row and the
  Status toggle switches a section off, so rule 5 stays a deliberate choice
  (`src/features/schedules/`, `src/services/schedules/`).

## Current pilot completion

- Implement schedule lookup and Late assignment in the tap route at write time.
  This completes the existing v1 rule; it is not a new feature.
- Verify the existing one-off backfill against reviewed historical rows and the
  intended schedules. Do not automatically reclassify history after schedule edits.
- Keep the existing admin schedules panel, Late KPI cards, filters, amber badges,
  and chart/table displays. Display support does not establish that live tap
  classification is implemented. Late continues to count as attended.

## Deferred ideas — outside the current release (R02)

The following ideas are retained as future context only. They are not active
release tasks and must not be implemented without a new scope decision:

- Teacher read-only schedule page. Keep the existing admin schedules panel.
- Per-subject timetable/period attendance. Keep the eight-subject catalog only.
- Holiday/exam-day override management.
- Additional program/year-level onboarding. Preserve historical records and
  the current BSIT 2nd Year pilot restrictions.

Early-departure classification remains excluded: class end is informational in v1.

Administrator Excused flow is excluded from the active project scope by R01
(2026-09-05); it must not be implemented from the deferred ideas above.

Related Documents:
[[Functional Requirement]]
[[Database Design]]
[[Admin User Interaction]]
[[Teacher User Interaction]]
[[System Architecture]]
